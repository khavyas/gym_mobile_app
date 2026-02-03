import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeftIcon,
  CalendarIcon,
  HeartIcon,
  SparklesIcon,
  ChartBarIcon,
  BellIcon,
  PlusIcon,
  CheckCircleIcon,
} from 'react-native-heroicons/outline';
import { Animated } from 'react-native';

const { width } = Dimensions.get('window');

// API Configuration
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

// Types
interface CycleData {
  periodStartDate: string;
  periodEndDate?: string;
  cycleLength?: number;
  periodLength?: number;
  symptoms?: Symptom[];
  flowIntensity?: FlowIntensity[];
  notes?: string;
}

interface Symptom {
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
}

interface FlowIntensity {
  date: string;
  intensity: 'light' | 'medium' | 'heavy';
}

interface CycleInsights {
  nextPeriodDate: string | null;
  daysUntilNextPeriod: number | null;
  fertileWindow: {
    start: string | null;
    end: string | null;
    ovulationDate: string | null;
  };
  cycleStats: {
    averageCycleLength: number;
    averagePeriodLength: number;
    cycleRegularity: 'regular' | 'irregular' | 'unknown';
    totalCyclesTracked: number;
  };
  commonSymptoms: Array<{ symptom: string; occurrences: number }>;
  lastPeriod: {
    startDate: string | null;
    endDate: string | null;
  };
}

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ visible, message, onHide, type = 'success' }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const isError = type === 'error';

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <View style={[styles.toastContent, isError && styles.toastError]}>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function MenstrualCycleTracker() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<CycleInsights | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [enablingTracking, setEnablingTracking] = useState(false);

  // Enable tracking state
  const [averageCycleLength, setAverageCycleLength] = useState('28');
  const [averagePeriodLength, setAveragePeriodLength] = useState('5');

  // Log period state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const SYMPTOM_OPTIONS = [
    'cramps',
    'headache',
    'bloating',
    'mood_swings',
    'fatigue',
    'breast_tenderness',
    'acne',
    'back_pain',
    'nausea',
    'food_cravings',
    'insomnia',
    'anxiety',
  ];

  useEffect(() => {
    loadCycleData();
  }, []);

  const loadCycleData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        showToastMessage('Please login to continue', 'error');
        router.back();
        return;
      }

      // Check if tracking is enabled by trying to fetch insights
      const response = await fetch(`${API_BASE_URL}/menstrual-cycle/insights`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInsights(data.data);
          setIsTracking(true);
          setShowEnableModal(false); // ✅ Make sure modal is hidden when tracking is enabled
        }
      } else if (response.status === 400) {
        // ✅ FIX: Tracking not enabled - show modal and STOP loading
        const errorData = await response.json();
        console.log('Tracking not enabled:', errorData.message);
        setIsTracking(false);
        setShowEnableModal(true);
      } else {
        // Other errors
        const errorData = await response.json();
        showToastMessage(errorData.message || 'Failed to load cycle data', 'error');
      }
    } catch (error) {
      console.error('Error loading cycle data:', error);
      showToastMessage('Failed to load cycle data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const enableTracking = async () => {
    // ✅ Validation
    const cycleLength = parseInt(averageCycleLength);
    const periodLength = parseInt(averagePeriodLength);

    if (isNaN(cycleLength) || cycleLength < 21 || cycleLength > 35) {
      showToastMessage('Please enter a valid cycle length (21-35 days)', 'error');
      return;
    }

    if (isNaN(periodLength) || periodLength < 2 || periodLength > 10) {
      showToastMessage('Please enter a valid period length (2-10 days)', 'error');
      return;
    }

    try {
      setEnablingTracking(true);
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(`${API_BASE_URL}/menstrual-cycle/enable`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          averageCycleLength: cycleLength,
          averagePeriodLength: periodLength,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsTracking(true);
        setShowEnableModal(false);
        showToastMessage('Cycle tracking enabled successfully!', 'success');
        // ✅ Reload data after enabling
        await loadCycleData();
      } else {
        showToastMessage(data.message || 'Failed to enable tracking', 'error');
      }
    } catch (error) {
      console.error('Error enabling tracking:', error);
      showToastMessage('Failed to enable tracking', 'error');
    } finally {
      setEnablingTracking(false);
    }
  };

  const logPeriod = async () => {
    if (!startDate) {
      showToastMessage('Please enter the start date', 'error');
      return;
    }

    // ✅ Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      showToastMessage('Please use YYYY-MM-DD format for start date', 'error');
      return;
    }

    if (endDate && !dateRegex.test(endDate)) {
      showToastMessage('Please use YYYY-MM-DD format for end date', 'error');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');

      const symptoms = selectedSymptoms.map((symptom) => ({
        type: symptom,
        severity: 'moderate' as const,
        date: startDate,
      }));

      const response = await fetch(`${API_BASE_URL}/menstrual-cycle/log-period`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate: endDate || null,
          symptoms,
          notes,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToastMessage('Period logged successfully!', 'success');
        setShowLogModal(false);
        // Reset form
        setStartDate('');
        setEndDate('');
        setSelectedSymptoms([]);
        setNotes('');
        // Reload data
        loadCycleData();
      } else {
        showToastMessage(data.message || 'Failed to log period', 'error');
      }
    } catch (error) {
      console.error('Error logging period:', error);
      showToastMessage('Failed to log period', 'error');
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysText = (days: number | null) => {
    if (days === null) return 'Unknown';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return `${Math.abs(days)} days ago`;
    return `In ${days} days`;
  };

  const getCurrentPhase = () => {
    if (!insights) return 'Unknown';
    const { daysUntilNextPeriod, cycleStats } = insights;
    
    if (daysUntilNextPeriod === null) return 'Unknown';
    
    const avgCycle = cycleStats.averageCycleLength;
    const daysFromStart = avgCycle - daysUntilNextPeriod;
    
    if (daysFromStart <= 5) return 'Menstrual';
    if (daysFromStart <= avgCycle / 2) return 'Follicular';
    if (daysFromStart <= (avgCycle / 2) + 3) return 'Ovulation';
    return 'Luteal';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Menstrual': return '#EF4444';
      case 'Follicular': return '#10B981';
      case 'Ovulation': return '#F59E0B';
      case 'Luteal': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EC4899" />
          <Text style={styles.loadingText}>Loading cycle data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Toast
        visible={showToast}
        message={toastMessage}
        type={toastType}
        onHide={() => setShowToast(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle Tracker</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Enable Tracking Modal */}
      <Modal
        visible={showEnableModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          // ✅ Prevent dismissing without action
          setShowEnableModal(false);
          router.back();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🩸 Enable Cycle Tracking</Text>
            <Text style={styles.modalSubtitle}>
              Start tracking your menstrual cycle to get personalized insights and predictions
            </Text>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Average Cycle Length (days)</Text>
              <TextInput
                style={styles.modalInput}
                value={averageCycleLength}
                onChangeText={setAverageCycleLength}
                keyboardType="numeric"
                placeholder="28"
                placeholderTextColor="#6B7280"
              />
              <Text style={styles.helperText}>Typical range: 21-35 days</Text>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Average Period Length (days)</Text>
              <TextInput
                style={styles.modalInput}
                value={averagePeriodLength}
                onChangeText={setAveragePeriodLength}
                keyboardType="numeric"
                placeholder="5"
                placeholderTextColor="#6B7280"
              />
              <Text style={styles.helperText}>Typical range: 2-10 days</Text>
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, enablingTracking && styles.modalButtonDisabled]} 
              onPress={enableTracking}
              disabled={enablingTracking}
            >
              {enablingTracking ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.modalButtonText}>Enable Tracking</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowEnableModal(false);
                router.back();
              }}
              disabled={enablingTracking}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Log Period Modal */}
      <Modal
        visible={showLogModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLogModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.logModalScroll}>
            <View style={styles.logModalContainer}>
              <Text style={styles.modalTitle}>📅 Log Period</Text>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Start Date *</Text>
                <TextInput
                  style={styles.modalInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6B7280"
                />
                <Text style={styles.helperText}>Example: 2026-02-03</Text>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>End Date (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6B7280"
                />
                <Text style={styles.helperText}>Example: 2026-02-08</Text>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Symptoms</Text>
                <View style={styles.symptomsContainer}>
                  {SYMPTOM_OPTIONS.map((symptom) => (
                    <TouchableOpacity
                      key={symptom}
                      style={[
                        styles.symptomChip,
                        selectedSymptoms.includes(symptom) && styles.symptomChipSelected,
                      ]}
                      onPress={() => toggleSymptom(symptom)}
                    >
                      <Text
                        style={[
                          styles.symptomChipText,
                          selectedSymptoms.includes(symptom) && styles.symptomChipTextSelected,
                        ]}
                      >
                        {symptom.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Notes</Text>
                <TextInput
                  style={[styles.modalInput, styles.notesInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional notes..."
                  placeholderTextColor="#6B7280"
                  multiline
                />
              </View>

              <TouchableOpacity style={styles.modalButton} onPress={logPeriod}>
                <Text style={styles.modalButtonText}>Log Period</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ✅ Show content only when tracking is enabled */}
      {isTracking && insights ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Current Phase Card */}
          <View style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <SparklesIcon size={24} color={getPhaseColor(getCurrentPhase())} />
              <Text style={styles.phaseTitle}>Current Phase</Text>
            </View>
            <View
              style={[
                styles.phaseBadge,
                { backgroundColor: `${getPhaseColor(getCurrentPhase())}20` },
              ]}
            >
              <Text
                style={[styles.phaseText, { color: getPhaseColor(getCurrentPhase()) }]}
              >
                {getCurrentPhase()}
              </Text>
            </View>
          </View>

          {/* Next Period Countdown */}
          <View style={styles.countdownCard}>
            <View style={styles.countdownHeader}>
              <CalendarIcon size={24} color="#EC4899" />
              <Text style={styles.countdownTitle}>Next Period</Text>
            </View>
            <Text style={styles.countdownDays}>
              {getDaysText(insights.daysUntilNextPeriod)}
            </Text>
            <Text style={styles.countdownDate}>
              {formatDate(insights.nextPeriodDate)}
            </Text>
          </View>

          {/* Fertile Window Card */}
          <View style={styles.fertileCard}>
            <View style={styles.fertileHeader}>
              <HeartIcon size={24} color="#F59E0B" />
              <Text style={styles.fertileTitle}>Fertile Window</Text>
            </View>
            <View style={styles.fertileContent}>
              <View style={styles.fertileItem}>
                <Text style={styles.fertileLabel}>Start</Text>
                <Text style={styles.fertileValue}>
                  {formatDate(insights.fertileWindow.start)}
                </Text>
              </View>
              <View style={styles.fertileDivider} />
              <View style={styles.fertileItem}>
                <Text style={styles.fertileLabel}>Ovulation</Text>
                <Text style={styles.fertileValue}>
                  {formatDate(insights.fertileWindow.ovulationDate)}
                </Text>
              </View>
              <View style={styles.fertileDivider} />
              <View style={styles.fertileItem}>
                <Text style={styles.fertileLabel}>End</Text>
                <Text style={styles.fertileValue}>
                  {formatDate(insights.fertileWindow.end)}
                </Text>
              </View>
            </View>
          </View>

          {/* Cycle Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <ChartBarIcon size={24} color="#10B981" />
              <Text style={styles.statsTitle}>Cycle Statistics</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{insights.cycleStats.averageCycleLength}</Text>
                <Text style={styles.statLabel}>Avg Cycle</Text>
                <Text style={styles.statUnit}>days</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{insights.cycleStats.averagePeriodLength}</Text>
                <Text style={styles.statLabel}>Avg Period</Text>
                <Text style={styles.statUnit}>days</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{insights.cycleStats.totalCyclesTracked}</Text>
                <Text style={styles.statLabel}>Cycles</Text>
                <Text style={styles.statUnit}>tracked</Text>
              </View>

              <View style={styles.statItem}>
                <View
                  style={[
                    styles.regularityBadge,
                    {
                      backgroundColor:
                        insights.cycleStats.cycleRegularity === 'regular'
                          ? '#10B98120'
                          : '#F59E0B20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.regularityText,
                      {
                        color:
                          insights.cycleStats.cycleRegularity === 'regular'
                            ? '#10B981'
                            : '#F59E0B',
                      },
                    ]}
                  >
                    {insights.cycleStats.cycleRegularity}
                  </Text>
                </View>
                <Text style={styles.statLabel}>Regularity</Text>
              </View>
            </View>
          </View>

          {/* Common Symptoms */}
          {insights.commonSymptoms.length > 0 && (
            <View style={styles.symptomsCard}>
              <Text style={styles.symptomsTitle}>Common Symptoms</Text>
              {insights.commonSymptoms.map((item, index) => (
                <View key={index} style={styles.symptomRow}>
                  <Text style={styles.symptomName}>
                    {item.symptom.replace(/_/g, ' ')}
                  </Text>
                  <View style={styles.symptomBarContainer}>
                    <View
                      style={[
                        styles.symptomBar,
                        {
                          width: `${(item.occurrences / insights.cycleStats.totalCyclesTracked) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.symptomCount}>{item.occurrences}x</Text>
                </View>
              ))}
            </View>
          )}

          {/* Last Period Info */}
          <View style={styles.lastPeriodCard}>
            <Text style={styles.lastPeriodTitle}>Last Period</Text>
            <View style={styles.lastPeriodContent}>
              <View style={styles.lastPeriodItem}>
                <Text style={styles.lastPeriodLabel}>Started</Text>
                <Text style={styles.lastPeriodValue}>
                  {formatDate(insights.lastPeriod.startDate)}
                </Text>
              </View>
              {insights.lastPeriod.endDate && (
                <View style={styles.lastPeriodItem}>
                  <Text style={styles.lastPeriodLabel}>Ended</Text>
                  <Text style={styles.lastPeriodValue}>
                    {formatDate(insights.lastPeriod.endDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Health Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Cycle Insights</Text>
            <View style={styles.tipItem}>
              <CheckCircleIcon size={20} color="#10B981" />
              <Text style={styles.tipText}>
                {getCurrentPhase() === 'Follicular' &&
                  'Great time for high-energy workouts and trying new activities'}
                {getCurrentPhase() === 'Ovulation' &&
                  'Peak energy levels - perfect for intense training sessions'}
                {getCurrentPhase() === 'Luteal' &&
                  'Focus on moderate exercise and self-care activities'}
                {getCurrentPhase() === 'Menstrual' &&
                  'Gentle movement like yoga and walking is beneficial'}
              </Text>
            </View>
            <View style={styles.tipItem}>
              <CheckCircleIcon size={20} color="#10B981" />
              <Text style={styles.tipText}>
                Tracking your cycle helps identify patterns and optimize your wellness routine
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        // ✅ Show empty state when tracking is not enabled
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Enable cycle tracking to start monitoring your menstrual health
          </Text>
        </View>
      )}

      {/* Floating Action Button */}
      {isTracking && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowLogModal(true)}
        >
          <PlusIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  toastContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastError: {
    backgroundColor: '#EF4444',
  },
  toastMessage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
  },
  logModalScroll: {
    flex: 1,
  },
  logModalContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    marginVertical: 40,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  symptomChipSelected: {
    backgroundColor: '#EC489920',
    borderColor: '#EC4899',
  },
  symptomChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  symptomChipTextSelected: {
    color: '#EC4899',
  },
  modalButton: {
    backgroundColor: '#EC4899',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 12,
  },
  modalCancelText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  phaseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  phaseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  phaseText: {
    fontSize: 18,
    fontWeight: '700',
  },
  countdownCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  countdownDays: {
    fontSize: 36,
    fontWeight: '700',
    color: '#EC4899',
    marginBottom: 8,
  },
  countdownDate: {
    fontSize: 14,
    color: '#94A3B8',
  },
  fertileCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  fertileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fertileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  fertileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fertileItem: {
    flex: 1,
    alignItems: 'center',
  },
  fertileDivider: {
    width: 1,
    backgroundColor: '#374151',
    marginHorizontal: 12,
  },
  fertileLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  fertileValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: '#6B7280',
  },
  regularityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  regularityText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  symptomsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  symptomsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomName: {
    fontSize: 14,
    color: '#E5E7EB',
    width: 120,
    textTransform: 'capitalize',
  },
  symptomBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  symptomBar: {
    height: '100%',
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  symptomCount: {
    fontSize: 12,
    color: '#94A3B8',
    width: 30,
    textAlign: 'right',
  },
  lastPeriodCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  lastPeriodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  lastPeriodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastPeriodItem: {
    flex: 1,
  },
  lastPeriodLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  lastPeriodValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  tipsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 12,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EC4899',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});