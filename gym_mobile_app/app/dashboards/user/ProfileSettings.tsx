import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from "react-native";
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
    // In a real app, you would send this data to your backend
    alert("Your changes have been saved successfully!");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Profile Settings</Text>
        <Text className="text-gray-500 mt-1">
          Manage your personal information, health metrics, and preferences
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Personal Information Section */}
        <View className="bg-white mt-6 mx-4 rounded-xl shadow-sm">
          <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
            <UserIcon size={20} color="#4F46E5" />
            <Text className="text-lg font-semibold text-gray-900 ml-3">Personal Information</Text>
          </View>
          
          <View className="px-5 py-4">
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Full Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={userInfo.name}
                onChangeText={(value) => handleInputChange("userInfo", "name", value)}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Email Address</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={userInfo.email}
                onChangeText={(value) => handleInputChange("userInfo", "email", value)}
                keyboardType="email-address"
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Phone Number</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                value={userInfo.phone}
                onChangeText={(value) => handleInputChange("userInfo", "phone", value)}
                keyboardType="phone-pad"
              />
            </View>
            
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Bio</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 h-20"
                value={userInfo.bio}
                onChangeText={(value) => handleInputChange("userInfo", "bio", value)}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Health Metrics Section */}
        <View className="bg-white mt-6 mx-4 rounded-xl shadow-sm">
          <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
            <HeartIcon size={20} color="#4F46E5" />
            <Text className="text-lg font-semibold text-gray-900 ml-3">Health Metrics</Text>
          </View>
          
          <View className="px-5 py-4">
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-gray-700 mb-1">Weight (kg)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  value={healthMetrics.weight}
                  onChangeText={(value) => handleInputChange("healthMetrics", "weight", value)}
                  keyboardType="numeric"
                />
              </View>
              
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-gray-700 mb-1">Height (cm)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  value={healthMetrics.height}
                  onChangeText={(value) => handleInputChange("healthMetrics", "height", value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-gray-700 mb-1">Age</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  value={healthMetrics.age}
                  onChangeText={(value) => handleInputChange("healthMetrics", "age", value)}
                  keyboardType="numeric"
                />
              </View>
              
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-gray-700 mb-1">Gender</Text>
                <View className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                  <Picker
                    selectedValue={healthMetrics.gender}
                    onValueChange={(value: string) => handleInputChange("healthMetrics", "gender", value)}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>
            </View>
            
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Fitness Goal</Text>
              <View className="bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={healthMetrics.fitnessGoal}
                  onValueChange={(value: string) => handleInputChange("healthMetrics", "fitnessGoal", value)}
                  style={{ height: 50 }}
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
        <View className="bg-white mt-6 mx-4 rounded-xl shadow-sm">
          <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
            <BellIcon size={20} color="#4F46E5" />
            <Text className="text-lg font-semibold text-gray-900 ml-3">Notification Preferences</Text>
          </View>
          
          <View className="px-5 py-4">
            <View className="flex-row justify-between items-center py-3">
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Workout Reminders</Text>
                <Text className="text-gray-500 text-sm">Get notified about upcoming workouts</Text>
              </View>
              <Switch
                value={notifications.workoutReminders}
                onValueChange={() => toggleSwitch("workoutReminders")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">New Content</Text>
                <Text className="text-gray-500 text-sm">Updates about new workouts and articles</Text>
              </View>
              <Switch
                value={notifications.newContent}
                onValueChange={() => toggleSwitch("newContent")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Promotions & Offers</Text>
                <Text className="text-gray-500 text-sm">Special discounts and offers</Text>
              </View>
              <Switch
                value={notifications.promotionOffers}
                onValueChange={() => toggleSwitch("promotionOffers")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Appointment Reminders</Text>
                <Text className="text-gray-500 text-sm">Notifications for trainer sessions</Text>
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
        <View className="bg-white mt-6 mx-4 rounded-xl shadow-sm">
          <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
            <LockClosedIcon size={20} color="#4F46E5" />
            <Text className="text-lg font-semibold text-gray-900 ml-3">Security</Text>
          </View>
          
          <View className="px-5 py-4">
            <View className="flex-row justify-between items-center py-3">
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Biometric Login</Text>
                <Text className="text-gray-500 text-sm">Use fingerprint or face recognition</Text>
              </View>
              <Switch
                value={security.biometricLogin}
                onValueChange={() => toggleSwitch("biometricLogin")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <View className="flex-row justify-between items-center py-3 border-t border-gray-100">
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Two-Factor Authentication</Text>
                <Text className="text-gray-500 text-sm">Extra layer of security for your account</Text>
              </View>
              <Switch
                value={security.twoFactorAuth}
                onValueChange={() => toggleSwitch("twoFactorAuth")}
                trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
              />
            </View>
            
            <TouchableOpacity className="flex-row justify-between items-center py-4 border-t border-gray-100">
              <Text className="text-gray-900 font-medium">Change Password</Text>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Settings Options */}
        <View className="bg-white mt-6 mx-4 rounded-xl shadow-sm mb-8">
          <TouchableOpacity className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <ChartBarIcon size={20} color="#4F46E5" />
              <Text className="text-gray-900 font-medium ml-3">Workout Preferences</Text>
            </View>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <CreditCardIcon size={20} color="#4F46E5" />
              <Text className="text-gray-900 font-medium ml-3">Payment Methods</Text>
            </View>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center px-5 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <QuestionMarkCircleIcon size={20} color="#4F46E5" />
              <Text className="text-gray-900 font-medium ml-3">Help & Support</Text>
            </View>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center px-5 py-4">
            <View className="flex-row items-center">
              <ArrowRightOnRectangleIcon size={20} color="#EF4444" />
              <Text className="text-red-500 font-medium ml-3">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          className="bg-indigo-600 mx-4 py-4 rounded-xl mb-8 shadow-sm"
          onPress={saveChanges}
        >
          <Text className="text-white text-center font-bold text-lg">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}