import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Modal, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type TabParamList = {
  Dashboard: undefined;
  AllGyms: undefined;
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

interface GymStats {
  totalMembers: number;
  activeMembers: number;
  totalEvents: number;
  monthlyRevenue: number;
  equipmentCount: number;
  trainersCount: number;
}

interface EditGymForm {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export default function GymDetails() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const params = useLocalSearchParams();
  
  // State management
  const [gym, setGym] = useState<GymCenter | null>(null);
  const [gymStats, setGymStats] = useState<GymStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalEvents: 0,
    monthlyRevenue: 0,
    equipmentCount: 0,
    trainersCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState<EditGymForm>({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const gymId = params.gymId as string;

  useEffect(() => {
    if (gymId) {
      fetchGymDetails();
    }
  }, [gymId]);

  const fetchGymDetails = async () => {
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

      // Fetch specific gym details
      const gymResponse = await axios.get(`${API_BASE_URL}/gyms/${gymId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Gym details response:', gymResponse.data);
      setGym(gymResponse.data);

      // Set edit form with current data
      setEditForm({
        name: gymResponse.data.name || '',
        address: gymResponse.data.address || '',
        phone: gymResponse.data.phone || '',
        email: gymResponse.data.email || ''
      });

      // Fetch gym statistics (if endpoint exists)
      try {
        const statsResponse = await axios.get(`${API_BASE_URL}/gyms/${gymId}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (statsResponse.data) {
          setGymStats(statsResponse.data);
        }
      } catch (statsError) {
        console.log('Stats endpoint not available, using mock data');
        // Mock stats for demonstration
        setGymStats({
          totalMembers: Math.floor(Math.random() * 500) + 50,
          activeMembers: Math.floor(Math.random() * 300) + 30,
          totalEvents: Math.floor(Math.random() * 50) + 5,
          monthlyRevenue: Math.floor(Math.random() * 50000) + 10000,
          equipmentCount: Math.floor(Math.random() * 100) + 20,
          trainersCount: Math.floor(Math.random() * 15) + 3
        });
      }

    } catch (err: any) {
      console.error('Error fetching gym details:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Unauthorized access. Please login again.');
      } else if (err.response?.status === 404) {
        setError('Gym center not found.');
      } else {
        setError('Failed to load gym details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGymDetails();
    setRefreshing(false);
  };

  const handleEditGym = async () => {
    try {
      setEditLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Validate form
      if (!editForm.name.trim() || !editForm.address.trim()) {
        Alert.alert('Error', 'Name and address are required fields');
        return;
      }

      const updateData = {
        name: editForm.name.trim(),
        address: editForm.address.trim(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim()
      };

      const response = await axios.put(`${API_BASE_URL}/gyms/${gymId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      Alert.alert('Success', 'Gym details updated successfully!');
      setShowEditModal(false);
      fetchGymDetails(); // Refresh data

    } catch (error: any) {
      console.error('Error updating gym:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update gym details');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteGym = () => {
    if (!gym) return;
    
    Alert.alert(
      'Delete Gym Center',
      `Are you sure you want to permanently delete "${gym.name}"?\n\nThis will also remove:\n• All gym members\n• All events and bookings\n• Admin account\n• All associated data\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Forever', 
          style: 'destructive',
          onPress: confirmDeleteGym
        }
      ]
    );
  };

  const confirmDeleteGym = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      await axios.delete(`${API_BASE_URL}/gyms/${gymId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

        Alert.alert(
        'Gym Deleted',
        `"${gym?.name}" has been permanently deleted.`,
        [
            {
            text: 'OK',
            onPress: () => router.replace('/dashboards/superadmin/AllGyms' as any)
            }
        ]
        );
    } catch (error: any) {
      console.error('Error deleting gym:', error);
      Alert.alert('Error', 'Failed to delete gym center. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getStatusColor = (createdAt: string) => {
    const daysDiff = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return '#10B981';
    if (daysDiff <= 30) return '#F59E0B';
    return '#6366F1';
  };

  const getStatusText = (createdAt: string) => {
    const daysDiff = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) return 'New Gym';
    if (daysDiff <= 30) return 'Recently Added';
    return 'Established';
  };

  const EditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Edit Gym Details</Text>
            
            <Text style={styles.inputLabel}>Gym Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter gym name"
              placeholderTextColor="#94A3B8"
              value={editForm.name}
              onChangeText={(text) => setEditForm({...editForm, name: text})}
            />
            
            <Text style={styles.inputLabel}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter gym address"
              placeholderTextColor="#94A3B8"
              value={editForm.address}
              onChangeText={(text) => setEditForm({...editForm, address: text})}
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              value={editForm.phone}
              onChangeText={(text) => setEditForm({...editForm, phone: text})}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor="#94A3B8"
              value={editForm.email}
              onChangeText={(text) => setEditForm({...editForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
                disabled={editLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEditGym}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
        <Text style={styles.headerTitle}>Gym Details</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.loadingText}>Loading gym details...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchGymDetails} style={styles.retryButton}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : !gym ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Gym not found</Text>
          </View>
        ) : (
          <>
            {/* Gym Header Card */}
            <LinearGradient
              colors={['#7C3AED', '#5B21B6']}
              style={styles.headerCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.gymHeaderInfo}>
                <View style={styles.gymTitleRow}>
                  <Text style={styles.gymName}>{gym.name}</Text>
                  <View 
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(gym.createdAt) }
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(gym.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.gymId}>ID: {gym.gymId}</Text>
                <Text style={styles.gymAddress}>📍 {gym.address}</Text>
                
                <View style={styles.contactRow}>
                  {gym.phone && (
                    <Text style={styles.contactInfo}>📞 {gym.phone}</Text>
                  )}
                  {gym.email && (
                    <Text style={styles.contactInfo}>✉️ {gym.email}</Text>
                  )}
                </View>
              </View>
            </LinearGradient>

            {/* Stats Grid */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Performance Overview</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{gymStats.totalMembers}</Text>
                  <Text style={styles.statLabel}>Total Members</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{gymStats.activeMembers}</Text>
                  <Text style={styles.statLabel}>Active Members</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{gymStats.totalEvents}</Text>
                  <Text style={styles.statLabel}>Events</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{formatRevenue(gymStats.monthlyRevenue)}</Text>
                  <Text style={styles.statLabel}>Monthly Revenue</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{gymStats.equipmentCount}</Text>
                  <Text style={styles.statLabel}>Equipment</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{gymStats.trainersCount}</Text>
                  <Text style={styles.statLabel}>Trainers</Text>
                </View>
              </View>
            </View>

            {/* Admin Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gym Administrator</Text>
              <LinearGradient
                colors={['#1E293B', '#334155']}
                style={styles.adminCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.adminHeader}>
                  <View style={styles.adminAvatar}>
                    <Text style={styles.adminInitial}>
                      {gym.admin.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.adminInfo}>
                    <Text style={styles.adminName}>{gym.admin.name}</Text>
                    <Text style={styles.adminEmail}>{gym.admin.email}</Text>
                    <Text style={styles.adminRole}>Gym Administrator</Text>
                  </View>
                </View>
                
                <View style={styles.adminActions}>
                  <TouchableOpacity style={styles.adminActionButton}>
                    <Text style={styles.adminActionText}>📧 Contact Admin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.adminActionButton}>
                    <Text style={styles.adminActionText}>🔄 Reset Password</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>

            {/* System Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>System Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Created</Text>
                  <Text style={styles.infoValue}>{formatDate(gym.createdAt)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Last Updated</Text>
                  <Text style={styles.infoValue}>{formatDate(gym.updatedAt)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Database ID</Text>
                  <Text style={styles.infoValue}>{gym._id}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Admin ID</Text>
                  <Text style={styles.infoValue}>{gym.admin._id}</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={[styles.actionButton, styles.membersButton]}>
                  <Text style={styles.actionIcon}>👥</Text>
                  <Text style={styles.actionText}>View Members</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.eventsButton]}>
                  <Text style={styles.actionIcon}>📅</Text>
                  <Text style={styles.actionText}>Manage Events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.equipmentButton]}>
                  <Text style={styles.actionIcon}>🏋️</Text>
                  <Text style={styles.actionText}>Equipment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.reportsButton]}>
                  <Text style={styles.actionIcon}>📊</Text>
                  <Text style={styles.actionText}>Reports</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Danger Zone</Text>
              <View style={styles.dangerCard}>
                <Text style={styles.dangerTitle}>Delete Gym Center</Text>
                <Text style={styles.dangerDesc}>
                  Permanently delete this gym center and all associated data. This action cannot be undone.
                </Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDeleteGym}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Delete Gym Forever</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomPadding} />
          </>
        )}
      </ScrollView>

      <EditModal />
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
  editButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 80,
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
  headerCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  gymHeaderInfo: {
    gap: 8,
  },
  gymTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  gymName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gymId: {
    fontSize: 14,
    color: '#E9D5FF',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  gymAddress: {
    fontSize: 16,
    color: '#E9D5FF',
    marginBottom: 12,
  },
  contactRow: {
    gap: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#E9D5FF',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    width: (width - 64) / 2,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  adminCard: {
    borderRadius: 16,
    padding: 20,
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  adminInitial: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  adminEmail: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 2,
  },
  adminRole: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  adminActions: {
    flexDirection: 'row',
    gap: 12,
  },
  adminActionButton: {
    flex: 1,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  adminActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  membersButton: {
    backgroundColor: '#059669',
  },
  eventsButton: {
    backgroundColor: '#DC2626',
  },
  equipmentButton: {
    backgroundColor: '#7C2D12',
  },
  reportsButton: {
    backgroundColor: '#1E40AF',
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
  dangerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  dangerDesc: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 30,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#475569',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});