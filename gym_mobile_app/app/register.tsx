import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from "react-native-svg";

// Toast Component Props Interface
interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

// Floating Wellness Icon Component
const FloatingIcon = ({ delay = 0, icon }: { delay?: number; icon: string }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 3000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Animated.Text
      style={[
        styles.floatingIcon,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      {icon}
    </Animated.Text>
  );
};

// Fitness Illustration SVG
const FitnessIllustration = () => {
  return (
    <Svg width="180" height="180" viewBox="0 0 200 200" style={styles.illustration}>
      <Defs>
        <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
        </LinearGradient>
      </Defs>
      
      {/* Background circle */}
      <Circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.2" />
      
      {/* Person doing exercise */}
      <G>
        {/* Head */}
        <Circle cx="100" cy="50" r="18" fill="#10B981" />
        
        {/* Body */}
        <Path
          d="M 100 68 L 100 110"
          stroke="#10B981"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Left arm raised */}
        <Path
          d="M 100 75 Q 80 70 70 55"
          stroke="#10B981"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Right arm raised */}
        <Path
          d="M 100 75 Q 120 70 130 55"
          stroke="#10B981"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Left leg */}
        <Path
          d="M 100 110 L 85 145"
          stroke="#10B981"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Right leg */}
        <Path
          d="M 100 110 L 115 145"
          stroke="#10B981"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Dumbbell in left hand */}
        <Circle cx="70" cy="55" r="6" fill="#10B981" />
        
        {/* Dumbbell in right hand */}
        <Circle cx="130" cy="55" r="6" fill="#10B981" />
      </G>
      
      {/* Energy particles */}
      <Circle cx="65" cy="40" r="3" fill="#10B981" opacity="0.6" />
      <Circle cx="135" cy="40" r="2.5" fill="#10B981" opacity="0.5" />
      <Circle cx="125" cy="30" r="2" fill="#10B981" opacity="0.7" />
      <Circle cx="75" cy="30" r="2.5" fill="#10B981" opacity="0.4" />
    </Svg>
  );
};

