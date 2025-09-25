import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TabNavigation } from '../components/common/TabNavigation';
import { PersonalInfoForm } from '../components/profile/PersonalInfoForm';
import { ProfessionalInfoForm } from '../components/profile/ProfessionalInfoForm';
import { PricingInfoForm } from '../components/profile/PricingInfoForm';
import { ContactInfoForm } from '../components/profile/ContactInfoForm';
import { useConsultant } from '../hooks/useConsultant';

const tabs = [
  { id: 'personal', label: 'Personal' },
  { id: 'professional', label: 'Professional' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
];

export const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔑 Load userId from AsyncStorage on mount
  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        Alert.alert('Error', 'No user ID found. Please log in again.');
      }
    };
    loadUserId();
  }, []);

  // Call the hook only after we have userId
  const { consultant, updateProfile, createProfile, loading } = useConsultant(userId || '');

  const handleSave = async (formData: any) => {
    try {
      setIsLoading(true);

      if (consultant) {
        const updatedData = { ...consultant, ...formData };
        await updateProfile(updatedData);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        await createProfile(formData);
        Alert.alert('Success', 'Profile created successfully!');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'personal':
        return <PersonalInfoForm consultant={consultant || undefined} onSave={handleSave} editable />;
      case 'professional':
        return <ProfessionalInfoForm consultant={consultant || undefined} onSave={handleSave} editable />;
      case 'pricing':
        return <PricingInfoForm consultant={consultant || undefined} onSave={handleSave} editable />;
      case 'contact':
        return <ContactInfoForm consultant={consultant || undefined} onSave={handleSave} editable />;
      default:
        return null;
    }
  };

  // Don’t render until userId is loaded
  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  content: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, fontSize: 16, color: '#6B7280' },
});
