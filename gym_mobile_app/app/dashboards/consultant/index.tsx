import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component

// Import your screens
import { DashboardScreen } from './screens/DashboardScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AppointmentsScreen } from './screens/AppointmentsScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import SettingsScreen from './screens/SettingsScreen';

type TabType = 'dashboard' | 'profile' | 'appointments' | 'schedule' | 'settings';

interface TabItem {
  id: TabType;
  label: string;
  iconName: string; // Use iconName for the vector icon
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'home-outline' },
  { id: 'profile', label: 'Profile', iconName: 'person-outline' },
  { id: 'appointments', label: 'Appointments', iconName: 'calendar-outline' },
  { id: 'schedule', label: 'Schedule', iconName: 'time-outline' },
  { id: 'settings', label: 'Settings', iconName: 'settings-outline' },
];

export default function ConsultantHome() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'appointments':
        return <AppointmentsScreen />;
      case 'schedule':
        return <ScheduleScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consultant Panel</Text>
        <View style={styles.headerRight}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>S</Text>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Icon
              name={tab.iconName}
              style={[
                styles.tabIcon,
                activeTab === tab.id && styles.activeTabIcon,
              ]}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// --- Updated Styles for a Professional Dark Theme ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Main dark background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111111', // Slightly lighter for the header
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4F4F5', // Off-white text
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6', // Blue accent
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#0A0A0A', // CRITICAL: Match the container background
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#111111', // Dark tab bar
    borderTopWidth: 1,
    borderTopColor: '#1F2937', // Dark border
    paddingVertical: 8,
    paddingBottom: 8, // Add extra padding for notched screens
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeTabButton: {
    // A subtle highlight for the active tab
    backgroundColor: '#1F2937',
  },
  tabIcon: {
    fontSize: 24,
    color: '#6B7280', // Muted gray for inactive icons
    marginBottom: 4,
  },
  activeTabIcon: {
    color: '#3B82F6', // Blue accent for active icon
  },
  tabLabel: {
    fontSize: 11,
    color: '#6B7280', // Muted gray for inactive text
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#F4F4F5', // Off-white for active text
    fontWeight: '600',
  },
});