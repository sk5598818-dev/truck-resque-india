import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../models/garage.dart';
import '../services/firestore_service.dart';
import '../services/location_service.dart';

class GarageProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();
  final LocationService _locationService = LocationService();

  Position? _currentPosition;
  List<GarageModel> _garages = [];
  bool _isLoadingLocation = false;
  String? _locationError;

  // Filters
  double _selectedRadiusKm = 50.0;
  String? _selectedCategory;
  String? _selectedBrand;
  bool _filter24h = false;
  bool _filterRoadside = false;

  Position? get currentPosition => _currentPosition;
  List<GarageModel> get garages => _garages;
  bool get isLoadingLocation => _isLoadingLocation;
  String? get locationError => _locationError;
  double get selectedRadiusKm => _selectedRadiusKm;
  String? get selectedCategory => _selectedCategory;
  String? get selectedBrand => _selectedBrand;
  bool get filter24h => _filter24h;
  bool get filterRoadside => _filterRoadside;

  // Initialize and get live GPS location
  Future<void> fetchLocationAndGarages() async {
    _isLoadingLocation = true;
    _locationError = null;
    notifyListeners();

    try {
      Position? pos = await _locationService.getCurrentLocation();
      if (pos != null) {
        _currentPosition = pos;
        _subscribeToGarages();
      } else {
        // Fallback default coordinates (e.g. Bhiwandi / Mumbai freight hub)
        _currentPosition = Position(
          latitude: 19.2969,
          longitude: 73.0631,
          timestamp: DateTime.now(),
          accuracy: 100,
          altitude: 0,
          heading: 0,
          speed: 0,
          speedAccuracy: 0,
          altitudeAccuracy: 0,
          headingAccuracy: 0,
        );
        _subscribeToGarages();
      }
    } catch (e) {
      _locationError = 'Could not acquire GPS coordinates. Showing default corridor.';
    } finally {
      _isLoadingLocation = false;
      notifyListeners();
    }
  }

  void _subscribeToGarages() {
    if (_currentPosition == null) return;

    _firestoreService
        .streamNearbyGarages(
          userLat: _currentPosition!.latitude,
          userLng: _currentPosition!.longitude,
          maxDistanceKm: _selectedRadiusKm,
          categoryFilter: _selectedCategory,
          brandFilter: _selectedBrand,
          requires24h: _filter24h,
          requiresRoadside: _filterRoadside,
        )
        .listen((garagesList) {
      _garages = garagesList;
      notifyListeners();
    });
  }

  // Filter setters
  void setRadius(double radius) {
    _selectedRadiusKm = radius;
    _subscribeToGarages();
    notifyListeners();
  }

  void setCategory(String? category) {
    _selectedCategory = category;
    _subscribeToGarages();
    notifyListeners();
  }

  void setBrand(String? brand) {
    _selectedBrand = brand;
    _subscribeToGarages();
    notifyListeners();
  }

  void toggle24h(bool val) {
    _filter24h = val;
    _subscribeToGarages();
    notifyListeners();
  }

  void toggleRoadside(bool val) {
    _filterRoadside = val;
    _subscribeToGarages();
    notifyListeners();
  }
}
