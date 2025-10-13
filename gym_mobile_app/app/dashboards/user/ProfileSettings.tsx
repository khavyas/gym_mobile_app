import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, StyleSheet, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { 
  ChevronRightIcon, 
  UserIcon, 
  LockClosedIcon, 
  BellIcon, 
  HeartIcon, 
  ChartBarIcon, 
  CreditCardIcon, 
  QuestionMarkCircleIcon, 
  ArrowRightOnRectangleIcon,
  CameraIcon,
  BriefcaseIcon
} from "react-native-heroicons/outline";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import { useNavigation } from '@react-navigation/native';

// API Configuration
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

// Define TypeScript interfaces for our state objects
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string | null;
}

interface HealthMetrics {
  weight: string;
  height: string;
  age: string;
  gender: string;
  fitnessGoal: string;
}

interface WorkPreferences {
  occupation: string;
  workoutTiming: string;
  availableDays: string[];
  workStressLevel: string;
  sedentaryHours: string;
  workoutLocation: string;
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

interface ProfileData {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  healthMetrics?: HealthMetrics;
  workPreferences?: WorkPreferences;
  notifications?: Notifications;     
  security?: Security;              
}

interface ProfileSettingsProps {
  navigation: any;
}


export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();
  
  // State for user information
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    profileImage: null,
  });

  // State for health metrics
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    fitnessGoal: "general_fitness",
  });

  // State for work preferences
  const [workPreferences, setWorkPreferences] = useState<WorkPreferences>({
    occupation: "other",
    workoutTiming: "morning",
    availableDays: [],
    workStressLevel: "medium",
    sedentaryHours: "6-8",
    workoutLocation: "gym",
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
    biometricLogin: false,
    twoFactorAuth: false,
  });

  // Load user data and profile on component mount
  useEffect(() => {
    loadUserData();
  }, []);

