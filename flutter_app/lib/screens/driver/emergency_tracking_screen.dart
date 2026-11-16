import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/firestore_service.dart';
import '../../models/emergency_request.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';

class EmergencyTrackingScreen extends StatelessWidget {
  final String requestId;

  const EmergencyTrackingScreen({Key? key, required this.requestId}) : super(key: key);

  Future<void> _makeCall(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    final firestoreService = FirestoreService();

    return Scaffold(
      appBar: AppBar(
        title: const Text('LIVE RESCUE RADAR'),
        backgroundColor: AppTheme.emergencyRed,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
          ),
        ],
      ),
      body: StreamBuilder<EmergencyRequestModel?>(
        stream: firestoreService.streamEmergency(requestId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primary));
          }

          final req = snapshot.data;
          if (req == null) {
            return const Center(child: Text('Emergency request not found.'));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Radar Pulse / Status Card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.card,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: req.status == 'searching'
                          ? AppTheme.primary
                          : (req.status == 'completed' ? AppTheme.secondary : AppTheme.emergencyRed),
                      width: 2,
                    ),
                  ),
                  child: Column(
                    children: [
                      Icon(
                        req.status == 'searching'
                            ? Icons.radar
                            : (req.status == 'completed' ? Icons.check_circle : Icons.directions_car),
                        size: 54,
                        color: req.status == 'searching' ? AppTheme.primary : AppTheme.secondary,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        _getStatusLabel(req.status),
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _getStatusDescription(req.status),
                        style: const TextStyle(fontSize: 13, color: AppTheme.textMuted),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Assigned Mechanic Card
                if (req.assignedGarageName != null) ...[
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('ASSIGNED HIGHWAY MECHANIC', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.secondary)),
                          const SizedBox(height: 6),
                          Text(req.assignedGarageName!, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                          if (req.assignedMechanicPhone != null) ...[
                            const SizedBox(height: 12),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.secondary),
                              onPressed: () => _makeCall(req.assignedMechanicPhone!),
                              icon: const Icon(Icons.call),
                              label: Text('Call Mechanic (${req.assignedMechanicPhone})'),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Request Details Card
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('BREAKDOWN TICKET DETAILS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                        const SizedBox(height: 10),
                        _detailRow('Truck Number', req.truckNumber),
                        _detailRow('Vehicle', '${req.truckBrand} (${req.fuelType})'),
                        _detailRow('Issue Category', req.category),
                        _detailRow('Driver Phone', req.driverPhone),
                        _detailRow('GPS Location', '${req.latitude.toStringAsFixed(4)}, ${req.longitude.toStringAsFixed(4)}'),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // National Hotline Fallback
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.headset_mic, color: AppTheme.primary, size: 28),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('24x7 Highway Ops Room', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                            Text('Toll-Free Backup Support', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: AppTheme.card),
                        onPressed: () => _makeCall(AppConstants.nationalHelpline),
                        child: const Text('1800-889-988', style: TextStyle(fontSize: 11)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
        ],
      ),
    );
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'searching':
        return 'Broadcasting to Highway Mechanics';
      case 'accepted':
        return 'Mechanic Accepted Breakdown';
      case 'en_route':
        return 'Mechanic En Route to You';
      case 'arrived':
        return 'Mechanic Arrived at Truck';
      case 'completed':
        return 'Assistance Completed';
      default:
        return status.toUpperCase();
    }
  }

  String _getStatusDescription(String status) {
    switch (status) {
      case 'searching':
        return 'Alerting nearby mobile mechanics and crane operators within 50 km.';
      case 'accepted':
        return 'A certified heavy commercial technician has accepted your request and is preparing equipment.';
      case 'en_route':
        return 'The mechanic van is currently traveling to your GPS location.';
      case 'arrived':
        return 'The technician is inspecting your truck. Please ensure safe parking on highway shoulder.';
      case 'completed':
        return 'Breakdown resolved. Safe journeys on Indian highways!';
      default:
        return 'Status update in progress.';
    }
  }
}
