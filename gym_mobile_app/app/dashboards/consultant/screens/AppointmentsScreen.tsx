import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

interface Appointment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  consultant: {
    _id: string;
    name: string;
    specialty: string;
    contact: {
      phone: string;
      email: string;
    };
  };
  title?: string;
  notes?: string;
  startAt: string;
  endAt: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  mode: 'online' | 'offline' | 'hybrid';
  location?: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

const filterTabs = [
  { id: 'all', label: 'All', icon: '📋', color: '#8B5CF6' },
  { id: 'pending', label: 'Pending', icon: '⏳', color: '#F59E0B' },
  { id: 'confirmed', label: 'Confirmed', icon: '✓', color: '#10B981' },
  { id: 'completed', label: 'Completed', icon: '✔', color: '#3B82F6' }
];

export const AppointmentsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultantId, setConsultantId] = useState<string | null>(null);

  useEffect(() => {
    initializeAndFetch();
  }, []);

const initializeAndFetch = async () => {
  try {
    // Get logged-in user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    const token = await AsyncStorage.getItem('userToken');
    
    if (!userId || !token) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    

    // CRITICAL FIX: Fetch the consultant document first
    // The consultant collection has a 'user' field that references the User
    // We need to get the consultant's _id (not the user's _id)
    const consultantResponse = await axios.get(
      `${API_BASE_URL}/consultants`,
      {
        params: { userId }, // Query by user field
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Consultant lookup response:', consultantResponse.data);

    // Extract consultant _id from the response
    let actualConsultantId: string | null = null;
    
    if (Array.isArray(consultantResponse.data) && consultantResponse.data.length > 0) {
      // If response is array, take first consultant
      actualConsultantId = consultantResponse.data[0]._id;
    } else if (consultantResponse.data._id) {
      // If response is single object
      actualConsultantId = consultantResponse.data._id;
    }

    if (!actualConsultantId) {
      setError('No consultant profile found for this user');
      setLoading(false);
      return;
    }

    console.log('Found consultant ID:', actualConsultantId);
    setConsultantId(actualConsultantId);
    
    // Now fetch appointments with the correct consultant _id
    await fetchAppointments(actualConsultantId);
    
  } catch (err: any) {
    console.error('Initialization error:', err?.response?.data || err.message);
    setError('Failed to initialize');
    setLoading(false);
  }
};


  const fetchAppointments = async (consultantIdParam?: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const consultantIdToUse = consultantIdParam || consultantId;
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      if (!consultantIdToUse) {
        setError('Consultant ID not found');
        setLoading(false);
        return;
      }

      console.log('Fetching appointments for consultant:', consultantIdToUse);

      // Now using the actual consultant _id (not user _id)
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        params: {
          consultantId: consultantIdToUse, // ✅ Now passing consultant._id
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetched appointments:', response.data);
      setAppointments(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching appointments:', err?.response?.data || err.message);
      setError(err?.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
  };

// AppointmentsScreen.tsx - Fixed handleStatusChange function

const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    // ✅ FIX: Changed from PUT to PATCH to match backend route
    await axios.patch(
      `${API_BASE_URL}/appointments/${appointmentId}`,
      { status: newStatus },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Update local state immediately for better UX
    setAppointments(prev =>
      prev.map(apt =>
        apt._id === appointmentId
          ? { ...apt, status: newStatus }
          : apt
      )
    );

    Alert.alert(
      'Success', 
      `Appointment ${newStatus === 'confirmed' ? 'accepted' : 'declined'} successfully`
    );
  } catch (err: any) {
    console.error('Error updating appointment:', err?.response?.data || err.message);
    
    // ✅ IMPROVED: Better error handling
    const errorMessage = err?.response?.data?.message || 'Failed to update appointment status';
    Alert.alert('Error', errorMessage);
    
    // Refresh appointments to ensure UI is in sync
    await fetchAppointments();
  }
};


  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'all') return true;
    return appointment.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const calculateDuration = (startAt: string, endAt: string) => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} mins`;
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online': return '💻';
      case 'offline': return '🏢';
      case 'hybrid': return '🔄';
      default: return '📍';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setLoading(true);
              setError(null);
              initializeAndFetch();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
     
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={['#10B981']}
          />
        }
      >
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={['#1A1A2E', '#16213E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerSection}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Appointments</Text>
              <Text style={styles.headerSubtitle}>
                Manage your client sessions
              </Text>
            </View>
            <View style={styles.statsCircle}>
              <Text style={styles.statsNumber}>{appointments.length}</Text>
              <Text style={styles.statsLabel}>Total</Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* Enhanced Tab Navigation */}
        <View style={styles.tabsWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}
          >
            {filterTabs.map(tab => {
              const isActive = activeTab === tab.id;
              const count = tab.id === 'all' 
                ? appointments.length 
                : appointments.filter(a => a.status === tab.id).length;
              
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.tab}
                    >
                      <Text style={styles.tabIcon}>{tab.icon}</Text>
                      <Text style={styles.activeTabText}>{tab.label}</Text>
                      <View style={styles.tabBadge}>
                        <Text style={styles.tabBadgeText}>{count}</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.tab}>
                      <Text style={styles.tabIcon}>{tab.icon}</Text>
                      <Text style={styles.tabText}>{tab.label}</Text>
                      <View style={[styles.tabBadge, styles.inactiveBadge]}>
                        <Text style={styles.inactiveBadgeText}>{count}</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <TouchableOpacity 
                key={appointment._id} 
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#1e1e2e', '#252538']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.appointmentCard}
                >
                  {/* Status Indicator Line */}
                  <View 
                    style={[
                      styles.statusLine, 
                      { backgroundColor: getStatusColor(appointment.status) }
                    ]} 
                  />
                  
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {appointment.user.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={[
                        styles.typeBadge,
                        { backgroundColor: appointment.mode === 'online' ? '#10B981' : appointment.mode === 'offline' ? '#F59E0B' : '#3B82F6' }
                      ]}>
                        <Text style={styles.typeBadgeText}>
                          {getModeIcon(appointment.mode)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.clientInfo}>
                      <Text style={styles.clientName}>{appointment.user.name}</Text>
                      <View style={styles.emailBadge}>
                        <Text style={styles.emailIcon}>📧</Text>
                        <Text style={styles.emailText} numberOfLines={1}>
                          {appointment.user.email}
                        </Text>
                      </View>
                    </View>

                    <View style={[
                      styles.statusPill,
                      { 
                        backgroundColor: `${getStatusColor(appointment.status)}20`,
                        borderColor: `${getStatusColor(appointment.status)}40`
                      }
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(appointment.status) }
                      ]} />
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(appointment.status) }
                      ]}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {/* Session Type Badge */}
                  <View style={styles.sessionTypeBadge}>
                    <Text style={styles.sessionTypeText}>
                      {appointment.mode.charAt(0).toUpperCase() + appointment.mode.slice(1)} Session
                    </Text>
                  </View>

                  {/* Title & Notes */}
                  {appointment.title && (
                    <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  )}
                  {appointment.notes && (
                    <Text style={styles.appointmentNotes} numberOfLines={2}>
                      {appointment.notes}
                    </Text>
                  )}

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <View style={styles.detailIconWrapper}>
                        <Text style={styles.detailEmoji}>📅</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{formatDate(appointment.startAt)}</Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailIconWrapper}>
                        <Text style={styles.detailEmoji}>⏰</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>{formatTime(appointment.startAt)}</Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailIconWrapper}>
                        <Text style={styles.detailEmoji}>⏱️</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Duration</Text>
                        <Text style={styles.detailValue}>
                          {calculateDuration(appointment.startAt, appointment.endAt)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Price Display */}
                  {appointment.price && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Session Fee:</Text>
                      <Text style={styles.priceValue}>₹{appointment.price}</Text>
                    </View>
                  )}

                  {/* Action Buttons for Pending */}
                  {appointment.status === 'pending' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={() => handleStatusChange(appointment._id, 'confirmed')}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.buttonIcon}>✓</Text>
                          <Text style={styles.buttonText}>Accept</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.declineButton}
                        onPress={() => handleStatusChange(appointment._id, 'cancelled')}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#EF4444', '#DC2626']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.buttonIcon}>✕</Text>
                          <Text style={styles.buttonText}>Decline</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Quick Actions for Other Status */}
                  {appointment.status !== 'pending' && (
                    <View style={styles.quickActions}>
                      <TouchableOpacity style={styles.quickActionButton}>
                        <Text style={styles.quickActionIcon}>💬</Text>
                        <Text style={styles.quickActionText}>Message</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.quickActionButton}>
                        <Text style={styles.quickActionIcon}>📞</Text>
                        <Text style={styles.quickActionText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.quickActionButton}>
                        <Text style={styles.quickActionIcon}>📋</Text>
                        <Text style={styles.quickActionText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyStateText}>
                No {activeTab !== 'all' ? activeTab : ''} appointments found
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Check back later for new bookings
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
  },
  loadingText: {
    color: '#A0AEC0',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
    paddingHorizontal: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerSection: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  statsCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderWidth: 2,
    borderColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statsLabel: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  tabsWrapper: {
    marginTop: 20,
    marginBottom: 16,
  },
  tabContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inactiveBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  appointmentsList: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  statusLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#252538',
  },
  typeBadgeText: {
    fontSize: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  emailIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  emailText: {
    fontSize: 12,
    color: '#A0D7FF',
    fontWeight: '600',
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sessionTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  sessionTypeText: {
    fontSize: 13,
    color: '#CBD5E0',
    fontWeight: '600',
  },
  appointmentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  appointmentNotes: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 18,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 12,
    gap: 6, // Reduced from 8
  },
  detailIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', 
    marginBottom: 4,
  },
  detailEmoji: {
    fontSize: 16,
  },
  detailLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10, 
    color: '#FFFFFF',
    fontWeight: '700',
    flexWrap: 'wrap', 
    },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  acceptButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  declineButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  buttonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  quickActionIcon: {
    fontSize: 16,
  },
  quickActionText: {
    fontSize: 12,
    color: '#CBD5E0',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});