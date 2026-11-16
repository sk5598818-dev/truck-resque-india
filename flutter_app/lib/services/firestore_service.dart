import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/garage.dart';
import '../models/emergency_request.dart';
import '../models/review.dart';
import '../core/constants.dart';
import 'location_service.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream active garages sorted by distance
  Stream<List<GarageModel>> streamNearbyGarages({
    required double userLat,
    required double userLng,
    double maxDistanceKm = 50.0,
    String? categoryFilter,
    String? brandFilter,
    bool requires24h = false,
    bool requiresRoadside = false,
  }) {
    return _firestore
        .collection(AppConstants.colGarages)
        .where('status', isEqualTo: 'active')
        .snapshots()
        .map((snapshot) {
      List<GarageModel> list = [];

      for (var doc in snapshot.docs) {
        final garage = GarageModel.fromFirestore(doc.data(), doc.id);
        
        // Filter by 24h & roadside
        if (requires24h && !garage.is24Hours) continue;
        if (requiresRoadside && !garage.mobileRoadside) continue;

        // Filter by category
        if (categoryFilter != null && categoryFilter.isNotEmpty) {
          bool hasService = garage.services.any((s) =>
              s.toLowerCase().contains(categoryFilter.toLowerCase()) ||
              garage.garageType.toLowerCase().contains(categoryFilter.toLowerCase()));
          if (!hasService) continue;
        }

        // Filter by brand
        if (brandFilter != null && brandFilter.isNotEmpty) {
          bool hasBrand = garage.vehicleBrands.any((b) =>
              b.toLowerCase().contains(brandFilter.toLowerCase()));
          if (!hasBrand) continue;
        }

        // Compute distance
        final dist = LocationService.calculateDistanceKm(
          userLat,
          userLng,
          garage.latitude,
          garage.longitude,
        );

        if (dist <= maxDistanceKm) {
          list.add(garage.copyWithDistance(dist));
        }
      }

      // Sort by distance ascending
      list.sort((a, b) => (a.distanceKm ?? 0).compareTo(b.distanceKm ?? 0));
      return list;
    });
  }

  // Create Emergency Roadside Assistance Request
  Future<String> createEmergencyRequest(EmergencyRequestModel request) async {
    final docRef = await _firestore
        .collection(AppConstants.colEmergencies)
        .add(request.toMap());
    return docRef.id;
  }

  // Stream Single Emergency Request for live driver/mechanic tracking
  Stream<EmergencyRequestModel?> streamEmergency(String requestId) {
    return _firestore
        .collection(AppConstants.colEmergencies)
        .doc(requestId)
        .snapshots()
        .map((doc) {
      if (!doc.exists || doc.data() == null) return null;
      return EmergencyRequestModel.fromFirestore(doc.data()!, doc.id);
    });
  }

  // Stream active broadcast requests within radar for Garage Owners
  Stream<List<EmergencyRequestModel>> streamPendingEmergencies() {
    return _firestore
        .collection(AppConstants.colEmergencies)
        .where('status', isEqualTo: 'searching')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => EmergencyRequestModel.fromFirestore(doc.data(), doc.id))
            .toList());
  }

  // Accept Emergency Request (Radar Job Acceptance)
  Future<void> acceptEmergency({
    required String requestId,
    required String garageId,
    required String garageName,
    required String mechanicPhone,
    required double mechanicLat,
    required double mechanicLng,
  }) async {
    await _firestore.collection(AppConstants.colEmergencies).doc(requestId).update({
      'status': 'accepted',
      'assignedGarageId': garageId,
      'assignedGarageName': garageName,
      'assignedMechanicPhone': mechanicPhone,
      'mechanicLatitude': mechanicLat,
      'mechanicLongitude': mechanicLng,
      'acceptedAt': FieldValue.serverTimestamp(),
    });
  }

  // Update Status & Mechanic GPS
  Future<void> updateEmergencyStatus({
    required String requestId,
    required String newStatus,
    double? mechanicLat,
    double? mechanicLng,
  }) async {
    Map<String, dynamic> updateData = {
      'status': newStatus,
    };
    if (mechanicLat != null) updateData['mechanicLatitude'] = mechanicLat;
    if (mechanicLng != null) updateData['mechanicLongitude'] = mechanicLng;

    await _firestore.collection(AppConstants.colEmergencies).doc(requestId).update(updateData);
  }

  // Stream Reviews for a Garage
  Stream<List<ReviewModel>> streamReviews(String garageId) {
    return _firestore
        .collection(AppConstants.colReviews)
        .where('garageId', isEqualTo: garageId)
        .snapshots()
        .map((snapshot) {
      var reviews = snapshot.docs
          .map((doc) => ReviewModel.fromFirestore(doc.data(), doc.id))
          .toList();
      reviews.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      return reviews;
    });
  }

  // Submit Review
  Future<void> submitReview(ReviewModel review) async {
    await _firestore.collection(AppConstants.colReviews).add(review.toMap());
    
    // Recalculate garage rating aggregate
    final snapshot = await _firestore
        .collection(AppConstants.colReviews)
        .where('garageId', isEqualTo: review.garageId)
        .get();

    if (snapshot.docs.isNotEmpty) {
      double totalRating = 0;
      for (var d in snapshot.docs) {
        totalRating += (d.data()['rating'] as num?)?.toDouble() ?? 5.0;
      }
      double avg = totalRating / snapshot.docs.length;

      await _firestore.collection(AppConstants.colGarages).doc(review.garageId).update({
        'rating': double.parse(avg.toStringAsFixed(1)),
        'totalReviews': snapshot.docs.length,
      });
    }
  }

  // Garage Owner Reply to Review
  Future<void> replyToReview({
    required String reviewId,
    required String replyText,
  }) async {
    await _firestore.collection(AppConstants.colReviews).doc(reviewId).update({
      'responseText': replyText,
      'responseDate': FieldValue.serverTimestamp(),
    });
  }
}
