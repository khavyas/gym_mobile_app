import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  BoltIcon,
  HeartIcon,
  MoonIcon,
  UserGroupIcon,
  SunIcon,
  FireIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  FaceSmileIcon,
  BeakerIcon,
} from 'react-native-heroicons/outline';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import WellnessRecommendation from './WellnessRecommendation';

const screenWidth = Dimensions.get('window').width;

interface WellnessParams {
  physical: 'low' | 'moderate' | 'high';
  mental: 'low' | 'moderate' | 'high';
  emotional: 'low' | 'moderate' | 'high';
  nutritional: 'low' | 'moderate' | 'high';
  sleep: 'low' | 'moderate' | 'high';
}

// Toast Component Props Interface
interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

// Toast Component
const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
 
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastIcon}>✓</Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function MoodWellbeing() {
  const [activeTab, setActiveTab] = useState<'log' | 'analysis' | 'insights'>('log');
  const [selectedMood, setSelectedMood] = useState<string>('good');
  const [moodRating, setMoodRating] = useState(7);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [hasRatedWellness, setHasRatedWellness] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Wellness parameters state - now with three levels
  const [wellnessParams, setWellnessParams] = useState<WellnessParams>({
    physical: 'moderate',
    mental: 'moderate',
    emotional: 'moderate',
    nutritional: 'moderate',
    sleep: 'moderate',
  });

  const moods = [
    { id: 'great', label: 'Great', emoji: '😄', color: '#10B981', rating: 10 },
    { id: 'good', label: 'Good', emoji: '🙂', color: '#06b6d4', rating: 7 },
    { id: 'okay', label: 'Okay', emoji: '😐', color: '#F59E0B', rating: 5 },
    { id: 'low', label: 'Low', emoji: '😔', color: '#F97316', rating: 3 },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#8B5CF6', rating: 2 },
  ];

  const factors = [
    { id: 'sleep', label: 'Sleep Quality', icon: MoonIcon, color: '#8B5CF6' },
    { id: 'exercise', label: 'Exercise', icon: BoltIcon, color: '#10B981' },
    { id: 'social', label: 'Social Connection', icon: UserGroupIcon, color: '#06b6d4' },
    { id: 'stress', label: 'Work Stress', icon: FireIcon, color: '#F97316' },
    { id: 'weather', label: 'Weather', icon: SunIcon, color: '#F59E0B' },
    { id: 'nutrition', label: 'Nutrition', icon: HeartIcon, color: '#EC4899' },
  ];

const wellnessParameters = [
  { 
    id: 'physical', 
    label: 'Physical Wellness', 
    color: '#10B981',
    icon: BoltIcon,  // Lightning bolt for energy/physical
    emoji: '💪'
  },
  { 
    id: 'mental', 
    label: 'Mental Wellness', 
    color: '#06b6d4',
    icon: AcademicCapIcon,  // Brain/thinking icon
    emoji: '🧠'
  },
  { 
    id: 'emotional', 
    label: 'Emotional Wellness', 
    color: '#8B5CF6',
    icon: HeartIcon,  // Heart for emotions
    emoji: '❤️'
  },
  { 
    id: 'nutritional', 
    label: 'Nutritional Wellness', 
    color: '#F59E0B',
    icon: BeakerIcon,  // Flask for nutrition/chemistry
    emoji: '🥗'
  },
  { 
    id: 'sleep', 
    label: 'Sleep Wellness', 
    color: '#EC4899',
    icon: MoonIcon,  // Moon for sleep
    emoji: '😴'
  },
];

  const wellnessLevels: Array<'low' | 'moderate' | 'high'> = ['low', 'moderate', 'high'];

  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
    );
  };

  const updateWellnessParam = (param: string, value: 'low' | 'moderate' | 'high') => {
    setWellnessParams(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleShowResults = () => {
    setHasRatedWellness(true);
    setActiveTab('insights');
    setToastMessage('Wellness assessment completed! 🎉');
    setShowToast(true);
  };

  const handleLogMood = () => {
    setToastMessage('Mood logged successfully! 📝');
    setShowToast(true);
  };

const renderWellnessSelector = (param: { 
  id: string; 
  label: string; 
  color: string; 
  icon: any;
  emoji: string;
}) => {
  const value = wellnessParams[param.id as keyof typeof wellnessParams];
  const levelIndex = wellnessLevels.indexOf(value);
  const IconComponent = param.icon;
  
  return (
    <View key={param.id} style={styles.wellnessParamContainer}>
      <View style={styles.wellnessParamHeader}>
        <View style={styles.wellnessParamTitleContainer}>
          {/* Icon with colored background */}
          <View style={[styles.wellnessIconContainer, { backgroundColor: `${param.color}20` }]}>
            <IconComponent size={20} color={param.color} />
          </View>
          <Text style={styles.wellnessParamLabel}>{param.label}</Text>
        </View>
        <View style={[styles.wellnessLevelBadge, { backgroundColor: `${param.color}20` }]}>
          <Text style={[styles.wellnessLevelBadgeText, { color: param.color }]}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.wellnessTrackContainer}>
        {/* Track with 3 segments */}
        <View style={styles.wellnessTrack}>
          {wellnessLevels.map((level, index) => {
            const isActive = index <= levelIndex;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.wellnessSegment,
                  isActive && { backgroundColor: param.color },
                  index === 0 && styles.segmentFirst,
                  index === wellnessLevels.length - 1 && styles.segmentLast,
                ]}
                onPress={() => updateWellnessParam(param.id, level)}
                activeOpacity={0.7}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.wellnessLabelsContainer}>
        {wellnessLevels.map((level) => (
          <Text key={level} style={styles.wellnessLevelLabel}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Text>
        ))}
      </View>
    </View>
  );
};

  const renderLogMoodTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Quick Mood Check */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <BoltIcon size={20} color="#F59E0B" />
          <Text style={styles.cardTitle}>Quick Mood Check</Text>
        </View>

        <View style={styles.moodButtonsContainer}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                selectedMood === mood.id && { 
                  borderColor: mood.color,
                  backgroundColor: `${mood.color}20`
                }
              ]}
              onPress={() => {
                setSelectedMood(mood.id);
                setMoodRating(mood.rating);
              }}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Detailed Mood Entry */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <SparklesIcon size={20} color="#8B5CF6" />
          <Text style={styles.cardTitle}>Detailed Mood Entry</Text>
        </View>

        <View style={styles.detailedSection}>
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingQuestion}>How are you feeling?</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingEmoji}>
                {moods.find(m => m.id === selectedMood)?.emoji || '🙂'}
              </Text>
              <Text style={styles.ratingValue}>{moodRating}/10</Text>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <View 
              onStartShouldSetResponder={() => true}
              onResponderGrant={(e) => {
                const locationX = e.nativeEvent.locationX;
                const sliderWidth = screenWidth - 112;
                const newRating = Math.round((locationX / sliderWidth) * 10);
                setMoodRating(Math.max(1, Math.min(10, newRating)));
                
                const mood = moods.find(m => Math.abs(m.rating - newRating) <= 2) || moods[1];
                setSelectedMood(mood.id);
              }}
              onResponderMove={(e) => {
                const locationX = e.nativeEvent.locationX;
                const sliderWidth = screenWidth - 112;
                const newRating = Math.round((locationX / sliderWidth) * 10);
                setMoodRating(Math.max(1, Math.min(10, newRating)));
                
                const mood = moods.find(m => Math.abs(m.rating - newRating) <= 2) || moods[1];
                setSelectedMood(mood.id);
              }}
            >
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${(moodRating / 10) * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${(moodRating / 10) * 100}%` }]} />
              </View>
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Very Low</Text>
              <Text style={styles.sliderLabel}>Excellent</Text>
            </View>
          </View>

         
         
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="What's on your mind? Any specific thoughts or events..."
              placeholderTextColor="#64748B"
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <TouchableOpacity 
            style={styles.logButton}
            onPress={handleLogMood}
          >
            <Text style={styles.logButtonText}>Log Mood Entry</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wellness Parameters Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HeartIcon size={20} color="#EC4899" />
          <Text style={styles.cardTitle}>Rate Your Wellness</Text>
        </View>

        <Text style={styles.wellnessDescription}>
          Select the level for each wellness dimension to get personalized insights
        </Text>

        <View style={styles.wellnessParamsWrapper}>
          {wellnessParameters.map(param => renderWellnessSelector(param))}
        </View>

        <TouchableOpacity 
          style={styles.showResultsButton}
          onPress={handleShowResults}
        >
          <Text style={styles.showResultsButtonText}>Show My Wellness Results</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAnalysisTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Current Mood Status */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HeartIcon size={20} color="#EC4899" />
          <Text style={styles.cardTitle}>Current Mood Status</Text>
        </View>

        <View style={styles.moodStatusContainer}>
          <View style={styles.currentMoodCard}>
            <Text style={styles.moodStatusEmoji}>🙂</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendIcon}>↗</Text>
            </View>
            <Text style={styles.currentMoodValue}>7.2/10</Text>
            <Text style={styles.currentMoodLabel}>Current Mood</Text>
          </View>

          <View style={styles.weeklyMoodCard}>
            <Text style={styles.weeklyValue}>6.8/10</Text>
            <Text style={styles.weeklyLabel}>Weekly Average</Text>
            <View style={styles.improvingBadge}>
              <Text style={styles.improvingText}>improving</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 7-Day Mood Trends */}
      <View style={styles.card}>
        <Text style={styles.chartTitle}>7-Day Mood Trends</Text>
        
        <LineChart
          data={{
            labels: ['10/02', '10/03', '10/04', '10/05', '10/06', '10/07'],
            datasets: [
              {
                data: [6.5, 6.8, 7.2, 6.4, 7.8, 7.5],
                color: () => '#10B981',
                strokeWidth: 2,
              },
              {
                data: [7.0, 6.5, 6.0, 6.8, 7.2, 7.0],
                color: () => '#06b6d4',
                strokeWidth: 2,
              },
              {
                data: [5.5, 6.0, 5.8, 5.5, 6.2, 6.5],
                color: () => '#F59E0B',
                strokeWidth: 2,
              },
            ],
            legend: ['Mood', 'Energy', 'Stress'],
          }}
          width={screenWidth - 72}
          height={220}
          chartConfig={{
            backgroundColor: '#1E293B',
            backgroundGradientFrom: '#1E293B',
            backgroundGradientTo: '#1E293B',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
            },
          }}
          bezier
          style={styles.chart}
        />

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Mood</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#06b6d4' }]} />
            <Text style={styles.legendText}>Energy</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Stress</Text>
          </View>
        </View>
      </View>

      {/* What Affects Your Mood Most */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What Affects Your Mood Most</Text>

        <View style={styles.correlationItem}>
          <View style={styles.correlationHeader}>
            <Text style={styles.correlationLabel}>Sleep</Text>
            <View style={styles.impactBadge}>
              <Text style={styles.impactText}>high impact</Text>
            </View>
          </View>
          <Text style={styles.correlationSubtext}>Correlation</Text>
          <View style={styles.correlationBar}>
            <View style={[styles.correlationFill, { width: '85%', backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.correlationPercentage}>85%</Text>
        </View>

        <View style={styles.correlationItem}>
          <View style={styles.correlationHeader}>
            <Text style={styles.correlationLabel}>Exercise</Text>
            <View style={[styles.impactBadge, { backgroundColor: '#78350F' }]}>
              <Text style={styles.impactText}>medium impact</Text>
            </View>
          </View>
          <Text style={styles.correlationSubtext}>Correlation</Text>
          <View style={styles.correlationBar}>
            <View style={[styles.correlationFill, { width: '72%', backgroundColor: '#06b6d4' }]} />
          </View>
          <Text style={styles.correlationPercentage}>72%</Text>
        </View>

        <View style={styles.correlationItem}>
          <View style={styles.correlationHeader}>
            <Text style={styles.correlationLabel}>Social</Text>
            <View style={[styles.impactBadge, { backgroundColor: '#78350F' }]}>
              <Text style={styles.impactText}>medium impact</Text>
            </View>
          </View>
          <Text style={styles.correlationSubtext}>Correlation</Text>
          <View style={styles.correlationBar}>
            <View style={[styles.correlationFill, { width: '68%', backgroundColor: '#8B5CF6' }]} />
          </View>
          <Text style={styles.correlationPercentage}>68%</Text>
        </View>
      </View>
    </ScrollView>
  );

  // Convert wellness levels to numeric scores for the recommendation component
  const convertLevelToScore = (level: 'low' | 'moderate' | 'high'): number => {
    switch (level) {
      case 'low':
        return 3;
      case 'moderate':
        return 6;
      case 'high':
        return 9;
      default:
        return 6;
    }
  };

  const getNumericWellnessParams = () => ({
    physical: convertLevelToScore(wellnessParams.physical),
    mental: convertLevelToScore(wellnessParams.mental),
    emotional: convertLevelToScore(wellnessParams.emotional),
    nutritional: convertLevelToScore(wellnessParams.nutritional),
    sleep: convertLevelToScore(wellnessParams.sleep),
  });

  const renderInsightsTab = () => {
    if (!hasRatedWellness) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateCard}>
            <HeartIcon size={64} color="#64748B" />
            <Text style={styles.emptyStateTitle}>No Wellness Data Yet</Text>
            <Text style={styles.emptyStateDescription}>
              Rate your wellness dimensions in the "Log Mood" tab to see personalized insights and recommendations.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setActiveTab('log')}
            >
              <Text style={styles.emptyStateButtonText}>Go to Log Mood</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return <WellnessRecommendation wellnessParams={getNumericWellnessParams()} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Toast Notification */}
      <Toast 
        visible={showToast} 
        message={toastMessage} 
        onHide={() => setShowToast(false)} 
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mood & Wellbeing</Text>
        <Text style={styles.headerSubtitle}>
          Track your mental health and get personalized recommendations
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'log' && styles.activeTab]}
          onPress={() => setActiveTab('log')}
        >
          <Text style={[styles.tabText, activeTab === 'log' && styles.activeTabText]}>
            Log Mood
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
            Insights
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'analysis' && styles.activeTab]}
          onPress={() => setActiveTab('analysis')}
        >
          <Text style={[styles.tabText, activeTab === 'analysis' && styles.activeTabText]}>
            Analysis
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'log' && renderLogMoodTab()}
      {activeTab === 'analysis' && renderAnalysisTab()}
      {activeTab === 'insights' && renderInsightsTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wellnessParamTitleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},
wellnessIconContainer: {
  width: 36,
  height: 36,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
},
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#334155',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  moodButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  detailedSection: {
    gap: 20,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingEmoji: {
    fontSize: 24,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sliderContainer: {
    gap: 8,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#06b6d4',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#06b6d4',
    borderRadius: 10,
    top: -6,
    marginLeft: -10,
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  factorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  factorCard: {
    width: '48%',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  factorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
  },
  notesSection: {
    gap: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  notesInput: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  logButton: {
    backgroundColor: '#00c48c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  wellnessDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
  },
  wellnessParamsWrapper: {
    gap: 24,
    marginBottom: 24,
  },
  wellnessParamContainer: {
    gap: 12,
  },
  wellnessParamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wellnessParamLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  wellnessLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  wellnessLevelBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  wellnessTrackContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  wellnessTrack: {
    flexDirection: 'row',
    height: 12,
    gap: 4,
  },
  wellnessSegment: {
    flex: 1,
    backgroundColor: '#334155',
  },
  segmentFirst: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  segmentLast: {
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  wellnessTapAreas: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wellnessTapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  wellnessLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  wellnessLevelLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  // Remove old button styles
  wellnessOptionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  wellnessOption: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  wellnessRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  wellnessOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  showResultsButton: {
    backgroundColor: '#00c48c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  showResultsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moodStatusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  currentMoodCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  moodStatusEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  trendBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  trendIcon: {
    fontSize: 20,
    color: '#10B981',
  },
  currentMoodValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  currentMoodLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  weeklyMoodCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  weeklyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  weeklyLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  improvingBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  improvingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  correlationItem: {
    marginBottom: 24,
  },
  correlationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  correlationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  impactBadge: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  impactText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  correlationSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  correlationBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    marginBottom: 8,
  },
  correlationFill: {
    height: '100%',
    borderRadius: 4,
  },
  correlationPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: '#065F46',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastIcon: {
    fontSize: 20,
    color: '#10B981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  toastMessage: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});