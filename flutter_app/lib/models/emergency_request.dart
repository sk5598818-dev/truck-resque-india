import 'package:cloud_firestore/cloud_firestore.dart';

class EmergencyRequestModel {
  final String id;
  final String driverId;
  final String driverPhone;
  final String? driverName;
  final String truckNumber;
  final String truckBrand;
  final String truckModel;
  final String fuelType; // BS6, BS4, CNG, LNG
  final String category;
  final String? description;
  final String? photoUrl;
  final double latitude;
  final double longitude;
  final String? locationAddress;
  final String status; // searching, accepted, en_route, arrived, completed, cancelled
  final String? assignedGarageId;
  final String? assignedGarageName;
  final String? assignedMechanicPhone;
  final double? mechanicLatitude;
  final double? mechanicLongitude;
  final DateTime createdAt;

  EmergencyRequestModel({
    required this.id,
    required this.driverId,
    required this.driverPhone,
    this.driverName,
    required this.truckNumber,
    required this.truckBrand,
    required this.truckModel,
    required this.fuelType,
    required this.category,
    this.description,
    this.photoUrl,
    required this.latitude,
    required this.longitude,
    this.locationAddress,
    this.status = 'searching',
    this.assignedGarageId,
    this.assignedGarageName,
    this.assignedMechanicPhone,
    this.mechanicLatitude,
    this.mechanicLongitude,
    required this.createdAt,
  });

  factory EmergencyRequestModel.fromFirestore(Map<String, dynamic> data, String docId) {
    DateTime parsedDate = DateTime.now();
    if (data['createdAt'] is Timestamp) {
      parsedDate = (data['createdAt'] as Timestamp).toDate();
    } else if (data['createdAt'] is String) {
      parsedDate = DateTime.tryParse(data['createdAt']) ?? DateTime.now();
    }

    return EmergencyRequestModel(
      id: docId,
      driverId: data['driverId'] ?? '',
      driverPhone: data['driverPhone'] ?? '',
      driverName: data['driverName'],
      truckNumber: data['truckNumber'] ?? 'N/A',
      truckBrand: data['truckBrand'] ?? 'Generic',
      truckModel: data['truckModel'] ?? 'Heavy Duty',
      fuelType: data['fuelType'] ?? 'BS6',
      category: data['category'] ?? 'Engine problem',
      description: data['description'],
      photoUrl: data['photoUrl'],
      latitude: (data['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (data['longitude'] as num?)?.toDouble() ?? 0.0,
      locationAddress: data['locationAddress'],
      status: data['status'] ?? 'searching',
      assignedGarageId: data['assignedGarageId'],
      assignedGarageName: data['assignedGarageName'],
      assignedMechanicPhone: data['assignedMechanicPhone'],
      mechanicLatitude: (data['mechanicLatitude'] as num?)?.toDouble(),
      mechanicLongitude: (data['mechanicLongitude'] as num?)?.toDouble(),
      createdAt: parsedDate,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'driverId': driverId,
      'driverPhone': driverPhone,
      'driverName': driverName,
      'truckNumber': truckNumber,
      'truckBrand': truckBrand,
      'truckModel': truckModel,
      'fuelType': fuelType,
      'category': category,
      'description': description,
      'photoUrl': photoUrl,
      'latitude': latitude,
      'longitude': longitude,
      'locationAddress': locationAddress,
      'status': status,
      'assignedGarageId': assignedGarageId,
      'assignedGarageName': assignedGarageName,
      'assignedMechanicPhone': assignedMechanicPhone,
      'mechanicLatitude': mechanicLatitude,
      'mechanicLongitude': mechanicLongitude,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
