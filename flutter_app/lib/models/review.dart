import 'package:cloud_firestore/cloud_firestore.dart';

class ReviewModel {
  final String id;
  final String garageId;
  final String driverId;
  final String driverName;
  final double rating;
  final String comment;
  final bool isVerifiedService;
  final String? serviceRequestId;
  final String? responseText;
  final DateTime? responseDate;
  final DateTime createdAt;

  ReviewModel({
    required this.id,
    required this.garageId,
    required this.driverId,
    required this.driverName,
    required this.rating,
    required this.comment,
    this.isVerifiedService = false,
    this.serviceRequestId,
    this.responseText,
    this.responseDate,
    required this.createdAt,
  });

  factory ReviewModel.fromFirestore(Map<String, dynamic> data, String docId) {
    DateTime parsedCreated = DateTime.now();
    if (data['createdAt'] is Timestamp) {
      parsedCreated = (data['createdAt'] as Timestamp).toDate();
    }

    DateTime? parsedResponse;
    if (data['responseDate'] is Timestamp) {
      parsedResponse = (data['responseDate'] as Timestamp).toDate();
    }

    return ReviewModel(
      id: docId,
      garageId: data['garageId'] ?? '',
      driverId: data['driverId'] ?? '',
      driverName: data['driverName'] ?? 'Verified Driver',
      rating: (data['rating'] as num?)?.toDouble() ?? 5.0,
      comment: data['comment'] ?? '',
      isVerifiedService: data['isVerifiedService'] ?? false,
      serviceRequestId: data['serviceRequestId'],
      responseText: data['responseText'],
      responseDate: parsedResponse,
      createdAt: parsedCreated,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'garageId': garageId,
      'driverId': driverId,
      'driverName': driverName,
      'rating': rating,
      'comment': comment,
      'isVerifiedService': isVerifiedService,
      'serviceRequestId': serviceRequestId,
      'responseText': responseText,
      'responseDate': responseDate != null ? Timestamp.fromDate(responseDate!) : null,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
