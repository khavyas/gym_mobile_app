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
import { Appointment } from '../services/types';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    client: 'John Doe',
    date: '2024-10-15',
    time: '10:00 AM',
    type: 'Nutrition Consultation',
    status: 'confirmed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    duration: '60 min'
  },
  {
    id: '2',
    client: 'Jane Smith',
    date: '2024-10-15',
    time: '2:00 PM',
    type: 'Yoga Session',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    duration: '45 min'
  },
  {
    id: '3',
    client: 'Mike Wilson',
    date: '2024-10-16',
    time: '11:00 AM',
    type: 'Diet Planning',
    status: 'completed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    duration: '30 min'
  },
  {
    id: '4',
    client: 'Sarah Davis',
    date: '2024-10-17',
    time: '3:00 PM',
    type: 'Fitness Assessment',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    duration: '90 min'
  },
];

const filterTabs = ['all', 'pending', 'confirmed', 'completed'];

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <Text style={styles.headerSubtitle}>
          Manage your client sessions and bookings
        </Text>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {filterTabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.appointmentsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <View key={appointment.id} style={styles.fullAppointmentCard}>
              <View style={styles.appointmentCardHeader}>
                <Image 
                  source={{ uri: appointment.avatar }}
                  style={styles.largeAvatar}
                />
                <View style={styles.clientDetails}>
                  <Text style={styles.clientNameLarge}>{appointment.client}</Text>
                  <Text style={styles.appointmentTypeText}>{appointment.type}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  appointment.status === 'confirmed' && styles.confirmedBadge,
                  appointment.status === 'pending' && styles.pendingBadge,
                  appointment.status === 'completed' && styles.completedBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    appointment.status === 'confirmed' && styles.confirmedText,
                    appointment.status === 'pending' && styles.pendingText,
                    appointment.status === 'completed' && styles.completedText
                  ]}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747310.png' }}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>{appointment.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2838/2838779.png' }}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>{appointment.duration}</Text>
                </View>
              </View>

              {appointment.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => handleStatusChange(appointment.id, 'confirmed')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.declineButton}
                    onPress={() => handleStatusChange(appointment.id, 'cancelled')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No {activeTab !== 'all' ? activeTab : ''} appointments found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingTop: 70, // Reduced padding
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F4F5',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  appointmentsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  fullAppointmentCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  clientDetails: {
    flex: 1,
  },
  clientNameLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F4F4F5',
    marginBottom: 4,
  },
  appointmentTypeText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  appointmentDetails: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    tintColor: '#9CA3AF',
  },
  detailText: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  confirmedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  completedBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  confirmedText: {
    color: '#10B981',
  },
  pendingText: {
    color: '#FBB936',
  },
  completedText: {
    color: '#3B82F6',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});