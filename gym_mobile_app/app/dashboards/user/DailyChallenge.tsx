import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

export default function DailyChallenge() {
  const todayChallenge = {
    id: 1,
    title: "Cardio Crusher",
    description: "Complete 30 minutes of cardio workout",
    difficulty: "Medium",
    points: 150,
    timeRemaining: "14h 32m",
    progress: 65,
    tasks: [
      { id: 1, task: "5 minutes warm-up", completed: true },
      { id: 2, task: "20 minutes running", completed: true },
      { id: 3, task: "5 minutes cool-down", completed: false },
    ],
    reward: "Unlock new workout playlist",
    category: "Cardio"
  };

  const weeklyProgress = [
    { day: 'Mon', completed: true, points: 120 },
    { day: 'Tue', completed: true, points: 150 },
    { day: 'Wed', completed: true, points: 100 },
    { day: 'Thu', completed: false, points: 0 },
    { day: 'Fri', completed: false, points: 0 },
    { day: 'Sat', completed: false, points: 0 },
    { day: 'Sun', completed: false, points: 0 },
  ];

  const availableChallenges = [
    {
      id: 2,
      title: "Strength Builder",
      description: "Complete 3 sets of compound exercises",
      difficulty: "Hard",
      points: 200,
      duration: "45 min",
      category: "Strength",
      participants: 1243,
      icon: "💪"
    },
    {
      id: 3,
      title: "Flexibility Flow",
      description: "Hold 5 yoga poses for 1 minute each",
      difficulty: "Easy",
      points: 100,
      duration: "20 min",
      category: "Flexibility",
      participants: 892,
      icon: "🧘‍♀️"
    },
    {
      id: 4,
      title: "Water Warrior",
      description: "Drink 3 liters of water today",
      difficulty: "Easy",
      points: 75,
      duration: "All day",
      category: "Hydration",
      participants: 2156,
      icon: "💧"
    }
  ];

  const achievements = [
    { id: 1, title: "7-Day Streak", icon: "🔥", progress: 57, target: 100 },
    { id: 2, title: "Challenge Master", icon: "🏆", progress: 23, target: 50 },
    { id: 3, title: "Early Bird", icon: "🌅", progress: 12, target: 30 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardio':
        return ['#EF4444', '#DC2626'];
      case 'strength':
        return ['#7C3AED', '#6D28D9'];
      case 'flexibility':
        return ['#10B981', '#059669'];
      case 'hydration':
        return ['#3B82F6', '#2563EB'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const renderWeeklyDay = (data: any, index: number) => (
    <View key={index} style={styles.weekDay}>
      <View style={[
        styles.dayCircle,
        data.completed ? styles.dayCompleted : styles.dayIncomplete
      ]}>
        <Text style={[
          styles.dayText,
          data.completed ? styles.dayTextCompleted : styles.dayTextIncomplete
        ]}>
          {data.day}
        </Text>
      </View>
      {data.completed && (
        <Text style={styles.dayPoints}>{data.points}pts</Text>
      )}
    </View>
  );

  const renderChallengeCard = (challenge: any) => (
    <TouchableOpacity key={challenge.id} style={styles.challengeCard}>
        <LinearGradient
        colors={getCategoryColor(todayChallenge.category) as [string, string]}
        style={styles.todayCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        >

        <View style={styles.challengeHeader}>
          <Text style={styles.challengeIcon}>{challenge.icon}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        
        <View style={styles.challengeFooter}>
          <View style={styles.challengeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.participants}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Challenges</Text>
          <Text style={styles.subtitle}>Push your limits every day</Text>
        </View>
        <TouchableOpacity style={styles.streakButton}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakNumber}>3</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Today's Challenge */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Today's Challenge</Text>
          
            <LinearGradient
            colors={getCategoryColor(todayChallenge.category) as [string, string]}
            style={styles.todayCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >

            <View style={styles.todayHeader}>
              <View>
                <Text style={styles.todayTitle}>{todayChallenge.title}</Text>
                <Text style={styles.todayDescription}>{todayChallenge.description}</Text>
              </View>
              <View style={styles.todayStats}>
                <Text style={styles.todayPoints}>{todayChallenge.points}</Text>
                <Text style={styles.todayPointsLabel}>points</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${todayChallenge.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{todayChallenge.progress}% Complete</Text>
            </View>

            {/* Task List */}
            <View style={styles.taskList}>
              {todayChallenge.tasks.map((task, index) => (
                <View key={task.id} style={styles.taskItem}>
                  <View style={[
                    styles.taskCheckbox,
                    task.completed ? styles.taskCompleted : styles.taskPending
                  ]}>
                    <Text style={styles.taskCheck}>
                      {task.completed ? '✓' : '○'}
                    </Text>
                  </View>
                  <Text style={[
                    styles.taskText,
                    task.completed ? styles.taskTextCompleted : styles.taskTextPending
                  ]}>
                    {task.task}
                  </Text>
                </View>
              ))}
            </View>

            {/* Action Button */}
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continue Challenge</Text>
            </TouchableOpacity>
            
            <View style={styles.timeRemaining}>
              <Text style={styles.timeRemainingText}>⏰ {todayChallenge.timeRemaining} remaining</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 This Week's Progress</Text>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyTitle}>Challenge Streak</Text>
              <Text style={styles.weeklySubtitle}>3/7 days completed</Text>
            </View>
            <View style={styles.weeklyProgress}>
              {weeklyProgress.map((data, index) => renderWeeklyDay(data, index))}
            </View>
            <View style={styles.weeklyStats}>
              <Text style={styles.weeklyStatsText}>Total Points Earned: 370</Text>
            </View>
          </View>
        </View>

        {/* Available Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏃‍♂️ More Challenges</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {availableChallenges.map(challenge => renderChallengeCard(challenge))}
        </View>

        {/* Achievements Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievement Progress</Text>
          
          {achievements.map((achievement, index) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementHeader}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementProgress}>
                    {achievement.progress}/{achievement.target}
                  </Text>
                </View>
              </View>
              <View style={styles.achievementProgressBar}>
                <View style={[
                  styles.achievementProgressFill,
                  { width: `${(achievement.progress / achievement.target) * 100}%` }
                ]} />
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Challenge History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>🎮</Text>
            <Text style={styles.quickActionText}>Leaderboard</Text>
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
  streakButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  todayCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  todayDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  todayStats: {
    alignItems: 'center',
  },
  todayPoints: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  todayPointsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  taskList: {
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskCompleted: {
    backgroundColor: '#FFFFFF',
  },
  taskPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  taskCheck: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskText: {
    fontSize: 14,
    flex: 1,
  },
  taskTextCompleted: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'line-through',
  },
  taskTextPending: {
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timeRemaining: {
    alignItems: 'center',
  },
  timeRemainingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  weeklyCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  weeklyHeader: {
    marginBottom: 16,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  weeklySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekDay: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayCompleted: {
    backgroundColor: '#10B981',
  },
  dayIncomplete: {
    backgroundColor: '#374151',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '600',
  },
  dayTextCompleted: {
    color: '#FFFFFF',
  },
  dayTextIncomplete: {
    color: '#94A3B8',
  },
  dayPoints: {
    fontSize: 8,
    color: '#10B981',
    fontWeight: '600',
  },
  weeklyStats: {
    alignItems: 'center',
  },
  weeklyStatsText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  challengeCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  challengeGradient: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeIcon: {
    fontSize: 24,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  challengeFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  achievementCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  achievementProgress: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  achievementProgressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
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