import React, { useState, useEffect } from "react";
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
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon
} from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";

// API Configuration
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';


interface PasswordValidationResult {
  isValid: boolean;
  message: string;
  criteria: {
    length: boolean;
    upperCase: boolean;
    lowerCase: boolean;
    number: boolean;
    specialChar: boolean;
  };
}

export default function ChangePassword() {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation states
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({
    isValid: false,
    message: "",
    criteria: {
      length: false,
      upperCase: false,
      lowerCase: false,
      number: false,
      specialChar: false
    }
  });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  // Enhanced password validation function
  const validatePassword = (password: string): PasswordValidationResult => {
    const criteria = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const isValid = Object.values(criteria).every(criterion => criterion);
    
    let message = "";
    if (!isValid) {
      const failedCriteria = [];
      if (!criteria.length) failedCriteria.push("at least 8 characters");
      if (!criteria.upperCase) failedCriteria.push("uppercase letter");
      if (!criteria.lowerCase) failedCriteria.push("lowercase letter");
      if (!criteria.number) failedCriteria.push("number");
      if (!criteria.specialChar) failedCriteria.push("special character");
      
      message = `Password must contain: ${failedCriteria.join(", ")}`;
    }

    return { isValid, message, criteria };
  };

  // Real-time validation when password changes
  useEffect(() => {
    if (newPassword.length > 0) {
      const validation = validatePassword(newPassword);
      setPasswordValidation(validation);
      setShowValidation(true);
    } else {
      setShowValidation(false);
      setPasswordValidation({
        isValid: false,
        message: "",
        criteria: {
          length: false,
          upperCase: false,
          lowerCase: false,
          number: false,
          specialChar: false
        }
      });
    }
  }, [newPassword]);

  // Check password match when confirm password changes
  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [newPassword, confirmPassword]);

  // Form validation function
  const validateForm = (): { isValid: boolean; message: string } => {
    if (!newPassword.trim()) {
      return { isValid: false, message: "New password is required" };
    }

    if (!confirmPassword.trim()) {
      return { isValid: false, message: "Confirm password is required" };
    }

    if (!passwordValidation.isValid) {
      return { isValid: false, message: passwordValidation.message };
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
            onPress: () => router.push("/dashboards/user/ProfileSettings"),
          },
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

  // Handle forgot password
  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "This feature will be implemented soon. Please contact support for password reset assistance.",
      [{ text: "OK" }]
    );
  };

  // Render password criteria item
  const renderCriteriaItem = (label: string, isMet: boolean) => (
    <View style={styles.criteriaItem}>
      {isMet ? (
        <CheckCircleIcon size={16} color="#10B981" />
      ) : (
        <XCircleIcon size={16} color="#EF4444" />
      )}
      <Text style={[styles.criteriaText, { color: isMet ? "#10B981" : "#EF4444" }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
<TouchableOpacity 
  style={styles.backButton} 
  onPress={() => router.back()}
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
              <View style={[
                styles.passwordInputContainer,
                showValidation && !passwordValidation.isValid && newPassword.length > 0 && styles.inputError,
                showValidation && passwordValidation.isValid && styles.inputSuccess
              ]}>
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
              
              {/* Real-time Password Validation */}
              {showValidation && (
                <View style={styles.validationContainer}>
                  {renderCriteriaItem("At least 8 characters", passwordValidation.criteria.length)}
                  {renderCriteriaItem("Uppercase letter (A-Z)", passwordValidation.criteria.upperCase)}
                  {renderCriteriaItem("Lowercase letter (a-z)", passwordValidation.criteria.lowerCase)}
                  {renderCriteriaItem("Number (0-9)", passwordValidation.criteria.number)}
                  {renderCriteriaItem("Special character", passwordValidation.criteria.specialChar)}
                </View>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={[
                styles.passwordInputContainer,
                passwordsMatch === false && styles.inputError,
                passwordsMatch === true && styles.inputSuccess
              ]}>
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
              
              {/* Password Match Validation */}
              {passwordsMatch !== null && confirmPassword.length > 0 && (
                <View style={styles.matchValidation}>
                  {passwordsMatch ? (
                    <View style={styles.matchSuccess}>
                      <CheckCircleIcon size={16} color="#10B981" />
                      <Text style={styles.matchSuccessText}>Passwords match</Text>
                    </View>
                  ) : (
                    <View style={styles.matchError}>
                      <XCircleIcon size={16} color="#EF4444" />
                      <Text style={styles.matchErrorText}>Password mismatch happened</Text>
                    </View>
                  )}
                </View>
              )}
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
          style={[
            styles.saveButton, 
            (loading || !passwordValidation.isValid || passwordsMatch !== true) && styles.saveButtonDisabled
          ]}
          onPress={handleChangePassword}
          disabled={loading || !passwordValidation.isValid || passwordsMatch !== true}
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
  inputError: {
    borderColor: '#EF4444',
  },
  inputSuccess: {
    borderColor: '#10B981',
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
  validationContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  criteriaText: {
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  matchValidation: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  matchSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchSuccessText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
  },
  matchError: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchErrorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
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