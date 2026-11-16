class UserProfile {
  final String uid;
  final String phone;
  final String? displayName;
  final String role; // 'driver', 'garage_owner', 'admin'
  final String? garageId;
  final bool isSuspended;

  UserProfile({
    required this.uid,
    required this.phone,
    this.displayName,
    this.role = 'driver',
    this.garageId,
    this.isSuspended = false,
  });

  factory UserProfile.fromFirestore(Map<String, dynamic> data, String uid) {
    return UserProfile(
      uid: uid,
      phone: data['phone'] ?? '',
      displayName: data['displayName'],
      role: data['role'] ?? 'driver',
      garageId: data['garageId'],
      isSuspended: data['isSuspended'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'phone': phone,
      'displayName': displayName,
      'role': role,
      'garageId': garageId,
      'isSuspended': isSuspended,
    };
  }
}
