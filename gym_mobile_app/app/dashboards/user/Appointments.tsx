import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  };
  startAt: string;
  endAt: string;
  title: string;
  notes?: string;
  mode: 'online' | 'offline';
  location?: string;
  price?: number;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token || !userId) {
        setError('Please log in to view appointments');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        params: { userId },
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setAppointments(response.data);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  // Filter appointments based on status and date
  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.startAt);
    const now = new Date();
    return ['pending', 'confirmed', 'rescheduled'].includes(apt.status) && aptDate > now;
  });

  const completedAppointments = appointments.filter(apt => {
    return apt.status === 'completed';
  });

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
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDuration = (startAt: string, endAt: string) => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    return `${diffMinutes}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rescheduled': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      case 'completed': return '#059669';
      default: return '#6b7280';
    }
  };

  const renderUpcomingCard = (appointment: Appointment) => (
    <View key={appointment._id} style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {appointment.consultant.name.charAt(0)}
              </Text>
            </View>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentType}>{appointment.title}</Text>
            <Text style={styles.consultantName}>with {appointment.consultant.name}</Text>
            <Text style={styles.specialtyText}>{appointment.consultant.specialty}</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.dateText}>{formatDate(appointment.startAt)}</Text>
              </View>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>🕐</Text>
                <Text style={styles.timeText}>{formatTime(appointment.startAt)}</Text>
                <Text style={styles.durationText}>
                  ({getDuration(appointment.startAt, appointment.endAt)})
                </Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.icon}>{appointment.mode === 'online' ? '💻' : '📍'}</Text>
              <Text style={[
                styles.locationText, 
                appointment.mode === 'online' && styles.onlineText
              ]}>
                {appointment.mode === 'online' ? 'Online Session' : appointment.location || 'In-Person'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) }
          ]}>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>{appointment.status}</Text>
          </View>
          <TouchableOpacity style={styles.rescheduleButton}>
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>
      {appointment.mode === 'online' && (
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinIcon}>🎥</Text>
          <Text style={styles.joinText}>Join</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCompletedCard = (appointment: Appointment) => (
    <View key={appointment._id} style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {appointment.consultant.name.charAt(0)}
              </Text>
            </View>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentType}>{appointment.title}</Text>
            <Text style={styles.consultantName}>with {appointment.consultant.name}</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.dateText}>{formatDate(appointment.startAt)}</Text>
              </View>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>🕐</Text>
                <Text style={styles.timeText}>{formatTime(appointment.startAt)}</Text>
              </View>
            </View>
            {appointment.price && (
              <Text style={styles.priceText}>₹{appointment.price}</Text>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={[styles.statusBadge, styles.completedBadge]}>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>Completed</Text>
          </View>
          <TouchableOpacity style={styles.bookAgainButton}>
            <Text style={styles.bookAgainText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {/* Header */}
        <View style={styles.scrollableHeader}>
          <View>
            <Text style={styles.title}>Sessions</Text>
            <Text style={styles.subtitle}>Manage your appointments and packages</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "completed" && styles.activeTab]}
            onPress={() => setActiveTab("completed")}
          >
            <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchAppointments}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "upcoming" && (
          <View style={styles.tabContent}>
            {upcomingAppointments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyText}>No upcoming appointments</Text>
                <Text style={styles.emptySubtext}>Book a consultation to get started</Text>
              </View>
            ) : (
              upcomingAppointments.map(renderUpcomingCard)
            )}
          </View>
        )}
        
        {activeTab === "completed" && (
          <View style={styles.tabContent}>
            {completedAppointments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>✅</Text>
                <Text style={styles.emptyText}>No completed appointments</Text>
                <Text style={styles.emptySubtext}>Your completed sessions will appear here</Text>
              </View>
            ) : (
              completedAppointments.map(renderCompletedCard)
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8b92a8',
    fontSize: 16,
    marginTop: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollableHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b92a8',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#252b3d',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1a1f2e',
  },
  tabText: {
    fontSize: 14,
    color: '#8b92a8',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8b92a8',
  },
  appointmentCard: {
    backgroundColor: '#252b3d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  consultantName: {
    fontSize: 14,
    color: '#8b92a8',
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#10b981',
    marginBottom: 8,
  },
  dateTimeRow: {
    marginBottom: 8,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#8b92a8',
  },
  timeText: {
    fontSize: 13,
    color: '#8b92a8',
  },
  durationText: {
    fontSize: 13,
    color: '#8b92a8',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#10b981',
  },
  onlineText: {
    color: '#3b82f6',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  completedBadge: {
    backgroundColor: '#059669',
  },
  statusIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rescheduleButton: {
    paddingVertical: 6,
  },
  rescheduleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  bookAgainButton: {
    paddingVertical: 6,
  },
  bookAgainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  joinIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});