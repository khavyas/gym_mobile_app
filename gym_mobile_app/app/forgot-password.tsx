import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated 
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

// Toast Component Props Interface
interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
  onHide: () => void;
}

// Toast Component
const Toast: React.FC<ToastProps> = ({ visible, message, type, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 4000); // Slightly longer for success messages

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const toastBgColor = type === 'success' ? '#065F46' : '#7F1D1D';
  const toastBorderColor = type === 'success' ? '#10B981' : '#EF4444';
  const toastIcon = type === 'success' ? '✓' : '!';

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.toastContent, { 
        backgroundColor: toastBgColor,
        borderLeftColor: toastBorderColor 
      }]}>
        <Text style={[styles.toastIcon, { color: toastBorderColor }]}>
          {toastIcon}
        </Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false); 

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      setToastMessage("Please enter your email address");
      setToastType('error');
      setShowToast(true);
      return;
    }

    if (!validateEmail(email)) {
      setToastMessage("Please enter a valid email address");
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    const payload = { email: email.toLowerCase().trim() };

    try {
      // Call new API endpoint to check if email is registered
      const response = await fetch(
        "https://gym-backend-20dr.onrender.com/api/auth/check-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      // Expecting backend to return { exists: true } or { exists: false }
    if (response.ok && data.exists === true) {
      // Step 2: Trigger reset email
      const sendEmailResponse = await fetch(
        "https://gym-backend-20dr.onrender.com/api/auth/send-reset-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // { email }
        }
      );

      const sendEmailData = await sendEmailResponse.json();

      if (sendEmailResponse.ok && sendEmailData.success) {
        setEmailSent(true);
        setToastMessage("A 6-digit OTP has been sent to your email. Please check your inbox and enter the OTP to reset your password.");
        setToastType('success');
        setShowToast(true);
      } else {
        setToastMessage(sendEmailData.message || "Failed to send reset email. Please try again.");
        setToastType('error');
        setShowToast(true);
      }
    }
      else if (response.ok && data.exists === false) {
        setToastMessage("Email ID not registered.");
        setToastType('error');
        setShowToast(true);
      } else {
        setToastMessage(data.message || "Failed to check email. Please try again.");
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setIsLoading(false);
      setToastMessage("Network error. Please check your connection and try again.");
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleVerifyOtp = async () => {
  if (!otpInput.trim() || otpInput.length !== 6) {
    setToastMessage("Please enter a valid 6-digit OTP");
    setToastType('error');
    setShowToast(true);
    return;
  }

  setIsVerifyingOtp(true);
  const payload = { 
    email: email.toLowerCase().trim(), 
    otp: otpInput.trim() 
  };

  try {
    const response = await fetch(
      "https://gym-backend-20dr.onrender.com/api/auth/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    setIsVerifyingOtp(false);

    if (response.ok && data.success) {
      setOtpVerified(true);
      setToastMessage("OTP Verified Successfully!");
      setToastType('success');
      setShowToast(true);
    } else {
      setToastMessage(data.message || "Invalid OTP. Please try again.");
      setToastType('error');
      setShowToast(true);
    }
  } catch (error) {
    setIsVerifyingOtp(false);
    setToastMessage("Network error. Please try again.");
    setToastType('error');
    setShowToast(true);
  }
  };

  const handleResendOtp = async () => {
  setIsLoading(true);
  const payload = { email: email.toLowerCase().trim() };

  try {
    const response = await fetch(
      "https://gym-backend-20dr.onrender.com/api/auth/send-reset-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    setIsLoading(false);

    if (response.ok && data.success) {
      setOtpInput(""); // Clear previous OTP input
      setToastMessage("OTP resent to your email!");
      setToastType('success');
      setShowToast(true);
    } else {
      setToastMessage(data.message || "Failed to resend OTP. Please try again.");
      setToastType('error');
      setShowToast(true);
    }
  } catch (error) {
    setIsLoading(false);
    setToastMessage("Network error. Please try again.");
    setToastType('error');
    setShowToast(true);
  }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleResetPassword = async () => {
  // Validation
  if (!newPassword.trim() || !confirmPassword.trim()) {
    setToastMessage("Please enter both password fields");
    setToastType('error');
    setShowToast(true);
    return;
  }

  if (newPassword.length < 6) {
    setToastMessage("Password must be at least 6 characters long");
    setToastType('error');
    setShowToast(true);
    return;
  }

  if (newPassword !== confirmPassword) {
    setToastMessage("Passwords do not match");
    setToastType('error');
    setShowToast(true);
    return;
  }

  setIsResettingPassword(true);
  const payload = { 
    email: email.toLowerCase().trim(),
    newPassword: newPassword.trim(),
    confirmPassword: confirmPassword.trim()
  };

  try {
    const response = await fetch(
      "https://gym-backend-20dr.onrender.com/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    setIsResettingPassword(false);

    if (response.ok && data.success) {
      setPasswordReset(true);
      setToastMessage("Password reset successfully! Redirecting to login...");
      setToastType('success');
      setShowToast(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setToastMessage(data.message || "Failed to reset password. Please try again.");
      setToastType('error');
      setShowToast(true);
    }
  } catch (error) {
    setIsResettingPassword(false);
    setToastMessage("Network error. Please try again.");
    setToastType('error');
    setShowToast(true);
  }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Toast Notification */}
      <Toast 
        visible={showToast} 
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)} 
      />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {emailSent 
              ? "Check your email for reset instructions" 
              : "Enter your email to receive reset instructions"
            }
          </Text>
        </View>

        <View style={styles.formContainer}>
   {!emailSent ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your registered email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.resetButton,
                  isLoading && styles.loadingButton
                ]} 
                onPress={handleSendResetEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Sending...</Text>
                  </View>
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Email</Text>
                )}
              </TouchableOpacity>
            </>
// REPLACE THIS ENTIRE SECTION in your return JSX (around line 335):

          ) : !otpVerified ? (
            <>
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>🛡️✅</Text>
                <Text style={styles.successTitle}>OTP Sent!</Text>
                <Text style={styles.successMessage}>
                  We've sent a 6-digit OTP to:
                </Text>
                <Text style={styles.emailDisplay}>{email}</Text>
                <Text style={styles.instructionText}>
                  Please check your inbox and enter the OTP to reset your password.
                  Don't forget to check your spam folder if you don't see the email.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter 6-Digit OTP</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="000000"
                  placeholderTextColor="#9CA3AF"
                  value={otpInput}
                  onChangeText={setOtpInput}
                  keyboardType="number-pad"
                  maxLength={6}
                  editable={!isVerifyingOtp}
                  textAlign="center"
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.resetButton,
                  isVerifyingOtp && styles.loadingButton
                ]} 
                onPress={handleVerifyOtp}
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Verifying...</Text>
                  </View>
                ) : (
                  <Text style={styles.resetButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton} 
                onPress={handleResendOtp}
                disabled={isLoading}
              >
                <Text style={styles.resendButtonText}>Didn't receive OTP? Resend</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.tryDifferentEmailButton} 
                onPress={() => {
                  setEmailSent(false);
                  setEmail("");
                  setOtpInput("");
                }}
              >
                <Text style={styles.tryDifferentEmailText}>Use Different Email</Text>
              </TouchableOpacity>
            </>
          ) : !passwordReset ? (
            <>
              <View style={styles.successContainer}>
                <Text style={styles.successIcon}>🔐</Text>
                <Text style={styles.successTitle}>Set New Password</Text>
                <Text style={styles.successMessage}>
                  Create a strong password for your account
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  editable={!isResettingPassword}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!isResettingPassword}
                />
              </View>

              <TouchableOpacity 
                style={[
                  styles.resetButton,
                  isResettingPassword && styles.loadingButton
                ]} 
                onPress={handleResetPassword}
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Resetting...</Text>
                  </View>
                ) : (
                  <Text style={styles.resetButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successTitle}>Password Reset Successfully!</Text>
              <Text style={styles.successMessage}>
                Your password has been reset successfully.
              </Text>
              <Text style={styles.instructionText}>
                You will be redirected to login in a moment...
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackToLogin}
          >
            <Text style={styles.backButtonText}>
              ← Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {emailSent 
              ? "Didn't receive the email? Check your spam folder" 
              : "Remember your password? Sign in instead"
            }
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  otpInput: {
    borderWidth: 1.5,
    borderColor: '#374151',
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    fontSize: 24,
    color: '#F9FAFB',
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: 16,
  },
  tryDifferentEmailButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  tryDifferentEmailText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    backgroundColor: '#111827', // Dark charcoal background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981', // Vibrant green
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#1F2937', // Dark gray
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#374151',
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: '#10B981', // Professional green
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  loadingButton: {
    backgroundColor: '#6B7280',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resendButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  resendButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
  },
  toastMessage: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});