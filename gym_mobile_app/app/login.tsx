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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Toast Component Props Interface
interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const payload = { email, password };

    try {
      const response = await fetch(
        "https://gymbackend-production-ac3b.up.railway.app/api/auth/login",
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
        // Login successful
        console.log("Login successful:", data);
        setIsLoading(false);
        
         // Save token + role in AsyncStorage
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userRole", data.role);


        // Show professional toast notification
        setToastMessage(`Welcome back, ${data.name}! 🎉`);
        setShowToast(true);
        
        // Navigate after toast is shown
        setTimeout(() => {
          if (data.role === "user") {
            router.replace("/dashboards/user");
          } else if (data.role === "consultant") {
            router.replace("/dashboards/consultant");
          } else if (data.role === "admin") {
            router.replace("/dashboards/admin");
          } else if (data.role === "super-admin") {
            router.replace("/dashboards/super-admin");
          } else {
            // fallback
            router.replace("/register");
          }
        }, 2000);
        
      } else {
        // Backend returned an error
        setIsLoading(false);
        console.error("Login failed:", data);
        alert(`Error: ${data.message || "Login failed"}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Network error:", error);
      alert("Network error. Please try again.");
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
        onHide={() => setShowToast(false)} 
      />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your wellness account</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
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

          <TouchableOpacity style={styles.forgotPasswordContainer}>
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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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





// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform 
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useState } from "react";

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

// const handleLogin = async () => {
//   const payload = { email, password };

//   try {
//     const response = await fetch(
//       "https://gymbackend-production-ac3b.up.railway.app/api/auth/login",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await response.json();

//     if (response.ok) {
//       // Login successful
//       console.log("Login successful:", data);
//       alert(`Welcome back, ${data.name}!`);

//       // You can save the token in AsyncStorage if needed:
//       // await AsyncStorage.setItem('userToken', data.token);

//       // Navigate to user/consultant questions or home
//       router.push("/questions/user-questions"); // Adjust based on your app logic
//     } else {
//       // Backend returned an error
//       console.error("Login failed:", data);
//       alert(`Error: ${data.message || "Login failed"}`);
//     }
//   } catch (error) {
//     console.error("Network error:", error);
//     alert("Network error. Please try again.");
//   }
// };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container} 
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <View style={styles.content}>
//         <View style={styles.headerContainer}>
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>Sign in to your wellness account</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Email Address</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email"
//               placeholderTextColor="#9CA3AF"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Password</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your password"
//               placeholderTextColor="#9CA3AF"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           <TouchableOpacity style={styles.forgotPasswordContainer}>
//             <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.loginButtonText}>Sign In</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.linkContainer} 
//             onPress={() => router.push("/register")}
//           >
//             <Text style={styles.linkText}>
//               Don't have an account? <Text style={styles.linkTextBold}>Create Account</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.footerContainer}>
//           <Text style={styles.footerText}>Your wellness journey starts here</Text>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111827', // Dark charcoal background
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 24,
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#10B981', // Vibrant green
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#D1D5DB',
//     textAlign: 'center',
//   },
//   formContainer: {
//     backgroundColor: '#1F2937', // Dark gray
//     borderRadius: 16,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//     borderWidth: 1,
//     borderColor: '#374151',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#E5E7EB',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1.5,
//     borderColor: '#374151',
//     backgroundColor: '#111827',
//     padding: 16,
//     borderRadius: 12,
//     fontSize: 16,
//     color: '#F9FAFB',
//     fontWeight: '500',
//   },
//   forgotPasswordContainer: {
//     alignItems: 'flex-end',
//     marginBottom: 24,
//   },
//   forgotPasswordText: {
//     color: '#10B981',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   loginButton: {
//     backgroundColor: '#10B981', // Professional green
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#10B981',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   linkContainer: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   linkText: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     textAlign: 'center',
//   },
//   linkTextBold: {
//     color: '#10B981',
//     fontWeight: 'bold',
//   },
//   footerContainer: {
//     alignItems: 'center',
//     marginTop: 32,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontStyle: 'italic',
//   },
// });