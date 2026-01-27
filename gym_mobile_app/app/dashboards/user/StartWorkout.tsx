import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert, Image, TextInput, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  Activity, 
  Dumbbell, 
  Heart, 
  Flame,
  ChevronRight,
  Search,
  X,
  Clock,
  TrendingUp,
  Zap,
  Timer,
  Play,
  Pause,
  StopCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Animated } from 'react-native';

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';
const { width } = Dimensions.get('window');

// Type Definitions
interface METValues {
  low?: number;
  light?: number;
  medium?: number;
  moderate?: number;
  high?: number;
  heavy?: number;
  [key: string]: number | undefined;
}

interface Exercise {
  id: string;
  name: string;
  mets: METValues;
  icon: string;
  popular: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string[];
}

interface WorkoutEntry {
  id: string;
  workoutType: string;
  category: string;
  duration: number;
  caloriesBurned: number;
  intensity: string;
  notes: string;
  time: string;
}

interface APIWorkoutEntry {
  _id: string;
  user: string;
  workoutType: string;
  duration: number;
  caloriesBurned: number;
  intensity: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Exercise Database with MET values
const EXERCISE_DATABASE: Record<string, Exercise[]> = {
  cardio: [
    { id: 'running_outdoor', name: 'Running (Outdoor)', mets: { low: 6.0, medium: 9.8, high: 12.5 }, icon: '🏃', popular: true },
    { id: 'treadmill', name: 'Treadmill', mets: { low: 5.0, medium: 8.0, high: 11.0 }, icon: '🏃', popular: true },
    { id: 'cycling', name: 'Cycling', mets: { low: 4.0, medium: 8.0, high: 12.0 }, icon: '🚴', popular: true },
    { id: 'rowing', name: 'Rowing Machine', mets: { low: 4.8, medium: 7.0, high: 12.0 }, icon: '🚣', popular: false },
    { id: 'elliptical', name: 'Elliptical', mets: { low: 5.0, medium: 7.0, high: 9.0 }, icon: '🏃', popular: true },
    { id: 'jump_rope', name: 'Jump Rope', mets: { low: 8.0, medium: 10.0, high: 12.0 }, icon: '🪢', popular: false },
    { id: 'swimming', name: 'Swimming', mets: { low: 6.0, medium: 8.0, high: 11.0 }, icon: '🏊', popular: true },
    { id: 'stairs', name: 'Stair Climbing', mets: { low: 5.0, medium: 8.0, high: 10.0 }, icon: '🪜', popular: false },
  ],
  strength: [
    { id: 'bench_press', name: 'Bench Press', mets: { light: 3.5, moderate: 5.0, heavy: 8.0 }, icon: '💪', popular: true },
    { id: 'squats', name: 'Squats', mets: { light: 5.0, moderate: 6.0, heavy: 8.0 }, icon: '🦵', popular: true },
    { id: 'deadlift', name: 'Deadlifts', mets: { light: 4.0, moderate: 6.0, heavy: 8.0 }, icon: '💪', popular: true },
    { id: 'dumbbell_press', name: 'Dumbbell Press', mets: { light: 3.0, moderate: 5.0, heavy: 7.0 }, icon: '💪', popular: true },
    { id: 'bicep_curls', name: 'Bicep Curls', mets: { light: 3.0, moderate: 4.0, heavy: 6.0 }, icon: '💪', popular: true },
    { id: 'shoulder_press', name: 'Shoulder Press', mets: { light: 3.5, moderate: 5.0, heavy: 7.0 }, icon: '💪', popular: false },
    { id: 'lat_pulldown', name: 'Lat Pulldown', mets: { light: 3.0, moderate: 5.0, heavy: 7.0 }, icon: '💪', popular: true },
    { id: 'leg_press', name: 'Leg Press', mets: { light: 4.0, moderate: 6.0, heavy: 8.0 }, icon: '🦵', popular: true },
  ],
  yoga: [
    { id: 'hatha_yoga', name: 'Hatha Yoga', mets: { low: 2.5, medium: 3.0, high: 4.0 }, icon: '🧘', popular: true },
    { id: 'vinyasa', name: 'Vinyasa Flow', mets: { low: 3.0, medium: 4.0, high: 5.0 }, icon: '🧘', popular: true },
    { id: 'power_yoga', name: 'Power Yoga', mets: { low: 4.0, medium: 5.0, high: 6.0 }, icon: '🧘', popular: true },
    { id: 'stretching', name: 'Stretching', mets: { low: 2.3, medium: 2.3, high: 2.3 }, icon: '🤸', popular: true },
    { id: 'pilates', name: 'Pilates', mets: { low: 3.0, medium: 4.0, high: 5.0 }, icon: '🧘', popular: false },
  ],
  hiit: [
    { id: 'hiit_general', name: 'HIIT Training', mets: { low: 8.0, medium: 10.0, high: 12.0 }, icon: '🔥', popular: true },
    { id: 'circuit_training', name: 'Circuit Training', mets: { low: 6.0, medium: 8.0, high: 10.0 }, icon: '🔥', popular: true },
    { id: 'crossfit', name: 'CrossFit', mets: { low: 8.0, medium: 10.0, high: 13.0 }, icon: '🔥', popular: true },
    { id: 'burpees', name: 'Burpees', mets: { low: 8.0, medium: 10.0, high: 12.0 }, icon: '🔥', popular: true },
    { id: 'tabata', name: 'Tabata', mets: { low: 10.0, medium: 12.0, high: 14.0 }, icon: '🔥', popular: false },
  ]
};

const CATEGORIES: Category[] = [
  { id: 'cardio', name: 'Cardio', icon: Activity, color: '#EF4444', gradient: ['#EF4444', '#DC2626'] },
  { id: 'strength', name: 'Strength', icon: Dumbbell, color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] },
  { id: 'yoga', name: 'Yoga', icon: Heart, color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
  { id: 'hiit', name: 'HIIT', icon: Flame, color: '#DC2626', gradient: ['#DC2626', '#B91C1C'] },
];

type Intensity = 'low' | 'light' | 'medium' | 'moderate' | 'high' | 'heavy';

function isValidIntensity(key: string): key is Intensity {
  const validIntensities: Intensity[] = ['low', 'light', 'medium', 'moderate', 'high', 'heavy'];
  return validIntensities.includes(key as Intensity);
}

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

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

export default function StartWorkout() {
  const router = useRouter();
  const [userWeight, setUserWeight] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [userGender, setUserGender] = useState<'male' | 'female' | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<Intensity>('medium');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showExerciseModal, setShowExerciseModal] = useState<boolean>(false);
  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>([]);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadStoredProfile();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isWorkoutActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isWorkoutActive, isPaused]);

  const loadStoredProfile = async () => {
    try {
      const storedWeight = await AsyncStorage.getItem('userWeight');
      const storedGender = await AsyncStorage.getItem('userGender');
      
      if (storedWeight && storedGender) {
        setUserWeight(parseFloat(storedWeight));
        setUserGender(storedGender as 'male' | 'female');
        setShowProfileSetup(false);
        fetchTodayWorkoutData();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveUserProfile = async () => {
    const weight = parseFloat(weightInput);
    if (!weight || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight');
      return;
    }
    if (!userGender) {
      Alert.alert('Missing Information', 'Please select your gender');
      return;
    }

    const weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    
    try {
      await AsyncStorage.setItem('userWeight', weightInKg.toString());
      await AsyncStorage.setItem('userGender', userGender);
      
      setUserWeight(weightInKg);
      setShowProfileSetup(false);
      showToastMessage('Profile saved successfully!');
      fetchTodayWorkoutData();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const fetchTodayWorkoutData = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.log('No auth token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/workouts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const today = new Date().toISOString().split('T')[0];
      const todayEntries = response.data.filter((entry: APIWorkoutEntry) => {
        const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
        return entryDate === today;
      });

      const totalCals = todayEntries.reduce((sum: number, entry: APIWorkoutEntry) => sum + entry.caloriesBurned, 0);
      setTotalCalories(totalCals);

      const localEntries: WorkoutEntry[] = todayEntries.map((entry: APIWorkoutEntry) => ({
        id: entry._id,
        workoutType: entry.workoutType,
        category: 'General',
        duration: entry.duration,
        caloriesBurned: entry.caloriesBurned,
        intensity: entry.intensity,
        notes: entry.notes,
        time: new Date(entry.createdAt).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
      }));

      setWorkoutHistory(localEntries);

    } catch (error: any) {
      console.error('Error fetching workout data:', error);
    }
  };

  const selectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(false);
    
    const updated = [exercise, ...recentExercises.filter(e => e.id !== exercise.id)].slice(0, 5);
    setRecentExercises(updated);
  };

  const getFilteredExercises = (): Exercise[] => {
    if (!selectedCategory) return [];
    
    const exercises = EXERCISE_DATABASE[selectedCategory.id] || [];
    
    if (searchQuery) {
      return exercises.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return exercises;
  };

  const calculateCalories = (durationMinutes: number): number => {
    if (!selectedExercise || !userWeight) return 0; 
    
    let metValue = 0;
    if (isValidIntensity(selectedIntensity)) {
      metValue = selectedExercise.mets[selectedIntensity] || 0;
    } else {
      metValue = Object.values(selectedExercise.mets)[0] || 0;
    }
    
    const genderMultiplier = userGender === 'male' ? 1.0 : 0.9;
    return Math.round((metValue * 3.5 * userWeight / 200) * durationMinutes * genderMultiplier);
  };

  const startWorkout = () => {
    if (!selectedExercise) {
      Alert.alert('No Exercise Selected', 'Please select an exercise first');
      return;
    }
    setIsWorkoutActive(true);
    setIsPaused(false);
    setElapsedTime(0);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const stopWorkout = async () => {
    if (!selectedExercise || !selectedCategory) {
      Alert.alert('Error', 'Please ensure an exercise and category are selected.');
      return;
    }

    if (elapsedTime < 60) {
      Alert.alert('Too Short', 'Workout must be at least 1 minute to be logged');
      return;
    }

    const durationMinutes = Math.floor(elapsedTime / 60);
    const caloriesBurned = calculateCalories(durationMinutes);

    const workoutData = {
      workoutType: selectedExercise.name,
      duration: durationMinutes,
      caloriesBurned,
      intensity: selectedIntensity,
      notes: workoutNotes,
    };

    // Create a new entry for immediate UI update
    const newEntry: WorkoutEntry = {
      id: Date.now().toString(), // Temporary ID
      workoutType: selectedExercise.name,
      category: selectedCategory.name,
      duration: durationMinutes,
      caloriesBurned,
      intensity: selectedIntensity,
      notes: workoutNotes,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };

    // Update UI immediately
    setWorkoutHistory(prev => [newEntry, ...prev]);
    setTotalCalories(prev => prev + caloriesBurned);
    resetWorkout();
    showToastMessage(`Workout logged! 💪 Burned ${caloriesBurned} calories`);

    try {
      const token = await getAuthToken();
      if (token) {
        const response = await axios.post(
          `${API_BASE_URL}/workouts`,
          workoutData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        // Update the entry with the real ID from the backend
        if (response.data && response.data._id) {
          setWorkoutHistory(prev => 
            prev.map(entry => 
              entry.id === newEntry.id 
                ? { ...entry, id: response.data._id }
                : entry
            )
          );
        }
        
        // Optionally refresh from backend to ensure sync
        // await fetchTodayWorkoutData();
      } else {
        // No token, just keep the local entry
        console.log('No auth token, workout saved locally only');
      }
    } catch (error) {
      console.error('Error logging workout to API:', error);
      // The workout is already in the UI, so we just log the error
      // Optionally show a message that it will sync later
    }
  };

  const resetWorkout = () => {
    setIsWorkoutActive(false);
    setIsPaused(false);
    setElapsedTime(0);
    setWorkoutNotes('');
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const removeWorkoutEntry = async (id: string) => {
    const entry = workoutHistory.find(e => e.id === id);
    if (!entry) return;

    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      await axios.delete(
        `${API_BASE_URL}/workouts/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setWorkoutHistory(prev => prev.filter(e => e.id !== id));
      setTotalCalories(prev => Math.max(0, prev - entry.caloriesBurned));
      showToastMessage('Workout removed from log');
    } catch (error: any) {
      console.error('Error deleting workout:', error);
      Alert.alert('Error', 'Failed to delete workout');
    }
  };

  const logManualWorkout = async () => {
    if (!selectedExercise) {
      Alert.alert('Missing Info', 'Please select an exercise first.');
      return;
    }

    // Default to 30 minutes
    const durationMinutes = 30;
    const caloriesBurned = calculateCalories(durationMinutes);

    const workoutData = {
      workoutType: selectedExercise.name,
      duration: durationMinutes,
      caloriesBurned,
      intensity: selectedIntensity,
      notes: workoutNotes,
    };

    // Create a new entry for immediate UI update
    const newEntry: WorkoutEntry = {
      id: Date.now().toString(),
      workoutType: selectedExercise.name,
      category: selectedCategory?.name || 'General',
      duration: durationMinutes,
      caloriesBurned,
      intensity: selectedIntensity,
      notes: workoutNotes,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };

    // Update UI immediately
    setWorkoutHistory(prev => [newEntry, ...prev]);
    setTotalCalories(prev => prev + caloriesBurned);
    setWorkoutNotes('');
    showToastMessage(`${selectedExercise.name} workout logged! 💪 ${caloriesBurned} calories burned`);

    try {
      const token = await getAuthToken();
      if (token) {
        const response = await axios.post(
          `${API_BASE_URL}/workouts`,
          workoutData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        // Update with real ID from backend
        if (response.data && response.data._id) {
          setWorkoutHistory(prev => 
            prev.map(entry => 
              entry.id === newEntry.id 
                ? { ...entry, id: response.data._id }
                : entry
            )
          );
        }
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      // Workout is already shown in UI
    }
  };

  if (showProfileSetup) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.setupContainer}>
          <View style={styles.setupHeader}>
            <View style={styles.setupIconContainer}>
              <TrendingUp size={48} color="#10B981" strokeWidth={2} />
            </View>
            <Text style={styles.setupTitle}>Welcome to Workout Tracker</Text>
            <Text style={styles.setupSubtitle}>
              Let's set up your profile for accurate calorie tracking
            </Text>
          </View>

          <View style={styles.setupForm}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userGender === 'male' && styles.genderButtonActive
                  ]}
                  onPress={() => setUserGender('male')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    userGender === 'male' && styles.genderButtonTextActive
                  ]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userGender === 'female' && styles.genderButtonActive
                  ]}
                  onPress={() => setUserGender('female')}
                >
                  <Text style={[
                    styles.genderButtonText,
                    userGender === 'female' && styles.genderButtonTextActive
                  ]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Your Weight</Text>
              <View style={styles.weightInputContainer}>
                <TextInput
                  style={styles.weightInput}
                  placeholder="Enter weight"
                  placeholderTextColor="#64748B"
                  keyboardType="numeric"
                  value={weightInput}
                  onChangeText={setWeightInput}
                />
                <View style={styles.unitToggle}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      weightUnit === 'kg' && styles.unitButtonActive
                    ]}
                    onPress={() => setWeightUnit('kg')}
                  >
                    <Text style={[
                      styles.unitButtonText,
                      weightUnit === 'kg' && styles.unitButtonTextActive
                    ]}>kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      weightUnit === 'lbs' && styles.unitButtonActive
                    ]}
                    onPress={() => setWeightUnit('lbs')}
                  >
                    <Text style={[
                      styles.unitButtonText,
                      weightUnit === 'lbs' && styles.unitButtonTextActive
                    ]}>lbs</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.saveProfileButton}
              onPress={saveUserProfile}
            >
              <Text style={styles.saveProfileButtonText}>Continue</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.setupNote}>
              This information is stored locally and used only for accurate calorie calculations
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <Toast 
        visible={showToast} 
        message={toastMessage} 
        onHide={() => setShowToast(false)} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Workout Tracker</Text>
            <Text style={styles.headerSubtitle}>
              {userWeight && `${Math.round(userWeight)} kg`} • {userGender}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Active Workout Timer */}
          {isWorkoutActive && (
            <View style={styles.timerSection}>
              <View style={styles.timerCard}>
                <View style={styles.timerDisplay}>
                  <Timer size={32} color="#10B981" strokeWidth={2.5} />
                  <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                </View>
                
                <Text style={styles.timerLabel}>
                  {selectedExercise?.name} - {selectedIntensity} intensity
                </Text>

                <View style={styles.timerControls}>
                  <TouchableOpacity 
                    style={styles.pauseButton}
                    onPress={pauseWorkout}
                  >
                    {isPaused ? (
                      <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                    ) : (
                      <Pause size={24} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.stopButton}
                    onPress={stopWorkout}
                  >
                    <StopCircle size={20} color="#FFFFFF" />
                    <Text style={styles.stopButtonText}>Finish</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.liveStats}>
                  <View style={styles.liveStatItem}>
                    <Flame size={20} color="#F59E0B" />
                    <Text style={styles.liveStatValue}>
                      {calculateCalories(Math.floor(elapsedTime / 60))} cal
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Quick Start */}
          {!isWorkoutActive && recentExercises.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>Quick Start</Text>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recentExercises.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.quickStartCard}
                    onPress={() => selectExercise(exercise)}
                  >
                    <Text style={styles.quickStartIcon}>{exercise.icon}</Text>
                    <Text style={styles.quickStartName}>{exercise.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Category Selection */}
          {!isWorkoutActive && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Zap size={20} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Select Category</Text>
              </View>
              
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory?.id === category.id;
                  
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryCard,
                        isSelected && { backgroundColor: category.color }
                      ]}
                      onPress={() => {
                        setSelectedCategory(category);
                        setShowExerciseModal(true);
                      }}
                    >
                      <IconComponent size={32} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Selected Exercise */}
          {selectedExercise && !isWorkoutActive && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Dumbbell size={20} color="#A855F7" />
                <Text style={styles.sectionTitle}>Selected Exercise</Text>
              </View>
              
              <View style={styles.selectedExerciseCard}>
                <View style={styles.selectedExerciseHeader}>
                  <View style={styles.selectedExerciseInfo}>
                    <Text style={styles.selectedExerciseIcon}>{selectedExercise.icon}</Text>
                    <View>
                      <Text style={styles.selectedExerciseName}>{selectedExercise.name}</Text>
                      <Text style={styles.selectedExerciseCategory}>{selectedCategory?.name}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.changeButton}
                    onPress={() => setShowExerciseModal(true)}
                  >
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.intensitySection}>
                  <Text style={styles.intensityLabel}>Select Intensity</Text>
                  <View style={styles.intensityButtons}>
                    {Object.keys(selectedExercise.mets).map((intensity) => {
                      const isSelected = selectedIntensity === intensity;
                      const intensityColors: Record<string, string> = {
                        low: '#10B981', 
                        light: '#10B981',
                        medium: '#F59E0B', 
                        moderate: '#F59E0B',
                        high: '#EF4444', 
                        heavy: '#EF4444'
                      };
                      const color = intensityColors[intensity] || '#94A3B8';
                      
                      return (
                        <TouchableOpacity
                          key={intensity}
                          style={[
                            styles.intensityButton,
                            isSelected && {
                              borderColor: color,
                              backgroundColor: `${color}30`,
                            }
                          ]}
                          onPress={() => {
                            if (isValidIntensity(intensity)) {
                              setSelectedIntensity(intensity);
                            }
                          }}
                        >
                          <Text style={[
                            styles.intensityButtonText,
                            isSelected && { color: '#FFFFFF' }
                          ]}>
                            {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.calorieEstimate}>
                  <Flame size={24} color="#F59E0B" />
                  <View>
                    <Text style={styles.calorieEstimateLabel}>Estimated (30 min)</Text>
                    <Text style={styles.calorieEstimateValue}>~{calculateCalories(30)} calories</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.startWorkoutButton}
                  onPress={startWorkout}
                >
                  <Text style={styles.startWorkoutButtonText}>Start Workout Timer</Text>
                  <ChevronRight size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Workout Notes */}
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>Workout Notes (Optional)</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Add notes about your workout..."
                    placeholderTextColor="#64748B"
                    value={workoutNotes}
                    onChangeText={setWorkoutNotes}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Manual Log Button */}
                <TouchableOpacity 
                  style={styles.manualLogButton}
                  onPress={logManualWorkout}
                >
                  <Text style={styles.manualLogButtonText}>
                    Log Quick Workout (30 min)
                  </Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.manualLogHint}>
                  💡 Tip: Use this for workouts already completed
                </Text>
              </View>
            </View>
          )}

          {/* Today's Progress */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Today's Progress</Text>
            </View>
            
            <View style={styles.progressCard}>
              <View style={styles.progressStats}>
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatValue}>{totalCalories}</Text>
                  <Text style={styles.progressStatLabel}>Calories Burned</Text>
                </View>
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatValue}>{workoutHistory.length}</Text>
                  <Text style={styles.progressStatLabel}>Workouts</Text>
                </View>
                <View style={styles.progressStatItem}>
                  <Text style={styles.progressStatValue}>
                    {workoutHistory.reduce((sum, w) => sum + w.duration, 0)}
                  </Text>
                  <Text style={styles.progressStatLabel}>Minutes</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Workout History */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Activity size={20} color="#A855F7" />
              <Text style={styles.sectionTitle}>Workout History</Text>
            </View>
            
            {workoutHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Activity size={40} color="#475569" strokeWidth={2} />
                <Text style={styles.emptyHistoryText}>No workouts logged yet</Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {workoutHistory.map((entry) => (
                  <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyIcon}>💪</Text>
                      <View style={styles.historyDetails}>
                        <Text style={styles.historyWorkoutType}>{entry.workoutType}</Text>
                        <Text style={styles.historyTime}>
                          {entry.duration} min • {entry.intensity} • {entry.time}
                        </Text>
                        <View style={styles.historyStats}>
                          <Flame size={14} color="#F59E0B" />
                          <Text style={styles.historyCalories}>{entry.caloriesBurned} calories</Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeWorkoutEntry(entry.id)}
                    >
                      <X size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Exercise Selection Modal */}
      {showExerciseModal && (
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowExerciseModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {selectedCategory?.name} Exercise</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowExerciseModal(false)}
              >
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises..."
                placeholderTextColor="#64748B"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView style={styles.exerciseList}>
              {getFilteredExercises().map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseItem}
                  onPress={() => selectExercise(exercise)}
                >
                  <View style={styles.exerciseItemLeft}>
                    <Text style={styles.exerciseItemIcon}>{exercise.icon}</Text>
                    <View>
                      <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                      <Text style={styles.exerciseItemMet}>
                        MET: {Object.values(exercise.mets)[0]}-{Object.values(exercise.mets)[Object.values(exercise.mets).length - 1]}
                      </Text>
                    </View>
                  </View>
                  {exercise.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>Popular</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
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
  setupContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  setupHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  setupIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  setupTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  setupSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    textAlign: 'center',
  },
  setupForm: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    maxWidth: 500,
    width: '100%',
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
  },
  genderButtonTextActive: {
    color: '#10B981',
  },
  weightInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  weightInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#334155',
  },
  unitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: '#10B981',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
  },
  saveProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  saveProfileButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  setupNote: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  timerSection: {
    marginBottom: 24,
  },
  timerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
  },
  timerLabel: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
    fontWeight: '600',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  pauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  liveStats: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  liveStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickStartCard: {
    minWidth: 120,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
  },
  quickStartIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickStartName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: '#E2E8F0',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 56) / 2,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    color: '#E2E8F0',
  },
  selectedExerciseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedExerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  selectedExerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedExerciseIcon: {
    fontSize: 40,
  },
  selectedExerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  selectedExerciseCategory: {
    fontSize: 14,
    color: '#94A3B8',
  },
  changeButton: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  intensitySection: {
    marginBottom: 20,
  },
  intensityLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  intensityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  calorieEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  calorieEstimateLabel: {
    fontSize: 13,
    color: '#94A3B8',
  },
  calorieEstimateValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F59E0B',
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  startWorkoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notesSection: {
    marginTop: 20,
  },
  notesLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  notesInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  manualLogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginTop: 16,
  },
  manualLogButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  manualLogHint: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyHistory: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyHistoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#374151',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  historyIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyWorkoutType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 6,
  },
  historyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyCalories: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  exerciseList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  exerciseItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exerciseItemIcon: {
    fontSize: 28,
  },
  exerciseItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  exerciseItemMet: {
    fontSize: 12,
    color: '#64748B',
  },
  popularBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
});