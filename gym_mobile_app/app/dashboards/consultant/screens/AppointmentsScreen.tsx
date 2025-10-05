import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
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
      >
        {filteredAppointments.map(appointment => (
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
                <Text style={styles.statusText}>
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
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.declineButton}
                  onPress={() => handleStatusChange(appointment.id, 'cancelled')}
                >
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    margin: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  appointmentsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  fullAppointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  },
  clientDetails: {
    flex: 1,
  },
  clientNameLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  appointmentTypeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  appointmentDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});