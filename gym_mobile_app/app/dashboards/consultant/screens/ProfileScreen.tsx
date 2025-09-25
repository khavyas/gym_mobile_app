import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
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

interface ProfileData {
  // Personal Info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  bio?: string;
  profileImage?: string;
  
  // Professional Info
  specializations?: string[];
  certifications?: string[];
  experience?: string;
  trainingModes?: string[];
  
  // Pricing Info
  hourlyRate?: number;
  packagePricing?: any[];
  currency?: string;
  
  // Contact Info
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

export const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔑 Load userId from AsyncStorage on mount
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert('Error', 'No user ID found. Please log in again.');
        }
      } catch (err) {
        console.error('Failed to load userId from storage:', err);
      }
    };
    loadUserId();
  }, []);

  // Hook call with userId
  const { consultant, updateProfile, createProfile, loading } = useConsultant(userId || '');

  const handleSave = async (formData: Partial<ProfileData>) => {
    try {
      setIsLoading(true);

      if (consultant) {
        // Merge with existing consultant profile (optional)
        const updatedData = { ...consultant, ...formData };
        await updateProfile(updatedData);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        await createProfile(formData);
        Alert.alert('Success', 'Profile created successfully!');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to save profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={profileStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={profileStyles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoForm
            consultant={consultant || undefined}
            onSave={handleSave}
            editable={true}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoForm
            consultant={consultant || undefined}
            onSave={handleSave}
            editable={true}
          />
        );
      case 'pricing':
        return (
          <PricingInfoForm
            consultant={consultant || undefined}
            onSave={handleSave}
            editable={true}
          />
        );
      case 'contact':
        return (
          <ContactInfoForm
            consultant={consultant || undefined}
            onSave={handleSave}
            editable={true}
          />
        );
      default:
        return (
          <PersonalInfoForm
            consultant={consultant || undefined}
            onSave={handleSave}
            editable={true}
          />
        );
    }
  };

  return (
    <View style={profileStyles.container}>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
      <ScrollView 
        style={profileStyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
