import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Droplet, Coffee, Wine } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';
const { width, height } = Dimensions.get('window');

interface WaterEntry {
  id: string;
  amount: number;
  time: string;
  type: 'glass' | 'bottle' | 'cup' | 'custom';
}

interface APIWaterEntry {
  _id: string;
  user: string;
  amount: number;
  time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function WaterIntake() {
  const router = useRouter();
  const [currentIntake, setCurrentIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2500);
  const [waterHistory, setWaterHistory] = useState<WaterEntry[]>([]);
  const [selectedAmount, setSelectedAmount] = useState(250);
  const [apiWaterData, setApiWaterData] = useState<APIWaterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodayWaterData();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Updated quick amounts with Lucide icons
  const quickAmounts = [
    { 
      label: 'Glass', 
      amount: 250, 
      icon: Wine,
      color: '#3B82F6' 
    },
    { 
      label: 'Bottle', 
      amount: 500, 
      icon: Droplet, 
      color: '#10B981' 
    },
    { 
      label: 'Cup', 
      amount: 200, 
      icon: Coffee, 
      color: '#F59E0B' 
    },
    { 
      label: 'Large', 
      amount: 750, 
      icon: Droplet, 
      color: '#8B5CF6' 
    },
  ];

  const progressPercentage = Math.min((currentIntake / dailyGoal) * 100, 100);

  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const logWaterToAPI = async (amount: number): Promise<boolean> => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        return false;
      }

