import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useState } from 'react';
import { CalendarIcon, FireIcon, ClockIcon, HeartIcon, TrophyIcon, ArrowTrendingUpIcon } from 'react-native-heroicons/outline';

const screenWidth = Dimensions.get('window').width;

export default function ProgressOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  
  // Sample data - in a real app, this would come from your backend
  const workoutData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [45, 60, 30, 75, 90, 50, 70],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const calorieData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [320, 450, 280, 510, 620, 380, 490]
      }
    ]
  };

  const progressData = {
    labels: ["Cardio", "Strength", "Flexibility"],
    data: [0.7, 0.5, 0.3]
  };

  const recentWorkouts = [
    { type: 'Strength', name: 'Chest & Triceps', duration: '45 min', calories: 320, date: 'Today' },
    { type: 'Cardio', name: 'Running', duration: '30 min', calories: 280, date: 'Yesterday' },
    { type: 'Yoga', name: 'Flexibility Flow', duration: '40 min', calories: 180, date: '2 days ago' },
    { type: 'Strength', name: 'Leg Day', duration: '55 min', calories: 420, date: '3 days ago' },
  ];

  const chartConfig = {
    backgroundColor: '#1F2937',
    backgroundGradientFrom: '#1F2937',
    backgroundGradientTo: '#374151',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#10B981"
    }
  };

  const progressChartConfig = {
    backgroundColor: '#1F2937',
    backgroundGradientFrom: '#1F2937',
    backgroundGradientTo: '#374151',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Progress Overview</Text>
      
      {/* Timeframe Selector */}
      <View style={styles.timeframeSelector}>
        <TouchableOpacity 
          style={[styles.timeframeButton, selectedTimeframe === 'week' && styles.activeTimeframe]}
          onPress={() => setSelectedTimeframe('week')}
        >
          <Text style={[styles.timeframeText, selectedTimeframe === 'week' && styles.activeTimeframeText]}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeframeButton, selectedTimeframe === 'month' && styles.activeTimeframe]}
          onPress={() => setSelectedTimeframe('month')}
        >
          <Text style={[styles.timeframeText, selectedTimeframe === 'month' && styles.activeTimeframeText]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.timeframeButton, selectedTimeframe === 'year' && styles.activeTimeframe]}
          onPress={() => setSelectedTimeframe('year')}
        >
          <Text style={[styles.timeframeText, selectedTimeframe === 'year' && styles.activeTimeframeText]}>Year</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <FireIcon size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>12,450</Text>
          <Text style={styles.statLabel}>Calories Burned</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <ClockIcon size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>28h 15m</Text>
          <Text style={styles.statLabel}>Total Workout Time</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrophyIcon size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>Workouts Completed</Text>
        </View>
      </View>

      {/* Workout Duration Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Workout Duration (Minutes)</Text>
        <LineChart
          data={workoutData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Calories Burned Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Calories Burned</Text>
        <BarChart
                  data={calorieData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={chartConfig}
                  style={styles.chart}
                  fromZero yAxisLabel={''} yAxisSuffix={''}        />
      </View>

      {/* Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Workout Distribution</Text>
        <ProgressChart
          data={progressData}
          width={screenWidth - 40}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={progressChartConfig}
          hideLegend={false}
          style={styles.chart}
        />
      </View>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {recentWorkouts.map((workout, index) => (
          <View key={index} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View style={[styles.workoutType, 
                {backgroundColor: workout.type === 'Strength' ? '#10B981' : 
                                 workout.type === 'Cardio' ? '#3B82F6' : '#8B5CF6'}]}>
                <Text style={styles.workoutTypeText}>{workout.type}</Text>
              </View>
              <Text style={styles.workoutDate}>{workout.date}</Text>
            </View>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View style={styles.workoutStats}>
              <View style={styles.workoutStat}>
                <ClockIcon size={16} color="#9CA3AF" />
                <Text style={styles.workoutStatText}>{workout.duration}</Text>
              </View>
              <View style={styles.workoutStat}>
                <FireIcon size={16} color="#9CA3AF" />
                <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsContainer}>
          <View style={styles.achievement}>
            <View style={styles.achievementIcon}>
              <TrophyIcon size={24} color="#F59E0B" />
            </View>
            <Text style={styles.achievementText}>7 Day Streak</Text>
          </View>
          <View style={styles.achievement}>
            <View style={styles.achievementIcon}>
              <HeartIcon size={24} color="#EF4444" />
            </View>
            <Text style={styles.achievementText}>Heart Healthy</Text>
          </View>
          <View style={styles.achievement}>
            <View style={styles.achievementIcon}>
              <ArrowTrendingUpIcon size={24} color="#10B981" />
            </View>
            <Text style={styles.achievementText}>Consistency</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#111827', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#10B981', 
    marginBottom: 20 
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTimeframe: {
    backgroundColor: '#10B981',
  },
  timeframeText: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTimeframeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statIcon: {
    backgroundColor: '#374151',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chartContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  workoutCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  workoutTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  workoutName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutStatText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievement: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  achievementIcon: {
    marginBottom: 8,
  },
  achievementText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
});