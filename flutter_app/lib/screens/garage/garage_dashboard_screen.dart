import 'package:flutter/material.dart';
import '../../services/firestore_service.dart';
import '../../models/emergency_request.dart';
import '../../core/theme.dart';

class GarageDashboardScreen extends StatefulWidget {
  const GarageDashboardScreen({Key? key}) : super(key: key);

  @override
  State<GarageDashboardScreen> createState() => _GarageDashboardScreenState();
}

class _GarageDashboardScreenState extends State<GarageDashboardScreen> {
  final FirestoreService _firestoreService = FirestoreService();
  bool _isOnline = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GARAGE OWNER RADAR'),
        actions: [
          Switch(
            value: _isOnline,
            activeColor: AppTheme.secondary,
            onChanged: (val) {
              setState(() => _isOnline = val);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(val ? 'Radar Online: Listening for Highway SOS' : 'Radar Paused: Offline')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status & Subscription Banner
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        color: _isOnline ? AppTheme.secondary : Colors.grey,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _isOnline ? 'Online: Receiving Nearby Highway SOS' : 'Offline: Not Receiving Alerts',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                          ),
                          const SizedBox(height: 2),
                          const Text('Tier: Free Lifetime Partner (100% Free)', style: TextStyle(fontSize: 11, color: AppTheme.secondary)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Live Incoming SOS Radar
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('INCOMING RESCUE BROADCASTS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textMuted)),
                Text('LIVE RADAR', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              ],
            ),
            const SizedBox(height: 8),

            StreamBuilder<List<EmergencyRequestModel>>(
              stream: _firestoreService.streamPendingEmergencies(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()));
                }

                final emergencies = snapshot.data ?? [];
                if (emergencies.isEmpty) {
                  return Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(color: AppTheme.card, borderRadius: BorderRadius.circular(16)),
                    child: const Center(
                      child: Column(
                        children: [
                          Icon(Icons.radar, size: 40, color: AppTheme.textMuted),
                          SizedBox(height: 12),
                          Text('No active breakdowns nearby', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          SizedBox(height: 4),
                          Text('Stay online. Incoming highway breakdowns will appear with sound alerts.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    ),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: emergencies.length,
                  itemBuilder: (context, idx) {
                    final req = emergencies[idx];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        side: const BorderSide(color: AppTheme.primary, width: 1.5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  req.truckNumber,
                                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Colors.white),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(color: AppTheme.emergencyRed.withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
                                  child: Text(req.category.toUpperCase(), style: const TextStyle(color: AppTheme.emergencyRed, fontSize: 10, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text('${req.truckBrand} (${req.truckModel})', style: const TextStyle(fontSize: 13, color: AppTheme.textLight)),
                            if (req.description != null && req.description!.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text('Note: ${req.description}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                            ],
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                const Icon(Icons.location_on, size: 14, color: AppTheme.secondary),
                                const SizedBox(width: 4),
                                Text('GPS: ${req.latitude.toStringAsFixed(4)}, ${req.longitude.toStringAsFixed(4)}', style: const TextStyle(fontSize: 12, color: AppTheme.secondary)),
                              ],
                            ),
                            const SizedBox(height: 14),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.secondary),
                                onPressed: () async {
                                  await _firestoreService.acceptEmergency(
                                    requestId: req.id,
                                    garageId: 'partner_garage',
                                    garageName: 'Verified Partner Workshop',
                                    mechanicPhone: '9876543210',
                                    mechanicLat: req.latitude,
                                    mechanicLng: req.longitude,
                                  );
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Job accepted! Contacting driver...')),
                                  );
                                },
                                icon: const Icon(Icons.check_circle_outline),
                                label: const Text('ACCEPT BREAKDOWN JOB NOW'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
