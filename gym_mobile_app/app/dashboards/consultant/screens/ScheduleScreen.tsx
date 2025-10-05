import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, StatusBar } from 'react-native'; // Import StatusBar

const ScheduleScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Set StatusBar content to light for dark backgrounds */}
      <StatusBar barStyle="light-content" />
      
      <View style={styles.emptyState}>
        {/* I've swapped the image for one that better fits a "schedule" theme */}
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' }}
          style={styles.emptyStateImage}
        />
        <Text style={styles.emptyStateTitle}>Schedule Management</Text>
        <Text style={styles.emptyStateText}>
          Manage your availability and view your calendar here. Set your working hours and block time slots.
        </Text>
        
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2838/2838779.png' }}
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>Set Availability</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747310.png' }}
            style={styles.buttonIconSecondary} // Use a new style for the secondary icon
          />
          <Text style={styles.secondaryButtonText}>View Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Updated Styles for a Professional Dark Theme ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Deep dark background
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateImage: {
    width: 300,
    height: 220,
    borderRadius: 20,
    marginBottom: 32,
    // Adding a subtle border can help the image stand out
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F4F5', // Off-white primary text
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 17,
    color: '#9CA3AF', // Muted gray for secondary text
    textAlign: 'center',
    marginBottom: 40, // Increased spacing
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6', // Vibrant blue
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
    // Enhanced shadow for dark theme
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Dark card background
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    // Dark border for definition
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    color: '#D1D5DB', // Light gray for text
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF', // White icon for primary button
  },
  // A new style for the secondary button icon to ensure it's visible
  buttonIconSecondary: {
    width: 22,
    height: 22,
    tintColor: '#9CA3AF', // Muted gray icon for secondary button
  },
});

export default ScheduleScreen;