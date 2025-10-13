import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';


const { width } = Dimensions.get('window');

type TabParamList = {
  Home: undefined;
  Fitness: undefined;
  Consultants: undefined;
  Appointments: undefined;
  Shop: undefined;
  Challenges: undefined;
  Health: undefined;
  Profile: undefined;
};

// Define Event type based on your backend Event model
interface Event {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  cost: number;
  benefits: string;
  date: string;
  location?: string;
  eventType: 'online' | 'offline' | 'hybrid';
  onlineLink?: string;
  gymCenter?: {
    _id: string;
    name: string;
  };
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface WaterIntake {
  _id: string;
  user: string;
  amount: number;
  time: string;
  createdAt: string;
  updatedAt: string;
}


const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export default function HomeSummary() {
  const router = useRouter(); 
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayWaterIntake, setTodayWaterIntake] = useState(0);
  const [waterLoading, setWaterLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation<NavigationProp<TabParamList>>();


  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchEvents();
    fetchTodayWaterIntake();
    fetchUserData();
  }, []);

  const getUserInitials = (name: string) => {
    if (!name) return 'JD'; // fallback
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const fetchUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/events`);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayWaterIntake = async () => {
    try {
      setWaterLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        console.log('No auth token found');
        return;
      }

      // Try fetching without date parameter first
      const response = await axios.get(`${API_BASE_URL}/water`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Water API Response:', response.data); // Add this for debugging

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Filter on client side since API might not support date filtering
      let totalIntake = 0;
      
      if (Array.isArray(response.data)) {
        totalIntake = response.data.reduce((sum: number, entry: WaterIntake) => {
          const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
          return entryDate === today ? sum + entry.amount : sum;
        }, 0);
      }

      console.log('Today water intake:', totalIntake); // Add this for debugging
      setTodayWaterIntake(totalIntake);
    } catch (error: any) {
      console.error('Error fetching water intake:', error);
      // Log more details about the error
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setWaterLoading(false);
    }
  };

  const getEventGradientColors = (title: string): [string, string] => {
    const lowercaseTitle = title.toLowerCase();
    
    if (lowercaseTitle.includes('zumba') || lowercaseTitle.includes('dance')) {
      return ['#EC4899', '#8B5CF6'];
    } else if (lowercaseTitle.includes('meditation') || lowercaseTitle.includes('mindfulness')) {
      return ['#3B82F6', '#1D4ED8'];
    } else if (lowercaseTitle.includes('yoga')) {
      return ['#10B981', '#059669'];
    } else if (lowercaseTitle.includes('cardio') || lowercaseTitle.includes('hiit')) {
      return ['#EF4444', '#DC2626'];
    } else if (lowercaseTitle.includes('strength') || lowercaseTitle.includes('weight')) {
      return ['#F59E0B', '#D97706'];
    } else {
      return ['#6366F1', '#4F46E5']; // Default purple gradient
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Good Morning! 💪";
    } else if (hour < 17) {
      return "Good Afternoon! 💪";
    } else {
      return "Good Evening! 💪";
    }
  };

  const formatEventDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (eventDate.toDateString() === now.toDateString()) {
      return `Today at ${eventDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${eventDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: "/dashboards/user/EventDetails",
      params: {
        eventId: event._id,
        type: event.title.toLowerCase().replace(/\s+/g, ''),
        title: event.title,
        time: formatEventDate(event.date),
        duration: '60 mins', // Default duration - you might want to add this to your Event model
        cost: `$${event.cost}`,
        benefits: event.benefits,
        instructor: event.instructor,
        locationType: event.eventType === 'online' ? 'online' : event.eventType === 'hybrid' ? 'hybrid' : 'in-person',
        location: event.eventType === 'online' ? 'Online Session' : event.location || 'Fitness Center',
        meetingLink: event.onlineLink || '',
        address: event.eventType !== 'online' ? event.location || '' : '',
        description: event.description,
        gymCenter: event.gymCenter?.name || 'Fitness Center'
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIcon}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>
              {getUserInitials(userName)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Progress Card */}
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.mainCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.mainCardTitle}>Today's Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5,340</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>320</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {waterLoading ? '...' : `${(todayWaterIntake / 1000).toFixed(1)}L`}
              </Text>
              <Text style={styles.statLabel}>Water</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '68%' }]} />
          </View>
          <Text style={styles.progressText}>68% of daily goal completed</Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.waterButton]}
              onPress={() => router.push('/dashboards/user/WaterIntake')}
            >
              <Text style={styles.actionIcon}>💧</Text>
              <Text style={styles.actionText}>Log Water</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.calorieButton]}>
              <Text style={styles.actionIcon}>🍎</Text>
              <Text style={styles.actionText}>Log Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.workoutButton]}>
              <Text style={styles.actionIcon}>🏃‍♂️</Text>
              <Text style={styles.actionText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Session */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Session</Text>
          <View style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>High Intensity Yoga</Text>
              <Text style={styles.sessionTime}>Today at 6:00 PM</Text>
              <Text style={styles.sessionInstructor}>with Sarah Johnson</Text>
            </View>
            <View style={styles.sessionActions}>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rescheduleButton}>
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Classes Banner - Updated with API data */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Classes</Text>
            {error && (
              <TouchableOpacity onPress={fetchEvents} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No upcoming events found</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.bannerContainer}
            >
              {events.map((event) => {
                const gradientColors = getEventGradientColors(event.title);
                
                return (
                  <TouchableOpacity 
                    key={event._id}
                    style={styles.bannerCard}
                    onPress={() => handleEventPress(event)}
                  >
                    <LinearGradient
                      colors={gradientColors}
                      style={styles.bannerGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.bannerTitle}>{event.title}</Text>
                      <Text style={styles.bannerText}>{formatEventDate(event.date)}</Text>
                      <Text style={styles.bannerInstructor}>with {event.instructor}</Text>
                      <View style={styles.bannerFooter}>
                        <Text style={styles.bannerCost}>${event.cost}</Text>
                        <Text style={styles.bannerCta}>Tap for details →</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Weekly Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyStats}>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyNumber}>4</Text>
                <Text style={styles.weeklyLabel}>Workouts</Text>
              </View>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyNumber}>1,280</Text>
                <Text style={styles.weeklyLabel}>Calories Burned</Text>
              </View>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyNumber}>12.5</Text>
                <Text style={styles.weeklyLabel}>Hours Active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewProgressButton}>
              <Text style={styles.viewProgressText}>View Full Progress →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🏆</Text>
          </View>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Streak Master!</Text>
            <Text style={styles.achievementDesc}>You've worked out 7 days in a row</Text>
          </View>
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
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mainCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#D1FAE5',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  waterButton: {
    backgroundColor: '#1E40AF',
  },
  calorieButton: {
    backgroundColor: '#DC2626',
  },
  workoutButton: {
    backgroundColor: '#7C2D12',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  sessionCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  sessionInfo: {
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 2,
  },
  sessionInstructor: {
    fontSize: 12,
    color: '#94A3B8',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  rescheduleButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    flex: 1,
  },
  rescheduleText: {
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  bannerContainer: {
    paddingHorizontal: 20,
  },
  bannerCard: {
    width: width * 0.7,
    height: 140,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  bannerGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  bannerInstructor: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  bannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerCost: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerCta: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  weeklyCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weeklyNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weeklyLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  viewProgressButton: {
    alignSelf: 'center',
  },
  viewProgressText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  achievementCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  badge: {
    width: 48,
    height: 48,
    backgroundColor: '#F59E0B',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badgeIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#94A3B8',
  },
});




