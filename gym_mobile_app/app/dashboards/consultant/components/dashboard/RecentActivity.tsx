import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Appointment } from '../../services/types';

interface RecentActivityProps {
  appointments: Appointment[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ appointments }) => {
  const renderAppointment = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentItem}>
      <View style={styles.appointmentInfo}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.appointmentType}>{item.type}</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentDate}>{item.date}</Text>
        <Text style={styles.appointmentTime}>{item.time}</Text>
      </View>
      <Badge 
        text={item.status} 
        variant={
          item.status === 'confirmed' ? 'success' : 
          item.status === 'pending' ? 'warning' : 
          'default'
        } 
      />
    </View>
  );

  return (
    <Card>
      <Text style={styles.title}>Recent Appointments</Text>
      <FlatList
        data={appointments.slice(0, 5)}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appointmentInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  appointmentType: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  appointmentDetails: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  appointmentTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});