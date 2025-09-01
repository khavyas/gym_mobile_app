import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; 
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Define your navigation types
type RootStackParamList = {
  HomeSummary: undefined;
  EventDetails: { 
    type: string;
    title: string;
    time: string;
    duration: string;
    cost: string;
    benefits: string;
    instructor: string;
  };
  // Add other screens here as needed
};

type HomeSummaryNavigationProp = StackNavigationProp<RootStackParamList, 'HomeSummary'>;

export default function HomeSummary() {
  const router = useRouter(); 
  const navigation = useNavigation<HomeSummaryNavigationProp>();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
            <Text style={styles.greeting}>Good Morning! 💪</Text>
            <Text style={styles.date}>{currentDate}</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileInitial}>JD</Text>
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
              <Text style={styles.statNumber}>1.5L</Text>
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
            <TouchableOpacity style={[styles.actionButton, styles.waterButton]}>
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

        {/* Classes Banner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.bannerContainer}
          >
            <TouchableOpacity 
              style={styles.bannerCard}
              onPress={() => router.push({
                pathname: "/dashboards/user/EventDetails",
                params: { 
                  type: 'zumba',
                  title: 'Zumba Fitness Party',
                  time: 'Tomorrow at 7:00 PM',
                  duration: '60 mins',
                  cost: '$15',
                  benefits: 'Cardio workout, Fun atmosphere, Full-body movement',
                  instructor: 'Maria Rodriguez',
                  locationType: 'online', // Add this
                  location: 'Zoom Meeting', // Add this
                  meetingLink: 'https://zoom.us/j/123456789' // Add for online classes
                }
              })}
            >
              <LinearGradient
                colors={['#EC4899', '#8B5CF6']}
                style={styles.bannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.bannerTitle}>Zumba Party</Text>
                <Text style={styles.bannerText}>Tomorrow at 7:00 PM</Text>
                <Text style={styles.bannerCta}>Tap for details →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bannerCard}
               onPress={() => router.push({
                pathname: "/dashboards/user/EventDetails",
                params: { 
                  type: 'meditation',
                title: 'Guided Meditation',
                time: 'Wednesday at 6:30 PM',
                duration: '45 mins',
                cost: '$10',
                benefits: 'Stress reduction, Mental clarity, Improved focus',
                instructor: 'David Chen',
                locationType: 'in-person', // Add this
                location: 'Main Studio - 123 Fitness St', // Add this
                address: '123 Fitness Street, Health City, HC 12345' 
                }
              })}
            >
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.bannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.bannerTitle}>Meditation</Text>
                <Text style={styles.bannerText}>Wednesday at 6:30 PM</Text>
                <Text style={styles.bannerCta}>Tap for details →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.bannerCard}
              onPress={() => router.push({
                pathname: "/dashboards/user/EventDetails",
                params: { 
                  type: 'yoga',
                  title: 'Vinyasa Flow Yoga',
                  time: 'Friday at 5:00 PM',
                  duration: '75 mins',
                  cost: '$12',
                  benefits: 'Flexibility, Strength building, Mind-body connection',
                  instructor: 'Sarah Johnson',
                  locationType: 'in-person', // Add this
                  location: 'Main Studio - 123 Fitness St', // Add this
                  address: '123 Fitness Street, Health City, HC 12345' // Add for in-person
                }
              })}       
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.bannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.bannerTitle}>Yoga Flow</Text>
                <Text style={styles.bannerText}>Friday at 5:00 PM</Text>
                <Text style={styles.bannerCta}>Tap for details →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
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
  bannerContainer: {
  paddingHorizontal: 20,
},
bannerCard: {
  width: width * 0.7,
  height: 120,
  borderRadius: 16,
  marginRight: 16,
  overflow: 'hidden',
},
bannerGradient: {
  flex: 1,
  padding: 16,
  justifyContent: 'center',
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
  marginBottom: 8,
},
bannerCta: {
  fontSize: 12,
  color: '#FFFFFF',
  fontWeight: '600',
},
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 20,
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