import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/theme.dart';

class PhoneLoginScreen extends StatefulWidget {
  const PhoneLoginScreen({Key? key}) : super(key: key);

  @override
  State<PhoneLoginScreen> createState() => _PhoneLoginScreenState();
}

class _PhoneLoginScreenState extends State<PhoneLoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _otpController = TextEditingController();
  bool _codeSent = false;
  int _timerSeconds = 60;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _startTimer() {
    setState(() {
      _timerSeconds = 60;
    });
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timerSeconds > 0) {
        setState(() {
          _timerSeconds--;
        });
      } else {
        timer.cancel();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('DRIVER & OPERATOR LOGIN'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
            child: const Text('Skip / Guest', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 20),
            Center(
              child: Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppTheme.primary, width: 2),
                ),
                child: const Icon(Icons.phone_android, color: AppTheme.primary, size: 36),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Sign In with Indian Mobile',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textLight),
            ),
            const SizedBox(height: 8),
            const Text(
              'Enter your 10-digit mobile number to access verified roadside assistance and nearby garages.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
            ),
            const SizedBox(height: 32),

            if (authProvider.errorMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 20),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.emergencyRed.withOpacity(0.15),
                  border: Border.all(color: AppTheme.emergencyRed),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  authProvider.errorMessage!,
                  style: const TextStyle(color: AppTheme.emergencyRed, fontSize: 13),
                ),
              ),

            if (!_codeSent) ...[
              // Phone Input
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                maxLength: 10,
                decoration: InputDecoration(
                  labelText: 'Mobile Number',
                  prefixText: '+91 ',
                  prefixStyle: const TextStyle(color: AppTheme.textLight, fontWeight: FontWeight.bold),
                  hintText: '9876543210',
                  prefixIcon: const Icon(Icons.call, color: AppTheme.primary),
                  counterText: '',
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: authProvider.isLoading
                    ? null
                    : () async {
                        String phone = _phoneController.text.trim();
                        if (phone.length < 10) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please enter a valid 10-digit mobile number')),
                          );
                          return;
                        }
                        bool success = await authProvider.sendOtp(phone);
                        if (success) {
                          setState(() {
                            _codeSent = true;
                          });
                          _startTimer();
                        }
                      },
                child: authProvider.isLoading
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Send Verification OTP'),
              ),
            ] else ...[
              // OTP Input
              TextField(
                controller: _otpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 22, letterSpacing: 8, fontWeight: FontWeight.bold),
                decoration: const InputDecoration(
                  labelText: 'Enter 6-Digit OTP',
                  hintText: '123456',
                  prefixIcon: Icon(Icons.lock_clock, color: AppTheme.secondary),
                  counterText: '',
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _timerSeconds > 0 ? 'Resend code in ${_timerSeconds}s' : 'Didn\'t receive code?',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  TextButton(
                    onPressed: _timerSeconds == 0
                        ? () {
                            authProvider.sendOtp(_phoneController.text.trim());
                            _startTimer();
                          }
                        : null,
                    child: const Text('Resend OTP'),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: authProvider.isLoading
                    ? null
                    : () async {
                        String otp = _otpController.text.trim();
                        if (otp.length < 6) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please enter 6-digit OTP')),
                          );
                          return;
                        }
                        bool success = await authProvider.verifyOtp(otp);
                        if (success && mounted) {
                          Navigator.pushReplacementNamed(context, '/home');
                        }
                      },
                child: authProvider.isLoading
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Verify & Continue'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => setState(() => _codeSent = false),
                child: const Text('Change Phone Number'),
              ),
            ],

            const SizedBox(height: 40),
            Center(
              child: Text(
                'By signing in, you agree to Highway Safety Rules & Terms.',
                style: TextStyle(color: Colors.grey[600], fontSize: 11),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
