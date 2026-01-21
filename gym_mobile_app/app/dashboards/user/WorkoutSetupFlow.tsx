
import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';

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

export default function IntegratedWorkoutTracker() {
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

  const saveUserProfile = () => {
    const weight = parseFloat(weightInput);
    if (!weight || weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }
    if (!userGender) {
      alert('Please select your gender');
      return;
    }

    const weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    setUserWeight(weightInKg);
    setShowProfileSetup(false);
    showToastMessage('Profile saved successfully!');
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
      alert('Please select an exercise first');
      return;
    }
    setIsWorkoutActive(true);
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const stopWorkout = () => {
    if (!selectedExercise || !selectedCategory) {
      alert('Please ensure an exercise and category are selected.');
      return;
    }

    if (elapsedTime < 60) {
      alert('Workout must be at least 1 minute to be logged');
      return;
    }

    const durationMinutes = Math.floor(elapsedTime / 60);
    const caloriesBurned = calculateCalories(durationMinutes);

    const newEntry: WorkoutEntry = {
      id: Date.now().toString(),
      workoutType: selectedExercise.name,
      category: selectedCategory.name,
      duration: durationMinutes,
      caloriesBurned,
      intensity: selectedIntensity,
      notes: workoutNotes,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };

    setWorkoutHistory(prev => [newEntry, ...prev]);
    setTotalCalories(prev => prev + caloriesBurned);
    
    resetWorkout();
    showToastMessage(`Workout logged! 💪 Burned ${caloriesBurned} calories`);
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
    setTimeout(() => setShowToast(false), 3000);
  };

  const removeWorkoutEntry = (id: string) => {
    const entry = workoutHistory.find(e => e.id === id);
    if (entry) {
      setWorkoutHistory(prev => prev.filter(e => e.id !== id));
      setTotalCalories(prev => Math.max(0, prev - entry.caloriesBurned));
      showToastMessage('Workout removed from log');
    }
  };

  if (showProfileSetup) {
    return (
      <div style={styles.setupContainer}>
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <div style={styles.setupHeader}>
            <div style={styles.setupIconContainer}>
              <TrendingUp size={48} color="#10B981" strokeWidth={2} />
            </div>
            <h1 style={styles.setupTitle}>Welcome to Workout Tracker</h1>
            <p style={styles.setupSubtitle}>
              Let's set up your profile for accurate calorie tracking
            </p>
          </div>

          <div style={styles.setupForm}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Gender</label>
              <div style={styles.genderButtons}>
                <button
                  style={{
                    ...styles.genderButton,
                    ...(userGender === 'male' ? styles.genderButtonActive : {})
                  }}
                  onClick={() => setUserGender('male')}
                >
                  Male
                </button>
                <button
                  style={{
                    ...styles.genderButton,
                    ...(userGender === 'female' ? styles.genderButtonActive : {})
                  }}
                  onClick={() => setUserGender('female')}
                >
                  Female
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Your Weight</label>
              <div style={styles.weightInputContainer}>
                <input
                  style={styles.weightInput}
                  placeholder="Enter weight"
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                />
                <div style={styles.unitToggle}>
                  <button
                    style={{
                      ...styles.unitButton,
                      ...(weightUnit === 'kg' ? styles.unitButtonActive : {})
                    }}
                    onClick={() => setWeightUnit('kg')}
                  >
                    kg
                  </button>
                  <button
                    style={{
                      ...styles.unitButton,
                      ...(weightUnit === 'lbs' ? styles.unitButtonActive : {})
                    }}
                    onClick={() => setWeightUnit('lbs')}
                  >
                    lbs
                  </button>
                </div>
              </div>
            </div>

            <button 
              style={styles.saveProfileButton}
              onClick={saveUserProfile}
            >
              Continue
              <ChevronRight size={20} />
            </button>

            <p style={styles.setupNote}>
              This information is stored locally and used only for accurate calorie calculations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {showToast && (
        <div style={styles.toastContainer as any}>
          <div style={styles.toastContent as any}>
            <span style={styles.toastIcon}>✓</span>
            <span style={styles.toastMessage}>{toastMessage}</span>
          </div>
        </div>
      )}

      <div style={styles.scrollContainer as any}>
        <div style={styles.heroSection as any}>
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
            style={styles.heroImage as any}
            alt="Workout"
          />
          <div style={styles.heroOverlay as any} />
          <div style={styles.heroContent as any}>
            <h1 style={styles.heroTitle}>
              {isWorkoutActive ? 'Workout in Progress' : 'Start Your Workout'}
            </h1>
            <p style={styles.heroSubtitle}>
              {userWeight && `${Math.round(userWeight)} kg`} • {userGender}
            </p>
          </div>
        </div>

        <div style={styles.content as any}>
          {isWorkoutActive && (
            <div style={styles.timerSection as any}>
              <div style={styles.timerCard as any}>
                <div style={styles.timerDisplay as any}>
                  <Timer size={32} color="#10B981" strokeWidth={2.5} />
                  <div style={styles.timerText}>{formatTime(elapsedTime)}</div>
                </div>
                
                <div style={styles.timerLabel}>
                  {selectedExercise?.name} - {selectedIntensity} intensity
                </div>

                <div style={styles.timerControls as any}>
                  <button 
                    style={styles.pauseButton as any}
                    onClick={pauseWorkout}
                  >
                    {isPaused ? <Play size={24} /> : <Pause size={24} />}
                  </button>
                  
                  <button 
                    style={styles.stopButton as any}
                    onClick={stopWorkout}
                  >
                    <StopCircle size={20} />
                    Finish
                  </button>
                </div>

                <div style={styles.liveStats as any}>
                  <div style={styles.liveStatItem as any}>
                    <Flame size={20} color="#F59E0B" />
                    <span>{calculateCalories(Math.floor(elapsedTime / 60))} cal</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isWorkoutActive && recentExercises.length > 0 && (
            <div style={styles.section as any}>
              <div style={styles.sectionHeader as any}>
                <Clock size={20} color="#10B981" />
                <h2 style={styles.sectionTitle}>Quick Start</h2>
              </div>
              
              <div style={styles.quickStartList as any}>
                {recentExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    style={styles.quickStartCard as any}
                    onClick={() => selectExercise(exercise)}
                  >
                    <span style={styles.quickStartIcon}>{exercise.icon}</span>
                    <span style={styles.quickStartName}>{exercise.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isWorkoutActive && (
            <div style={styles.section as any}>
              <div style={styles.sectionHeader as any}>
                <Zap size={20} color="#F59E0B" />
                <h2 style={styles.sectionTitle}>Select Category</h2>
              </div>
              
              <div style={styles.categoryGrid as any}>
                {CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selectedCategory?.id === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      style={{
                        ...styles.categoryCard,
                        ...(isSelected ? {
                          background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})`
                        } : { backgroundColor: '#1E293B' })
                      } as any}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowExerciseModal(true);
                      }}
                    >
                      <IconComponent size={32} strokeWidth={2.5} />
                      <span style={styles.categoryName}>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedExercise && !isWorkoutActive && (
            <div style={styles.section as any}>
              <div style={styles.sectionHeader as any}>
                <Dumbbell size={20} color="#A855F7" />
                <h2 style={styles.sectionTitle}>Selected Exercise</h2>
              </div>
              
              <div style={styles.selectedExerciseCard as any}>
                <div style={styles.selectedExerciseHeader as any}>
                  <div style={styles.selectedExerciseInfo as any}>
                    <span style={styles.selectedExerciseIcon}>{selectedExercise.icon}</span>
                    <div>
                      <div style={styles.selectedExerciseName}>{selectedExercise.name}</div>
                      <div style={styles.selectedExerciseCategory}>{selectedCategory?.name}</div>
                    </div>
                  </div>
                  
                  <button 
                    style={styles.changeButton as any}
                    onClick={() => setShowExerciseModal(true)}
                  >
                    Change
                  </button>
                </div>

                <div style={styles.intensitySection as any}>
                  <label style={styles.intensityLabel}>Select Intensity</label>
                  <div style={styles.intensityButtons as any}>
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
                        <button
                          key={intensity}
                          style={{
                            ...styles.intensityButton,
                            ...(isSelected ? {
                              borderColor: color,
                              backgroundColor: `${color}30`,
                              color: '#FFFFFF'
                            } : {})
                          } as any}
                          onClick={() => {
                            if (isValidIntensity(intensity)) {
                              setSelectedIntensity(intensity);
                            }
                          }}
                        >
                          {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={styles.calorieEstimate as any}>
                  <Flame size={24} color="#F59E0B" />
                  <div>
                    <div style={styles.calorieEstimateLabel}>Estimated (30 min)</div>
                    <div style={styles.calorieEstimateValue}>~{calculateCalories(30)} calories</div>
                  </div>
                </div>

                <button 
                  style={styles.startWorkoutButton as any}
                  onClick={startWorkout}
                >
                  Start Workout Timer
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}

          <div style={styles.section as any}>
            <div style={styles.sectionHeader as any}>
              <TrendingUp size={20} color="#10B981" />
              <h2 style={styles.sectionTitle}>Today's Progress</h2>
            </div>
            
            <div style={styles.progressCard as any}>
              <div style={styles.progressStats as any}>
                <div style={styles.progressStatItem as any}>
                  <div style={styles.progressStatValue}>{totalCalories}</div>
                  <div style={styles.progressStatLabel}>Calories Burned</div>
                </div>
                <div style={styles.progressStatItem as any}>
                  <div style={styles.progressStatValue}>{workoutHistory.length}</div>
                  <div style={styles.progressStatLabel}>Workouts</div>
                </div>
                <div style={styles.progressStatItem as any}>
                  <div style={styles.progressStatValue}>
                    {workoutHistory.reduce((sum, w) => sum + w.duration, 0)}
                  </div>
                  <div style={styles.progressStatLabel}>Minutes</div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section as any}>
            <div style={styles.sectionHeader as any}>
              <Activity size={20} color="#A855F7" />
              <h2 style={styles.sectionTitle}>Workout History</h2>
            </div>
            
            {workoutHistory.length === 0 ? (
              <div style={styles.emptyHistory as any}>
                <Activity size={40} color="#475569" strokeWidth={2} style={{ margin: '0 auto' }} />
                <div style={styles.emptyHistoryText}>No workouts logged yet</div>
              </div>
            ) : (
              <div style={styles.historyList as any}>
                {workoutHistory.map((entry) => (
                  <div key={entry.id} style={styles.historyItem as any}>
                    <div style={styles.historyItemLeft as any}>
                      <span style={styles.historyIcon}>
                        {recentExercises.find(e => e.name === entry.workoutType)?.icon || '💪'}
                      </span>
                      <div style={styles.historyDetails as any}>
                        <div style={styles.historyWorkoutType}>{entry.workoutType}</div>
                        <div style={styles.historyTime}>
                          {entry.duration} min • {entry.intensity} • {entry.time}
                        </div>
                        <div style={styles.historyStats as any}>
                          <Flame size={14} color="#F59E0B" />
                          <span style={styles.historyCalories}>{entry.caloriesBurned} calories</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      style={styles.removeButton as any}
                      onClick={() => removeWorkoutEntry(entry.id)}
                    >
                      <X size={20} color="#EF4444" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showExerciseModal && (
        <div 
          style={styles.modalContainer as any}
          onClick={() => setShowExerciseModal(false)}
        >
          <div 
            style={styles.modalContent as any}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader as any}>
              <h2 style={styles.modalTitle}>Select {selectedCategory?.name} Exercise</h2>
              <button 
                style={styles.modalCloseButton as any}
                onClick={() => setShowExerciseModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.searchContainer as any}>
              <Search size={20} color="#64748B" />
              <input
                style={styles.searchInput as any}
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={styles.exerciseList as any}>
              {getFilteredExercises().map((exercise) => (
                <button
                  key={exercise.id}
                  style={styles.exerciseItem as any}
                  onClick={() => selectExercise(exercise)}
                >
                  <div style={styles.exerciseItemLeft as any}>
                    <span style={styles.exerciseItemIcon}>{exercise.icon}</span>
                    <div>
                      <div style={styles.exerciseItemName}>{exercise.name}</div>
                      <div style={styles.exerciseItemMet}>
                        MET: {Object.values(exercise.mets)[0]}-{Object.values(exercise.mets)[Object.values(exercise.mets).length - 1]}
                      </div>
                    </div>
                  </div>
                  {exercise.popular && (
                    <span style={styles.popularBadge as any}>
                      Popular
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  toastContainer: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    width: '90%',
    maxWidth: '500px',
  },
  toastContent: {
    backgroundColor: '#065F46',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    borderLeft: '4px solid #10B981',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  toastIcon: {
    fontSize: '20px',
    color: '#10B981',
    marginRight: '12px',
    fontWeight: 'bold',
  },
  toastMessage: {
    flex: 1,
    fontSize: '16px',
    color: '#FFFFFF',
    fontWeight: '600',
  },
  setupContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '24px',
  },
  setupHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  setupIconContainer: {
    width: '100px',
    height: '100px',
    borderRadius: '50px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  setupTitle: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '12px',
  },
  setupSubtitle: {
    fontSize: '16px',
    color: '#94A3B8',
    lineHeight: '24px',
  },
  setupForm: {
    backgroundColor: '#1E293B',
    borderRadius: '24px',
    padding: '24px',
    maxWidth: '500px',
    margin: '0 auto',
    width: '100%',
  },
  formGroup: {
    marginBottom: '24px',
  },
  formLabel: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'block',
  },
  genderButtons: {
    display: 'flex',
    gap: '12px',
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    border: '2px solid #334155',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#94A3B8',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  genderButtonActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10B981',
  },
  weightInputContainer: {
    display: 'flex',
    gap: '12px',
  },
  weightInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    border: '2px solid #334155',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    color: '#FFFFFF',
  },
  unitToggle: {
    display: 'flex',
    backgroundColor: '#0F172A',
    borderRadius: '12px',
    padding: '4px',
    border: '2px solid #334155',
  },
  unitButton: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: '#94A3B8',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  unitButtonActive: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
  },
  saveProfileButton: {
    background: 'linear-gradient(135deg, #10B981, #059669)',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#FFFFFF',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
  },
  setupNote: {
    fontSize: '13px',
    color: '#64748B',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: '20px',
  },
  scrollContainer: {
    overflowY: 'auto',
    height: '100vh',
  },
  heroSection: {
    height: '200px',
    position: 'relative',
    marginBottom: '20px',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    filter: 'blur(1px)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95))',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%',
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  heroSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
  },
  content: {
    padding: '0 20px 40px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    color: '#E2E8F0',
  },
  timerSection: {
    marginBottom: '24px',
  },
  timerCard: {
    backgroundColor: '#1E293B',
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center',
    border: '1px solid #334155',
  },
  timerDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '16px',
  },
  timerText: {
    fontSize: '56px',
    fontWeight: '800',
    marginTop: '12px',
    fontVariantNumeric: 'tabular-nums',
  },
  timerLabel: {
    fontSize: '16px',
    color: '#94A3B8',
    marginBottom: '24px',
    fontWeight: '600',
  },
  timerControls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  pauseButton: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid #FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  stopButton: {
    background: '#EF4444',
    border: 'none',
    borderRadius: '16px',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
  liveStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  },
  liveStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '600',
  },
  quickStartList: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  quickStartCard: {
    minWidth: '120px',
    backgroundColor: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  quickStartIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  quickStartName: {
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#E2E8F0',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  },
  categoryCard: {
    border: 'none',
    borderRadius: '16px',
    padding: '20px',
    minHeight: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  categoryName: {
    fontSize: '16px',
    fontWeight: '700',
    marginTop: '12px',
    color: '#E2E8F0',
  },
  selectedExerciseCard: {
    backgroundColor: '#1E293B',
    borderRadius: '20px',
    padding: '20px',
    border: '1px solid #334155',
  },
  selectedExerciseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #334155',
  },
  selectedExerciseInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  selectedExerciseIcon: {
    fontSize: '40px',
  },
  selectedExerciseName: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  selectedExerciseCategory: {
    fontSize: '14px',
    color: '#94A3B8',
  },
  changeButton: {
    backgroundColor: '#334155',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  intensitySection: {
    marginBottom: '20px',
  },
  intensityLabel: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '12px',
    display: 'block',
  },
  intensityButtons: {
    display: 'flex',
    gap: '8px',
  },
  intensityButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    border: '2px solid #334155',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#94A3B8',
    cursor: 'pointer',
  },
  calorieEstimate: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: '16px',
    borderRadius: '12px',
    gap: '12px',
    marginBottom: '20px',
  },
  calorieEstimateLabel: {
    fontSize: '13px',
    color: '#94A3B8',
  },
  calorieEstimateValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#F59E0B',
  },
  startWorkoutButton: {
    background: 'linear-gradient(135deg, #10B981, #059669)',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
  },
  progressCard: {
    backgroundColor: '#1E293B',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #334155',
  },
  progressStats: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  progressStatItem: {
    textAlign: 'center',
  },
  progressStatValue: {
    fontSize: '28px',
    fontWeight: '800',
  },
  progressStatLabel: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '4px',
    fontWeight: '500',
  },
  emptyHistory: {
    backgroundColor: '#1E293B',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    border: '1px solid #374151',
  },
  emptyHistoryText: {
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '16px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  historyItem: {
    backgroundColor: '#1E293B',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    border: '1px solid #374151',
  },
  historyItemLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
  },
  historyIcon: {
    fontSize: '28px',
    marginRight: '12px',
  },
  historyDetails: {
    flex: 1,
  },
  historyWorkoutType: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  historyTime: {
    fontSize: '13px',
    color: '#94A3B8',
    marginBottom: '6px',
  },
  historyStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  historyCalories: {
    fontSize: '14px',
    color: '#F59E0B',
    fontWeight: '600',
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
  },
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    paddingTop: '24px',
    maxHeight: '80vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px 20px',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    margin: 0,
  },
  modalCloseButton: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#334155',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    margin: '0 20px 16px',
    padding: '12px 16px',
    borderRadius: '12px',
    gap: '12px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    color: '#FFFFFF',
    outline: 'none',
  },
  exerciseList: {
    padding: '0 20px 20px',
    overflowY: 'auto',
    flex: 1,
  },
  exerciseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '8px',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'left',
  },
  exerciseItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  exerciseItemIcon: {
    fontSize: '28px',
  },
  exerciseItemName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
    color: '#E2E8F0', 
  },
  exerciseItemMet: {
    fontSize: '12px',
    color: '#64748B',
  },
  popularBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#10B981',
  },
};