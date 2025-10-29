import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView 
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from "react-native-svg";

// Toast Component Props Interface
interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  type?: 'success' | 'error'; 
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

// Meditation Illustration SVG
const MeditationIllustration = () => {
  return (
    <Svg width="200" height="200" viewBox="0 0 200 200" style={styles.illustration}>
      <Defs>
        <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
        </LinearGradient>
      </Defs>
      
      {/* Background circle */}
      <Circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.2" />
      
      {/* Person sitting in meditation */}
      <G>
        {/* Head */}
        <Circle cx="100" cy="60" r="20" fill="#10B981" />
        
        {/* Body */}
        <Path
          d="M 100 80 Q 85 100 85 120 L 85 130 Q 85 135 90 135 L 110 135 Q 115 135 115 130 L 115 120 Q 115 100 100 80 Z"
          fill="#10B981"
        />
        
        {/* Arms in meditation pose */}
        <Path
          d="M 85 95 Q 70 95 65 105 Q 60 110 65 115 Q 70 120 75 115 L 85 105"
          fill="#10B981"
        />
        <Path
          d="M 115 95 Q 130 95 135 105 Q 140 110 135 115 Q 130 120 125 115 L 115 105"
          fill="#10B981"
        />
        
        {/* Legs crossed */}
        <Path
          d="M 85 135 Q 75 140 70 145 L 60 150 Q 55 152 60 155 L 80 155"
          fill="#10B981"
        />
        <Path
          d="M 115 135 Q 125 140 130 145 L 140 150 Q 145 152 140 155 L 120 155"
          fill="#10B981"
        />
      </G>
      
      {/* Floating particles */}
      <Circle cx="70" cy="50" r="3" fill="#10B981" opacity="0.6" />
      <Circle cx="130" cy="60" r="2" fill="#10B981" opacity="0.5" />
      <Circle cx="120" cy="40" r="2.5" fill="#10B981" opacity="0.7" />
      <Circle cx="80" cy="35" r="2" fill="#10B981" opacity="0.4" />
    </Svg>
  );
};

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");

  const API_BASE_URL = "https://gym-backend-20dr.onrender.com/api";

  // Toast Component
  const Toast: React.FC<ToastProps> = ({ visible, message, onHide, type = 'success' }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-100));
    const isError = type === 'error';
    
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
        <View style={[
          styles.toastContent,
          isError && styles.toastError
        ]}>
          <Text style={[
            styles.toastIcon,
            isError && styles.toastErrorIcon
          ]}>
            {isError ? '✗' : '✓'}
          </Text>
          <Text style={styles.toastMessage}>{message}</Text>
        </View>
      </Animated.View>
    );
  };

  const handleLogin = async () => {
    // simple validations
    if (!identifier.trim() || !password) {
      setToastType('error');
      setToastMessage('Please enter email/phone and password.');
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        identifier: identifier.trim(),
        password,
      };
      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // { userId, name, email, role, token }
      const data = response.data;

      if (!data || !data.token) {
        throw new Error('Invalid server response: missing token');
      }

      // persist to AsyncStorage
      await AsyncStorage.setItem('userToken', data.token);
      if (data.role) await AsyncStorage.setItem('userRole', data.role);
      if (data.name) await AsyncStorage.setItem('userName', data.name);
      if (data.email) await AsyncStorage.setItem('userEmail', data.email);
      if (data.userId) await AsyncStorage.setItem('userId', String(data.userId));

      // show success
      setToastType('success');
      setToastMessage(`Welcome back, ${data.name || 'User'}!`);
      setShowToast(true);

      setIsLoading(false);

      // navigate after small delay (let toast show)
      setTimeout(() => router.replace('/dashboards/user'), 1100);
    } catch (err: any) {
      console.error('Login error:', err?.response?.data || err.message || err);

      setIsLoading(false);

      // nicer error messaging
      if (err.response) {
        // server responded with non-2xx
        const status = err.response.status;
        const serverMsg = err.response.data?.message || err.response.data?.error || JSON.stringify(err.response.data);

        if (status === 401) {
          setToastType('error');
          setToastMessage('Invalid email or password.');
        } else if (status === 400) {
          setToastType('error');
          setToastMessage(serverMsg || 'Bad request.');
        } else {
          setToastType('error');
          setToastMessage(serverMsg || 'Server error. Please try again later.');
        }
      } else if (err.request) {
        // request made but no response
        setToastType('error');
        setToastMessage('Network error — please check your connection.');
      } else {
        // other errors
        setToastType('error');
        setToastMessage('Login failed. Please try again.');
      }

      setShowToast(true);
    }
  };

  // Dynamically decide keyboard type
  const getKeyboardType = () => {
    if (/^\d+$/.test(identifier)) return "phone-pad"; // only numbers → phone
    if (identifier.includes("@")) return "email-address"; // has @ → email
    return "default";
  };

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
        <View style={[styles.iconPosition, { top: 100, left: 30 }]}>
          <FloatingIcon icon="🧘" delay={0} />
        </View>
        <View style={[styles.iconPosition, { top: 150, right: 40 }]}>
          <FloatingIcon icon="💚" delay={500} />
        </View>
        <View style={[styles.iconPosition, { top: 250, left: 50 }]}>
          <FloatingIcon icon="🌿" delay={1000} />
        </View>
        <View style={[styles.iconPosition, { top: 350, right: 30 }]}>
          <FloatingIcon icon="✨" delay={1500} />
        </View>
      </View>

      <Toast 
        visible={showToast} 
        message={toastMessage} 
        type={toastType}
        onHide={() => setShowToast(false)} 
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo and Brand Section with Illustration */}
        <View style={styles.brandContainer}>
          <View style={styles.illustrationContainer}>
            <MeditationIllustration />
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.heartIcon}>♡</Text>
          </View>
          <Text style={styles.brandName}>HealthHub</Text>
          <Text style={styles.brandTagline}>Your wellness companion</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your wellness account</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email or phone"
              placeholderTextColor="#9CA3AF"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType={getKeyboardType()}
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon size={24} color="#9CA3AF" />
                ) : (
                  <EyeIcon size={24} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.loginButton,
              isLoading && styles.loadingButton
            ]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Signing in...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkContainer} 
            onPress={() => router.push("/register")}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkTextBold}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Your wellness journey starts here</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  toastError: {
    backgroundColor: '#7F1D1D',
    borderLeftColor: '#EF4444',
  },
  toastErrorIcon: {
    color: '#EF4444',
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
 
gradientBackground: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  minHeight: '200%',
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
 scrollContent: {
  flexGrow: 1,
  padding: 24,
  paddingTop: 60,
  paddingBottom: 40, 
  zIndex: 2,
  minHeight: '100%', 
},
  // Brand Section Styles
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustrationContainer: {
    marginBottom: 16,
  },
  illustration: {
    opacity: 0.8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#10B981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heartIcon: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  brandTagline: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
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
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#10B981',
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
  },
  loadingButton: {
    backgroundColor: '#6B7280',
  },
  loginButtonText: {
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
  footerContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
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