const loadUserData = async () => {
    console.log('Starting loadUserData...');
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedToken = await AsyncStorage.getItem("userToken");
     
      console.log('Stored userId:', storedUserId);
      console.log('Stored token exists:', !!storedToken);
      
      if (storedUserId && storedToken) {
        setUserId(storedUserId);
        setToken(storedToken);
        console.log('Calling fetchProfile...');
        await fetchProfile(storedUserId, storedToken);
      } else {
        console.error('Missing authentication data:', { storedUserId, hasToken: !!storedToken });
        Alert.alert('Error', 'User not logged in. Please log in again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      Alert.alert('Error', 'Failed to load user data');
      setLoading(false);
    }
  };

const refreshProfile = async () => {
  if (userId && token) {
    setLoading(true);
    await fetchProfile(userId, token);
  }
};

  useFocusEffect(
    React.useCallback(() => {
      console.log('Profile Settings screen focused - loading data');
      loadUserData();
    }, [])
  );


  // Fetch profile data from API
 const fetchProfile = async (userId: string, token: string) => {
    console.log('fetchProfile called with:', { userId, hasToken: !!token });
    console.log('API URL:', `${API_BASE_URL}/profile/${userId}`);
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response status:', response.status);
      console.log('API Response ok:', response.ok);

      if (response.ok) {
        const profileData: ProfileData = await response.json();
        console.log('Profile data received:', profileData);
        
        // Update state with fetched data
        setUserInfo({
          name: profileData.fullName || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          bio: profileData.bio || "",
          profileImage: profileData.profileImage || null,
        });

        // Handle optional nested objects
        if (profileData.healthMetrics) {
          setHealthMetrics(profileData.healthMetrics);
        }

        if (profileData.workPreferences) {
          setWorkPreferences(profileData.workPreferences);
        }

        if (profileData.notifications) {
          setNotifications(profileData.notifications);
        }

        if (profileData.security) {
          setSecurity(profileData.security);
        }

      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('API Error:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Network error in fetchProfile:', error);
      Alert.alert('Error', 'Network error while fetching profile');
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };


  // Update profile data via API
  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!userId || !token) {
      Alert.alert('Error', 'User not authenticated');
      return false;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update profile');
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Network error while updating profile');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Function to handle image picking
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUserInfo({ ...userInfo, profileImage: result.assets[0].uri });
    }
  };

  // Function to take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUserInfo({ ...userInfo, profileImage: result.assets[0].uri });
    }
  };

  // Function to show image picker options
  const showImagePicker = () => {
    Alert.alert(
      "Select Profile Picture",
      "Choose how you'd like to set your profile picture",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Photo Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  // Function to handle input changes with proper typing
  const handleInputChange = (section: "userInfo" | "healthMetrics" | "workPreferences", field: string, value: string) => {
    if (section === "userInfo") {
      setUserInfo({ ...userInfo, [field]: value });
    } else if (section === "healthMetrics") {
      setHealthMetrics({ ...healthMetrics, [field]: value });
    } else if (section === "workPreferences") {
      setWorkPreferences({ ...workPreferences, [field]: value });
    }
  };

  // Function to toggle work days
  const toggleWorkDay = (day: string) => {
    const updatedDays = workPreferences.availableDays.includes(day)
      ? workPreferences.availableDays.filter(d => d !== day)
      : [...workPreferences.availableDays, day];
    
    setWorkPreferences({ ...workPreferences, availableDays: updatedDays });
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
 const saveChanges = async () => {
  const profileUpdateData = {
    fullName: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    bio: userInfo.bio,
    profileImage: userInfo.profileImage || undefined,
    healthMetrics,
    workPreferences,
    notifications,
    security,
  };

  const success = await updateProfile(profileUpdateData);
  if (success) {
    Alert.alert("Success", "Your changes have been saved successfully!");
  }
};

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            {/* Profile Picture Upload */}
            <View style={styles.profileImageSection}>
              <Text style={styles.inputLabel}>Profile Picture</Text>
              <View style={styles.profileImageContainer}>
                <TouchableOpacity style={styles.profileImageButton} onPress={showImagePicker}>
                  {userInfo.profileImage ? (
                    <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <CameraIcon size={32} color="#94A3B8" />
                      <Text style={styles.profileImageText}>Add Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {/* <TouchableOpacity 
                    style={[styles.menuItem, styles.borderTop]}
                   onPress={() => router.push("/dashboards/user/ChangePassword")}
                  >
                    <Text style={styles.menuItemText}>Change Password</Text>
                    <ChevronRightIcon size={20} color="#9CA3AF" />
                </TouchableOpacity> */}
                
              </View>
            </View>

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

        {/* Work Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BriefcaseIcon size={20} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Work Preferences</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Occupation</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={workPreferences.occupation}
                  onValueChange={(value: string) => handleInputChange("workPreferences", "occupation", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Software Engineer" value="software_engineer" />
                  <Picker.Item label="Teacher" value="teacher" />
                  <Picker.Item label="Healthcare Worker" value="healthcare" />
                  <Picker.Item label="Manager" value="manager" />
                  <Picker.Item label="Sales" value="sales" />
                  <Picker.Item label="Student" value="student" />
                  <Picker.Item label="Entrepreneur" value="entrepreneur" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Workout Time</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={workPreferences.workoutTiming}
                  onValueChange={(value: string) => handleInputChange("workPreferences", "workoutTiming", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Early Morning (5-7 AM)" value="early_morning" />
                  <Picker.Item label="Morning (7-9 AM)" value="morning" />
                  <Picker.Item label="Lunch Time (12-2 PM)" value="lunch" />
                  <Picker.Item label="Evening (6-8 PM)" value="evening" />
                  <Picker.Item label="Night (8-10 PM)" value="night" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Available Days</Text>
              <View style={styles.daysContainer}>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      workPreferences.availableDays.includes(day) && styles.dayButtonSelected
                    ]}
                    onPress={() => toggleWorkDay(day)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      workPreferences.availableDays.includes(day) && styles.dayButtonTextSelected
                    ]}>
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Work Stress Level</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={workPreferences.workStressLevel}
                    onValueChange={(value: string) => handleInputChange("workPreferences", "workStressLevel", value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Low" value="low" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="High" value="high" />
                  </Picker>
                </View>
              </View>
              
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Daily Sedentary Hours</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={workPreferences.sedentaryHours}
                    onValueChange={(value: string) => handleInputChange("workPreferences", "sedentaryHours", value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Less than 4" value="0-4" />
                    <Picker.Item label="4-6 hours" value="4-6" />
                    <Picker.Item label="6-8 hours" value="6-8" />
                    <Picker.Item label="8+ hours" value="8+" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Workout Location</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={workPreferences.workoutLocation}
                  onValueChange={(value: string) => handleInputChange("workPreferences", "workoutLocation", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Gym" value="gym" />
                  <Picker.Item label="Home" value="home" />
                  <Picker.Item label="Outdoors" value="outdoors" />
                  <Picker.Item label="Office Gym" value="office_gym" />
                  <Picker.Item label="Mixed" value="mixed" />
                </Picker>
              </View>
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
            
                <TouchableOpacity 
                    style={[styles.menuItem, styles.borderTop]}
                   onPress={() => router.push("/dashboards/user/ChangePassword")}
                  >
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
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveChanges}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
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
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#0F172A',
},
loadingText: {
  color: '#94A3B8',
  fontSize: 16,
  marginTop: 12,
},
saveButtonDisabled: {
  backgroundColor: '#374151',
  opacity: 0.6,
},
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
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
  // Profile Image Styles
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  profileImageText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 8,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // Days Selection Styles
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  dayButtonSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  dayButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
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


