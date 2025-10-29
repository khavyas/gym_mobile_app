import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Import the NotificationModal component
import NotificationModal, { Notification } from './ui/NotificationModal';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

// Default notifications data
const defaultNotifications: Notification[] = [
  {
    id: '1',
    icon: 'activity',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.15)',
    title: 'Time to Move!',
    emoji: '🚶',
    message: "You've been sitting for 3 hours. Take a 5-minute walk to boost your energy.",
    time: '2 minutes ago',
    actionButton: 'Start Walk',
    onAction: () => Alert.alert('Walk Started', 'Great! Let\'s get moving!'),
  },
  {
    id: '2',
    icon: 'water',
    iconColor: '#3B82F6',
    iconBg: 'rgba(59, 130, 246, 0.15)',
    title: 'Hydration Reminder',
    emoji: '💧',
    message: "You've only had 2 glasses of water today. Aim for 8 glasses total.",
    time: '15 minutes ago',
    actionButton: 'Log Water',
    onAction: () => Alert.alert('Water Logged', 'Keep it up!'),
  },
  {
    id: '3',
    icon: 'trophy',
    iconColor: '#10B981',
    iconBg: 'rgba(16, 185, 129, 0.15)',
    title: 'Weekly Goal Achieved!',
    emoji: '🎉',
    message: "Congratulations! You've completed 5 workouts this week.",
    time: '1 hour ago',
  },
  {
    id: '4',
    icon: 'medical',
    iconColor: '#EF4444',
    iconBg: 'rgba(239, 68, 68, 0.15)',
    title: 'Medication Reminder',
    emoji: '💊',
    message: "Time to take your Lisinopril (10mg). Don't miss your dose.",
    time: '1 hour ago',
    actionButton: 'Mark Taken',
    onAction: () => Alert.alert('Marked', 'Medication marked as taken'),
  },
  {
    id: '5',
    icon: 'fitness',
    iconColor: '#8B5CF6',
    iconBg: 'rgba(139, 92, 246, 0.15)',
    title: 'Daily Mood Check-in',
    emoji: '😊',
    message: 'How are you feeling today? Track your mood for better insights.',
    time: '2 hours ago',
    actionButton: 'Log Mood',
    onAction: () => Alert.alert('Mood Tracker', 'Opening mood tracker...'),
  },
  {
    id: '6',
    icon: 'moon',
    iconColor: '#6366F1',
    iconBg: 'rgba(99, 102, 241, 0.15)',
    title: 'Sleep Optimization',
    emoji: '🌙',
    message: 'Your bedtime is in 1 hour. Start winding down for better sleep quality.',
    time: '3 hours ago',
    actionButton: 'Sleep Mode',
    onAction: () => Alert.alert('Sleep Mode', 'Activating sleep mode...'),
  },
  {
    id: '7',
    icon: 'activity',
    iconColor: '#EC4899',
    iconBg: 'rgba(236, 72, 153, 0.15)',
    title: 'Workout Reminder',
    emoji: '💪',
    message: "Don't forget your evening workout! You're just one session away from your weekly goal.",
    time: '4 hours ago',
    actionButton: 'Start Workout',
    onAction: () => Alert.alert('Workout', 'Let\'s do this!'),
  },
];

export default function Header({
  title = 'HealthHub',
  subtitle = 'User Portal',
  showBackButton = false,
  onBackPress,
}: HeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications on mount
  useEffect(() => {
    setNotifications(defaultNotifications);
  }, []);

  const handleProfilePress = () => {
    router.push('/dashboards/user/ProfileSettings');
  };

  const handleStatsPress = () => {
    router.push('/dashboards/user/HealthAnalysis');
  };

  const handleWellBeingPress = () => {
    router.push('/dashboards/user/MoodWellbeing');
  };

  const handleNotificationPress = () => {
    setShowNotifications(true);
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>H</Text>
              </View>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleStatsPress}>
            <Ionicons name="bar-chart-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleWellBeingPress}>
            <Ionicons name="fitness-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="watch-outline" size={18} color="#fff" />
          </TouchableOpacity>
          
          {/* Notification Button */}
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={18} color="#fff" />
            {notifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Ionicons name="person" size={20} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onRemoveNotification={handleRemoveNotification}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#00c48c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 8,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
});