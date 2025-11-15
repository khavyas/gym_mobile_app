import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Appointment } from '../services/types';

const mockAppointments: Appointment[] = [
  { 
    id: '1', 
    client: 'John Martinez', 
    date: '2024-10-15', 
    time: '10:00 AM', 
    type: 'Online', 
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
  { 
    id: '5', 
    client: 'David Kim', 
    date: '2024-10-17', 
    time: '9:00 AM', 
    type: 'Offline', 
    duration: '45 mins', 
    status: 'pending', 
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    gym: 'Strength Lab'
  },
];

const filterTabs = [
  { id: 'all', label: 'All', icon: '📋', color: '#8B5CF6' },
  { id: 'pending', label: 'Pending', icon: '⏳', color: '#F59E0B' },
  { id: 'confirmed', label: 'Confirmed', icon: '✓', color: '#10B981' },
  { id: 'completed', label: 'Completed', icon: '✔', color: '#3B82F6' }
];

export const AppointmentsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'all') return true;
    return appointment.status === activeTab;
  });

  const handleStatusChange = (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: newStatus }
          : apt
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
     
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
            filteredAppointments.map((appointment, index) => (
              <TouchableOpacity 
                key={appointment.id} 
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
                      <Image 
                        source={{ uri: appointment.avatar }}
                        style={styles.avatar}
                      />
                      <View style={[
                        styles.typeBadge,
                        { backgroundColor: appointment.type === 'Online' ? '#10B981' : appointment.type === 'Offline' ? '#F59E0B' : '#3B82F6' }
                      ]}>
                        <Text style={styles.typeBadgeText}>
                          {appointment.type === 'Online' ? '💻' : appointment.type === 'Offline' ? '🏢' : '🔄'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.clientInfo}>
                      <Text style={styles.clientName}>{appointment.client}</Text>
                      <View style={styles.gymBadge}>
                        <Text style={styles.gymIcon}>🏋️</Text>
                        <Text style={styles.gymText}>{appointment.gym}</Text>
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
                    <Text style={styles.sessionTypeText}>{appointment.type} Session</Text>
                  </View>

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <View style={styles.detailIconWrapper}>
                        <Text style={styles.detailEmoji}>📅</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{appointment.date}</Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailIconWrapper}>
                        <Text style={styles.detailEmoji}>⏰</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>{appointment.time}</Text>
                      </View>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailIconWrapper}>
                        <Text style={styles.detailEmoji}>⏱️</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Duration</Text>
                        <Text style={styles.detailValue}>{appointment.duration}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons for Pending */}
                  {appointment.status === 'pending' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={() => handleStatusChange(appointment.id, 'confirmed')}
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
                        onPress={() => handleStatusChange(appointment.id, 'cancelled')}
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  gymBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  gymIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  gymText: {
    fontSize: 12,
    color: '#A0D7FF',
    fontWeight: '600',
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
    marginBottom: 16,
  },
  sessionTypeText: {
    fontSize: 13,
    color: '#CBD5E0',
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 12,
    gap: 8,
  },
  detailIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 11,
    color: '#FFFFFF',
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