import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import { ChevronRightIcon, UserIcon, LockClosedIcon, BellIcon, HeartIcon, ChartBarIcon, CreditCardIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";

// Define TypeScript interfaces for our state objects
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  bio: string;
}

interface HealthMetrics {
  weight: string;
  height: string;
  age: string;
  gender: string;
  fitnessGoal: string;
}

interface Notifications {
  workoutReminders: boolean;
  newContent: boolean;
  promotionOffers: boolean;
  appointmentReminders: boolean;
}

interface Security {
  biometricLogin: boolean;
  twoFactorAuth: boolean;
}

export default function ProfileSettings() {
  // State for user information with explicit types
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Fitness enthusiast focused on strength training and nutrition",
  });

  // State for health metrics
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    weight: "82",
    height: "183",
    age: "32",
    gender: "male",
    fitnessGoal: "build_muscle",
  });

  // State for notification preferences
  const [notifications, setNotifications] = useState<Notifications>({
    workoutReminders: true,
    newContent: true,
    promotionOffers: false,
    appointmentReminders: true,
  });

  // State for security settings
  const [security, setSecurity] = useState<Security>({
    biometricLogin: true,
    twoFactorAuth: false,
  });

  // Function to handle input changes with proper typing
  const handleInputChange = (section: "userInfo" | "healthMetrics", field: string, value: string) => {
    if (section === "userInfo") {
      setUserInfo({ ...userInfo, [field]: value });
    } else if (section === "healthMetrics") {
      setHealthMetrics({ ...healthMetrics, [field]: value });
    }
  };

  // Function to toggle switches with proper typing
  const toggleSwitch = (field: keyof Notifications | keyof Security) => {
    if (field in notifications) {
      setNotifications({ ...notifications, [field]: !notifications[field as keyof Notifications] });
    } else if (field in security) {
      setSecurity({ ...security, [field]: !security[field as keyof Security] });
    }
  };

  // Function to handle saving changes
  const saveChanges = () => {
    Alert.alert("Success", "Your changes have been saved successfully!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage your personal information, health metrics, and preferences
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserIcon size={20} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={userInfo.name}
                onChangeText={(value) => handleInputChange("userInfo", "name", value)}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={userInfo.email}
                onChangeText={(value) => handleInputChange("userInfo", "email", value)}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={userInfo.phone}
                onChangeText={(value) => handleInputChange("userInfo", "phone", value)}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={userInfo.bio}
                onChangeText={(value) => handleInputChange("userInfo", "bio", value)}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Health Metrics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HeartIcon size={20} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Health Metrics</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  value={healthMetrics.weight}
                  onChangeText={(value) => handleInputChange("healthMetrics", "weight", value)}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.textInput}
                  value={healthMetrics.height}
                  onChangeText={(value) => handleInputChange("healthMetrics", "height", value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.textInput}
                  value={healthMetrics.age}
                  onChangeText={(value) => handleInputChange("healthMetrics", "age", value)}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={healthMetrics.gender}
                    onValueChange={(value: string) => handleInputChange("healthMetrics", "gender", value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fitness Goal</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={healthMetrics.fitnessGoal}
                  onValueChange={(value: string) => handleInputChange("healthMetrics", "fitnessGoal", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Build Muscle" value="build_muscle" />
                  <Picker.Item label="Lose Weight" value="lose_weight" />
                  <Picker.Item label="Improve Endurance" value="improve_endurance" />
                  <Picker.Item label="General Fitness" value="general_fitness" />
                  <Picker.Item label="Training for Event" value="training_for_event" />
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BellIcon size={20} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Workout Reminders</Text>
                <Text style={styles.switchSubtitle}>Get notified about upcoming workouts</Text>
              </View>
              <Switch
                value={notifications.workoutReminders}
                onValueChange={() => toggleSwitch("workoutReminders")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View style={[styles.switchRow, styles.borderTop]}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>New Content</Text>
                <Text style={styles.switchSubtitle}>Updates about new workouts and articles</Text>
              </View>
              <Switch
                value={notifications.newContent}
                onValueChange={() => toggleSwitch("newContent")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View style={[styles.switchRow, styles.borderTop]}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Promotions & Offers</Text>
                <Text style={styles.switchSubtitle}>Special discounts and offers</Text>
              </View>
              <Switch
                value={notifications.promotionOffers}
                onValueChange={() => toggleSwitch("promotionOffers")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View style={[styles.switchRow, styles.borderTop]}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Appointment Reminders</Text>
                <Text style={styles.switchSubtitle}>Notifications for trainer sessions</Text>
              </View>
              <Switch
                value={notifications.appointmentReminders}
                onValueChange={() => toggleSwitch("appointmentReminders")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LockClosedIcon size={20} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.switchRow}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Biometric Login</Text>
                <Text style={styles.switchSubtitle}>Use fingerprint or face recognition</Text>
              </View>
              <Switch
                value={security.biometricLogin}
                onValueChange={() => toggleSwitch("biometricLogin")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View style={[styles.switchRow, styles.borderTop]}>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchTitle}>Two-Factor Authentication</Text>
                <Text style={styles.switchSubtitle}>Extra layer of security for your account</Text>
              </View>
              <Switch
                value={security.twoFactorAuth}
                onValueChange={() => toggleSwitch("twoFactorAuth")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <TouchableOpacity style={[styles.menuItem, styles.borderTop]}>
              <Text style={styles.menuItemText}>Change Password</Text>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Settings Options */}
        <View style={[styles.section, styles.lastSection]}>
          <TouchableOpacity style={[styles.menuItem, styles.borderBottom]}>
            <View style={styles.menuItemLeft}>
              <ChartBarIcon size={20} color="#4F46E5" />
              <Text style={styles.menuItemText}>Workout Preferences</Text>
            </View>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, styles.borderBottom]}>
            <View style={styles.menuItemLeft}>
              <CreditCardIcon size={20} color="#4F46E5" />
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, styles.borderBottom]}>
            <View style={styles.menuItemLeft}>
              <QuestionMarkCircleIcon size={20} color="#4F46E5" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <ArrowRightOnRectangleIcon size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveChanges}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    color: '#94A3B8',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
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
  lastSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerContainer: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  switchSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 16,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});