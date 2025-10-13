import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, Alert, RefreshControl } from 'react-native';
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
  __v?: number;
}

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export default function AllGyms() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  
  // State management
  const [gymCenters, setGymCenters] = useState<GymCenter[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<GymCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'id'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchAllGyms();
  }, []);

  useEffect(() => {
    filterAndSortGyms();
  }, [gymCenters, searchQuery, sortBy, sortOrder]);

  const fetchAllGyms = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('userToken');
      const userRole = await AsyncStorage.getItem('userRole');
      
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      if (userRole !== 'superadmin') {
        setError('Unauthorized access. Super admin role required.');
        return;
      }

      console.log('Fetching gyms with token:', token.substring(0, 20) + '...');

      const response = await axios.get(`${API_BASE_URL}/gyms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Gyms API Response:', response.data);

      if (Array.isArray(response.data)) {
        setGymCenters(response.data);
      } else {
        console.warn('Unexpected API response format:', response.data);
        setError('Unexpected response format from server');
      }

    } catch (err: any) {
      console.error('Error fetching gyms:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Unauthorized access. Please login again.');
      } else if (err.response?.status === 404) {
        setError('Gyms endpoint not found.');
      } else {
        setError('Failed to load gym centers. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllGyms();
    setRefreshing(false);
  };

  const filterAndSortGyms = () => {
    let filtered = [...gymCenters];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(gym => 
        gym.name.toLowerCase().includes(query) ||
        gym.address.toLowerCase().includes(query) ||
        gym.gymId.toLowerCase().includes(query) ||
        gym.admin.name.toLowerCase().includes(query) ||
        (gym.email && gym.email.toLowerCase().includes(query)) ||
        (gym.phone && gym.phone.includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'date':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'id':
          compareValue = a.gymId.localeCompare(b.gymId);
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

    setFilteredGyms(filtered);
  };

  const handleGymPress = (gym: GymCenter) => {
    router.push({
      pathname: "/dashboards/super-admin/GymDetails",
      params: {
        gymId: gym._id,
        gymName: gym.name
      }
    });
  };

  const handleDeleteGym = (gym: GymCenter) => {
    Alert.alert(
      'Delete Gym Center',
      `Are you sure you want to delete "${gym.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => confirmDeleteGym(gym)
        }
      ]
    );
  };

  const confirmDeleteGym = async (gym: GymCenter) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      await axios.delete(`${API_BASE_URL}/gyms/${gym._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      Alert.alert('Success', `"${gym.name}" has been deleted successfully.`);
      fetchAllGyms(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting gym:', error);
      Alert.alert('Error', 'Failed to delete gym center. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGymStatusColor = (createdAt: string) => {
    const daysDiff = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return '#10B981'; // New (Green)
    if (daysDiff <= 30) return '#F59E0B'; // Recent (Yellow)
    return '#6366F1'; // Established (Blue)
  };

  const getGymStatusText = (createdAt: string) => {
    const daysDiff = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return 'New';
    if (daysDiff <= 30) return 'Recent';
    return 'Active';
  };

  const SortButton = ({ type, label }: { type: 'name' | 'date' | 'id', label: string }) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === type && styles.sortButtonActive
      ]}
      onPress={() => {
        if (sortBy === type) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortBy(type);
          setSortOrder('asc');
        }
      }}
    >
      <Text style={[
        styles.sortButtonText,
        sortBy === type && styles.sortButtonTextActive
      ]}>
        {label} {sortBy === type && (sortOrder === 'asc' ? '↑' : '↓')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Gym Centers</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/dashboards/super-admin')}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search gyms..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sortContainer}
        >
          <SortButton type="name" label="Name" />
          <SortButton type="date" label="Date" />
          <SortButton type="id" label="ID" />
        </ScrollView>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{gymCenters.length}</Text>
          <Text style={styles.statLabel}>Total Gyms</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{filteredGyms.length}</Text>
          <Text style={styles.statLabel}>Showing</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {gymCenters.filter(gym => 
              Math.floor((Date.now() - new Date(gym.createdAt).getTime()) / (1000 * 60 * 60 * 24)) <= 7
            ).length}
          </Text>
          <Text style={styles.statLabel}>New This Week</Text>
        </View>
      </View>

      {/* Gym List */}
      <ScrollView 
        style={styles.gymList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>Loading gym centers...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchAllGyms} style={styles.retryButton}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredGyms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No gyms match your search' : 'No gym centers found'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first gym center to get started'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => router.push('/dashboards/super-admin')}
              >
                <Text style={styles.createFirstText}>Create First Gym</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredGyms.map((gym, index) => (
            <TouchableOpacity 
              key={gym._id}
              style={styles.gymCard}
              onPress={() => handleGymPress(gym)}
            >
              <LinearGradient
                colors={['#1E293B', '#334155']}
                style={styles.gymGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Gym Header */}
                <View style={styles.gymHeader}>
                  <View style={styles.gymInfo}>
                    <Text style={styles.gymId}>#{gym.gymId.slice(-8)}</Text>
                    <View 
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getGymStatusColor(gym.createdAt) }
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getGymStatusText(gym.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteGym(gym)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                {/* Gym Details */}
                <View style={styles.gymDetails}>
                  <Text style={styles.gymName}>{gym.name}</Text>
                  <Text style={styles.gymAddress}>📍 {gym.address}</Text>
                  
                  <View style={styles.contactInfo}>
                    {gym.phone && (
                      <Text style={styles.contactText}>📞 {gym.phone}</Text>
                    )}
                    {gym.email && (
                      <Text style={styles.contactText}>✉️ {gym.email}</Text>
                    )}
                  </View>
                </View>

                {/* Admin Info */}
                <View style={styles.adminSection}>
                  <View style={styles.adminInfo}>
                    <Text style={styles.adminLabel}>Admin:</Text>
                    <Text style={styles.adminName}>{gym.admin.name}</Text>
                    <Text style={styles.adminEmail}>{gym.admin.email}</Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.gymFooter}>
                  <Text style={styles.createdDate}>
                    Created: {formatDate(gym.createdAt)}
                  </Text>
                  <Text style={styles.viewDetails}>View Details →</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
        
        <View style={styles.bottomPadding} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  searchIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: '#7C3AED',
  },
  sortButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  gymList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  createFirstButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  gymCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gymGradient: {
    padding: 20,
  },
  gymHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gymInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gymId: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  gymDetails: {
    marginBottom: 16,
  },
  gymName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  gymAddress: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  adminSection: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  adminInfo: {
    gap: 2,
  },
  adminLabel: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  adminName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  adminEmail: {
    fontSize: 12,
    color: '#94A3B8',
  },
  gymFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  createdDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  viewDetails: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});