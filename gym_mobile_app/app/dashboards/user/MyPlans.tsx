import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

export default function MyPlans() {
  const workoutPlans = [
    {
      id: 1,
      title: "Strength Building Program",
      duration: "4 weeks",
      progress: 65,
      type: "Strength",
      sessionsCompleted: 13,
      totalSessions: 20,
      nextSession: "Tomorrow, 7:00 AM",
      color: ["#DC2626", "#B91C1C"]
    },
    {
      id: 2,
      title: "HIIT Cardio Challenge",
      duration: "3 weeks",
      progress: 40,
      type: "Cardio",
      sessionsCompleted: 6,
      totalSessions: 15,
      nextSession: "Today, 6:00 PM",
      color: ["#7C3AED", "#6D28D9"]
    }
  ];

  const dietPlans = [
    {
      id: 1,
      title: "Muscle Gain Diet Plan",
      calories: "2,800 kcal/day",
      progress: 78,
      mealsCompleted: 23,
      totalMeals: 28,
      nextMeal: "Lunch at 1:00 PM",
      color: ["#059669", "#047857"]
    },
    {
      id: 2,
      title: "Lean Cut Program",
      calories: "2,200 kcal/day",
      progress: 55,
      mealsCompleted: 15,
      totalMeals: 21,
      nextMeal: "Dinner at 7:30 PM",
      color: ["#EA580C", "#DC2626"]
    }
  ];

  const renderPlanCard = (plan: any, type: 'workout' | 'diet') => (
    <TouchableOpacity key={plan.id} style={styles.planCard}>
      <LinearGradient
        colors={plan.color}
        style={styles.planGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.planHeader}>
          <View style={styles.planTypeContainer}>
            <Text style={styles.planType}>{plan.type || type.toUpperCase()}</Text>
          </View>
          <Text style={styles.progressPercentage}>{plan.progress}%</Text>
        </View>
        
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planSubtitle}>
          {type === 'workout' ? plan.duration : plan.calories}
        </Text>
        
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${plan.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {type === 'workout' 
              ? `${plan.sessionsCompleted}/${plan.totalSessions} sessions completed`
              : `${plan.mealsCompleted}/${plan.totalMeals} meals this week`
            }
          </Text>
        </View>
        
        <View style={styles.nextSessionContainer}>
          <Text style={styles.nextSessionLabel}>
            {type === 'workout' ? 'Next Session:' : 'Next Meal:'}
          </Text>
          <Text style={styles.nextSessionText}>
            {type === 'workout' ? plan.nextSession : plan.nextMeal}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Plans</Text>
            <Text style={styles.subtitle}>Track your workout and diet progress</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Active Plans Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Active Plans Overview</Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewNumber}>{workoutPlans.length}</Text>
              <Text style={styles.overviewLabel}>Workout Plans</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewNumber}>{dietPlans.length}</Text>
              <Text style={styles.overviewLabel}>Diet Plans</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewNumber}>62%</Text>
              <Text style={styles.overviewLabel}>Avg Progress</Text>
            </View>
          </View>
        </View>

        {/* Workout Plans Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💪 Workout Plans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {workoutPlans.map(plan => renderPlanCard(plan, 'workout'))}
        </View>

        {/* Diet Plans Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍎 Diet Plans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {dietPlans.map(plan => renderPlanCard(plan, 'diet'))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>Create Custom Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>View Analytics</Text>
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  overviewCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  overviewLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
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
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  planCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  planGradient: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTypeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planType: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  nextSessionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  nextSessionLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nextSessionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
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