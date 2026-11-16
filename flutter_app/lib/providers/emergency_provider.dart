import 'package:flutter/material.dart';
import '../models/emergency_request.dart';
import '../services/firestore_service.dart';

class EmergencyProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();

  EmergencyRequestModel? _activeRequest;
  bool _isSubmitting = false;
  String? _error;

  EmergencyRequestModel? get activeRequest => _activeRequest;
  bool get isSubmitting => _isSubmitting;
  String? get error => _error;

  // Submit Emergency Breakdown Request
  Future<String?> submitEmergency(EmergencyRequestModel request) async {
    _isSubmitting = true;
    _error = null;
    notifyListeners();

    try {
      String id = await _firestoreService.createEmergencyRequest(request);
      // Track this request
      listenToRequest(id);
      _isSubmitting = false;
      notifyListeners();
      return id;
    } catch (e) {
      _error = e.toString();
      _isSubmitting = false;
      notifyListeners();
      return null;
    }
  }

  // Real-time tracking of active request
  void listenToRequest(String requestId) {
    _firestoreService.streamEmergency(requestId).listen((req) {
      _activeRequest = req;
      notifyListeners();
    });
  }

  void clearActiveRequest() {
    _activeRequest = null;
    notifyListeners();
  }
}
