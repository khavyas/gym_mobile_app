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

// Toast Component Props Interface
interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  type?: 'success' | 'error'; 
}

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
        {/* Logo and Brand Section */}
        <View style={styles.brandContainer}>
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
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  // Brand Section Styles
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#10B981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: '#1F2937',
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