// Toast Component
const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
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
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

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
      <View style={styles.toastContent}>
        <Text style={styles.toastIcon}>✓</Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [consent, setConsent] = useState(false);
  const [privacyNoticeAccepted, setPrivacyNoticeAccepted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false); 
  
  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!consent || !privacyNoticeAccepted) {
      alert("Please accept the consent and privacy policy to continue");
      return;
    }

    setIsLoading(true);
    const payload = { 
      name, 
      age: age ? parseInt(age) : undefined, 
      phone, 
      email, 
      password, 
      role,
      consent,
      privacyNoticeAccepted
    };

    try {
      const response = await fetch(
        "https://gym-backend-20dr.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        setIsLoading(false);
        
        // Save token + role in AsyncStorage
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userRole", role);
        await AsyncStorage.setItem("userId", data.userId);

        // Show professional toast notification
        setToastMessage(`Registration successful! Welcome ${data.name} 🎉`);
        setShowToast(true);

        // Navigate based on role after toast is shown
        setTimeout(() => {
          if (role === "user") {
            router.push("/questions/user-questions");
          } else {
            router.push("/questions/consultant-questions");
          }
        }, 2000);
        
      } else {
        setIsLoading(false);
        console.error("Registration failed:", data);
        alert(`Error: ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    }
  };

  // Privacy Policy Modal Component
  const PrivacyPolicyModal = () => (
    <Modal
      visible={showPrivacyModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPrivacyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalText}>
              <Text style={styles.modalBold}>Last Updated:</Text> October 26, 2025{'\n\n'}
              
              <Text style={styles.modalBold}>1. Information We Collect{'\n'}</Text>
              We collect personal information including your name, age, phone number, email address, and health-related data that you provide during registration and while using our services.{'\n\n'}
              
              <Text style={styles.modalBold}>2. How We Use Your Information{'\n'}</Text>
              Your information is used to provide personalized fitness guidance, track your wellness journey, connect you with fitness consultants, and improve our services.{'\n\n'}
              
              <Text style={styles.modalBold}>3. Data Security{'\n'}</Text>
              We implement industry-standard security measures to protect your personal and health data. All data transmissions are encrypted using secure protocols.{'\n\n'}
              
              <Text style={styles.modalBold}>4. Data Sharing{'\n'}</Text>
              We do not sell your personal information. Your health data is only shared with assigned fitness consultants to provide you with professional guidance.{'\n\n'}
              
              <Text style={styles.modalBold}>5. Your Rights{'\n'}</Text>
              You have the right to access, modify, or delete your personal data at any time through your profile settings.{'\n\n'}
              
              <Text style={styles.modalBold}>6. Cookies and Tracking{'\n'}</Text>
              We use cookies and similar technologies to enhance your experience and analyze app usage.{'\n\n'}
              
              <Text style={styles.modalBold}>7. Contact Us{'\n'}</Text>
              For privacy concerns, contact us at privacy@healthhub.com
            </Text>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setShowPrivacyModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Terms of Service Modal Component
  const TermsOfServiceModal = () => (
    <Modal
      visible={showTermsModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTermsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Terms of Service</Text>
            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalText}>
              <Text style={styles.modalBold}>Last Updated:</Text> October 26, 2025{'\n\n'}
              
              <Text style={styles.modalBold}>1. Acceptance of Terms{'\n'}</Text>
              By creating an account and using HealthHub, you agree to be bound by these Terms of Service and all applicable laws and regulations.{'\n\n'}
              
              <Text style={styles.modalBold}>2. User Responsibilities{'\n'}</Text>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.{'\n\n'}
              
              <Text style={styles.modalBold}>3. Health Disclaimer{'\n'}</Text>
              The fitness guidance provided is for informational purposes only and does not constitute medical advice. Always consult with healthcare professionals before starting any fitness program.{'\n\n'}
              
              <Text style={styles.modalBold}>4. User Conduct{'\n'}</Text>
              You agree not to use the service for any unlawful purpose, harass other users, or post inappropriate content.{'\n\n'}
              
              <Text style={styles.modalBold}>5. Consultant Services{'\n'}</Text>
              Fitness consultants are independent professionals. HealthHub facilitates connections but does not guarantee specific results.{'\n\n'}
              
              <Text style={styles.modalBold}>6. Intellectual Property{'\n'}</Text>
              All content, features, and functionality are owned by HealthHub and protected by copyright and trademark laws.{'\n\n'}
              
              <Text style={styles.modalBold}>7. Account Termination{'\n'}</Text>
              We reserve the right to terminate accounts that violate these terms or engage in harmful behavior.{'\n\n'}
              
              <Text style={styles.modalBold}>8. Limitation of Liability{'\n'}</Text>
              HealthHub is not liable for any indirect, incidental, or consequential damages arising from your use of the service.{'\n\n'}
              
              <Text style={styles.modalBold}>9. Changes to Terms{'\n'}</Text>
              We may modify these terms at any time. Continued use after changes constitutes acceptance of new terms.{'\n\n'}
              
              <Text style={styles.modalBold}>10. Contact Information{'\n'}</Text>
              For questions about these terms, contact us at support@healthhub.com
            </Text>
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setShowTermsModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Gradient Background */}
      <View style={styles.gradientBackground}>
        {/* Decorative Blobs */}
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      {/* Floating Icons */}
      <View style={styles.floatingIconsContainer}>
        <View style={[styles.iconPosition, { top: 80, left: 20 }]}>
          <FloatingIcon icon="💪" delay={0} />
        </View>
        <View style={[styles.iconPosition, { top: 120, right: 30 }]}>
          <FloatingIcon icon="🏃" delay={500} />
        </View>
        <View style={[styles.iconPosition, { top: 200, left: 40 }]}>
          <FloatingIcon icon="🌟" delay={1000} />
        </View>
        <View style={[styles.iconPosition, { top: 300, right: 25 }]}>
          <FloatingIcon icon="❤️" delay={1500} />
        </View>
      </View>

      <Toast 
        visible={showToast} 
        message={toastMessage} 
        onHide={() => setShowToast(false)} 
      />
      
      <PrivacyPolicyModal />
      <TermsOfServiceModal />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.illustrationContainer}>
            <FitnessIllustration />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our wellness community</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor="#9CA3AF"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a secure password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeSlashIcon size={24} color="#9CA3AF" />
                ) : (
                  <EyeIcon size={24} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Re-enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon size={24} color="#9CA3AF" />
                ) : (
                  <EyeIcon size={24} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Choose Your Role *</Text>
            <View style={styles.roleCardsContainer}>
              <TouchableOpacity 
                style={[
                  styles.roleCard, 
                  role === "user" && styles.activeRoleCard
                ]}
                onPress={() => setRole("user")}
                disabled={isLoading}
              >
                <View style={styles.roleCardContent}>
                  <View style={[styles.roleIcon, role === "user" && styles.activeRoleIcon]}>
                    <Ionicons 
                      name="person-outline" 
                      size={28} 
                      color={role === "user" ? "#FFFFFF" : "#9CA3AF"} 
                    />
                  </View>
                  <Text style={[styles.roleCardTitle, role === "user" && styles.activeRoleCardTitle]}>
                    User
                  </Text>
                  <Text style={[styles.roleCardSubtitle, role === "user" && styles.activeRoleCardSubtitle]}>
                    Looking for fitness guidance
                  </Text>
                </View>
                {role === "user" && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.roleCard, 
                  role === "consultant" && styles.activeRoleCard
                ]}
                onPress={() => setRole("consultant")}
                disabled={isLoading}
              >
                <View style={styles.roleCardContent}>
                  <View style={[styles.roleIcon, role === "consultant" && styles.activeRoleIcon]}>
                    <Ionicons 
                      name="fitness-outline" 
                      size={28} 
                      color={role === "consultant" ? "#FFFFFF" : "#9CA3AF"} 
                    />
                  </View>
                  <Text style={[styles.roleCardTitle, role === "consultant" && styles.activeRoleCardTitle]}>
                    Consultant
                  </Text>
                  <Text style={[styles.roleCardSubtitle, role === "consultant" && styles.activeRoleCardSubtitle]}>
                    Providing fitness expertise
                  </Text>
                </View>
                {role === "consultant" && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Consent Checkboxes */}
          <View style={styles.consentContainer}>
            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => setConsent(!consent)}
              disabled={isLoading}
            >
              <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
                {consent && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.consentText}>
                I consent to the collection and processing of my health data *
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxRow}
              onPress={() => setPrivacyNoticeAccepted(!privacyNoticeAccepted)}
              disabled={isLoading}
            >
              <View style={[styles.checkbox, privacyNoticeAccepted && styles.checkboxChecked]}>
                {privacyNoticeAccepted && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.consentText}>
                I have read and accept the{' '}
                <Text 
                  style={styles.linkInline}
                  onPress={() => setShowPrivacyModal(true)}
                >
                  Privacy Policy
                </Text>
                {' '}and{' '}
                <Text 
                  style={styles.linkInline}
                  onPress={() => setShowTermsModal(true)}
                >
                  Terms of Service
                </Text> *
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              styles.registerButton,
              isLoading && styles.loadingButton
            ]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Creating Account...</Text>
              </View>
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkContainer} 
            onPress={() => router.push("/login")}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  // Gradient Background
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#111827',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: '#10B981',
    top: -100,
    right: -100,
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: '#059669',
    bottom: -50,
    left: -80,
  },
  blob3: {
    width: 200,
    height: 200,
    backgroundColor: '#34D399',
    top: '40%',
    left: -50,
  },
  // Floating Icons
  floatingIconsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  iconPosition: {
    position: 'absolute',
  },
  floatingIcon: {
    fontSize: 24,
    opacity: 0.3,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    zIndex: 2,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustrationContainer: {
    marginBottom: 16,
  },
  illustration: {
    opacity: 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
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
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#374151',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingRight: 12,
  },
  eyeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  roleCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    minHeight: 140,
  },
  activeRoleCard: {
    borderColor: '#10B981',
    backgroundColor: '#065F46',
  },
  roleCardContent: {
    alignItems: 'center',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
modalContainer: {
  backgroundColor: '#1F2937',
  borderRadius: 16,
  width: '100%',
  maxHeight: '80%',
  borderWidth: 1,
  borderColor: '#374151',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 10,
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#374151',
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#10B981',
},
modalClose: {
  fontSize: 28,
  color: '#9CA3AF',
  fontWeight: '300',
},
modalContent: {
  padding: 20,
  maxHeight: 400,
},
modalText: {
  fontSize: 14,
  color: '#D1D5DB',
  lineHeight: 22,
},
modalBold: {
  fontWeight: 'bold',
  color: '#E5E7EB',
  fontSize: 15,
},
modalButton: {
  backgroundColor: '#10B981',
  margin: 20,
  marginTop: 0,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
},
modalButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
},
 
  eyeIconButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  activeRoleIcon: {
    backgroundColor: '#10B981',
  },
  roleCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  activeRoleCardTitle: {
    color: '#FFFFFF',
  },
  roleCardSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  activeRoleCardSubtitle: {
    color: '#D1FAE5',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentContainer: {
    marginBottom: 24,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 6,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  linkInline: {
    color: '#10B981',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingButton: {
    backgroundColor: '#6B7280',
  },
  registerButtonText: {
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
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  linkTextBold: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: '#065F46',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastIcon: {
    fontSize: 20,
    color: '#10B981',
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