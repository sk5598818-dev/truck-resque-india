import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/emergency_request.dart';
import '../../providers/auth_provider.dart';
import '../../providers/emergency_provider.dart';
import '../../services/location_service.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';

class EmergencySosScreen extends StatefulWidget {
  const EmergencySosScreen({Key? key}) : super(key: key);

  @override
  State<EmergencySosScreen> createState() => _EmergencySosScreenState();
}

class _EmergencySosScreenState extends State<EmergencySosScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _truckNoController = TextEditingController();
  final TextEditingController _modelController = TextEditingController();
  final TextEditingController _descController = TextEditingController();

  String _selectedBrand = 'Tata Motors (Prima, Signa, LPT)';
  String _selectedFuel = 'BS6';
  String _selectedCategory = 'engine_problem';
  double? _lat;
  double? _lng;
  bool _locating = true;

  @override
  void initState() {
    super.initState();
    _fetchLocation();
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.user?.phoneNumber != null) {
      _phoneController.text = auth.user!.phoneNumber!.replaceAll('+91', '');
    }
  }

  Future<void> _fetchLocation() async {
    setState(() => _locating = true);
    final pos = await LocationService().getCurrentLocation();
    setState(() {
      _locating = false;
      if (pos != null) {
        _lat = pos.latitude;
        _lng = pos.longitude;
      } else {
        // Fallback to corridor hub
        _lat = 19.2969;
        _lng = 73.0631;
      }
    });
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _truckNoController.dispose();
    _modelController.dispose();
    _descController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final emergencyProvider = Provider.of<EmergencyProvider>(context);
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('EMERGENCY BREAKDOWN SOS'),
        backgroundColor: AppTheme.emergencyRed,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // GPS Coordinates Banner
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.card,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _lat != null ? AppTheme.secondary : Colors.grey),
                ),
                child: Row(
                  children: [
                    Icon(
                      _lat != null ? Icons.gps_fixed : Icons.gps_not_fixed,
                      color: _lat != null ? AppTheme.secondary : Colors.grey,
                      size: 24,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _locating
                                ? 'Pinpointing GPS location...'
                                : 'Live GPS: ${_lat?.toStringAsFixed(4)}, ${_lng?.toStringAsFixed(4)}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                          ),
                          const Text(
                            'Mechanics will navigate directly to these coordinates.',
                            style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.refresh, size: 20),
                      onPressed: _fetchLocation,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Driver Contact
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                maxLength: 10,
                decoration: const InputDecoration(
                  labelText: 'Driver Mobile Number (+91)',
                  prefixText: '+91 ',
                  counterText: '',
                  prefixIcon: Icon(Icons.phone, color: AppTheme.primary),
                ),
                validator: (val) => (val == null || val.length < 10) ? 'Enter 10-digit mobile' : null,
              ),

              const SizedBox(height: 14),

              // Truck Registration Number
              TextFormField(
                controller: _truckNoController,
                textCapitalization: TextCapitalization.characters,
                decoration: const InputDecoration(
                  labelText: 'Truck Registration Number (e.g. MH 04 JK 1234)',
                  prefixIcon: Icon(Icons.local_shipping, color: AppTheme.primary),
                ),
                validator: (val) => (val == null || val.trim().isEmpty) ? 'Enter truck registration' : null,
              ),

              const SizedBox(height: 14),

              // Brand Dropdown
              DropdownButtonFormField<String>(
                value: _selectedBrand,
                decoration: const InputDecoration(
                  labelText: 'Truck Brand',
                  prefixIcon: Icon(Icons.directions_bus, color: AppTheme.primary),
                ),
                items: AppConstants.truckBrands.map((b) => DropdownMenuItem(value: b, child: Text(b, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13)))).toList(),
                onChanged: (val) => setState(() => _selectedBrand = val!),
              ),

              const SizedBox(height: 14),

              // Model & Emission Standards
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: TextFormField(
                      controller: _modelController,
                      decoration: const InputDecoration(labelText: 'Model (e.g. 5530 Signa)'),
                      validator: (val) => (val == null || val.trim().isEmpty) ? 'Enter model' : null,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    flex: 1,
                    child: DropdownButtonFormField<String>(
                      value: _selectedFuel,
                      decoration: const InputDecoration(labelText: 'Fuel / Spec'),
                      items: ['BS6', 'BS4', 'CNG', 'LNG'].map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
                      onChanged: (val) => setState(() => _selectedFuel = val!),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 14),

              // Breakdown Category Dropdown
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Breakdown Issue Category',
                  prefixIcon: Icon(Icons.build_circle, color: AppTheme.emergencyRed),
                ),
                items: AppConstants.breakdownCategories.map((c) => DropdownMenuItem(
                  value: c['id'] as String,
                  child: Text('${c['label']} (${c['hindi']})', style: const TextStyle(fontSize: 12)),
                )).toList(),
                onChanged: (val) => setState(() => _selectedCategory = val!),
              ),

              const SizedBox(height: 14),

              // Description
              TextFormField(
                controller: _descController,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Problem Details / Highway Marker (Optional)',
                  hintText: 'e.g. Near Toll Plaza, smoke from radiator, AdBlue warning on cluster',
                ),
              ),

              const SizedBox(height: 24),

              // Submit Button
              SizedBox(
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.emergencyRed,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: emergencyProvider.isSubmitting
                      ? null
                      : () async {
                          if (!_formKey.currentState!.validate()) return;
                          if (_lat == null || _lng == null) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Please wait for GPS coordinates')),
                            );
                            return;
                          }

                          final req = EmergencyRequestModel(
                            id: '',
                            driverId: auth.user?.uid ?? 'guest_driver',
                            driverPhone: '+91${_phoneController.text.trim()}',
                            truckNumber: _truckNoController.text.trim().toUpperCase(),
                            truckBrand: _selectedBrand,
                            truckModel: _modelController.text.trim(),
                            fuelType: _selectedFuel,
                            category: _selectedCategory,
                            description: _descController.text.trim(),
                            latitude: _lat!,
                            longitude: _lng!,
                            status: 'searching',
                            createdAt: DateTime.now(),
                          );

                          final reqId = await emergencyProvider.submitEmergency(req);
                          if (reqId != null && mounted) {
                            Navigator.pushReplacementNamed(
                              context,
                              '/emergency-tracking',
                              arguments: reqId,
                            );
                          }
                        },
                  icon: emergencyProvider.isSubmitting
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Icon(Icons.flash_on),
                  label: const Text('DISPATCH HIGHWAY ASSISTANCE NOW', style: TextStyle(fontWeight: FontWeight.w900)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
