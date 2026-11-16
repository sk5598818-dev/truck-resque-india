const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Haversine formula to compute distance in km
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Trigger: On new emergency breakdown SOS created
 * Matches nearby active garages, filters by capability, and sends FCM push notification
 */
exports.onEmergencyCreated = functions.firestore
  .document('emergency_requests/{requestId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const requestId = snap.id;
    const {
      vehicleNumber,
      vehicleBrand,
      breakdownCategory,
      latitude,
      longitude,
      highway,
      city,
      priority,
      searchRadiusKm = 50
    } = data;

    console.log(`🚨 New Emergency SOS ${requestId} received for ${vehicleNumber} at [${latitude}, ${longitude}]`);

    try {
      // 1. Fetch all verified active garages
      const garagesSnap = await db.collection('mechanic_garages')
        .where('verificationStatus', '==', 'verified')
        .where('isActive', '==', true)
        .limit(100)
        .get();

      if (garagesSnap.empty) {
        console.log('No active verified garages found.');
        return null;
      }

      // 2. Filter garages within radius
      const eligibleGarages = [];
      garagesSnap.forEach(docSnap => {
        const garage = docSnap.data();
        if (garage.latitude && garage.longitude && latitude && longitude) {
          const dist = calculateDistanceKm(latitude, longitude, garage.latitude, garage.longitude);
          const maxRadius = garage.serviceRadiusKm || searchRadiusKm;
          if (dist <= maxRadius) {
            eligibleGarages.push({ id: docSnap.id, uid: garage.uid, dist, garageName: garage.garageName });
          }
        }
      });

      console.log(`Matched ${eligibleGarages.length} eligible mechanics within service radius.`);

      if (eligibleGarages.length === 0) {
        return null;
      }

      // 3. Fetch FCM device tokens for eligible garage owners
      const tokens = [];
      const userUids = eligibleGarages.map(g => g.uid).filter(Boolean);

      for (const uid of userUids) {
        const tokenDoc = await db.collection('user_fcm_tokens').doc(uid).get();
        if (tokenDoc.exists && tokenDoc.data().token) {
          tokens.push(tokenDoc.data().token);
        }
      }

      if (tokens.length === 0) {
        console.log('No FCM tokens registered for matched garages.');
        return null;
      }

      // 4. Send high-priority multicast notification
      const payload = {
        notification: {
          title: `🚨 EMERGENCY HIGHWAY SOS: ${vehicleNumber}`,
          body: `${breakdownCategory.replace(/_/g, ' ')} on ${highway || city || 'Highway'}. Tap to accept & dispatch van.`
        },
        data: {
          requestId: requestId,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          type: 'emergency_sos',
          priority: priority || 'urgent',
          vehicleNumber: vehicleNumber || '',
          url: `/garage-dashboard`
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'emergency_breakdown_alerts',
            sound: 'emergency_siren',
            priority: 'max',
            visibility: 'public'
          }
        },
        tokens
      };

      const response = await messaging.sendEachForMulticast(payload);
      console.log(`FCM Notifications dispatched: ${response.successCount} successful, ${response.failureCount} failed.`);
      return response;
    } catch (error) {
      console.error('Error dispatching emergency notifications:', error);
      return null;
    }
  });

/**
 * Trigger: On emergency request status updated
 * Notifies driver when mechanic accepts or advances status
 */
exports.onEmergencyStatusUpdated = functions.firestore
  .document('emergency_requests/{requestId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const requestId = change.after.id;

    if (before.status === after.status) return null;

    console.log(`Status changed for ${requestId}: ${before.status} -> ${after.status}`);

    const driverUid = after.driverUid;
    if (!driverUid) return null;

    try {
      const driverTokenDoc = await db.collection('user_fcm_tokens').doc(driverUid).get();
      if (!driverTokenDoc.exists || !driverTokenDoc.data().token) return null;

      let messageTitle = 'Truck Rescue India Status Update';
      let messageBody = `Your breakdown request status is now: ${after.status.replace(/_/g, ' ')}`;

      if (after.status === 'accepted') {
        messageTitle = '🛠️ Mechanic Assigned & Dispatched!';
        messageBody = `${after.assignedGarageName} accepted your request. Rescue van en route.`;
      } else if (after.status === 'mechanic_on_way') {
        messageTitle = '🚚 Mechanic On The Way!';
        messageBody = 'The mobile breakdown van is driving to your highway spot.';
      } else if (after.status === 'reached_location') {
        messageTitle = '📍 Mechanic Arrived at Vehicle!';
        messageBody = 'The mechanic has reached your breakdown location.';
      } else if (after.status === 'completed') {
        messageTitle = '✅ Rescue Assistance Completed!';
        messageBody = 'Your truck repair is completed. Thank you for using Truck Rescue India.';
      }

      await messaging.send({
        token: driverTokenDoc.data().token,
        notification: {
          title: messageTitle,
          body: messageBody
        },
        data: {
          requestId,
          status: after.status,
          url: `/emergency/${requestId}`
        }
      });
    } catch (err) {
      console.error('Failed to notify driver:', err);
    }
    return null;
  });
