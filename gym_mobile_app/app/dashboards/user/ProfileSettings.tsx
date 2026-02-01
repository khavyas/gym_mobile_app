import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, StyleSheet, Alert, Image, Modal, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { ChevronRightIcon, UserIcon, LockClosedIcon, BellIcon, HeartIcon, ChartBarIcon, CreditCardIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon, CameraIcon, BriefcaseIcon, IdentificationIcon, MapPinIcon, ChevronDownIcon } from "react-native-heroicons/outline";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import { logout } from '../../utils/auth';
import { Animated } from "react-native";

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  type?: 'success' | 'error';
}

// API Configuration
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

// Custom Dropdown Component
interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

// ── Wellness types ──
interface WellnessQuestionItem {
  questionId: number;
  question: string;
  type: 'scale' | 'multiple-choice' | 'text';
  options?: string[];
  multiSelect?: boolean;
  placeholder?: string;
  order: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  selectedValue, 
  onValueChange, 
  placeholder = "Select an option" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === selectedValue);
  
  return (
    <View>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDownIcon size={20} color="#94A3B8" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Option</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === selectedValue && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === selectedValue && styles.optionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === selectedValue && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Dropdown options
const OCCUPATION_OPTIONS: DropdownOption[] = [
  { label: "IT Professional", value: "it_professional" },
  { label: "Healthcare Worker", value: "healthcare_worker" },
  { label: "Teacher/Professor", value: "teacher" },
  { label: "Business Owner", value: "business_owner" },
  { label: "Student", value: "student" },
  { label: "Homemaker", value: "homemaker" },
  { label: "Retired", value: "retired" },
  { label: "Other", value: "other" },
];

const WORKOUT_TIMING_OPTIONS: DropdownOption[] = [
  { label: "Morning (5 AM - 9 AM)", value: "morning" },
  { label: "Afternoon (12 PM - 3 PM)", value: "afternoon" },
  { label: "Evening (5 PM - 8 PM)", value: "evening" },
  { label: "Night (8 PM - 11 PM)", value: "night" },
];

const STRESS_LEVEL_OPTIONS: DropdownOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const SEDENTARY_HOURS_OPTIONS: DropdownOption[] = [
  { label: "Less than 4 hours", value: "<4" },
  { label: "4-6 hours", value: "4-6" },
  { label: "6-8 hours", value: "6-8" },
  { label: "8-10 hours", value: "8-10" },
  { label: "More than 10 hours", value: ">10" },
];

const WORKOUT_LOCATION_OPTIONS: DropdownOption[] = [
  { label: "Gym", value: "gym" },
  { label: "Home", value: "home" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Office", value: "office" },
];

const GENDER_OPTIONS: DropdownOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const FITNESS_GOAL_OPTIONS: DropdownOption[] = [
  { label: "Weight Loss", value: "weight_loss" },
  { label: "Muscle Gain", value: "muscle_gain" },
  { label: "General Fitness", value: "general_fitness" },
  { label: "Strength Training", value: "strength_training" },
  { label: "Endurance", value: "endurance" },
  { label: "Flexibility", value: "flexibility" },
];

// Interfaces
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string | null;
  dateOfBirth: string;
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

interface GovernmentIds {
  aadharNumber: string;
  abhaId: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
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
  dateOfBirth?: string;
  healthMetrics?: HealthMetrics;
  workPreferences?: WorkPreferences;
  aadharNumber?: string;
  abhaId?: string;
  address?: Address;
  notifications?: Notifications;
  security?: Security;
}

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
      <View style={[styles.toastContent, isError && styles.toastError]}>
        <Text style={[styles.toastIcon, isError && styles.toastErrorIcon]}>
          {isError ? '✗' : '✓'}
        </Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [bmiCalculated, setBmiCalculated] = useState(false);
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiColor, setBmiColor] = useState('#94A3B8');

  // ── Wellness state ──
  const [wellnessQuestions, setWellnessQuestions] = useState<WellnessQuestionItem[]>([]);
  const [wellnessAnswers, setWellnessAnswers] = useState<Record<number, string | string[]>>({});
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [wellnessLoading, setWellnessLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    profileImage: null,
    dateOfBirth: "",
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    fitnessGoal: "general_fitness",
  });

  const [workPreferences, setWorkPreferences] = useState<WorkPreferences>({
    occupation: "other",
    workoutTiming: "morning",
    availableDays: [],
    workStressLevel: "medium",
    sedentaryHours: "6-8",
    workoutLocation: "gym",
  });

  const [governmentIds, setGovernmentIds] = useState<GovernmentIds>({
    aadharNumber: "",
    abhaId: "",
  });

  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [notifications, setNotifications] = useState<Notifications>({
    workoutReminders: true,
    newContent: true,
    promotionOffers: false,
    appointmentReminders: true,
  });

  const [security, setSecurity] = useState<Security>({
    biometricLogin: false,
    twoFactorAuth: false,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  // ── Fetch wellness questions + this user's saved responses ──
  const fetchWellnessData = async (storedUserId: string, storedToken: string) => {
    try {
      setWellnessLoading(true);

      // 1) all questions
      const qRes = await fetch(`${API_BASE_URL}/wellness/questions`, {
        headers: { Authorization: `Bearer ${storedToken}`, 'Content-Type': 'application/json' },
      });
      const qData = await qRes.json();
      if (qRes.ok && qData.success) {
        setWellnessQuestions(qData.questions);
      }

      // 2) this user's answers  { questionId: answer, ... }
      const aRes = await fetch(`${API_BASE_URL}/wellness/responses/${storedUserId}`, {
        headers: { Authorization: `Bearer ${storedToken}`, 'Content-Type': 'application/json' },
      });
      const aData = await aRes.json();
      if (aRes.ok && aData.success) {
        setWellnessAnswers(aData.answers);
      }
    } catch (err) {
      console.error('fetchWellnessData error:', err);
    } finally {
      setWellnessLoading(false);
    }
  };

  // BMI Calculation Function
  const calculateBMI = () => {
    const weight = parseFloat(healthMetrics.weight);
    const height = parseFloat(healthMetrics.height);

    if (!weight || !height || weight <= 0 || height <= 0) {
      setToastType('error');
      setToastMessage('Please enter valid weight and height');
      setShowToast(true);
      return;
    }

    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    
    setBmi(parseFloat(calculatedBmi.toFixed(1)));
    setBmiCalculated(true);

    let category = '';
    let color = '';

    if (calculatedBmi < 18.5) {
      category = 'Underweight';
      color = '#60A5FA';
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      category = 'Normal';
      color = '#10B981';
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      category = 'Overweight';
      color = '#F59E0B';
    } else {
      category = 'Obese';
      color = '#EF4444';
    }

    setBmiCategory(category);
    setBmiColor(color);

    setToastType('success');
    setToastMessage(`BMI Calculated: ${calculatedBmi.toFixed(1)} - ${category}`);
    setShowToast(true);
  };

  const getBMIProgress = () => {
    if (!bmiCalculated) return 0;
    const minBmi = 15;
    const maxBmi = 40;
    const progress = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const loadUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedToken = await AsyncStorage.getItem("userToken");

      if (storedUserId && storedToken) {
        setUserId(storedUserId);
        setToken(storedToken);
        await fetchProfile(storedUserId, storedToken);
        await fetchWellnessData(storedUserId, storedToken); // ← fetch wellness alongside profile
      } else {
        Alert.alert('Error', 'User not logged in. Please log in again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      Alert.alert('Error', 'Failed to load user data');
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string, token: string) => {
    try {
      setLoading(true);
      setToastType('success');
      setToastMessage('Loading your profile...');
      setShowToast(true);

      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const profileData: ProfileData = await response.json();
        
        setUserInfo({
          name: profileData.fullName || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          bio: profileData.bio || "",
          profileImage: profileData.profileImage || null,
          dateOfBirth: profileData.dateOfBirth || "",
        });

        if (profileData.healthMetrics) {
          setHealthMetrics({
            weight: profileData.healthMetrics.weight || "",
            height: profileData.healthMetrics.height || "",
            age: profileData.healthMetrics.age || "",
            gender: profileData.healthMetrics.gender || "male",
            fitnessGoal: profileData.healthMetrics.fitnessGoal || "general_fitness",
          });
        }

        if (profileData.workPreferences) {
          setWorkPreferences({
            occupation: profileData.workPreferences.occupation || "other",
            workoutTiming: profileData.workPreferences.workoutTiming || "morning",
            availableDays: profileData.workPreferences.availableDays || [],
            workStressLevel: profileData.workPreferences.workStressLevel || "medium",
            sedentaryHours: profileData.workPreferences.sedentaryHours || "6-8",
            workoutLocation: profileData.workPreferences.workoutLocation || "gym",
          });
        }

        setGovernmentIds({
          aadharNumber: profileData.aadharNumber || "",
          abhaId: profileData.abhaId || "",
        });

        if (profileData.address) {
          setAddress({
            street: profileData.address.street || "",
            city: profileData.address.city || "",
            state: profileData.address.state || "",
            pincode: profileData.address.pincode || "",
          });
        }

        if (profileData.notifications) {
          setNotifications(profileData.notifications);
        }

        if (profileData.security) {
          setSecurity(profileData.security);
        }

        setToastType('success');
        setToastMessage('Profile loaded successfully!');
        setShowToast(true);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setToastType('error');
        setToastMessage(errorData.message || 'Failed to fetch profile');
        setShowToast(true);
      }
    } catch (error: any) {
      console.error('Network error in fetchProfile:', error);
      setToastType('error');
      setToastMessage(error.message || 'Network error while fetching profile');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!userId || !token) {
      setToastType('error');
      setToastMessage('User not authenticated');
      setShowToast(true);
      return false;
    }

    if (governmentIds.aadharNumber && governmentIds.aadharNumber.length > 0 && governmentIds.aadharNumber.length !== 12) {
      setToastType('error');
      setToastMessage('Aadhar number must be exactly 12 digits');
      setShowToast(true);
      return false;
    }

    if (address.pincode && address.pincode.length > 0 && address.pincode.length !== 6) {
      setToastType('error');
      setToastMessage('Pincode must be exactly 6 digits');
      setShowToast(true);
      return false;
    }

    try {
      setSaving(true);
      setToastType('success');
      setToastMessage('Saving your profile...');
      setShowToast(true);

      const updatePayload = {
        phone: userInfo.phone,
        bio: userInfo.bio,
        profileImage: userInfo.profileImage || undefined,
        dateOfBirth: userInfo.dateOfBirth || undefined,
        healthMetrics,
        workPreferences,
        aadharNumber: governmentIds.aadharNumber || undefined,
        abhaId: governmentIds.abhaId || undefined,
        address,
        notifications,
        security,
      };

      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        const result = await response.json();
        setToastType('success');
        setToastMessage(result.message || 'Profile updated successfully! 🎉');
        setShowToast(true);
        return true;
      } else {
        const errorData = await response.json();
        let errorMessage = 'Failed to update profile';
        
        if (errorData.message) {
          if (errorData.message.includes('validation failed')) {
            if (errorData.message.includes('aadharNumber')) {
              errorMessage = 'Aadhar number must be exactly 12 digits';
            } else if (errorData.message.includes('pincode')) {
              errorMessage = 'Pincode must be exactly 6 digits';
            } else {
              errorMessage = 'Please check your input fields';
            }
          } else {
            errorMessage = errorData.message;
          }
        }

        setToastType('error');
        setToastMessage(errorMessage);
        setShowToast(true);
        return false;
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setToastType('error');
      setToastMessage(error.message || 'Network error while updating profile');
      setShowToast(true);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    console.log('🔴 Starting logout process directly...');
    try {
      console.log('🔵 Clearing AsyncStorage...');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      console.log('✅ AsyncStorage cleared');

      console.log('🔵 Clearing local states...');
      setUserId(null);
      setToken(null);
      console.log('✅ Local states cleared');

      setToastType('success');
      setToastMessage('Logged out successfully!');
      setShowToast(true);

      setTimeout(() => {
        console.log('🔵 Redirecting to login...');
        try {
          router.replace('/login');
          console.log('✅ Redirected with /login');
        } catch (e1) {
          console.log('⚠️ /login failed, trying ../../../login');
          try {
            router.replace('../../../login');
            console.log('✅ Redirected with ../../../login');
          } catch (e2) {
            console.log('⚠️ Relative path failed, trying push');
            router.push('/login');
            console.log('✅ Pushed to /login');
          }
        }
      }, 500);
    } catch (error) {
      console.error('❌ Logout error:', error);
      setToastType('error');
      setToastMessage('Failed to logout');
      setShowToast(true);
    }
  };

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

  const handleInputChange = (section: string, field: string, value: string) => {
    if (section === "userInfo") {
      setUserInfo({ ...userInfo, [field]: value });
    } else if (section === "healthMetrics") {
      setHealthMetrics({ ...healthMetrics, [field]: value });
      if (field === "weight" || field === "height") {
        setBmiCalculated(false);
      }
    } else if (section === "workPreferences") {
      setWorkPreferences({ ...workPreferences, [field]: value });
    } else if (section === "governmentIds") {
      setGovernmentIds({ ...governmentIds, [field]: value });
    } else if (section === "address") {
      setAddress({ ...address, [field]: value });
    }
  };

  const toggleWorkDay = (day: string) => {
    const updatedDays = workPreferences.availableDays.includes(day)
      ? workPreferences.availableDays.filter(d => d !== day)
      : [...workPreferences.availableDays, day];
    setWorkPreferences({ ...workPreferences, availableDays: updatedDays });
  };

  const toggleSwitch = (field: keyof Notifications | keyof Security) => {
    if (field in notifications) {
      setNotifications({ ...notifications, [field]: !notifications[field as keyof Notifications] });
    } else if (field in security) {
      setSecurity({ ...security, [field]: !security[field as keyof Security] });
    }
  };

  // ── Derived: how many questions have been answered ──
  const answeredCount = wellnessQuestions.filter((q) => {
    const a = wellnessAnswers[q.questionId];
    return a != null && (Array.isArray(a) ? a.length > 0 : a !== '');
  }).length;
  const totalCount = wellnessQuestions.length;

  // ── Render one Q&A row inside the modal ──
  const renderWellnessItem = ({ item }: { item: WellnessQuestionItem }) => {
    const answer = wellnessAnswers[item.questionId];
    const hasAnswer = answer != null && (Array.isArray(answer) ? answer.length > 0 : answer !== '');

    return (
      <View style={styles.wellnessModalItem}>
        {/* badge */}
        <View style={styles.wellnessModalBadge}>
          <Text style={styles.wellnessModalBadgeText}>Q{item.questionId}</Text>
        </View>

        {/* question */}
        <Text style={styles.wellnessModalQuestion}>{item.question}</Text>

        {/* answer */}
        <View style={[styles.wellnessModalAnswerBox, !hasAnswer && styles.wellnessModalAnswerBoxEmpty]}>
          {hasAnswer ? (
            Array.isArray(answer) ? (
              <View style={styles.wellnessModalTagsRow}>
                {(answer as string[]).map((tag, i) => (
                  <View key={i} style={styles.wellnessModalTag}>
                    <Text style={styles.wellnessModalTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.wellnessModalAnswerText}>{answer}</Text>
            )
          ) : (
            <Text style={styles.wellnessModalEmptyAnswerText}>Not answered</Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Toast 
        visible={showToast} 
        message={toastMessage} 
        type={toastType}
        onHide={() => setShowToast(false)} 
      />

      {/* ─────────────── Wellness Responses Modal ─────────────── */}
      <Modal
        visible={showWellnessModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWellnessModal(false)}
      >
        <View style={styles.wellnessModalOverlay}>
          <View style={styles.wellnessModalContainer}>
            {/* header */}
            <View style={styles.wellnessModalHeader}>
              <View>
                <Text style={styles.wellnessModalTitle}>💭 Wellness Responses</Text>
                <Text style={styles.wellnessModalSubtitle}>
                  {answeredCount} of {totalCount} answered
                </Text>
              </View>
              <TouchableOpacity
                style={styles.wellnessModalCloseBtn}
                onPress={() => setShowWellnessModal(false)}
              >
                <Text style={styles.wellnessModalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* thin progress bar */}
            <View style={styles.wellnessModalProgressBg}>
              <View
                style={[
                  styles.wellnessModalProgressFill,
                  { width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` },
                ]}
              />
            </View>

            {/* question list */}
            {wellnessLoading ? (
              <View style={styles.wellnessModalCenterBox}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.wellnessModalLoadingText}>Loading responses…</Text>
              </View>
            ) : totalCount === 0 ? (
              <Text style={styles.wellnessModalEmptyText}>No questions available.</Text>
            ) : (
              <FlatList
                data={wellnessQuestions}
                keyExtractor={(item) => item.questionId.toString()}
                renderItem={renderWellnessItem}
                contentContainerStyle={styles.wellnessModalList}
              />
            )}
          </View>
        </View>
      </Modal>
      {/* ─────────────── end modal ─────────────── */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage your personal information, health metrics, and preferences
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserIcon size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.profileImageSection}>
              <View style={styles.profileImageContainer}>
                <TouchableOpacity 
                  style={styles.profileImageButton}
                  onPress={showImagePicker}
                >
                  {userInfo.profileImage ? (
                    <Image 
                      source={{ uri: userInfo.profileImage }} 
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <CameraIcon size={32} color="#94A3B8" />
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.profileImageText}>
                  {userInfo.profileImage ? 'Change Photo' : 'Add Photo'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name (Cannot be changed)</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={userInfo.name}
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address (Cannot be changed)</Text>
              <TextInput
                style={[styles.textInput, styles.disabledInput]}
                value={userInfo.email}
                editable={false}
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
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={styles.textInput}
                value={userInfo.dateOfBirth}
                onChangeText={(value) => handleInputChange("userInfo", "dateOfBirth", value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={userInfo.bio}
                onChangeText={(value) => handleInputChange("userInfo", "bio", value)}
                multiline
                placeholder="Tell us about yourself"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
        </View>

        {/* Government IDs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IdentificationIcon size={24} color="#4F46E5" />
            <Text style={[styles.sectionTitle, styles.secureTitle]}>Government IDs (Secure)</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.securityNotice}>
              <Text style={styles.securityNoticeText}>
                🔒 Your government IDs are encrypted and stored securely. This information is used for verification purposes only.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Aadhar Number (12 digits)</Text>
              <TextInput
                style={styles.textInput}
                value={governmentIds.aadharNumber}
                onChangeText={(value) => handleInputChange("governmentIds", "aadharNumber", value)}
                keyboardType="numeric"
                maxLength={12}
                placeholder="XXXX XXXX XXXX"
                placeholderTextColor="#6B7280"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ABHA ID (Health ID)</Text>
              <TextInput
                style={styles.textInput}
                value={governmentIds.abhaId}
                onChangeText={(value) => handleInputChange("governmentIds", "abhaId", value)}
                placeholder="Your ABDM Health ID"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPinIcon size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Address</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.textInput}
                value={address.street}
                onChangeText={(value) => handleInputChange("address", "street", value)}
                placeholder="Enter street address"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.textInput}
                  value={address.city}
                  onChangeText={(value) => handleInputChange("address", "city", value)}
                  placeholder="City"
                  placeholderTextColor="#6B7280"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.textInput}
                  value={address.state}
                  onChangeText={(value) => handleInputChange("address", "state", value)}
                  placeholder="State"
                  placeholderTextColor="#6B7280"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pincode</Text>
              <TextInput
                style={styles.textInput}
                value={address.pincode}
                onChangeText={(value) => handleInputChange("address", "pincode", value)}
                keyboardType="numeric"
                maxLength={6}
                placeholder="6-digit pincode"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
        </View>

        {/* Work Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BriefcaseIcon size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Work Preferences</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Occupation</Text>
              <CustomDropdown
                options={OCCUPATION_OPTIONS}
                selectedValue={workPreferences.occupation}
                onValueChange={(value) => handleInputChange("workPreferences", "occupation", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Workout Time</Text>
              <CustomDropdown
                options={WORKOUT_TIMING_OPTIONS}
                selectedValue={workPreferences.workoutTiming}
                onValueChange={(value) => handleInputChange("workPreferences", "workoutTiming", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Available Days</Text>
              <View style={styles.daysContainer}>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      workPreferences.availableDays.includes(day) && styles.dayButtonSelected,
                    ]}
                    onPress={() => toggleWorkDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        workPreferences.availableDays.includes(day) && styles.dayButtonTextSelected,
                      ]}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work Stress Level</Text>
              <CustomDropdown
                options={STRESS_LEVEL_OPTIONS}
                selectedValue={workPreferences.workStressLevel}
                onValueChange={(value) => handleInputChange("workPreferences", "workStressLevel", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Daily Sedentary Hours</Text>
              <CustomDropdown
                options={SEDENTARY_HOURS_OPTIONS}
                selectedValue={workPreferences.sedentaryHours}
                onValueChange={(value) => handleInputChange("workPreferences", "sedentaryHours", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Workout Location</Text>
              <CustomDropdown
                options={WORKOUT_LOCATION_OPTIONS}
                selectedValue={workPreferences.workoutLocation}
                onValueChange={(value) => handleInputChange("workPreferences", "workoutLocation", value)}
              />
            </View>
          </View>
        </View>

        {/* Health Metrics Section with BMI Calculator */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HeartIcon size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Health Metrics & BMI</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.textInput}
                  value={healthMetrics.weight}
                  onChangeText={(value) => handleInputChange("healthMetrics", "weight", value)}
                  keyboardType="numeric"
                  placeholder="70"
                  placeholderTextColor="#6B7280"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                  style={styles.textInput}
                  value={healthMetrics.height}
                  onChangeText={(value) => handleInputChange("healthMetrics", "height", value)}
                  keyboardType="numeric"
                  placeholder="170"
                  placeholderTextColor="#6B7280"
                />
              </View>
            </View>

            {/* BMI Calculator Card */}
            <View style={styles.bmiCalculatorCard}>
              <View style={styles.bmiHeader}>
                <View style={styles.bmiIconContainer}>
                  <Text style={styles.bmiIcon}>⚖️</Text>
                </View>
                <View style={styles.bmiHeaderText}>
                  <Text style={styles.bmiTitle}>BMI Calculator</Text>
                  <Text style={styles.bmiSubtitle}>Body Mass Index Analysis</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.calculateButton}
                onPress={calculateBMI}
              >
                <Text style={styles.calculateButtonText}>Calculate BMI</Text>
                <Text style={styles.calculateButtonIcon}>→</Text>
              </TouchableOpacity>

              {bmiCalculated && (
                <View style={styles.bmiResultContainer}>
                  <View style={[styles.bmiScoreCard, { borderColor: bmiColor }]}>
                    <Text style={styles.bmiScoreLabel}>Your BMI</Text>
                    <Text style={[styles.bmiScore, { color: bmiColor }]}>{bmi}</Text>
                    <View style={[styles.bmiCategoryBadge, { backgroundColor: bmiColor + '20' }]}>
                      <Text style={[styles.bmiCategoryText, { color: bmiColor }]}>
                        {bmiCategory}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bmiRangeContainer}>
                    <Text style={styles.bmiRangeTitle}>BMI Range</Text>
                    <View style={styles.bmiRangeBar}>
                      <View style={styles.bmiRangeGradient}>
                        <View style={[styles.bmiRangeSegment, { backgroundColor: '#60A5FA' }]} />
                        <View style={[styles.bmiRangeSegment, { backgroundColor: '#10B981' }]} />
                        <View style={[styles.bmiRangeSegment, { backgroundColor: '#F59E0B' }]} />
                        <View style={[styles.bmiRangeSegment, { backgroundColor: '#EF4444' }]} />
                      </View>
                      <View 
                        style={[
                          styles.bmiIndicator, 
                          { 
                            left: `${getBMIProgress()}%`,
                            backgroundColor: bmiColor 
                          }
                        ]} 
                      >
                        <View style={[styles.bmiIndicatorDot, { backgroundColor: bmiColor }]} />
                      </View>
                    </View>
                    
                    <View style={styles.bmiRangeLabels}>
                      <Text style={styles.bmiRangeLabel}>15</Text>
                      <Text style={styles.bmiRangeLabel}>18.5</Text>
                      <Text style={styles.bmiRangeLabel}>25</Text>
                      <Text style={styles.bmiRangeLabel}>30</Text>
                      <Text style={styles.bmiRangeLabel}>40</Text>
                    </View>
                  </View>

                  <View style={styles.bmiCategoriesContainer}>
                    <Text style={styles.bmiCategoriesTitle}>BMI Categories</Text>
                    <View style={styles.bmiCategoryRow}>
                      <View style={[styles.bmiCategoryDot, { backgroundColor: '#60A5FA' }]} />
                      <Text style={styles.bmiCategoryLabel}>Underweight</Text>
                      <Text style={styles.bmiCategoryValue}>&lt; 18.5</Text>
                    </View>
                    <View style={styles.bmiCategoryRow}>
                      <View style={[styles.bmiCategoryDot, { backgroundColor: '#10B981' }]} />
                      <Text style={styles.bmiCategoryLabel}>Normal</Text>
                      <Text style={styles.bmiCategoryValue}>18.5 - 24.9</Text>
                    </View>
                    <View style={styles.bmiCategoryRow}>
                      <View style={[styles.bmiCategoryDot, { backgroundColor: '#F59E0B' }]} />
                      <Text style={styles.bmiCategoryLabel}>Overweight</Text>
                      <Text style={styles.bmiCategoryValue}>25 - 29.9</Text>
                    </View>
                    <View style={styles.bmiCategoryRow}>
                      <View style={[styles.bmiCategoryDot, { backgroundColor: '#EF4444' }]} />
                      <Text style={styles.bmiCategoryLabel}>Obese</Text>
                      <Text style={styles.bmiCategoryValue}>&gt; 30</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* ─── Wellness Responses Card (right after BMI card) ─── */}
            <View style={styles.wellnessCard}>
              <View style={styles.wellnessCardHeader}>
                <View style={styles.wellnessCardIconWrap}>
                  <Text style={styles.wellnessCardIcon}>💭</Text>
                </View>
                <View style={styles.wellnessCardTextWrap}>
                  <Text style={styles.wellnessCardTitle}>Wellness Responses</Text>
                  <Text style={styles.wellnessCardSubtitle}>
                    {totalCount > 0
                      ? `${answeredCount} of ${totalCount} questions answered`
                      : 'No questions available'}
                  </Text>
                </View>
              </View>

             
              <TouchableOpacity
                style={styles.wellnessCardButton}
                onPress={() => setShowWellnessModal(true)}
              >
                <Text style={styles.wellnessCardButtonText}>View My Responses</Text>
                <Text style={styles.wellnessCardButtonArrow}>→</Text>
              </TouchableOpacity>
            </View>
            {/* ─── end wellness card ─── */}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.textInput}
                value={healthMetrics.age}
                onChangeText={(value) => handleInputChange("healthMetrics", "age", value)}
                keyboardType="numeric"
                placeholder="25"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <CustomDropdown
                options={GENDER_OPTIONS}
                selectedValue={healthMetrics.gender}
                onValueChange={(value) => handleInputChange("healthMetrics", "gender", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fitness Goal</Text>
              <CustomDropdown
                options={FITNESS_GOAL_OPTIONS}
                selectedValue={healthMetrics.fitnessGoal}
                onValueChange={(value) => handleInputChange("healthMetrics", "fitnessGoal", value)}
              />
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BellIcon size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={[styles.switchRow, styles.borderBottom]}>
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

            <View style={[styles.switchRow, styles.borderBottom]}>
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

            <View style={[styles.switchRow, styles.borderBottom]}>
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

            <View style={styles.switchRow}>
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
            <LockClosedIcon size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={[styles.switchRow, styles.borderBottom]}>
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

            <View style={styles.switchRow}>
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
              <View style={styles.menuItemLeft}>
                <LockClosedIcon size={20} color="#FFFFFF" />
                <Text style={styles.menuItemText}>Change Password</Text>
              </View>
              <ChevronRightIcon size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Settings Options */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => {}}
          >
            <View style={styles.menuItemLeft}>
              <ChartBarIcon size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Workout Preferences</Text>
            </View>
            <ChevronRightIcon size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => {}}
          >
            <View style={styles.menuItemLeft}>
              <CreditCardIcon size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRightIcon size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => {}}
          >
            <View style={styles.menuItemLeft}>
              <QuestionMarkCircleIcon size={20} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRightIcon size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <ArrowRightOnRectangleIcon size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={updateProfile}
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
  // ── Custom Dropdown ──
  dropdownButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalClose: {
    fontSize: 24,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  optionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionItemSelected: {
    backgroundColor: '#4F46E520',
  },
  optionText: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  optionTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#4F46E5',
    fontWeight: 'bold',
  },

  // ── Toast ──
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
  toastError: {
    backgroundColor: '#7F1D1D',
    borderLeftColor: '#EF4444',
  },
  toastIcon: {
    fontSize: 20,
    color: '#10B981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  toastErrorIcon: {
    color: '#EF4444',
  },
  toastMessage: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ── Layout ──
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },

  // ── Sections ──
  section: {
    backgroundColor: '#1E293B',
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  secureTitle: {
    color: '#FCA5A5',
    fontWeight: '700',
  },
  securityNotice: {
    backgroundColor: '#1F2937',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  securityNoticeText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },

  // ── Profile image ──
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

  // ── Inputs ──
  disabledInput: {
    backgroundColor: '#1F2937',
    color: '#6B7280',
    opacity: 0.7,
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

  // ── Day buttons ──
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

  // ── Switches ──
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

  // ── Menu items ──
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

  // ── Save button ──
  saveButton: {
    backgroundColor: '#4F46E5',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
    fontSize: 18,
  },

  // ── BMI Calculator ──
  bmiCalculatorCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#374151',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bmiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4F46E520',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bmiIcon: {
    fontSize: 24,
  },
  bmiHeaderText: {
    flex: 1,
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bmiSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  calculateButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  calculateButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bmiResultContainer: {
    marginTop: 24,
  },
  bmiScoreCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  bmiScoreLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bmiScore: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bmiCategoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bmiCategoryText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bmiRangeContainer: {
    marginBottom: 20,
  },
  bmiRangeTitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bmiRangeBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  bmiRangeGradient: {
    flexDirection: 'row',
    height: '100%',
  },
  bmiRangeSegment: {
    flex: 1,
  },
  bmiIndicator: {
    position: 'absolute',
    top: -8,
    width: 28,
    height: 28,
    marginLeft: -14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bmiIndicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bmiRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  bmiRangeLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  bmiCategoriesContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
  },
  bmiCategoriesTitle: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bmiCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bmiCategoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  bmiCategoryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  bmiCategoryValue: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  // ── Wellness trigger card ──
  wellnessCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#374151',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  wellnessCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  wellnessCardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  wellnessCardIcon: {
    fontSize: 24,
  },
  wellnessCardTextWrap: {
    flex: 1,
  },
  wellnessCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  wellnessCardSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  wellnessCardProgressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
    marginBottom: 16,
    overflow: 'hidden',
  },
  wellnessCardProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  wellnessCardButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  wellnessCardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  wellnessCardButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // ── Wellness modal (bottom sheet) ──
  wellnessModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  wellnessModalContainer: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  wellnessModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  wellnessModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  wellnessModalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  wellnessModalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wellnessModalCloseBtnText: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  wellnessModalProgressBg: {
    height: 4,
    backgroundColor: '#374151',
  },
  wellnessModalProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  wellnessModalList: {
    padding: 16,
  },
  wellnessModalCenterBox: {
    alignItems: 'center',
    padding: 48,
  },
  wellnessModalLoadingText: {
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 12,
  },
  wellnessModalEmptyText: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
    padding: 40,
  },

  // ── Each Q&A item ──
  wellnessModalItem: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  wellnessModalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4F46E520',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  wellnessModalBadgeText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  wellnessModalQuestion: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 10,
  },
  wellnessModalAnswerBox: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#10B98130',
  },
  wellnessModalAnswerBoxEmpty: {
    borderColor: '#334155',
  },
  wellnessModalAnswerText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  wellnessModalEmptyAnswerText: {
    color: '#4B5563',
    fontSize: 14,
    fontStyle: 'italic',
  },
  wellnessModalTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wellnessModalTag: {
    backgroundColor: '#10B98118',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#10B98140',
  },
  wellnessModalTagText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
  },
});