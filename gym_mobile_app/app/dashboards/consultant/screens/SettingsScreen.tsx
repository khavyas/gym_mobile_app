import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native'; // Import StatusBar

const SettingsScreen: React.FC = () => {
  // --- Updated with darker, more saturated colors for the icon backgrounds ---
  const settingsOptions = [
    { 
      icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png', 
      title: 'Account Settings',
      subtitle: 'Update your personal information',
      color: '#1E3A8A', // Dark Blue
    },
    { 
      icon: 'https://cdn-icons-png.flaticon.com/512/2889/2889676.png', 
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      color: '#14532D', // Dark Green
    },
    { 
      icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png', 
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      color: '#713F12', // Dark Amber/Yellow
    },
    { 
      icon: 'https://cdn-icons-png.flaticon.com/512/891/891462.png', 
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      color: '#581C87', // Dark Purple
    },
    { 
      icon: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png', 
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      color: '#7F1D1D', // Dark Red
    },
    { 
      icon: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png', 
      title: 'About',
      subtitle: 'App version and information',
      color: '#164E63', // Dark Cyan
    },
  ];

  return (
    <View style={styles.container}>
      {/* Set StatusBar content to light for dark backgrounds */}
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsHeader}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <Text style={styles.settingsSubtitle}>Manage your account preferences</Text>
        </View>

        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Dr. Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah.johnson@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1827/1827933.png' }}
              style={styles.editIcon}
              tintColor="#3B82F6" // Ensure icon is visible
            />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.settingItem} activeOpacity={0.7}>
              <View style={[styles.settingIconContainer, { backgroundColor: option.color }]}>
                <Image source={{ uri: option.icon }} style={styles.settingIcon} tintColor="#FFFFFF" /> {/* Make icon white */}
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
              </View>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271228.png' }}
                style={styles.chevronIcon}
                tintColor="#9CA3AF" // Muted gray for chevron
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828479.png' }}
            style={styles.logoutIcon}
            tintColor="#FCA5A5" // Light red for the icon
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Updated Styles for a Professional Dark Theme ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Deep dark background
  },
  scrollView: {
    flex: 1,
  },
  settingsHeader: {
    paddingTop: 60, // Account for status bar
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#1A1A1A', // Dark card background
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // More prominent shadow for dark theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  settingsTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F4F4F5', // Off-white primary text
    marginBottom: 4,
  },
  settingsSubtitle: {
    fontSize: 15,
    color: '#9CA3AF', // Muted gray for subtitles
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#333333', // Subtle border
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F4F5',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E3A8A', // Dark blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 22,
    height: 22,
  },
  settingsSection: {
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIcon: {
    width: 26,
    height: 26,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F4F4F5',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  chevronIcon: {
    width: 18,
    height: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7F1D1D', // Dark red background
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#991B1B', // Darker red border
  },
  logoutIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FCA5A5', // Light red text for contrast
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280', // Muted gray for footer
  },
});

export default SettingsScreen;