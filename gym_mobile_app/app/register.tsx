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

  // const handleRegister = () => {
  //   // Add your registration logic here
  //   console.log({ name, age, phone, email, password, role });
  //   alert("Registration successful!");
  //     if (role === 'user') {
  //   router.push('/questions/user-questions');
  // } else {
  //   router.push('/questions/consultant-questions');
  // }
  // };

  const handleRegister = async () => {
  const payload = { name, age, phone, email, password, role };

  try {
    const response = await fetch(
      "https://gymbackend-production-ac3b.up.railway.app/api/auth/register",
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
      // Success: user registered
      console.log("Registration successful:", data);
      alert(`Registration successful! Welcome ${data.name}`);

      // Navigate based on role
      if (role === "user") {
        router.push("/questions/user-questions");
      } else {
        router.push("/questions/consultant-questions");
      }
    } else {
      // Backend returned an error
      console.error("Registration failed:", data);
      alert(`Error: ${data.message || "Registration failed"}`);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error. Please try again.");
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
            <Text style={styles.inputLabel}>Choose Your Role *</Text>
            <View style={styles.roleCardsContainer}>
              <TouchableOpacity 
                style={[
                  styles.roleCard, 
                  role === "user" && styles.activeRoleCard
                ]}
                onPress={() => setRole("user")}
              >
                <View style={styles.roleCardContent}>
                  <View style={[styles.roleIcon, role === "user" && styles.activeRoleIcon]}>
                    <Text style={[styles.roleIconText, role === "user" && styles.activeRoleIconText]}>👤</Text>
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
              >
                <View style={styles.roleCardContent}>
                  <View style={[styles.roleIcon, role === "consultant" && styles.activeRoleIcon]}>
                    <Text style={[styles.roleIconText, role === "consultant" && styles.activeRoleIconText]}>💪</Text>
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
  roleIconText: {
    fontSize: 24,
  },
  activeRoleIconText: {
    fontSize: 24,
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

