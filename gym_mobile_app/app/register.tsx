import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = () => {
    // Add your registration logic here
    console.log({ name, age, phone, email, password, role });
    alert("Registration successful!");
      if (role === 'user') {
    router.push('/questions/user-questions');
  } else {
    router.push('/questions/consultant-questions');
  }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
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
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a secure password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Role *</Text>
            <View style={styles.roleToggleContainer}>
              <TouchableOpacity 
                style={[
                  styles.roleToggleButton, 
                  styles.roleToggleLeft,
                  role === "user" && styles.activeRoleButton
                ]}
                onPress={() => setRole("user")}
              >
                <Text style={[
                  styles.roleToggleText, 
                  role === "user" && styles.activeRoleText
                ]}>
                  User
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.roleToggleButton, 
                  styles.roleToggleRight,
                  role === "consultant" && styles.activeRoleButton
                ]}
                onPress={() => setRole("consultant")}
              >
                <Text style={[
                  styles.roleToggleText, 
                  role === "consultant" && styles.activeRoleText
                ]}>
                  Consultant
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Create Account</Text>
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
    backgroundColor: '#111827', // Dark charcoal background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
  registerButton: {
    backgroundColor: '#10B981', // Professional green
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
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
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
  roleToggleContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  roleToggleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  roleToggleLeft: {
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  roleToggleRight: {
    // No additional styles needed
  },
  activeRoleButton: {
    backgroundColor: '#10B981',
  },
  roleToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  activeRoleText: {
    color: '#FFFFFF',
  },
});




// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform 
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useState } from "react";

// export default function Register() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");

//   const handleRegister = () => {
//     // Add your registration logic here
//     console.log({ name, age, phone, email, password, role });
//     alert("Registration successful!");
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={styles.container} 
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.headerContainer}>
//           <Text style={styles.title}>Create Account</Text>
//           <Text style={styles.subtitle}>Join our wellness community</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Full Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your full name"
//               placeholderTextColor="#7A9B7A"
//               value={name}
//               onChangeText={setName}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Age</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your age"
//               placeholderTextColor="#7A9B7A"
//               value={age}
//               onChangeText={setAge}
//               keyboardType="numeric"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Phone Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your phone number"
//               placeholderTextColor="#7A9B7A"
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Email Address *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email"
//               placeholderTextColor="#7A9B7A"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Password *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Create a secure password"
//               placeholderTextColor="#7A9B7A"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Role *</Text>
//             <View style={styles.roleToggleContainer}>
//               <TouchableOpacity 
//                 style={[
//                   styles.roleToggleButton, 
//                   styles.roleToggleLeft,
//                   role === "user" && styles.activeRoleButton
//                 ]}
//                 onPress={() => setRole("user")}
//               >
//                 <Text style={[
//                   styles.roleToggleText, 
//                   role === "user" && styles.activeRoleText
//                 ]}>
//                   User
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[
//                   styles.roleToggleButton, 
//                   styles.roleToggleRight,
//                   role === "consultant" && styles.activeRoleButton
//                 ]}
//                 onPress={() => setRole("consultant")}
//               >
//                 <Text style={[
//                   styles.roleToggleText, 
//                   role === "consultant" && styles.activeRoleText
//                 ]}>
//                   Consultant
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
//             <Text style={styles.registerButtonText}>Create Account</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.linkContainer} 
//             onPress={() => router.push("/login")}
//           >
//             <Text style={styles.linkText}>
//               Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E8F5E8', // Light professional green background
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 24,
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#2D5530', // Dark green
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#5A7A5A',
//     textAlign: 'center',
//   },
//   formContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 24,
//     shadowColor: '#2D5530',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2D5530',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 2,
//     borderColor: '#C8E6C9',
//     backgroundColor: '#F8FBF8',
//     padding: 16,
//     borderRadius: 12,
//     fontSize: 16,
//     color: '#2D5530',
//   },
//   registerButton: {
//     backgroundColor: '#4CAF50', // Professional green
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 8,
//     shadowColor: '#4CAF50',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   registerButtonText: {
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
//     color: '#5A7A5A',
//     textAlign: 'center',
//   },
//   linkTextBold: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//   },
//   roleToggleContainer: {
//     flexDirection: 'row',
//     borderWidth: 2,
//     borderColor: '#C8E6C9',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   roleToggleButton: {
//     flex: 1,
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     backgroundColor: '#F8FBF8',
//   },
//   roleToggleLeft: {
//     borderRightWidth: 1,
//     borderRightColor: '#C8E6C9',
//   },
//   roleToggleRight: {
//     // No additional styles needed
//   },
//   activeRoleButton: {
//     backgroundColor: '#4CAF50',
//   },
//   roleToggleText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2D5530',
//   },
//   activeRoleText: {
//     color: '#FFFFFF',
//   },
// });