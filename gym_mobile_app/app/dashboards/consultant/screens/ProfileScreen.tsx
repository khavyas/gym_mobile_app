import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersonalInfoForm } from '../components/profile/PersonalInfoForm';
import { ProfessionalInfoForm } from '../components/profile/ProfessionalInfoForm';
import { PricingInfoForm } from '../components/profile/PricingInfoForm';
import { ContactInfoForm } from '../components/profile/ContactInfoForm';
import { useConsultant } from '../hooks/useConsultant';

const tabs = [
  { id: 'personal', label: 'Personal', icon: '👤', color: '#8B5CF6' },
  { id: 'professional', label: 'Professional', icon: '💼', color: '#3B82F6' },
  { id: 'pricing', label: 'Pricing', icon: '💰', color: '#10B981' },
  { id: 'contact', label: 'Contact', icon: '📱', color: '#F59E0B' },
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
  gym?: string;
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
    

      {/* Content Area */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
          
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your information</Text>
          </View>       
         
        </View>
      </LinearGradient>

      {/* Enhanced Tab Navigation */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.tab}
                  >
                    <View style={styles.tabIconWrapper}>
                      <Text style={styles.tabIcon}>{tab.icon}</Text>
                    </View>
                    <Text style={styles.activeTabText}>{tab.label}</Text>
                    <View style={styles.activeIndicator} />
                  </LinearGradient>
                ) : (
                  <View style={styles.tab}>
                    <View style={styles.tabIconWrapperInactive}>
                      <Text style={styles.tabIconInactive}>{tab.icon}</Text>
                    </View>
                    <Text style={styles.tabText}>{tab.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>


        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  completionCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderWidth: 3,
    borderColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionPercentage: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  completionLabel: {
    fontSize: 10,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  tabsWrapper: {
    marginTop: 20,
    marginBottom: 12,
  },
  tabContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  tabIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabIconWrapperInactive: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tabIcon: {
    fontSize: 22,
  },
  tabIconInactive: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});