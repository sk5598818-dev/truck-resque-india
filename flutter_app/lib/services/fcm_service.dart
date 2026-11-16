import 'package:firebase_messaging/firebase_messaging.dart';

class FcmService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  Future<void> initialize({
    required Function(RemoteMessage message) onForegroundMessage,
    required Function(RemoteMessage message) onMessageOpenedApp,
  }) async {
    // Request notification permissions
    NotificationSettings settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      // Foreground notification listener
      FirebaseMessaging.onMessage.listen(onForegroundMessage);

      // Notification opened listener
      FirebaseMessaging.onMessageOpenedApp.listen(onMessageOpenedApp);
    }
  }

  // Get device token
  Future<String?> getToken() async {
    return await _fcm.getToken();
  }

  // Subscribe to Highway Emergency Radar Topic
  Future<void> subscribeToRadarTopic(String state) async {
    String cleanState = state.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '_');
    await _fcm.subscribeToTopic('radar_$cleanState');
  }
}
