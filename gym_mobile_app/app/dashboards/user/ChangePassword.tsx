import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ChevronLeftIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from "react-native-heroicons/outline";

// API Configuration
const API_BASE_URL = 'https://gymbackend-production-ac3b.up.railway.app/api';

interface ChangePasswordProps {
  navigation: any;
}

export default function ChangePassword({ navigation }: ChangePasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation function
  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    
    if (!hasLowerCase) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    
    if (!hasNumbers) {
      return { isValid: false, message: "Password must contain at least one number" };
    }
    
    if (!hasSpecialChar) {
      return { isValid: false, message: "Password must contain at least one special character" };
    }
    
    return { isValid: true, message: "" };
  };

  // Form validation function
  const validateForm = (): { isValid: boolean; message: string } => {
    if (!newPassword.trim()) {
      return { isValid: false, message: "New password is required" };
    }

    if (!confirmPassword.trim()) {
      return { isValid: false, message: "Confirm password is required" };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return passwordValidation;
    }

    if (newPassword !== confirmPassword) {
      return { isValid: false, message: "Passwords do not match" };
    }

    return { isValid: true, message: "" };
  };

  // Handle password change
  const handleChangePassword = async () => {
    try {
      // Validate form
      const validation = validateForm();
      if (!validation.isValid) {
        Alert.alert("Validation Error", validation.message);
        return;
      }

      setLoading(true);

      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }

      // Call change password API
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success", 
          "Password changed successfully!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
        // Clear form
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", data.message || "Failed to change password");
      }

    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert("Error", "Network error while changing password");
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password (you can implement this later)
  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "This feature will be implemented soon. Please contact support for password reset assistance.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Change Password</Text>
          <Text style={styles.headerSubtitle}>
            Create a new secure password for your account
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Password Requirements Info */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <LockClosedIcon size={20} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Password Requirements</Text>
          </View>
          <View style={styles.requirementsList}>
            <Text style={styles.requirementText}>• At least 8 characters long</Text>
            <Text style={styles.requirementText}>• Contains uppercase letter (A-Z)</Text>
            <Text style={styles.requirementText}>• Contains lowercase letter (a-z)</Text>
            <Text style={styles.requirementText}>• Contains at least one number (0-9)</Text>
            <Text style={styles.requirementText}>• Contains special character (!@#$%^&*)</Text>
          </View>
        </View>

        {/* Change Password Form */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            {/* New Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#6B7280"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeSlashIcon size={20} color="#94A3B8" />
                  ) : (
                    <EyeIcon size={20} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#6B7280"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon size={20} color="#94A3B8" />
                  ) : (
                    <EyeIcon size={20} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity 
              style={styles.forgotPasswordButton} 
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot your current password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Changing Password...' : 'Save New Password'}
          </Text>
        </TouchableOpacity>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>
            After changing your password, you'll remain logged in on this device. 
            You may need to log in again on other devices.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    color: '#94A3B8',
    marginTop: 4,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#1E293B',
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#1E293B',
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  requirementsList: {
    marginLeft: 32,
  },
  requirementText: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  securityNote: {
    backgroundColor: '#1E293B',
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  securityNoteText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});