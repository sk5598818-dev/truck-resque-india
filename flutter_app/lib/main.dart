import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';

import 'core/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/garage_provider.dart';
import 'providers/emergency_provider.dart';
import 'models/garage.dart';

import 'screens/auth/phone_login_screen.dart';
import 'screens/driver/driver_home_screen.dart';
import 'screens/driver/nearby_garages_screen.dart';
import 'screens/driver/garage_detail_screen.dart';
import 'screens/driver/emergency_sos_screen.dart';
import 'screens/driver/emergency_tracking_screen.dart';
import 'screens/driver/ai_diagnostic_screen.dart';
import 'screens/garage/garage_dashboard_screen.dart';
import 'screens/admin/admin_console_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Safe Firebase Initialization
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Firebase already initialized or running in mock harness: $e');
  }

  runApp(const TruckRescueApp());
}

class TruckRescueApp extends StatelessWidget {
  const TruckRescueApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => GarageProvider()),
        ChangeNotifierProvider(create: (_) => EmergencyProvider()),
      ],
      child: MaterialApp(
        title: 'TRUCK RESCUE INDIA',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        initialRoute: '/home',
        onGenerateRoute: (settings) {
          switch (settings.name) {
            case '/home':
              return MaterialPageRoute(builder: (_) => const DriverHomeScreen());
            case '/login':
              return MaterialPageRoute(builder: (_) => const PhoneLoginScreen());
            case '/nearby':
              return MaterialPageRoute(builder: (_) => const NearbyGaragesScreen());
            case '/garage-detail':
              final garage = settings.arguments as GarageModel;
              return MaterialPageRoute(builder: (_) => GarageDetailScreen(garage: garage));
            case '/emergency-sos':
              return MaterialPageRoute(builder: (_) => const EmergencySosScreen());
            case '/emergency-tracking':
              final requestId = settings.arguments as String;
              return MaterialPageRoute(builder: (_) => EmergencyTrackingScreen(requestId: requestId));
            case '/ai-diagnostic':
              return MaterialPageRoute(builder: (_) => const AiDiagnosticScreen());
            case '/garage-dashboard':
              return MaterialPageRoute(builder: (_) => const GarageDashboardScreen());
            case '/admin':
              return MaterialPageRoute(builder: (_) => const AdminConsoleScreen());
            default:
              return MaterialPageRoute(builder: (_) => const DriverHomeScreen());
          }
        },
      ),
    );
  }
}
