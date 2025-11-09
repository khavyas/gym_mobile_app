import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Activity, Dumbbell, Heart, Timer, Flame, TrendingUp, Play, Pause, StopCircle } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Animated } from 'react-native';

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';
const { width } = Dimensions.get('window');

interface WorkoutEntry {
  id: string;
  workoutType: string;
  duration: number; // in minutes
  caloriesBurned: number;
  intensity: 'low' | 'medium' | 'high';
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
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [totalCalories, setTotalCalories] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>([]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('Cardio');
  const [selectedIntensity, setSelectedIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const workoutTypes = [
    { 
      label: 'Cardio', 
      icon: Activity,
      color: '#EF4444',
      calPerMin: 8
    },
    { 
      label: 'Strength', 
      icon: Dumbbell,
      color: '#F59E0B',
      calPerMin: 6
    },
    { 
      label: 'Yoga', 
      icon: Heart,
      color: '#8B5CF6',
      calPerMin: 4
    },
    { 
      label: 'HIIT', 
      icon: Flame,
      color: '#DC2626',
      calPerMin: 12
    },
  ];

  const intensityLevels = [
    { label: 'Low', value: 'low' as const, multiplier: 0.7, color: '#10B981' },
    { label: 'Medium', value: 'medium' as const, multiplier: 1.0, color: '#F59E0B' },
    { label: 'High', value: 'high' as const, multiplier: 1.3, color: '#EF4444' },
  ];

  useEffect(() => {
    fetchTodayWorkoutData();
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

  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const logWorkoutToAPI = async (workoutData: Omit<WorkoutEntry, 'id' | 'time'>): Promise<boolean> => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        return false;
      }

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

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error logging workout to API:', error);
      Alert.alert('Error', 'Failed to log workout. Please try again.');
      return false;
    }
  };

  const fetchTodayWorkoutData = async () => {
    try {
      setIsLoading(true);
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
        duration: entry.duration,
        caloriesBurned: entry.caloriesBurned,
        intensity: entry.intensity as any,
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
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setIsPaused(false);
    setElapsedTime(0);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const stopWorkout = async () => {
    if (elapsedTime < 60) {
      Alert.alert('Too Short', 'Workout must be at least 1 minute to be logged.');
      return;
    }

    const durationMinutes = Math.floor(elapsedTime / 60);
    const workout = workoutTypes.find(w => w.label === selectedWorkoutType);
    const intensity = intensityLevels.find(i => i.value === selectedIntensity);
    const caloriesBurned = Math.round(
      (workout?.calPerMin || 6) * durationMinutes * (intensity?.multiplier || 1)
    );

    const workoutData = {
      workoutType: selectedWorkoutType,
      duration: durationMinutes,
      caloriesBurned,
      intensity: selectedIntensity,
      notes: workoutNotes,
    };

    // Skip backend API call - just save locally and show toast
    saveWorkoutLocally(workoutData);
    resetWorkout();

    // Show success toast
    setToastMessage(`Workout logged successfully! 💪 Burned ${caloriesBurned} calories`);
    setShowToast(true);
  };

  const logManualWorkout = () => {
  if (!selectedWorkoutType) {
    Alert.alert('Missing Info', 'Please select a workout type.');
    return;
  }

  // Default to 30 minutes if no active workout
  const durationMinutes = 30;
  const workout = workoutTypes.find(w => w.label === selectedWorkoutType);
  const intensity = intensityLevels.find(i => i.value === selectedIntensity);
  const caloriesBurned = Math.round(
    (workout?.calPerMin || 6) * durationMinutes * (intensity?.multiplier || 1)
  );

  const workoutData = {
    workoutType: selectedWorkoutType,
    duration: durationMinutes,
    caloriesBurned,
    intensity: selectedIntensity,
    notes: workoutNotes,
  };

  saveWorkoutLocally(workoutData);
  setWorkoutNotes('');

  // Show success toast
  setToastMessage(`${selectedWorkoutType} workout logged! 💪 ${caloriesBurned} calories burned`);
  setShowToast(true);
};

  const saveWorkoutLocally = (workoutData: Omit<WorkoutEntry, 'id' | 'time'>) => {
    const newEntry: WorkoutEntry = {
      id: Date.now().toString(),
      ...workoutData,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };

    setWorkoutHistory(prev => [newEntry, ...prev]);
    setTotalCalories(prev => prev + workoutData.caloriesBurned);
  };

  const resetWorkout = () => {
    setIsWorkoutActive(false);
    setIsPaused(false);
    setElapsedTime(0);
    setWorkoutNotes('');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutIcon = (type: string) => {
    const workout = workoutTypes.find(w => w.label === type);
    return workout ? workout.icon : Activity;
  };

  const getWorkoutColor = (type: string) => {
    const workout = workoutTypes.find(w => w.label === type);
    return workout ? workout.color : '#10B981';
  };

  const removeWorkoutEntry = (id: string) => {
    const entry = workoutHistory.find(e => e.id === id);
    if (entry) {
      setWorkoutHistory(prev => prev.filter(e => e.id !== id));
      setTotalCalories(prev => Math.max(0, prev - entry.caloriesBurned));
      
      // Show toast for removal
      setToastMessage(`${entry.workoutType} workout removed from log`);
      setShowToast(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
    <Toast 
        visible={showToast} 
        message={toastMessage} 
        onHide={() => setShowToast(false)} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >

              {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Workout Tracker</Text>
          <Text style={styles.headerSubtitle}>{currentDate}</Text>
        </View>
        {/* <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity> */}
      </View>


        {/* Active Workout Timer with Background Image */}
        <View style={styles.timerSection}>
          <View style={styles.timerCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' }}
              style={styles.timerCardBackground}
              blurRadius={1.5}
            />
            <View style={styles.timerCardOverlay} />
            
            <View style={styles.timerCardContent}>
              <View style={styles.timerDisplay}>
                <Timer size={32} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
              </View>
              
              <Text style={styles.timerLabel}>
                {!isWorkoutActive ? 'Ready to start?' : isPaused ? 'Paused' : 'Workout in progress'}
              </Text>

              {/* Timer Controls */}
              <View style={styles.timerControls}>
                {!isWorkoutActive ? (
                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={startWorkout}
                  >
                    <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.startButtonText}>Start Workout</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.activeControls}>
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
                      <StopCircle size={24} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.stopButtonText}>Finish</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Live Stats */}
              {isWorkoutActive && (
                <View style={styles.liveStats}>
                  <View style={styles.liveStatItem}>
                    <Flame size={20} color="#FFFFFF" />
                    <Text style={styles.liveStatValue}>
                      {Math.round((elapsedTime / 60) * 8)} cal
                    </Text>
                  </View>
                  <View style={styles.liveStatItem}>
                    <Heart size={20} color="#FFFFFF" />
                    <Text style={styles.liveStatValue}>Active</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Today's Progress Card with Reduced Opacity */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80' }}
              style={styles.progressCardBackground}
              blurRadius={2}
            />
            <View style={styles.progressCardOverlay} />
            
            <View style={styles.progressCardContent}>
              <View style={styles.progressHeader}>
                <TrendingUp size={24} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.progressTitle}>Today's Progress</Text>
              </View>

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
        </View>

         {/* Motivation Card with Stock Image */}
        <View style={styles.motivationSection}>
          <View style={styles.motivationCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80' }}
              style={styles.motivationImage}
            />
            <View style={styles.motivationOverlay}>
              <View style={styles.motivationContent}>
                <Dumbbell size={32} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.motivationTitle}>Push Your Limits</Text>
                <Text style={styles.motivationText}>
                  Every workout brings you one step closer to your fitness goals. Stay consistent and track your progress!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Workout Type Selection */}
        <View style={styles.workoutTypeSection}>
          <Text style={styles.sectionTitle}>Select Workout Type</Text>
          <View style={styles.workoutTypeGrid}>
            {workoutTypes.map((workout) => {
              const IconComponent = workout.icon;
              const isSelected = selectedWorkoutType === workout.label;
              return (
                <TouchableOpacity
                  key={workout.label}
                  style={[
                    styles.workoutTypeButton,
                    isSelected && styles.workoutTypeButtonSelected
                  ]}
                  onPress={() => setSelectedWorkoutType(workout.label)}
                  disabled={isWorkoutActive}
                >
                  <View style={[
                    styles.workoutTypeIconContainer,
                    { backgroundColor: isSelected ? workout.color : '#374151' }
                  ]}>
                    <IconComponent size={24} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <Text style={[
                    styles.workoutTypeLabel,
                    isSelected && styles.workoutTypeLabelSelected
                  ]}>
                    {workout.label}
                  </Text>
                  <Text style={styles.workoutTypeCalories}>
                    {workout.calPerMin} cal/min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Intensity Selection */}
        <View style={styles.intensitySection}>
          <Text style={styles.sectionTitle}>Workout Intensity</Text>
          <View style={styles.intensityButtons}>
            {intensityLevels.map((level) => {
              const isSelected = selectedIntensity === level.value;
              return (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.intensityButton,
                    isSelected && { borderColor: level.color, backgroundColor: `${level.color}20` }
                  ]}
                  onPress={() => setSelectedIntensity(level.value)}
                  disabled={isWorkoutActive}
                >
                  <Text style={[
                    styles.intensityButtonText,
                    isSelected && { color: level.color }
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Workout Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Workout Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes about your workout..."
            placeholderTextColor="#64748B"
            value={workoutNotes}
            onChangeText={setWorkoutNotes}
            multiline
            numberOfLines={3}
            editable={!isWorkoutActive}
          />
        </View>

        {!isWorkoutActive && (
              <View style={styles.manualLogSection}>
                <TouchableOpacity 
                  style={styles.manualLogButton}
                  onPress={logManualWorkout}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.manualLogButtonGradient}
                  >
                    <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.manualLogButtonText}>
                      Log Quick Workout (30 min)
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={styles.manualLogHint}>
                  💡 Tip: Use this for workouts already completed
                </Text>
              </View>
            )}

       

        {/* Workout History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Today's Workouts</Text>
            <Text style={styles.historyCount}>
              {workoutHistory.length} sessions
            </Text>
          </View>
          
          {workoutHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <View style={styles.emptyHistoryIconContainer}>
                <Activity size={40} color="#64748B" strokeWidth={2} />
              </View>
              <Text style={styles.emptyHistoryText}>No workouts logged yet</Text>
              <Text style={styles.emptyHistorySubtext}>Start your first workout!</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {workoutHistory.map((entry) => {
                const IconComponent = getWorkoutIcon(entry.workoutType);
                return (
                  <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <View style={[
                        styles.historyIcon,
                        { backgroundColor: getWorkoutColor(entry.workoutType) }
                      ]}>
                        <IconComponent size={20} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                      <View style={styles.historyDetails}>
                        <Text style={styles.historyWorkoutType}>{entry.workoutType}</Text>
                        <Text style={styles.historyTime}>
                          {entry.duration} min • {entry.intensity} intensity • {entry.time}
                        </Text>
                        <View style={styles.historyStats}>
                          <Flame size={14} color="#F59E0B" />
                          <Text style={styles.historyCalories}>{entry.caloriesBurned} calories</Text>
                        </View>
                        {entry.notes && (
                          <Text style={styles.historyNotes} numberOfLines={1}>
                            Note: {entry.notes}
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeWorkoutEntry(entry.id)}
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  
  // Manual Log Button Styles
  manualLogSection: {
    marginBottom: 24,
  },
  manualLogButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  manualLogButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
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
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  timerSection: {
    marginBottom: 24,
  },
  timerCard: {
    borderRadius: 24,
    minHeight: 280,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  timerCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  timerCardContent: {
    padding: 32,
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    fontWeight: '600',
  },
  timerControls: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    minWidth: 200,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 16,
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  stopButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 24,
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
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: 20,
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  progressCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  progressCardContent: {
    padding: 24,
    position: 'relative',
    zIndex: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
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
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  workoutTypeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  workoutTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  workoutTypeButton: {
    width: (width - 56) / 2,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  workoutTypeButtonSelected: {
    borderColor: '#10B981',
    backgroundColor: '#065F46',
  },
  workoutTypeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  workoutTypeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 4,
  },
  workoutTypeLabelSelected: {
    color: '#FFFFFF',
  },
  workoutTypeCalories: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  intensitySection: {
    marginBottom: 24,
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  intensityButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  intensityButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
  notesSection: {
    marginBottom: 24,
  },
  notesInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  motivationSection: {
    marginBottom: 32,
  },
  motivationCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#334155',
  },
  motivationImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  motivationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  motivationContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: '90%',
  },
  motivationTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  motivationText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  historySection: {
    marginBottom: 32,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyCount: {
    fontSize: 14,
    color: '#94A3B8',
  },
  emptyHistory: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyHistoryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#94A3B8',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#374151',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 4,
  },
  historyCalories: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  historyNotes: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
});