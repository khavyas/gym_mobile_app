import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { TabNavigation } from '../components/common/TabNavigation';
import { Appointment } from '../services/types';

const mockAppointments: Appointment[] = [
  {
    id: '1',
    client: 'John Doe',
    date: '2024-10-15',
    time: '10:00 AM',
    type: 'Nutrition Consultation',
    status: 'confirmed'
  },
  {
    id: '2',
    client: 'Jane Smith',
    date: '2024-10-15',
    time: '2:00 PM',
    type: 'Yoga Session',
    status: 'pending'
  },
  {
    id: '3',
    client: 'Mike Wilson',
    date: '2024-10-16',
    time: '11:00 AM',
    type: 'Diet Planning',
    status: 'completed'
  },
  {
    id: '4',
    client: 'Sarah Davis',
    date: '2024-10-17',
    time: '3:00 PM',
    type: 'Fitness Assessment',
    status: 'pending'
  },
];

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'completed', label: 'Completed' },
];

export const AppointmentsScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const filteredAppointments = appointments.filter(appointment => {
    if (activeFilter === 'all') return true;
    return appointment.status === activeFilter;
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

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <Card style={appointmentStyles.appointmentCard}>
      <View style={appointmentStyles.appointmentHeader}>
        <View style={appointmentStyles.clientInfo}>
          <Text style={appointmentStyles.clientName}>{item.client}</Text>
          <Text style={appointmentStyles.appointmentType}>{item.type}</Text>
        </View>
        <Badge
          text={item.status}
          variant={
            item.status === 'confirmed' ? 'success' :
            item.status === 'pending' ? 'warning' :
            item.status === 'completed' ? 'primary' :
            'danger'
          }
        />
      </View>
      
      <View style={appointmentStyles.appointmentDetails}>
        <Text style={appointmentStyles.dateTime}>
          📅 {item.date} at {item.time}
        </Text>
      </View>

      {item.status === 'pending' && (
        <View style={appointmentStyles.actionButtons}>
          <Button
            title="Accept"
            variant="primary"
            size="sm"
            onPress={() => handleStatusChange(item.id, 'confirmed')}
            style={appointmentStyles.actionButton}
          />
          <Button
            title="Decline"
            variant="danger"
            size="sm"
            onPress={() => handleStatusChange(item.id, 'cancelled')}
            style={appointmentStyles.actionButton}
          />
        </View>
      )}
    </Card>
  );

  return (
    <View style={appointmentStyles.container}>
      <TabNavigation
        tabs={filterTabs}
        activeTab={activeFilter}
        onTabPress={setActiveFilter}
      />
      
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={appointmentStyles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Add the missing StyleSheet
const appointmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  appointmentCard: {
    marginBottom: 16,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
    marginRight: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  dateTime: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});