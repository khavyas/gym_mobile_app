import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  CalendarIcon,
} from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

interface HealthData {
  dataProcessing: {
    status: string;
    daysAnalyzed: number;
  };
  patternRecognition: {
    confidence: number;
  };
  lastUpdated: string;
  nextAnalysis: string;
  riskSignals: Array<{
    title: string;
    level: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';
    description: string;
    color: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export default function HealthAnalysis() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (userId && token) {
        // Simulated data - replace with actual API call
        setTimeout(() => {
          setHealthData({
            dataProcessing: {
              status: 'Complete',
              daysAnalyzed: 30,
            },
            patternRecognition: {
              confidence: 94,
            },
            lastUpdated: '2 hours ago',
            nextAnalysis: 'Tomorrow',
            riskSignals: [
              {
                title: 'Recurring Digestive Issues',
                level: 'HIGH RISK',
                description: 'Strong correlation detected between dairy consumption and digestive symptoms over the past 3 weeks.',
                color: '#7F1D1D',
              },
              {
                title: 'Irregular Sleep Pattern',
                level: 'MEDIUM RISK',
                description: 'Sleep quality has decreased by 23% over the last 14 days. Consider adjusting bedtime routine.',
                color: '#78350F',
              },
              {
                title: 'Hydration Levels',
                level: 'LOW RISK',
                description: 'Water intake is slightly below recommended levels. Aim for 8-10 glasses daily.',
                color: '#1E3A8A',
              },
            ],
            recommendations: [
              {
                title: 'Dietary Adjustment',
                description: 'Consider reducing dairy intake and monitor symptoms',
                priority: 'high',
              },
              {
                title: 'Sleep Hygiene',
                description: 'Establish consistent sleep schedule with 30-min wind-down routine',
                priority: 'high',
              },
              {
                title: 'Hydration Goal',
                description: 'Set reminders to drink water throughout the day',
                priority: 'medium',
              },
            ],
          });
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH RISK':
        return '#DC2626';
      case 'MEDIUM RISK':
        return '#F59E0B';
      case 'LOW RISK':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06b6d4" />
          <Text style={styles.loadingText}>Analyzing your health data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Health Analysis</Text>
          <Text style={styles.headerSubtitle}>AI-powered insights from your health data</Text>
        </View>

        {/* Medical Disclaimer */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <ExclamationTriangleIcon size={20} color="#F59E0B" />
            <Text style={styles.disclaimerTitle}>Medical Disclaimer:</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This analysis is for informational purposes only and is not medical advice. Always consult with healthcare professionals for medical concerns.
          </Text>
        </View>

        {/* Analysis Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ChartBarIcon size={20} color="#06b6d4" />
            <Text style={styles.cardTitle}>Analysis Status</Text>
          </View>

          <View style={styles.statusSection}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Data Processing</Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusValue}>
                  Analyzing {healthData?.dataProcessing.daysAnalyzed} days of health data
                </Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{healthData?.dataProcessing.status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Pattern Recognition</Text>
              <Text style={styles.progressPercentage}>{healthData?.patternRecognition.confidence}% confidence</Text>
              <View style={styles.progressBar}>
                <View
                style={[
                    styles.progressFill,
                    { width: healthData ? `${healthData.patternRecognition.confidence}%` : '0%' },
                ]}
                />
              </View>
            </View>

            <View style={styles.timestampSection}>
              <View style={styles.timestampItem}>
                <ClockIcon size={16} color="#94A3B8" />
                <Text style={styles.timestampText}>Last updated: {healthData?.lastUpdated}</Text>
              </View>
              <View style={styles.timestampItem}>
                <CalendarIcon size={16} color="#94A3B8" />
                <Text style={styles.timestampText}>Next analysis: {healthData?.nextAnalysis}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Risk Signals */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ExclamationTriangleIcon size={20} color="#06b6d4" />
            <Text style={styles.cardTitle}>Risk Signals</Text>
          </View>

          <View style={styles.riskSignalsContainer}>
            {healthData?.riskSignals.map((signal, index) => (
              <View key={index} style={[styles.riskCard, { backgroundColor: signal.color }]}>
                <View style={styles.riskHeader}>
                  <ExclamationTriangleIcon size={20} color="#FCA5A5" />
                  <Text style={styles.riskTitle}>{signal.title}</Text>
                </View>
                <View style={styles.riskBadge}>
                  <Text style={styles.riskBadgeText}>{signal.level}</Text>
                </View>
                <Text style={styles.riskDescription}>{signal.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={[styles.card, styles.lastCard]}>
          <View style={styles.cardHeader}>
            <ChartBarIcon size={20} color="#06b6d4" />
            <Text style={styles.cardTitle}>Recommended Actions</Text>
          </View>

          <View style={styles.recommendationsContainer}>
            {healthData?.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationLeft}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(rec.priority) }]} />
                    <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  </View>
                  <View style={[styles.priorityBadge, { borderColor: getPriorityColor(rec.priority) }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(rec.priority) }]}>
                      {rec.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.recommendationDescription}>{rec.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  disclaimerCard: {
    backgroundColor: '#78350F',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#92400E',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FDE68A',
    marginLeft: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#FEF3C7',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  lastCard: {
    marginBottom: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  statusSection: {
    gap: 20,
  },
  statusItem: {
    gap: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 14,
    color: '#94A3B8',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressSection: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#94A3B8',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  timestampSection: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  timestampItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestampText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  riskSignalsContainer: {
    gap: 16,
  },
  riskCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FCA5A5',
    marginLeft: 8,
    flex: 1,
  },
  riskBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCA5A5',
    letterSpacing: 0.5,
  },
  riskDescription: {
    fontSize: 14,
    color: '#FCA5A5',
    lineHeight: 20,
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationCard: {
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
});