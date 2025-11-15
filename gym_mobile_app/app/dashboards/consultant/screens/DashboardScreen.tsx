
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
import { LinearGradient } from 'expo-linear-gradient';

// --- Mock Data ---
const mockStats: DashboardStats = {
  totalClients: 45,
  monthlyRevenue: 3200,
  completedSessions: 128,
  averageRating: 4.8,
};

const mockAppointments: Appointment[] = [
  { 
    id: '1', 
    client: 'John Martinez', 
    date: '2024-10-15', 
    time: '10:00 AM', 
    type: 'online', 
    duration: '60 mins', 
    status: 'confirmed', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    gym: 'PowerFit Gym'
  },
  { 
    id: '2', 
    client: 'Sarah Chen', 
    date: '2024-10-15', 
    time: '2:00 PM', 
    type: 'Offline', 
    duration: '45 mins', 
    status: 'pending', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    gym: 'Elite Fitness Hub'
  },
  { 
    id: '3', 
    client: 'Mike Thompson', 
    date: '2024-10-16', 
    time: '11:00 AM', 
    type: 'Hybrid', 
    duration: '30 mins', 
    status: 'completed', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    gym: 'FitZone Studio'
  },
  { 
    id: '4', 
    client: 'Emily Rodriguez', 
    date: '2024-10-16', 
    time: '3:30 PM', 
    type: 'Online', 
    duration: '60 mins', 
    status: 'confirmed', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    gym: 'Athletic Performance Center'
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#1A1A2E', '#16213E', '#0F3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.title}>Dashboard Overview</Text>
          </View>
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop' }}
              style={styles.profileImage}
            />
            <View style={styles.statusDot} />
          </View>
        </LinearGradient>

        {/* Stats Grid with Vibrant Gradients */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statCardWrapper} activeOpacity={0.8}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>👥</Text>
              </View>
              <View>
                <Text style={styles.statValue}>{stats.totalClients}</Text>
                <Text style={styles.statLabel}>Total Clients</Text>
               
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCardWrapper} activeOpacity={0.8}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>💰</Text>
              </View>
              <View>
                <Text style={styles.statValue}>₹{stats.monthlyRevenue}</Text>
                <Text style={styles.statLabel}>Monthly Revenue</Text>
               
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCardWrapper} activeOpacity={0.8}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>✅</Text>
              </View>
              <View>
                <Text style={styles.statValue}>{stats.completedSessions}</Text>
                <Text style={styles.statLabel}>Sessions Done</Text>
              
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCardWrapper} activeOpacity={0.8}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>⭐</Text>
              </View>
              <View>
                <Text style={styles.statValue}>{stats.averageRating}</Text>
                <Text style={styles.statLabel}>Average Rating</Text>
              
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Appointments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
              <Text style={styles.sectionSubtitle}>Manage your consultations</Text>
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAll}>View All</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>

          {appointments.map((appointment, index) => (
            <TouchableOpacity key={appointment.id} activeOpacity={0.7}>
              <LinearGradient
                colors={['#1e1e2e', '#252538']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.appointmentCard,
                  { 
                    borderLeftWidth: 4,
                    borderLeftColor: 
                      appointment.status === 'confirmed' ? '#10b981' :
                      appointment.status === 'pending' ? '#f59e0b' :
                      '#3b82f6'
                  }
                ]}
              >
                <View style={styles.appointmentLeft}>
                  <Image source={{ uri: appointment.avatar }} style={styles.clientAvatar} />
                  <View style={styles.avatarBadge}>
                    <Text style={styles.avatarBadgeText}>
                      {appointment.type.charAt(0)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.appointmentInfo}>
                  <Text style={styles.clientName}>{appointment.client}</Text>
                  <View style={styles.appointmentTypeRow}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.appointmentType}>{appointment.type}</Text>
                    </View>
                  </View>
                  <View style={styles.gymRow}>
                    <Text style={styles.gymIcon}>🏋️</Text>
                    <Text style={styles.gymName}>{appointment.gym}</Text>
                  </View>
                  <View style={styles.appointmentMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>📅</Text>
                      <Text style={styles.metaText}>{appointment.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>⏰</Text>
                      <Text style={styles.metaText}>{appointment.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>⏱️</Text>
                      <Text style={styles.metaText}>{appointment.duration}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.appointmentRight}>
                  <View style={[
                    styles.statusBadge,
                    appointment.status === 'confirmed' && styles.confirmedBadge,
                    appointment.status === 'pending' && styles.pendingBadge,
                    appointment.status === 'completed' && styles.completedBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {appointment.status === 'confirmed' ? '✓' : 
                       appointment.status === 'pending' ? '⏳' : '✔'}
                    </Text>
                    <Text style={styles.statusLabel}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreIcon}>⋮</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  scrollView: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  greeting: { fontSize: 16, color: '#A0AEC0', marginBottom: 4, fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  profileContainer: { position: 'relative' },
  profileImage: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    borderWidth: 3, 
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0F3460'
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    padding: 16, 
    paddingTop: 24,
    gap: 12
  },
  statCardWrapper: { 
    width: '48.5%',
    aspectRatio: 0.95,
  },
  statCard: { 
    borderRadius: 24, 
    padding: 18, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    flex: 1,
    justifyContent: 'space-between'
  },
  statIconContainer: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    backgroundColor: 'rgba(255, 255, 255, 0.25)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statEmoji: { fontSize: 28 },
  statValue: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    marginBottom: 4,
    letterSpacing: 0.5
  },
  statLabel: { 
    fontSize: 13, 
    color: 'rgba(255, 255, 255, 0.9)', 
    fontWeight: '600',
    marginBottom: 8
  },
  statTrend: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  trendText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  section: { padding: 20, paddingTop: 12 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#FFFFFF',
    letterSpacing: 0.3
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
    fontWeight: '500'
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  viewAll: { 
    fontSize: 14, 
    color: '#667eea', 
    fontWeight: '700',
    marginRight: 4
  },
  arrow: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '700'
  },
  appointmentCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden'
  },
  appointmentLeft: {
    position: 'relative',
    marginRight: 14
  },
  clientAvatar: { 
    width: 64, 
    height: 64, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#252538'
  },
  avatarBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  appointmentInfo: { flex: 1 },
  clientName: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#FFFFFF', 
    marginBottom: 6,
    letterSpacing: 0.2
  },
  appointmentTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  typeBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  appointmentType: { 
    fontSize: 13, 
    color: '#A0D7FF', 
    fontWeight: '600'
  },
  gymRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  gymIcon: {
    fontSize: 14,
    marginRight: 6
  },
  gymName: {
    fontSize: 13,
    color: '#CBD5E0',
    fontWeight: '500'
  },
  appointmentMeta: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  metaIcon: { 
    fontSize: 12,
    marginRight: 4
  },
  metaText: { 
    fontSize: 12, 
    color: '#CBD5E0',
    fontWeight: '500'
  },
  appointmentRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%'
  },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 100,
    justifyContent: 'center'
  },
  confirmedBadge: { 
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  pendingBadge: { 
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)'
  },
  completedBadge: { 
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)'
  },
  statusText: {
    fontSize: 14
  },
  statusLabel: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#FFFFFF'
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  moreIcon: {
    fontSize: 18,
    color: '#A0AEC0',
    fontWeight: '700'
  },
  bottomSpacing: { height: 30 }
});