import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_profile.dart';
import '../core/constants.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // Send OTP to Indian Mobile (+91)
  Future<void> sendOtp({
    required String phoneNumber,
    required Function(String verificationId, int? resendToken) onCodeSent,
    required Function(FirebaseAuthException e) onVerificationFailed,
    required Function(PhoneAuthCredential credential) onAutoVerified,
    int? forceResendingToken,
  }) async {
    // Format Indian mobile number
    String formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('91')) {
        formattedPhone = '+$formattedPhone';
      } else {
        formattedPhone = '+91$formattedPhone';
      }
    }

    await _auth.verifyPhoneNumber(
      phoneNumber: formattedPhone,
      timeout: const Duration(seconds: 60),
      verificationCompleted: onAutoVerified,
      verificationFailed: onVerificationFailed,
      codeSent: onCodeSent,
      codeAutoRetrievalTimeout: (String verificationId) {},
      forceResendingToken: forceResendingToken,
    );
  }

  // Verify OTP and Sign In
  Future<UserCredential> verifyOtp({
    required String verificationId,
    required String smsCode,
  }) async {
    PhoneAuthCredential credential = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode.trim(),
    );

    UserCredential userCredential = await _auth.signInWithCredential(credential);
    await _ensureUserProfile(userCredential.user!);
    return userCredential;
  }

  // Ensure user profile in Firestore
  Future<UserProfile> _ensureUserProfile(User user) async {
    final docRef = _firestore.collection(AppConstants.colUsers).doc(user.uid);
    final docSnap = await docRef.get();

    if (!docSnap.exists) {
      final profile = UserProfile(
        uid: user.uid,
        phone: user.phoneNumber ?? '',
        role: 'driver',
      );
      await docRef.set(profile.toMap());
      return profile;
    } else {
      return UserProfile.fromFirestore(docSnap.data()!, user.uid);
    }
  }

  // Fetch Current User Profile
  Future<UserProfile?> getUserProfile() async {
    final user = currentUser;
    if (user == null) return null;

    final docSnap = await _firestore.collection(AppConstants.colUsers).doc(user.uid).get();
    if (!docSnap.exists) return null;

    return UserProfile.fromFirestore(docSnap.data()!, user.uid);
  }

  // Sign Out
  Future<void> signOut() async {
    await _auth.signOut();
  }
}
