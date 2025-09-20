import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl 
} from 'react-native';
import { StatsCards } from '../components/dashboard/StatsCards';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { DashboardStats, Appointment } from '../services/types';

// Mock data - replace with actual API calls
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
];

export const DashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch fresh data from API
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
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard Overview</Text>
        <Text style={styles.subtitle}>Welcome back! Here's your performance summary</Text>
      </View>
      
      <StatsCards stats={stats} />
      <RecentActivity appointments={appointments} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});