      const response = await axios.post(
        `${API_BASE_URL}/water`,
        { amount },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error logging water to API:', error);
      Alert.alert('Error', 'Failed to log water intake. Please try again.');
      return false;
    }
  };

  const fetchTodayWaterData = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();
      if (!token) {
        console.log('No auth token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/water`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const today = new Date().toISOString().split('T')[0];
      const todayEntries = response.data.filter((entry: APIWaterEntry) => {
        const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
        return entryDate === today;
      });

      setApiWaterData(todayEntries);
      
      const totalFromAPI = todayEntries.reduce((sum: number, entry: APIWaterEntry) => sum + entry.amount, 0);
      setCurrentIntake(totalFromAPI);

      const localEntries: WaterEntry[] = todayEntries.map((entry: APIWaterEntry) => ({
        id: entry._id,
        amount: entry.amount,
        time: new Date(entry.createdAt).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: 'custom'
      }));

      setWaterHistory(localEntries);

    } catch (error: any) {
      console.error('Error fetching water data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addWater = async (amount: number, type: 'glass' | 'bottle' | 'cup' | 'custom') => {
    const success = await logWaterToAPI(amount);
    
    if (!success) {
      Alert.alert(
        'Connection Error',
        'Failed to sync with server. Do you want to track locally?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Track Locally', 
            onPress: () => addWaterLocally(amount, type)
          }
        ]
      );
      return;
    }

    addWaterLocally(amount, type);
  };

  const addWaterLocally = (amount: number, type: 'glass' | 'bottle' | 'cup' | 'custom') => {
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      type
    };

    setWaterHistory(prev => [newEntry, ...prev]);
    setCurrentIntake(prev => prev + amount);

    if (currentIntake + amount >= dailyGoal && currentIntake < dailyGoal) {
      Alert.alert(
        "🎉 Goal Achieved!",
        "Congratulations! You've reached your daily water intake goal!",
        [{ text: "Awesome!", style: "default" }]
      );
    }
  };

  const removeWaterEntry = (id: string) => {
    const entry = waterHistory.find(e => e.id === id);
    if (entry) {
      setWaterHistory(prev => prev.filter(e => e.id !== id));
      setCurrentIntake(prev => Math.max(0, prev - entry.amount));
    }
  };

  const getWaveHeight = () => {
    return Math.max(20, (progressPercentage / 100) * 200);
  };

  const getEncouragementMessage = () => {
    if (progressPercentage === 0) return "Let's start hydrating! 💧";
    if (progressPercentage < 25) return "Great start! Keep it up! 🌱";
    if (progressPercentage < 50) return "You're doing awesome! 🌟";
    if (progressPercentage < 75) return "More than halfway there! 🚀";
    if (progressPercentage < 100) return "Almost there! You can do it! 💪";
    return "Goal achieved! You're well hydrated! 🎉";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
          {/* Header - Now inside ScrollView */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Water Intake</Text>
          <Text style={styles.headerSubtitle}>{currentDate}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
        {/* Water Progress Visualization with Background Image */}
        <View style={styles.progressSection}>
          <View style={styles.waterCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80' }}
              style={styles.waterCardBackground}
            />
            <View style={styles.waterCardOverlay} />
            
            <View style={styles.waterCardContent}>
              <View style={styles.waterContainer}>
                <View style={[styles.waterWave, { height: getWaveHeight() }]} />
                <View style={styles.waterOverlay}>
                  <Text style={styles.currentAmount}>
                    {(currentIntake / 1000).toFixed(1)}L
                  </Text>
                  <Text style={styles.goalAmount}>
                    of {(dailyGoal / 1000).toFixed(1)}L goal
                  </Text>
                  <Text style={styles.percentageText}>
                    {progressPercentage.toFixed(0)}%
                  </Text>
                </View>
              </View>

              <View style={styles.progressIndicators}>
                <View style={styles.progressBar}>
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
              </View>
            </View>
          </View>
        </View>

        {/* Quick Add Buttons with Icons */}
        <View style={styles.quickAddSection}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickAddGrid}>
            {quickAmounts.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.quickAddButton}
                  onPress={() => addWater(item.amount, item.label.toLowerCase() as any)}
                >
                  <View style={[styles.quickAddIconContainer, { backgroundColor: item.color }]}>
                    <IconComponent size={24} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.quickAddLabel}>{item.label}</Text>
                  <Text style={styles.quickAddAmount}>{item.amount}ml</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom Amount */}
        <View style={styles.customSection}>
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          <View style={styles.customAmountCard}>
            <View style={styles.amountSelector}>
              <TouchableOpacity 
                style={styles.amountButton}
                onPress={() => setSelectedAmount(Math.max(50, selectedAmount - 50))}
              >
                <Ionicons name="remove" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.amountDisplay}>
                <Text style={styles.customAmount}>{selectedAmount}</Text>
                <Text style={styles.customUnit}>ml</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.amountButton}
                onPress={() => setSelectedAmount(Math.min(2000, selectedAmount + 50))}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.addCustomButton}
              onPress={() => addWater(selectedAmount, 'custom')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Water</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hydration Benefits Card with Stock Image */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitsCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1523294587484-bae6cc870010?w=800&q=80' }}
              style={styles.benefitsImage}
            />
            <View style={styles.benefitsOverlay}>
              <View style={styles.benefitsContent}>
                <Droplet size={32} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.benefitsTitle}>Stay Hydrated</Text>
                <Text style={styles.benefitsText}>
                  Drinking enough water helps boost energy, improve skin health, and support overall wellness.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Today's Log</Text>
            <Text style={styles.historyCount}>
              {waterHistory.length} entries
            </Text>
          </View>
          
          {waterHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <View style={styles.emptyHistoryIconContainer}>
                <Droplet size={40} color="#64748B" strokeWidth={2} />
              </View>
              <Text style={styles.emptyHistoryText}>No water logged yet</Text>
              <Text style={styles.emptyHistorySubtext}>Start tracking your hydration!</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {waterHistory.map((entry) => (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.historyItemLeft}>
                    <View style={[styles.historyIcon, { backgroundColor: '#0EA5E9' }]}>
                      <Ionicons name="water" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.historyDetails}>
                      <Text style={styles.historyAmount}>{entry.amount}ml</Text>
                      <Text style={styles.historyTime}>{entry.time}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeWaterEntry(entry.id)}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color="#10B981" />
              <Text style={styles.statValue}>{waterHistory.length}</Text>
              <Text style={styles.statLabel}>Times Today</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>
                {waterHistory.length > 0 ? waterHistory[0].time : '--'}
              </Text>
              <Text style={styles.statLabel}>Last Drink</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="analytics" size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>
                {waterHistory.length > 0 ? Math.round(currentIntake / waterHistory.length) : 0}ml
              </Text>
              <Text style={styles.statLabel}>Avg/Drink</Text>
            </View>
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
  waterCard: {
    borderRadius: 24,
    minHeight: 220,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  waterCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  waterCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  waterCardContent: {
    padding: 24,
    position: 'relative',
    zIndex: 1,
  },
  waterContainer: {
    position: 'relative',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  waterWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  waterOverlay: {
    alignItems: 'center',
    zIndex: 1,
  },
  currentAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  goalAmount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressIndicators: {
    alignItems: 'center',
  },
  progressBar: {
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
  },
  quickAddSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickAddGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickAddIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickAddLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickAddAmount: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  customSection: {
    marginBottom: 32,
  },
  customAmountCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  amountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  amountButton: {
    backgroundColor: '#374151',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountDisplay: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  customAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  customUnit: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  addCustomButton: {
    borderRadius: 12,
    overflow: 'hidden',
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
  historyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyTime: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  statsSection: {
    marginBottom: 32,
  },
  // Benefits Section Styles
  benefitsSection: {
    marginBottom: 32,
    marginTop: 8,
  },
  benefitsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  benefitsImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  benefitsOverlay: {
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
  benefitsContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: '90%',
  },
  benefitsTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  benefitsText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.98,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
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