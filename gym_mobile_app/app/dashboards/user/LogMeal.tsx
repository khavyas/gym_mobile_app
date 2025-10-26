import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Utensils, Coffee, Pizza, Apple, Moon, Drumstick } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';
const { width } = Dimensions.get('window');

interface MealEntry {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

interface APIMealEntry {
  _id: string;
  user: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
  updatedAt: string;
}

export default function LogMeal() {
  const router = useRouter();
  const [totalCalories, setTotalCalories] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const mealTypes = [
    { 
      label: 'Breakfast', 
      value: 'breakfast' as const,
      icon: Coffee,
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706']
    },
    { 
      label: 'Lunch', 
      value: 'lunch' as const,
      icon: Utensils,
      color: '#10B981',
      gradient: ['#10B981', '#059669']
    },
    { 
      label: 'Dinner', 
      value: 'dinner' as const,
      icon: Drumstick,
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626']
    },
    { 
      label: 'Snack', 
      value: 'snack' as const,
      icon: Apple,
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED']
    },
  ];

  const progressPercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  useEffect(() => {
    fetchTodayMealData();
  }, []);

  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const logMealToAPI = async (mealData: Omit<MealEntry, 'id' | 'time'>): Promise<boolean> => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        return false;
      }

      const response = await axios.post(
        `${API_BASE_URL}/meals`,
        mealData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error logging meal to API:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
      return false;
    }
  };

  const fetchTodayMealData = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();
      if (!token) {
        console.log('No auth token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/meals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const today = new Date().toISOString().split('T')[0];
      const todayEntries = response.data.filter((entry: APIMealEntry) => {
        const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
        return entryDate === today;
      });

      const totalCals = todayEntries.reduce((sum: number, entry: APIMealEntry) => sum + entry.calories, 0);
      setTotalCalories(totalCals);

      const localEntries: MealEntry[] = todayEntries.map((entry: APIMealEntry) => ({
        id: entry._id,
        mealType: entry.mealType as any,
        foodName: entry.foodName,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fats: entry.fats,
        time: new Date(entry.createdAt).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
      }));

      setMealHistory(localEntries);

    } catch (error: any) {
      console.error('Error fetching meal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMeal = async () => {
    if (!foodName.trim() || !calories) {
      Alert.alert('Required Fields', 'Please enter at least food name and calories.');
      return;
    }

    const mealData = {
      mealType: selectedMealType,
      foodName: foodName.trim(),
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
    };

    const success = await logMealToAPI(mealData);
    
    if (!success) {
      Alert.alert(
        'Connection Error',
        'Failed to sync with server. Do you want to track locally?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Track Locally', 
            onPress: () => addMealLocally(mealData)
          }
        ]
      );
      return;
    }

    addMealLocally(mealData);
    clearForm();
  };

  const addMealLocally = (mealData: Omit<MealEntry, 'id' | 'time'>) => {
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      ...mealData,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };

    setMealHistory(prev => [newEntry, ...prev]);
    setTotalCalories(prev => prev + mealData.calories);

    if (totalCalories + mealData.calories >= dailyGoal && totalCalories < dailyGoal) {
      Alert.alert(
        "🎉 Daily Goal Reached!",
        "You've reached your daily calorie goal!",
        [{ text: "Great!", style: "default" }]
      );
    }
  };

  const clearForm = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  const removeMealEntry = (id: string) => {
    const entry = mealHistory.find(e => e.id === id);
    if (entry) {
      setMealHistory(prev => prev.filter(e => e.id !== id));
      setTotalCalories(prev => Math.max(0, prev - entry.calories));
    }
  };

  const getMealTypeIcon = (type: string) => {
    const meal = mealTypes.find(m => m.value === type);
    return meal ? meal.icon : Utensils;
  };

  const getMealTypeColor = (type: string) => {
    const meal = mealTypes.find(m => m.value === type);
    return meal ? meal.color : '#10B981';
  };

  const getEncouragementMessage = () => {
    if (progressPercentage === 0) return "Start tracking your meals! 🍽️";
    if (progressPercentage < 25) return "Great start on your nutrition! 🌱";
    if (progressPercentage < 50) return "You're doing awesome! 🌟";
    if (progressPercentage < 75) return "More than halfway there! 🚀";
    if (progressPercentage < 100) return "Almost at your goal! 💪";
    return "Daily goal achieved! Well done! 🎉";
  };

  const getMealsByType = (type: string) => {
    return mealHistory.filter(meal => meal.mealType === type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Meal Tracker</Text>
          <Text style={styles.headerSubtitle}>{currentDate}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Calorie Progress Card with Background Image */}
        <View style={styles.progressSection}>
          <View style={styles.calorieCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80' }}
              style={styles.calorieCardBackground}
            />
            <View style={styles.calorieCardOverlay} />
            
            <View style={styles.calorieCardContent}>
              <View style={styles.calorieDisplay}>
                <Text style={styles.currentCalories}>{totalCalories}</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
              </View>
              <Text style={styles.goalText}>of {dailyGoal} kcal goal</Text>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.encouragementText}>
                {getEncouragementMessage()}
              </Text>

              {/* Macro Summary */}
              <View style={styles.macroSummary}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {mealHistory.reduce((sum, meal) => sum + meal.protein, 0)}g
                  </Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {mealHistory.reduce((sum, meal) => sum + meal.carbs, 0)}g
                  </Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {mealHistory.reduce((sum, meal) => sum + meal.fats, 0)}g
                  </Text>
                  <Text style={styles.macroLabel}>Fats</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Meal Type Selection */}
        <View style={styles.mealTypeSection}>
          <Text style={styles.sectionTitle}>Select Meal Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.mealTypeScroll}
          >
            {mealTypes.map((meal) => {
              const IconComponent = meal.icon;
              const isSelected = selectedMealType === meal.value;
              return (
                <TouchableOpacity
                  key={meal.value}
                  style={[
                    styles.mealTypeButton,
                    isSelected && styles.mealTypeButtonSelected
                  ]}
                  onPress={() => setSelectedMealType(meal.value)}
                >
                  <View style={[
                    styles.mealTypeIconContainer,
                    { backgroundColor: isSelected ? meal.color : '#374151' }
                  ]}>
                    <IconComponent size={24} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <Text style={[
                    styles.mealTypeLabel,
                    isSelected && styles.mealTypeLabelSelected
                  ]}>
                    {meal.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Add Meal Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Log Your Meal</Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Food Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Grilled Chicken Salad"
                placeholderTextColor="#64748B"
                value={foodName}
                onChangeText={setFoodName}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Calories *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.inputLabel}>Fats (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  value={fats}
                  onChangeText={setFats}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.addMealButton}
              onPress={addMeal}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Log Meal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nutrition Tips Card */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80' }}
              style={styles.tipsImage}
            />
            <View style={styles.tipsOverlay}>
              <View style={styles.tipsContent}>
                <Utensils size={32} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.tipsTitle}>Balanced Nutrition</Text>
                <Text style={styles.tipsText}>
                  Track your macros to ensure you're getting the right balance of protein, carbs, and fats for optimal health.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Meals History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <Text style={styles.historyCount}>
              {mealHistory.length} meals
            </Text>
          </View>
          
          {mealHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <View style={styles.emptyHistoryIconContainer}>
                <Utensils size={40} color="#64748B" strokeWidth={2} />
              </View>
              <Text style={styles.emptyHistoryText}>No meals logged yet</Text>
              <Text style={styles.emptyHistorySubtext}>Start tracking your nutrition!</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {mealHistory.map((entry) => {
                const IconComponent = getMealTypeIcon(entry.mealType);
                return (
                  <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <View style={[
                        styles.historyIcon,
                        { backgroundColor: getMealTypeColor(entry.mealType) }
                      ]}>
                        <IconComponent size={20} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                      <View style={styles.historyDetails}>
                        <Text style={styles.historyFoodName}>{entry.foodName}</Text>
                        <Text style={styles.historyMealType}>
                          {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)} • {entry.time}
                        </Text>
                        <View style={styles.macroRow}>
                          <Text style={styles.macroText}>{entry.calories} cal</Text>
                          {entry.protein > 0 && (
                            <Text style={styles.macroText}>P: {entry.protein}g</Text>
                          )}
                          {entry.carbs > 0 && (
                            <Text style={styles.macroText}>C: {entry.carbs}g</Text>
                          )}
                          {entry.fats > 0 && (
                            <Text style={styles.macroText}>F: {entry.fats}g</Text>
                          )}
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeMealEntry(entry.id)}
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Meal Breakdown</Text>
          <View style={styles.statsGrid}>
            {mealTypes.map((meal) => {
              const meals = getMealsByType(meal.value);
              const totalCals = meals.reduce((sum, m) => sum + m.calories, 0);
              const IconComponent = meal.icon;
              
              return (
                <View key={meal.value} style={styles.statCard}>
                  <IconComponent size={24} color={meal.color} strokeWidth={2.5} />
                  <Text style={styles.statValue}>{totalCals}</Text>
                  <Text style={styles.statLabel}>{meal.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  progressSection: {
    marginBottom: 32,
  },
  calorieCard: {
    borderRadius: 24,
    minHeight: 280,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  calorieCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  calorieCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  calorieCardContent: {
    padding: 24,
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
  },
  calorieDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentCalories: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calorieUnit: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  goalText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  encouragementText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
  },
  macroSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  macroLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  mealTypeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  mealTypeScroll: {
    flexDirection: 'row',
  },
  mealTypeButton: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#374151',
  },
  mealTypeButtonSelected: {
    borderColor: '#10B981',
    backgroundColor: '#065F46',
  },
  mealTypeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mealTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  mealTypeLabelSelected: {
    color: '#FFFFFF',
  },
  formSection: {
    marginBottom: 32,
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
  },
  addMealButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipsSection: {
    marginBottom: 32,
  },
  tipsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#334155',
  },
  tipsImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tipsOverlay: {
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
  tipsContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: '90%',
  },
  tipsTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tipsText: {
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
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#374151',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  historyFoodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  historyMealType: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 6,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});