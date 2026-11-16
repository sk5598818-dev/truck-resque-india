import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/garage_provider.dart';
import '../../models/garage.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';

class NearbyGaragesScreen extends StatefulWidget {
  const NearbyGaragesScreen({Key? key}) : super(key: key);

  @override
  State<NearbyGaragesScreen> createState() => _NearbyGaragesScreenState();
}

class _NearbyGaragesScreenState extends State<NearbyGaragesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<GarageProvider>(context, listen: false).fetchLocationAndGarages();
    });
  }

  Future<void> _makeCall(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  Future<void> _openWhatsApp(String phone, String garageName) async {
    String clean = phone.replaceAll(RegExp(r'[^0-9]'), '');
    if (!clean.startsWith('91')) clean = '91$clean';
    final uri = Uri.parse('https://wa.me/$clean?text=Hello%20$garageName,%20I%20found%20you%20on%20Truck%20Rescue%20India.%20Need%20breakdown%20assistance.');
    if (await canLaunchUrl(uri)) await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<GarageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('NEARBY GARAGES & RADAR'),
        actions: [
          IconButton(
            icon: const Icon(Icons.my_location),
            onPressed: () => provider.fetchLocationAndGarages(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: AppTheme.surface,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Radius Chips
                Row(
                  children: [
                    const Text('Distance:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [5.0, 10.0, 25.0, 50.0, 100.0].map((radius) {
                            bool isSelected = provider.selectedRadiusKm == radius;
                            return Padding(
                              padding: const EdgeInsets.only(right: 6),
                              child: ChoiceChip(
                                label: Text('${radius.toInt()} km'),
                                selected: isSelected,
                                selectedColor: AppTheme.primary,
                                labelStyle: TextStyle(
                                  fontSize: 11,
                                  color: isSelected ? Colors.white : AppTheme.textLight,
                                  fontWeight: FontWeight.bold,
                                ),
                                onSelected: (val) {
                                  if (val) provider.setRadius(radius);
                                },
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Quick Service Filters
                Row(
                  children: [
                    FilterChip(
                      label: const Text('24 Hours', style: TextStyle(fontSize: 11)),
                      selected: provider.filter24h,
                      selectedColor: AppTheme.secondary.withOpacity(0.3),
                      checkmarkColor: AppTheme.secondary,
                      onSelected: (val) => provider.toggle24h(val),
                    ),
                    const SizedBox(width: 8),
                    FilterChip(
                      label: const Text('Roadside Mobile Van', style: TextStyle(fontSize: 11)),
                      selected: provider.filterRoadside,
                      selectedColor: AppTheme.primary.withOpacity(0.3),
                      checkmarkColor: AppTheme.primary,
                      onSelected: (val) => provider.toggleRoadside(val),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Garages List
          Expanded(
            child: provider.isLoadingLocation
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(color: AppTheme.primary),
                        SizedBox(height: 16),
                        Text('Scanning GPS coordinates...', style: TextStyle(color: AppTheme.textMuted)),
                      ],
                    ),
                  )
                : provider.garages.isEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.location_off, size: 48, color: AppTheme.textMuted),
                              const SizedBox(height: 16),
                              const Text(
                                'No verified garages within this radius',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Try expanding your distance filter to 50 km or 100 km, or call our 24x7 National Highway Hotline.',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                              ),
                              const SizedBox(height: 20),
                              ElevatedButton(
                                onPressed: () => provider.setRadius(100.0),
                                child: const Text('Expand to 100 km'),
                              ),
                            ],
                          ),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: provider.garages.length,
                        itemBuilder: (context, index) {
                          final garage = provider.garages[index];
                          return _buildGarageCard(context, garage);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildGarageCard(BuildContext context, GarageModel garage) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.pushNamed(context, '/garage-detail', arguments: garage),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Name & Distance
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                garage.garageName,
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (garage.isVerified) ...[
                              const SizedBox(width: 4),
                              const Icon(Icons.verified, size: 16, color: AppTheme.secondary),
                            ],
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${garage.city}, ${garage.state}',
                          style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ),
                  if (garage.distanceKm != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppTheme.primary.withOpacity(0.4)),
                      ),
                      child: Text(
                        '${garage.distanceKm!.toStringAsFixed(1)} km',
                        style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w900, fontSize: 13),
                      ),
                    ),
                ],
              ),

              const SizedBox(height: 12),

              // Badges: Rating & 24 Hours
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.amber.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.star, size: 13, color: Colors.amber),
                        const SizedBox(width: 4),
                        Text(
                          '${garage.rating.toStringAsFixed(1)} (${garage.totalReviews})',
                          style: const TextStyle(color: Colors.amber, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  if (garage.is24Hours) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.secondary.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        '24 HOURS',
                        style: TextStyle(color: AppTheme.secondary, fontSize: 10, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                  if (garage.mobileRoadside) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'ROADSIDE VAN',
                        style: TextStyle(color: Colors.blueAccent, fontSize: 10, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                ],
              ),

              const SizedBox(height: 12),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondary,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      onPressed: () => _makeCall(garage.phone),
                      icon: const Icon(Icons.call, size: 16),
                      label: const Text('Call', style: TextStyle(fontSize: 13)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF25D366),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      onPressed: () => _openWhatsApp(garage.whatsappNumber ?? garage.phone, garage.garageName),
                      icon: const Icon(Icons.chat, size: 16),
                      label: const Text('WhatsApp', style: TextStyle(fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
