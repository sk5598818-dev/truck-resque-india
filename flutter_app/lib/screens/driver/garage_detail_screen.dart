import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/garage.dart';
import '../../models/review.dart';
import '../../services/firestore_service.dart';
import '../../core/theme.dart';

class GarageDetailScreen extends StatelessWidget {
  final GarageModel garage;

  const GarageDetailScreen({Key? key, required this.garage}) : super(key: key);

  Future<void> _makeCall(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) await launchUrl(uri);
  }

  Future<void> _openWhatsApp(String phone) async {
    String clean = phone.replaceAll(RegExp(r'[^0-9]'), '');
    if (!clean.startsWith('91')) clean = '91$clean';
    final uri = Uri.parse('https://wa.me/$clean');
    if (await canLaunchUrl(uri)) await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final firestoreService = FirestoreService();

    return Scaffold(
      appBar: AppBar(
        title: Text(garage.garageName, overflow: TextOverflow.ellipsis),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        color: AppTheme.surface,
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () => _makeCall(garage.phone),
                icon: const Icon(Icons.call),
                label: const Text('Call Mechanic', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF25D366),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () => _openWhatsApp(garage.whatsappNumber ?? garage.phone),
                icon: const Icon(Icons.chat),
                label: const Text('WhatsApp Chat', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Garage Banner Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            garage.garageName,
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                          ),
                        ),
                        if (garage.isVerified)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.secondary.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.verified, size: 14, color: AppTheme.secondary),
                                SizedBox(width: 4),
                                Text('VERIFIED', style: TextStyle(color: AppTheme.secondary, fontSize: 10, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text('Owner: ${garage.ownerName}', style: const TextStyle(fontSize: 13, color: AppTheme.textMuted)),
                    if (garage.address != null) ...[
                      const SizedBox(height: 4),
                      Text(garage.address!, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                    ],
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 18),
                        const SizedBox(width: 4),
                        Text(
                          '${garage.rating.toStringAsFixed(1)} / 5.0 (${garage.totalReviews} Reviews)',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.amber),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Services Section
            const Text('SPECIALIZED TRUCK SERVICES', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textMuted)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: garage.services.map((s) => Chip(
                backgroundColor: AppTheme.card,
                label: Text(s, style: const TextStyle(fontSize: 11, color: Colors.white)),
              )).toList(),
            ),

            const SizedBox(height: 20),

            // Brands Supported
            const Text('SUPPORTED COMMERCIAL BRANDS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textMuted)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: garage.vehicleBrands.map((b) => Chip(
                backgroundColor: AppTheme.surface,
                avatar: const Icon(Icons.directions_car, size: 14, color: AppTheme.primary),
                label: Text(b, style: const TextStyle(fontSize: 11, color: AppTheme.textLight)),
              )).toList(),
            ),

            const SizedBox(height: 24),

            // Reviews Header & Add Review Button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('CUSTOMER REVIEWS & FEEDBACK', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textMuted)),
                TextButton.icon(
                  onPressed: () => _showReviewDialog(context, firestoreService),
                  icon: const Icon(Icons.rate_review, size: 16, color: AppTheme.primary),
                  label: const Text('Write Review', style: TextStyle(color: AppTheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Real-time Reviews Stream
            StreamBuilder<List<ReviewModel>>(
              stream: firestoreService.streamReviews(garage.id),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: Padding(padding: EdgeInsets.all(16), child: CircularProgressIndicator()));
                }
                final reviews = snapshot.data ?? [];
                if (reviews.isEmpty) {
                  return Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(color: AppTheme.card, borderRadius: BorderRadius.circular(12)),
                    child: const Center(
                      child: Text('No reviews yet. Be the first highway driver to rate this garage!', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                    ),
                  );
                }

                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: reviews.length,
                  itemBuilder: (context, idx) {
                    final r = reviews[idx];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: AppTheme.card, borderRadius: BorderRadius.circular(12)),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(r.driverName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                              Row(
                                children: [
                                  const Icon(Icons.star, size: 14, color: Colors.amber),
                                  const SizedBox(width: 2),
                                  Text(r.rating.toStringAsFixed(1), style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 12)),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(r.comment, style: const TextStyle(fontSize: 12, color: AppTheme.textLight)),
                          if (r.responseText != null) ...[
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: AppTheme.surface, borderRadius: BorderRadius.circular(8)),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Garage Owner Reply:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                                  const SizedBox(height: 2),
                                  Text(r.responseText!, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                ],
                              ),
                            ),
                          ],
                        ],
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

  void _showReviewDialog(BuildContext context, FirestoreService service) {
    double selectedRating = 5.0;
    final commentController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.surface,
          title: const Text('Rate this Garage'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [1.0, 2.0, 3.0, 4.0, 5.0].map((star) {
                  return IconButton(
                    icon: Icon(
                      star <= selectedRating ? Icons.star : Icons.star_border,
                      color: Colors.amber,
                      size: 28,
                    ),
                    onPressed: () => setDialogState(() => selectedRating = star),
                  );
                }).toList(),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: commentController,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Share your service experience, mechanic speed, and pricing...',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                if (commentController.text.trim().isEmpty) return;
                final newReview = ReviewModel(
                  id: '',
                  garageId: garage.id,
                  driverId: 'driver_app_user',
                  driverName: 'Commercial Driver',
                  rating: selectedRating,
                  comment: commentController.text.trim(),
                  createdAt: DateTime.now(),
                );
                await service.submitReview(newReview);
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Review submitted successfully!')),
                );
              },
              child: const Text('Submit Review'),
            ),
          ],
        ),
      ),
    );
  }
}
