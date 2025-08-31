import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

export default function StatsOverview() {
  const timeFrames = ['Week', 'Month', 'Year'];
  const selectedTimeFrame = 'Month';

  const mainStats = [
    {
      title: "Workouts Completed",
      value: "24",
      unit: "sessions",
      change: "+12%",
      positive: true,
      color: ["#3B82F6", "#2563EB"],
      icon: "💪"
    },
    {
      title: "Calories Burned",
      value: "8,450",
      unit: "kcal",
      change: "+8%",
      positive: true,
      color: ["#EF4444", "#DC2626"],
      icon: "🔥"
    },
    {
      title: "Active Minutes",
      value: "1,240",
      unit: "min",
      change: "+15%",
      positive: true,
      color: ["#10B981", "#059669"],
      icon: "⏱️"
    },
    {
      title: "Average Heart Rate",
      value: "142",
      unit: "bpm",
      change: "-2%",
      positive: false,
      color: ["#F59E0B", "#D97706"],
      icon: "❤️"
    }
  ];

  const weeklyData = [
    { day: 'Mon', value: 85, calories: 420 },
    { day: 'Tue', value: 92, calories: 380 },
    { day: 'Wed', value: 78, calories: 450 },
    { day: 'Thu', value: 95, calories: 520 },
    { day: 'Fri', value: 88, calories: 390 },
    { day: 'Sat', value: 100, calories: 580 },
    { day: 'Sun', value: 70, calories: 320 },
  ];

  const achievements = [
    { title: "7-Day Streak", description: "Worked out 7 days in a row", icon: "🏆", unlocked: true },
    { title: "Calorie Crusher", description: "Burned 10,000+ calories", icon: "🔥", unlocked: true },
    { title: "Early Bird", description: "5 morning workouts", icon: "🌅", unlocked: false },
    { title: "Consistency King", description: "30-day workout streak", icon: "👑", unlocked: false },
  ];

  const renderStatCard = (stat: any, index: number) => (
    <View key={index} style={[styles.statCard, { width: (width - 60) / 2 }]}>
      <LinearGradient
        colors={stat.color}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.statIcon}>{stat.icon}</Text>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statUnit}>{stat.unit}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
        <View style={styles.changeContainer}>
          <Text style={[styles.changeText, { color: stat.positive ? '#10B981' : '#EF4444' }]}>
            {stat.change}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderWeeklyBar = (data: any, index: number) => {
    const maxHeight = 80;
    const height = (data.value / 100) * maxHeight;
    
    return (
      <View key={index} style={styles.barContainer}>
        <View style={styles.barBackground}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={[styles.bar, { height }]}
          />
        </View>
        <Text style={styles.barDay}>{data.day}</Text>
        <Text style={styles.barValue}>{data.calories}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Stats Overview</Text>
            <Text style={styles.subtitle}>Track your fitness journey</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>📊</Text>
          </TouchableOpacity>
        </View>

        {/* Time Frame Selector */}
        <View style={styles.timeFrameContainer}>
          {timeFrames.map((frame, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.timeFrameButton,
                frame === selectedTimeFrame && styles.timeFrameButtonActive
              ]}
            >
              <Text style={[
                styles.timeFrameText,
                frame === selectedTimeFrame && styles.timeFrameTextActive
              ]}>
                {frame}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Stats Grid */}
        <View style={styles.statsGrid}>
          {mainStats.map((stat, index) => renderStatCard(stat, index))}
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Calories Burned</Text>
              <Text style={styles.chartSubtitle}>Last 7 days</Text>
            </View>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => renderWeeklyBar(data, index))}
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.legendText}>Daily average: 438 kcal</Text>
            </View>
          </View>
        </View>

        {/* Progress Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Summary</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Weight Goal</Text>
                <Text style={styles.progressSubtitle}>Target: 75kg</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '68%' }]} />
                </View>
                <Text style={styles.progressPercentage}>68%</Text>
              </View>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Monthly Steps</Text>
                <Text style={styles.progressSubtitle}>Target: 300k steps</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '82%', backgroundColor: '#F59E0B' }]} />
                </View>
                <Text style={styles.progressPercentage}>82%</Text>
              </View>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Workout Streak</Text>
                <Text style={styles.progressSubtitle}>Target: 30 days</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '43%', backgroundColor: '#EF4444' }]} />
                </View>
                <Text style={styles.progressPercentage}>43%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <View key={index} style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementCardLocked
              ]}>
                <Text style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.achievementIconLocked
                ]}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </Text>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.achievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📈</Text>
            <Text style={styles.quickActionText}>Detailed Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📤</Text>
            <Text style={styles.quickActionText}>Export Data</Text>
          </TouchableOpacity>
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
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 20,
  },
  timeFrameContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeFrameButtonActive: {
    backgroundColor: '#10B981',
  },
  timeFrameText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  timeFrameTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  statIcon: {
    fontSize: 24,
    alignSelf: 'flex-end',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statUnit: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    lineHeight: 16,
  },
  changeContainer: {
    marginTop: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  chartCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    width: 20,
    height: 80,
    backgroundColor: '#374151',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 10,
  },
  barDay: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '500',
  },
  barValue: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
    fontWeight: '600',
  },
  chartLegend: {
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  progressCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressInfo: {
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 32,
  },
  achievementsContainer: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  achievementCardLocked: {
    borderColor: '#374151',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  achievementTitleLocked: {
    color: '#94A3B8',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  achievementDescriptionLocked: {
    color: '#6B7280',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});