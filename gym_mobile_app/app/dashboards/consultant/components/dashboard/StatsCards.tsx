import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { DashboardStats } from '../../services/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statsData = [
    { label: 'Total Clients', value: stats.totalClients, color: '#3B82F6' },
    { label: 'Monthly Revenue', value: `$${stats.monthlyRevenue}`, color: '#10B981' },
    { label: 'Completed Sessions', value: stats.completedSessions, color: '#8B5CF6' },
    { label: 'Average Rating', value: stats.averageRating.toFixed(1), color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      {statsData.map((stat, index) => (
        <Card key={index} style={styles.statCard}>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
