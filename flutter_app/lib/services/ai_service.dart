import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants.dart';

class AiDiagnosticService {
  // Query AI Truck Diagnostic Backend
  static Future<String> queryDiagnostic({
    required String brand,
    required String model,
    required String fuelType,
    required String query,
    String? faultCode,
    String language = 'hi', // 'hi' or 'en'
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/diagnostic'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'brand': brand,
          'model': model,
          'fuelType': fuelType,
          'query': query,
          'faultCode': faultCode,
          'language': language,
        }),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] ?? 'No diagnostic analysis returned.';
      } else {
        return _fallbackDiagnostic(brand, faultCode ?? query, language);
      }
    } catch (e) {
      return _fallbackDiagnostic(brand, faultCode ?? query, language);
    }
  }

  // Built-in Highway Diagnostic Fallback when in low connectivity / offline
  static String _fallbackDiagnostic(String brand, String codeOrIssue, String lang) {
    bool isHindi = lang == 'hi';
    String lower = codeOrIssue.toLowerCase();

    if (lower.contains('nox') || lower.contains('4334') || lower.contains('3226')) {
      if (isHindi) {
        return '⚠️ [NOx सेंसर / SCR यूरिया समस्या]\n'
            'संभावित कारण: NOx सेंसर खराब या हीटर सर्किट ओपन, यूरिया (AdBlue) की क्वालिटी खराब या मिलावटी, या डोजर नोजल चोक।\n\n'
            'निरीक्षण चेकलिस्ट:\n'
            '1. एग्जॉस्ट पाइप पर लगे आउटलेट NOx सेंसर की 4-पिन वायरिंग चेक करें।\n'
            '2. AdBlue टैंक में शुद्ध DEF यूरिया चेक करें (Refractometer रीडिंग 32.5% होनी चाहिए)।\n'
            '3. यूरिया डोजर का स्प्रे टेस्ट करें।\n\n'
            'सुरक्षा चेतावनी: तुरंत गति 20 किमी/घंटा लिम्प मोड में जा सकती है। नजदीकी BS6 स्कैनर स्पेशलिस्ट से संपर्क करें।';
      } else {
        return '⚠️ [NOx Sensor / SCR AdBlue System Fault]\n'
            'Likely Causes: Downstream NOx sensor heater circuit open, low AdBlue quality (urea concentration out of range), or SCR doser crystallization.\n\n'
            'Inspection Steps:\n'
            '1. Check 4-wire CAN harness going to NOx sensor module.\n'
            '2. Verify DEF quality (target 32.5% using refractometer).\n'
            '3. Perform SCR doser quantity actuation test via diagnostic scanner.\n\n'
            'Warning: Engine derate (torque reduction / speed cap 20 km/h) active. Visit nearest certified BS6 garage.';
      }
    }

    if (lower.contains('dpf') || lower.contains('soot') || lower.contains('choke') || lower.contains('3719')) {
      if (isHindi) {
        return '⚠️ [DPF साइलेंसर चोक / कालिख जमाव]\n'
            'संभावित कारण: लगातार धीमी गति पर गाड़ी चलना, DPF डिफरेंशियल प्रेशर सेंसर खराबी, या अधूरा रीजनरेशन।\n\n'
            'निरीक्षण चेकलिस्ट:\n'
            '1. सुरक्षित पार्किंग में हैंडब्रेक लगाकर Parked Manual Regeneration बटन 3 सेकंड दबाएं।\n'
            '2. कूलेंट टेम्परेचर 70°C से ऊपर होना चाहिए।\n'
            '3. अगर लेवल 4 चोक है, तो स्कैनर से फोर्सड सर्विस रीजनरेशन करना होगा।';
      } else {
        return '⚠️ [DPF Diesel Particulate Filter Soot Accumulation]\n'
            'Likely Causes: DPF soot load level 3 or 4 reached due to repeated low speed driving or incomplete auto-regen cycles.\n\n'
            'Inspection Steps:\n'
            '1. Park vehicle in clear open area, engage neutral & handbrake.\n'
            '2. Hold manual DPF regeneration switch on dashboard for 3 seconds.\n'
            '3. If Level 4 lamp solid/blinking, requires forced stationary scanner regen.';
      }
    }

    // General Guidance
    if (isHindi) {
      return '🔧 [वाहन डायग्नोस्टिक विश्लेषण — $brand]\n'
          'फाल्ट इनपुट: $codeOrIssue\n\n'
          'सुझाव:\n'
          '1. वाहन की बैटरी वोल्टेज चेक करें (न्यूनतम 24V DC भारी वाहनों के लिए)।\n'
          '2. क्लस्टर मीटर पर चेतावनी बत्ती (MIL / Warning Lamp) का रंग नोट करें।\n'
          '3. नजदीकी BS6 स्कैनर व ECM विशेषज्ञ से तुरंत लाइव डाटा जांच कराएं।\n\n'
          '📞 24x7 हेल्पलाइन: 1800-889-988';
    } else {
      return '🔧 [Diagnostic Assessment — $brand]\n'
          'Input Issue / Code: $codeOrIssue\n\n'
          'Recommendations:\n'
          '1. Verify commercial dual-battery voltage (target >= 24.5V DC).\n'
          '2. Check amber/red engine MIL status on dashboard instrument cluster.\n'
          '3. Connect an RP1210 / J1939 diagnostic scanner to read live freeze frame parameters.\n\n'
          '📞 24x7 Helpline: 1800-889-988';
    }
  }
}
