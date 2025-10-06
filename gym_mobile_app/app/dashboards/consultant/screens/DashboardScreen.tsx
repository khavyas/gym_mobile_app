import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Image,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { DashboardStats, Appointment } from '../services/types';

// --- Mock Data (No changes needed here) ---
const mockStats: DashboardStats = {
  totalClients: 45,
  monthlyRevenue: 3200,
  completedSessions: 128,
  averageRating: 4.8,
};

const mockAppointments: Appointment[] = [
  { id: '1', client: 'John Doe', date: '2024-10-15', time: '10:00 AM', type: 'Nutrition Consultation', duration: '60 mins', status: 'confirmed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: '2', client: 'Jane Smith', date: '2024-10-15', time: '2:00 PM', type: 'Yoga Session', duration: '45 mins', status: 'pending', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: '3', client: 'Mike Wilson', date: '2024-10-16', time: '11:00 AM', type: 'Diet Planning', duration: '30 mins', status: 'completed', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
];

export const DashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.title}>Dashboard Overview</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop' }}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.statsGrid}>
          {/* Using a simple View instead of LinearGradient */}
          <View style={[styles.statCard, styles.primaryCard]}>
            <View style={styles.statIconContainer}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/476/476863.png' }} style={styles.statIcon} tintColor="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stats.totalClients}</Text>
            <Text style={styles.statLabel}>Total Clients</Text>
          </View>

          <View style={[styles.statCard, styles.successCard]}>
            <View style={styles.statIconContainer}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/891/891462.png' }} style={styles.statIcon} tintColor="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>${stats.monthlyRevenue}</Text>
            <Text style={styles.statLabel}>Monthly Revenue</Text>
          </View>

          <View style={[styles.statCard, styles.warningCard]}>
            <View style={styles.statIconContainer}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2919/2919906.png' }} style={styles.statIcon} tintColor="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stats.completedSessions}</Text>
            <Text style={styles.statLabel}>Sessions Done</Text>
          </View>

          <View style={[styles.statCard, styles.infoCard]}>
            <View style={styles.statIconContainer}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }} style={styles.statIcon} tintColor="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>{stats.averageRating}</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {appointments.map(appointment => (
            // Using a simple View instead of LinearGradient
            <View key={appointment.id} style={styles.appointmentCard}>
              <Image source={{ uri: appointment.avatar }} style={styles.clientAvatar} />
              <View style={styles.appointmentInfo}>
                <Text style={styles.clientName}>{appointment.client}</Text>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
                <View style={styles.appointmentMeta}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747310.png' }} style={styles.metaIcon} tintColor="#9CA3AF" />
                  <Text style={styles.metaText}>{appointment.date}</Text>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }} style={styles.metaIcon} tintColor="#9CA3AF" />
                  <Text style={styles.metaText}>{appointment.time}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                appointment.status === 'confirmed' && styles.confirmedBadge,
                appointment.status === 'pending' && styles.pendingBadge,
                appointment.status === 'completed' && styles.completedBadge
              ]}>
                <Text style={styles.statusText}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// --- Styles for a simple dark theme (no gradients) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#1A1A1A', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  greeting: { fontSize: 15, color: '#9CA3AF', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '700', color: '#F4F4F5' },
  profileImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#3B82F6' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { width: '48%', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  // Simple solid color backgrounds for cards
  primaryCard: { backgroundColor: '#3B82F6' },
  successCard: { backgroundColor: '#10B981' },
  warningCard: { backgroundColor: '#F59E0B' },
  infoCard: { backgroundColor: '#8B5CF6' },
  statIconContainer: { width: 50, height: 50, borderRadius: 14, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statIcon: { width: 28, height: 28 },
  statValue: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#E5E7EB', fontWeight: '500' },
  section: { padding: 20, paddingTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#F4F4F5' },
  viewAll: { fontSize: 15, color: '#60A5FA', fontWeight: '600' },
  appointmentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  clientAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  appointmentInfo: { flex: 1 },
  clientName: { fontSize: 17, fontWeight: '600', color: '#F4F4F5', marginBottom: 4 },
  appointmentType: { fontSize: 14, color: '#9CA3AF', marginBottom: 6 },
  appointmentMeta: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { width: 14, height: 14, marginRight: 4, marginLeft: 8 },
  metaText: { fontSize: 12, color: '#D1D5DB' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  confirmedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  pendingBadge: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  completedBadge: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
});