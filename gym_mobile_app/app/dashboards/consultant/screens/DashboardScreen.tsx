import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Image,
  TouchableOpacity
} from 'react-native';
import { DashboardStats, Appointment } from '../services/types';

const mockStats: DashboardStats = {
  totalClients: 45,
  monthlyRevenue: 3200,
  completedSessions: 128,
  averageRating: 4.8,
};

const mockAppointments: Appointment[] = [
  { 
    id: '1', 
    client: 'John Doe', 
    date: '2024-10-15', 
    time: '10:00 AM', 
    type: 'Nutrition Consultation', 
    duration: '60 mins',
    status: 'confirmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  { 
    id: '2', 
    client: 'Jane Smith', 
    date: '2024-10-15', 
    time: '2:00 PM', 
    type: 'Yoga Session', 
    duration: '45 mins',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  { 
    id: '3', 
    client: 'Mike Wilson', 
    date: '2024-10-16', 
    time: '11:00 AM', 
    type: 'Diet Planning', 
    duration: '30 mins',
    status: 'completed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Professional Header */}
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

      {/* Stats Grid with Icons */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.primaryCard]}>
          <View style={styles.statIconContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/476/476863.png' }}
              style={styles.statIcon}
            />
          </View>
          <Text style={styles.statValue}>{stats.totalClients}</Text>
          <Text style={styles.statLabel}>Total Clients</Text>
        </View>

        <View style={[styles.statCard, styles.successCard]}>
          <View style={styles.statIconContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/891/891462.png' }}
              style={styles.statIcon}
            />
          </View>
          <Text style={styles.statValue}>${stats.monthlyRevenue}</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
        </View>

        <View style={[styles.statCard, styles.warningCard]}>
          <View style={styles.statIconContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2919/2919906.png' }}
              style={styles.statIcon}
            />
          </View>
          <Text style={styles.statValue}>{stats.completedSessions}</Text>
          <Text style={styles.statLabel}>Sessions Done</Text>
        </View>

        <View style={[styles.statCard, styles.infoCard]}>
          <View style={styles.statIconContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' }}
              style={styles.statIcon}
            />
          </View>
          <Text style={styles.statValue}>{stats.averageRating}</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
      </View>

      {/* Recent Appointments with Avatars */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Appointments</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {appointments.map(appointment => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <Image 
              source={{ uri: appointment.avatar }}
              style={styles.clientAvatar}
            />
            <View style={styles.appointmentInfo}>
              <Text style={styles.clientName}>{appointment.client}</Text>
              <Text style={styles.appointmentType}>{appointment.type}</Text>
              <View style={styles.appointmentMeta}>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747310.png' }}
                  style={styles.metaIcon}
                />
                <Text style={styles.metaText}>{appointment.date}</Text>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }}
                  style={styles.metaIcon}
                />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryCard: {
    backgroundColor: '#EFF6FF',
  },
  successCard: {
    backgroundColor: '#F0FDF4',
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
  },
  infoCard: {
    backgroundColor: '#F5F3FF',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 28,
    height: 28,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  clientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    marginLeft: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: '#DCFCE7',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  completedBadge: {
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
});