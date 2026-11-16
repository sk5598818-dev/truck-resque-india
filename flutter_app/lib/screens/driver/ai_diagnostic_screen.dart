import 'package:flutter/material.dart';
import '../../services/ai_service.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';

class AiDiagnosticScreen extends StatefulWidget {
  const AiDiagnosticScreen({Key? key}) : super(key: key);

  @override
  State<AiDiagnosticScreen> createState() => _AiDiagnosticScreenState();
}

class _AiDiagnosticScreenState extends State<AiDiagnosticScreen> {
  final TextEditingController _queryController = TextEditingController();
  final List<Map<String, String>> _messages = [];
  bool _isLoading = false;
  String _selectedLanguage = 'hi'; // 'hi' or 'en'
  String _selectedBrand = 'Tata Motors (Prima, Signa, LPT)';
  String _selectedFuel = 'BS6';

  @override
  void initState() {
    super.initState();
    _messages.add({
      'role': 'assistant',
      'text': 'नमस्ते! मैं TRUCK RESCUE INDIA का AI भारी वाहन डायग्नोस्टिक सहायक हूँ।\n\n'
          'आप मुझसे Tata, Ashok Leyland, BharatBenz, Eicher के BS4/BS6 फाल्ट कोड (SPN / FMI / P-Codes), AdBlue यूरिया समस्या, NOx सेंसर, या इंजन स्टार्टिंग की जांच पूछ सकते हैं।'
    });
  }

  Future<void> _sendMessage() async {
    final text = _queryController.text.trim();
    if (text.isEmpty || _isLoading) return;

    setState(() {
      _messages.add({'role': 'user', 'text': text});
      _isLoading = true;
    });
    _queryController.clear();

    final response = await AiDiagnosticService.queryDiagnostic(
      brand: _selectedBrand,
      model: 'Heavy Commercial',
      fuelType: _selectedFuel,
      query: text,
      faultCode: text,
      language: _selectedLanguage,
    );

    setState(() {
      _messages.add({'role': 'assistant', 'text': response});
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI TRUCK DIAGNOSTIC'),
        actions: [
          // Language Switcher
          Container(
            margin: const EdgeInsets.only(right: 12),
            child: Row(
              children: [
                ActionChip(
                  label: Text('हिंदी', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _selectedLanguage == 'hi' ? Colors.white : AppTheme.textMuted)),
                  backgroundColor: _selectedLanguage == 'hi' ? AppTheme.primary : AppTheme.card,
                  onPressed: () => setState(() => _selectedLanguage = 'hi'),
                ),
                const SizedBox(width: 4),
                ActionChip(
                  label: Text('EN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _selectedLanguage == 'en' ? Colors.white : AppTheme.textMuted)),
                  backgroundColor: _selectedLanguage == 'en' ? AppTheme.primary : AppTheme.card,
                  onPressed: () => setState(() => _selectedLanguage = 'en'),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Vehicle Spec Quick Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: AppTheme.surface,
            child: Row(
              children: [
                Expanded(
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      isExpanded: true,
                      value: _selectedBrand,
                      dropdownColor: AppTheme.card,
                      style: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold),
                      items: AppConstants.truckBrands.map((b) => DropdownMenuItem(value: b, child: Text(b, overflow: TextOverflow.ellipsis))).toList(),
                      onChanged: (val) => setState(() => _selectedBrand = val!),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedFuel,
                    dropdownColor: AppTheme.card,
                    style: const TextStyle(fontSize: 12, color: AppTheme.secondary, fontWeight: FontWeight.bold),
                    items: ['BS6', 'BS4', 'CNG'].map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
                    onChanged: (val) => setState(() => _selectedFuel = val!),
                  ),
                ),
              ],
            ),
          ),

          // Messages List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, idx) {
                final msg = _messages[idx];
                final isUser = msg['role'] == 'user';

                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
                    decoration: BoxDecoration(
                      color: isUser ? AppTheme.primary : AppTheme.card,
                      borderRadius: BorderRadius.circular(16).copyWith(
                        bottomRight: isUser ? const Radius.circular(0) : const Radius.circular(16),
                        bottomLeft: !isUser ? const Radius.circular(0) : const Radius.circular(16),
                      ),
                      border: isUser ? null : Border.all(color: AppTheme.border),
                    ),
                    child: Text(
                      msg['text'] ?? '',
                      style: const TextStyle(fontSize: 13, height: 1.4, color: Colors.white),
                    ),
                  ),
                );
              },
            ),
          ),

          if (_isLoading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primary)),
                  SizedBox(width: 8),
                  Text('Analyzing heavy commercial fault code...', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                ],
              ),
            ),

          // Quick Code Suggestions
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            child: Row(
              children: [
                'SPN 4334 NOx Sensor',
                'SPN 3719 DPF Soot',
                'P20EE SCR Inefficiency',
                'Truck Not Starting 24V',
              ].map((shortcut) => Padding(
                padding: const EdgeInsets.only(right: 6),
                child: ActionChip(
                  backgroundColor: AppTheme.surface,
                  label: Text(shortcut, style: const TextStyle(fontSize: 10, color: AppTheme.primary)),
                  onPressed: () {
                    _queryController.text = shortcut;
                    _sendMessage();
                  },
                ),
              )).toList(),
            ),
          ),

          // Input Bar
          Container(
            padding: const EdgeInsets.all(12),
            color: AppTheme.surface,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _queryController,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _sendMessage(),
                    decoration: const InputDecoration(
                      hintText: 'Enter fault code (e.g. SPN 4334 FMI 2) or issue...',
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send, color: AppTheme.primary),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
