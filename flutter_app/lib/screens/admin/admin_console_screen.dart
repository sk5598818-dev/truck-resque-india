import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';

class AdminConsoleScreen extends StatefulWidget {
  const AdminConsoleScreen({Key? key}) : super(key: key);

  @override
  State<AdminConsoleScreen> createState() => _AdminConsoleScreenState();
}

class _AdminConsoleScreenState extends State<AdminConsoleScreen> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ADMIN SECURITY CONSOLE'),
        backgroundColor: const Color(0xFF0F172A),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: _firestore.collection(AppConstants.colGarages).snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final docs = snapshot.data?.docs ?? [];

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Summary Stat Cards
              Row(
                children: [
                  Expanded(
                    child: _statCard('Total Garages', '${docs.length}', AppTheme.primary),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _statCard(
                      'Verified',
                      '${docs.where((d) => (d.data() as Map<String, dynamic>)['isVerified'] == true).length}',
                      AppTheme.secondary,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),
              const Text('GARAGE VERIFICATION & MANAGEMENT', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
              const SizedBox(height: 8),

              ...docs.map((doc) {
                final data = doc.data() as Map<String, dynamic>;
                final bool isVerified = data['isVerified'] ?? false;
                final String name = data['garageName'] ?? 'Workshop';
                final String city = data['city'] ?? '';
                final String phone = data['phone'] ?? '';

                return Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ListTile(
                    title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: Text('$city • $phone', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                    trailing: Switch(
                      value: isVerified,
                      activeColor: AppTheme.secondary,
                      onChanged: (val) async {
                        await _firestore.collection(AppConstants.colGarages).doc(doc.id).update({
                          'isVerified': val,
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('$name verification set to $val')),
                        );
                      },
                    ),
                  ),
                );
              }).toList(),
            ],
          );
        },
      ),
    );
  }

  Widget _statCard(String label, String count, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppTheme.card, borderRadius: BorderRadius.circular(12), border: Border.all(color: color.withOpacity(0.4))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(count, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: color)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
        ],
      ),
    );
  }
}
