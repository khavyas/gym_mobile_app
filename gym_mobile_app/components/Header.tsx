import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({
  title = 'HealthHub',
  subtitle = 'User Portal',
  showBackButton = false,
  onBackPress,
}: HeaderProps) {
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/dashboards/user/ProfileSettings');
  };

  const handleStatsPress = () => {
    router.push('/dashboards/user/HealthAnalysis');
  };

    const handleWellBeingPress = () => {
    router.push('/dashboards/user/MoodWellbeing');
  };

  return (
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
          <Ionicons name="bar-chart-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleWellBeingPress}>
          <Ionicons name="fitness-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="watch-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="people-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Ionicons name="person" size={20} color="#0ea5e9" />
        </TouchableOpacity>
      </View>
    </View>
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
    gap: 8,
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