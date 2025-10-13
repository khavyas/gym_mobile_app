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
  Dashboard: undefined;
  GymCenters: undefined;
  Users: undefined;
  Analytics: undefined;
  Settings: undefined;
  Profile: undefined;
};

interface GymCenter {
  _id: string;
  gymId: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  admin: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalGyms: number;
  totalUsers: number;
  totalAdmins: number;
  totalRevenue: number;
  activeUsers: number;
  pendingApprovals: number;
}

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  
  // State management
  const [gymCenters, setGymCenters] = useState<GymCenter[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalGyms: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingApprovals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Super Admin');
  const [adminEmail, setAdminEmail] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchDashboardData();
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      
      if (storedName) setAdminName(storedName);
      if (storedEmail) setAdminEmail(storedEmail);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      // Fetch gym centers
      const gymResponse = await axios.get(`${API_BASE_URL}/gym-centers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Fetch dashboard stats
      const statsResponse = await axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setGymCenters(gymResponse.data);
      setStats(statsResponse.data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      
      // Mock data for demonstration
      setStats({
        totalGyms: 12,
        totalUsers: 1245,
        totalAdmins: 15,
        totalRevenue: 125000,
        activeUsers: 892,
        pendingApprovals: 3
      });
      
    } finally {
      setLoading(false);
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Good Morning! 👑";
    } else if (hour < 17) {
      return "Good Afternoon! 👑";
    } else {
      return "Good Evening! 👑";
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'SA';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const navigateToCreateGym = () => {
    router.push('/dashboards/super-admin/CreateGym');
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
              {getUserInitials(adminName)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Stats Card */}
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          style={styles.mainCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.mainCardTitle}>Platform Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalGyms}</Text>
              <Text style={styles.statLabel}>Gyms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatRevenue(stats.totalRevenue)}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
          <Text style={styles.progressText}>85% of monthly targets achieved</Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.createGymButton]}
              onPress={navigateToCreateGym}
            >
              <Text style={styles.actionIcon}>🏢</Text>
              <Text style={styles.actionText}>Create Gym</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.usersButton]}
              onPress={() => navigation.navigate('Users')}
            >
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Manage Users</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.analyticsButton]}
              onPress={() => navigation.navigate('Analytics')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>{stats.activeUsers}</Text>
              <Text style={styles.metricLabel}>Active Users</Text>
              <Text style={styles.metricChange}>+12%</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>{stats.totalAdmins}</Text>
              <Text style={styles.metricLabel}>Gym Admins</Text>
              <Text style={styles.metricChange}>+3%</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricNumber}>{stats.pendingApprovals}</Text>
              <Text style={styles.metricLabel}>Pending</Text>
              <Text style={[styles.metricChange, styles.warningColor]}>Review</Text>
            </View>
          </View>
        </View>

        {/* Recent Gym Centers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Gym Centers</Text>
            <TouchableOpacity onPress={() => router.push('/dashboards/super-admin/AllGyms')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text style={styles.loadingText}>Loading gym centers...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchDashboardData} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : gymCenters.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No gym centers found</Text>
              <TouchableOpacity 
                style={styles.createFirstGymButton}
                onPress={navigateToCreateGym}
              >
                <Text style={styles.createFirstGymText}>Create First Gym</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.gymsContainer}
            >
              {gymCenters.slice(0, 5).map((gym) => (
                <TouchableOpacity
                  key={gym._id}
                  style={styles.gymCard}
                  onPress={() => router.push(`/dashboards/super-admin/GymDetails?gymId=${gym._id}`)}
                >
                  <LinearGradient
                    colors={['#1E293B', '#334155']}
                    style={styles.gymGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.gymHeader}>
                      <Text style={styles.gymId}>#{gym.gymId}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Active</Text>
                      </View>
                    </View>
                    <Text style={styles.gymName}>{gym.name}</Text>
                    <Text style={styles.gymAddress}>{gym.address}</Text>
                    <View style={styles.gymFooter}>
                      <Text style={styles.adminName}>
                        {(() => {
                          const admin = gym.admin as any;
                          if (typeof admin === 'string') {
                            return `Admin ID: ${admin.slice(-6)}`;
                          } else if (admin?.name) {
                            return admin.name;
                          } else {
                            return 'Admin';
                          }
                        })()}
                      </Text>
                      <Text style={styles.gymCta}>View Details →</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.statusActive]} />
              <Text style={styles.statusLabel}>Server Status</Text>
              <Text style={styles.statusValue}>Online</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.statusActive]} />
              <Text style={styles.statusLabel}>Database</Text>
              <Text style={styles.statusValue}>Connected</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.statusWarning]} />
              <Text style={styles.statusLabel}>API Response</Text>
              <Text style={styles.statusValue}>150ms</Text>
            </View>
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
    backgroundColor: '#7C3AED',
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
    color: '#E9D5FF',
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
    color: '#E9D5FF',
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
  viewAllText: {
    color: '#7C3AED',
    fontSize: 14,
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
  createGymButton: {
    backgroundColor: '#059669',
  },
  usersButton: {
    backgroundColor: '#DC2626',
  },
  analyticsButton: {
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
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  warningColor: {
    color: '#F59E0B',
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
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: 16,
  },
  createFirstGymButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstGymText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  gymsContainer: {
    paddingHorizontal: 20,
  },
  gymCard: {
    width: width * 0.75,
    height: 160,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  gymGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  gymHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gymId: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gymName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gymAddress: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
  },
  gymFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminName: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  gymCta: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  statusActive: {
    backgroundColor: '#10B981',
  },
  statusWarning: {
    backgroundColor: '#F59E0B',
  },
  statusLabel: {
    flex: 1,
    fontSize: 14,
    color: '#94A3B8',
  },
  statusValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});