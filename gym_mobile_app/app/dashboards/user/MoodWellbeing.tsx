import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
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
  PhoneIcon,
  ExclamationTriangleIcon,
} from 'react-native-heroicons/outline';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import WellnessRecommendation from './WellnessRecommendation';

const screenWidth = Dimensions.get('window').width;

export default function MoodWellbeing() {
 const [activeTab, setActiveTab] = useState<'log' | 'analysis' | 'tips' | 'recommendations'>('log');
  const [selectedMood, setSelectedMood] = useState<string>('good');
  const [moodRating, setMoodRating] = useState(7);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  
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

  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
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
                setMoodRating(mood.rating); // Add this line
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
      
      // Update selected mood based on rating
      const mood = moods.find(m => Math.abs(m.rating - newRating) <= 2) || moods[1];
      setSelectedMood(mood.id);
    }}
    onResponderMove={(e) => {
      const locationX = e.nativeEvent.locationX;
      const sliderWidth = screenWidth - 112;
      const newRating = Math.round((locationX / sliderWidth) * 10);
      setMoodRating(Math.max(1, Math.min(10, newRating)));
      
      // Update selected mood based on rating
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

          <Text style={styles.factorsTitle}>What's affecting your mood today?</Text>

          <View style={styles.factorsGrid}>
            {factors.map((factor) => {
              const Icon = factor.icon;
              const isSelected = selectedFactors.includes(factor.id);
              return (
                <TouchableOpacity
                  key={factor.id}
                  style={[
                    styles.factorCard,
                    isSelected && { 
                      backgroundColor: `${factor.color}20`,
                      borderColor: factor.color
                    }
                  ]}
                  onPress={() => toggleFactor(factor.id)}
                >
                  <Icon size={20} color={factor.color} />
                  <Text style={styles.factorLabel}>{factor.label}</Text>
                </TouchableOpacity>
              );
            })}
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

          <TouchableOpacity style={styles.logButton}>
            <Text style={styles.logButtonText}>Log Mood Entry</Text>
          </TouchableOpacity>
        </View>
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

  const renderAITipsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Quick Mood Boost */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <BoltIcon size={20} color="#F59E0B" />
          <Text style={styles.tipTitle}>Quick Mood Boost</Text>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>Immediate</Text>
          </View>
        </View>
        <Text style={styles.tipDescription}>
          Try a 5-minute breathing exercise or step outside for fresh air
        </Text>
        <TouchableOpacity style={styles.tipButton}>
          <Text style={styles.tipButtonText}>Start Exercise</Text>
        </TouchableOpacity>
      </View>

      {/* Sleep Optimization */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <MoonIcon size={20} color="#8B5CF6" />
          <Text style={styles.tipTitle}>Sleep Optimization</Text>
          <View style={[styles.timeBadge, { backgroundColor: '#1E3A8A' }]}>
            <Text style={styles.timeText}>Daily</Text>
          </View>
        </View>
        <Text style={styles.tipDescription}>
          Your mood correlates strongly with sleep. Aim for bed by 10 PM tonight
        </Text>
        <TouchableOpacity style={[styles.tipButton, { backgroundColor: '#334155' }]}>
          <Text style={styles.tipButtonText}>Set Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Social Connection */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <HeartIcon size={20} color="#EC4899" />
          <Text style={styles.tipTitle}>Social Connection</Text>
          <View style={[styles.timeBadge, { backgroundColor: '#581C87' }]}>
            <Text style={styles.timeText}>Weekly</Text>
          </View>
        </View>
        <Text style={styles.tipDescription}>
          Plan a coffee date or call a friend this week to boost mood
        </Text>
        <TouchableOpacity style={[styles.tipButton, { backgroundColor: '#334155' }]}>
          <Text style={styles.tipButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Consider Support */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <ExclamationTriangleIcon size={20} color="#F97316" />
          <Text style={styles.tipTitle}>Consider Support</Text>
          <View style={[styles.timeBadge, { backgroundColor: '#7C2D12' }]}>
            <Text style={styles.timeText}>Professional</Text>
          </View>
        </View>
        <Text style={styles.tipDescription}>
          Your mood has been consistently low. Consider talking to Dr. Chen
        </Text>
        <TouchableOpacity style={[styles.tipButton, { backgroundColor: '#334155' }]}>
          <Text style={styles.tipButtonText}>Book Session</Text>
        </TouchableOpacity>
      </View>

      {/* Crisis Support */}
      <View style={styles.crisisCard}>
        <View style={styles.crisisHeader}>
          <ExclamationTriangleIcon size={24} color="#F59E0B" />
          <Text style={styles.crisisTitle}>Need Additional Support?</Text>
        </View>
        <Text style={styles.crisisText}>
          If you're experiencing persistent low mood or thoughts of self-harm, please reach out to a healthcare professional immediately.
        </Text>
        <View style={styles.crisisButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Care Team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.crisisHelplineButton}>
            <Text style={styles.crisisHelplineText}>Crisis Helpline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

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
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
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
      {activeTab === 'tips' && renderAITipsTab()}
      {activeTab === 'recommendations' && <WellnessRecommendation />} 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  tipCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  timeBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#60A5FA',
  },
  tipDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipButton: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  crisisCard: {
    backgroundColor: '#7C2D12',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#92400E',
  },
  crisisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  crisisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEF3C7',
    marginLeft: 10,
  },
  crisisText: {
    fontSize: 14,
    color: '#FEF3C7',
    lineHeight: 20,
    marginBottom: 16,
  },
  crisisButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#06b6d4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  crisisHelplineButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  crisisHelplineText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#FFFFFF',
  },
});
