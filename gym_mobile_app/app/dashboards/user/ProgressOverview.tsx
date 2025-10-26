import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useState } from 'react';
import { CalendarIcon, FireIcon, ClockIcon, HeartIcon, TrophyIcon, ArrowTrendingUpIcon } from 'react-native-heroicons/outline';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 72; // 40 (container padding) + 32 (chart container padding 16*2)

export default function ProgressOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  
  // Data for different timeframes
  const timeframeData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      workoutDurations: [45, 60, 30, 75, 90, 50, 70],
      calories: [320, 450, 280, 510, 620, 380, 490],
      stats: {
        totalCalories: '3,050',
        totalTime: '7h 00m',
        workoutsCompleted: 7
      },
      progressData: {
        labels: ["Cardio", "Strength", "Flexibility"],
        data: [0.7, 0.5, 0.3]
      },
      recentWorkouts: [
        { type: 'Strength', name: 'Chest & Triceps', duration: '45 min', calories: 320, date: 'Today' },
        { type: 'Cardio', name: 'Running', duration: '30 min', calories: 280, date: 'Yesterday' },
        { type: 'Yoga', name: 'Flexibility Flow', duration: '40 min', calories: 180, date: '2 days ago' },
        { type: 'Strength', name: 'Leg Day', duration: '55 min', calories: 420, date: '3 days ago' },
      ]
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      workoutDurations: [280, 350, 320, 400],
      calories: [2100, 2650, 2400, 3100],
      stats: {
        totalCalories: '10,250',
        totalTime: '22h 30m',
        workoutsCompleted: 28
      },
      progressData: {
        labels: ["Cardio", "Strength", "Flexibility"],
        data: [0.65, 0.6, 0.4]
      },
      recentWorkouts: [
        { type: 'HIIT', name: 'Full Body HIIT', duration: '35 min', calories: 410, date: 'Week 4' },
        { type: 'Strength', name: 'Upper Body', duration: '50 min', calories: 380, date: 'Week 4' },
        { type: 'Cardio', name: 'Cycling', duration: '45 min', calories: 320, date: 'Week 3' },
        { type: 'Yoga', name: 'Power Yoga', duration: '60 min', calories: 250, date: 'Week 3' },
      ]
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      workoutDurations: [1200, 1400, 1350, 1500, 1600, 1550, 1700, 1650, 1750, 1800, 1850, 1900],
      calories: [8500, 10200, 9800, 11500, 12200, 11800, 13000, 12600, 13400, 13800, 14200, 14500],
      stats: {
        totalCalories: '145,500',
        totalTime: '312h 45m',
        workoutsCompleted: 365
      },
      progressData: {
        labels: ["Cardio", "Strength", "Flexibility"],
        data: [0.68, 0.72, 0.55]
      },
      recentWorkouts: [
        { type: 'Strength', name: 'Back & Biceps', duration: '55 min', calories: 440, date: 'Dec' },
        { type: 'Cardio', name: 'Trail Running', duration: '60 min', calories: 520, date: 'Dec' },
        { type: 'HIIT', name: 'Tabata Training', duration: '30 min', calories: 380, date: 'Nov' },
        { type: 'Yoga', name: 'Restorative Yoga', duration: '45 min', calories: 200, date: 'Nov' },
      ]
    }
  };

  // Get current timeframe data
  const currentData = timeframeData[selectedTimeframe];

  const workoutData = {
    labels: currentData.labels,
    datasets: [
      {
        data: currentData.workoutDurations,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const calorieData = {
    labels: currentData.labels,
    datasets: [
      {
        data: currentData.calories
      }
    ]
  };

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
          <Text style={styles.statValue}>{currentData.stats.totalCalories}</Text>
          <Text style={styles.statLabel}>Calories Burned</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <ClockIcon size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{currentData.stats.totalTime}</Text>
          <Text style={styles.statLabel}>Total Workout Time</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrophyIcon size={20} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{currentData.stats.workoutsCompleted}</Text>
          <Text style={styles.statLabel}>Workouts Completed</Text>
        </View>
      </View>

      {/* Workout Duration Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Workout Duration (Minutes)</Text>
        <LineChart
          data={workoutData}
          width={chartWidth}
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
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero 
          yAxisLabel={''} 
          yAxisSuffix={''}
        />
      </View>

      {/* Progress Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Workout Distribution</Text>
        <ProgressChart
          data={currentData.progressData}
          width={chartWidth}
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
        {currentData.recentWorkouts.map((workout: any, index: number) => (
          <View key={index} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View style={[styles.workoutType, 
                {backgroundColor: workout.type === 'Strength' ? '#10B981' : 
                                 workout.type === 'Cardio' ? '#3B82F6' : 
                                 workout.type === 'HIIT' ? '#F59E0B' : '#8B5CF6'}]}>
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
            <Text style={styles.achievementText}>
              {selectedTimeframe === 'week' ? '7 Day Streak' : 
               selectedTimeframe === 'month' ? '30 Day Streak' : 'Year Complete'}
            </Text>
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
            <Text style={styles.achievementText}>
              {selectedTimeframe === 'week' ? 'Weekly Goal' : 
               selectedTimeframe === 'month' ? 'Monthly Goal' : 'Annual Goal'}
            </Text>
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
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
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