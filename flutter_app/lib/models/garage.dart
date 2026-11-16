class GarageModel {
  final String id;
  final String garageName;
  final String ownerName;
  final String phone;
  final String? whatsappNumber;
  final String garageType;
  final List<String> services;
  final List<String> vehicleBrands;
  final String state;
  final String city;
  final String? address;
  final String? pincode;
  final double latitude;
  final double longitude;
  final String? geohash;
  final bool is24Hours;
  final bool mobileRoadside;
  final bool isVerified;
  final String status; // 'active', 'pending', 'suspended'
  final String subscriptionTier; // 'free', 'featured', 'premium'
  final double rating;
  final int totalReviews;
  final double? distanceKm; // Computed dynamically for nearby search

  GarageModel({
    required this.id,
    required this.garageName,
    required this.ownerName,
    required this.phone,
    this.whatsappNumber,
    required this.garageType,
    required this.services,
    required this.vehicleBrands,
    required this.state,
    required this.city,
    this.address,
    this.pincode,
    required this.latitude,
    required this.longitude,
    this.geohash,
    required this.is24Hours,
    required this.mobileRoadside,
    this.isVerified = false,
    this.status = 'active',
    this.subscriptionTier = 'free',
    this.rating = 0.0,
    this.totalReviews = 0,
    this.distanceKm,
  });

  factory GarageModel.fromFirestore(Map<String, dynamic> data, String docId) {
    return GarageModel(
      id: docId,
      garageName: data['garageName'] ?? 'Highway Garage',
      ownerName: data['ownerName'] ?? 'Owner',
      phone: data['phone'] ?? '',
      whatsappNumber: data['whatsappNumber'],
      garageType: data['garageType'] ?? 'General Mechanic',
      services: List<String>.from(data['services'] ?? []),
      vehicleBrands: List<String>.from(data['vehicleBrands'] ?? []),
      state: data['state'] ?? '',
      city: data['city'] ?? '',
      address: data['address'],
      pincode: data['pincode'],
      latitude: (data['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (data['longitude'] as num?)?.toDouble() ?? 0.0,
      geohash: data['geohash'],
      is24Hours: data['is24Hours'] ?? false,
      mobileRoadside: data['mobileRoadside'] ?? false,
      isVerified: data['isVerified'] ?? false,
      status: data['status'] ?? 'active',
      subscriptionTier: data['subscriptionTier'] ?? 'free',
      rating: (data['rating'] as num?)?.toDouble() ?? 0.0,
      totalReviews: (data['totalReviews'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'garageName': garageName,
      'ownerName': ownerName,
      'phone': phone,
      'whatsappNumber': whatsappNumber,
      'garageType': garageType,
      'services': services,
      'vehicleBrands': vehicleBrands,
      'state': state,
      'city': city,
      'address': address,
      'pincode': pincode,
      'latitude': latitude,
      'longitude': longitude,
      'geohash': geohash,
      'is24Hours': is24Hours,
      'mobileRoadside': mobileRoadside,
      'isVerified': isVerified,
      'status': status,
      'subscriptionTier': subscriptionTier,
      'rating': rating,
      'totalReviews': totalReviews,
    };
  }

  GarageModel copyWithDistance(double distance) {
    return GarageModel(
      id: id,
      garageName: garageName,
      ownerName: ownerName,
      phone: phone,
      whatsappNumber: whatsappNumber,
      garageType: garageType,
      services: services,
      vehicleBrands: vehicleBrands,
      state: state,
      city: city,
      address: address,
      pincode: pincode,
      latitude: latitude,
      longitude: longitude,
      geohash: geohash,
      is24Hours: is24Hours,
      mobileRoadside: mobileRoadside,
      isVerified: isVerified,
      status: status,
      subscriptionTier: subscriptionTier,
      rating: rating,
      totalReviews: totalReviews,
      distanceKm: distance,
    );
  }
}
