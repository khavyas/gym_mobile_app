import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreateGymForm {
  gymName: string;
  address: string;
  phone: string;
  email: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export default function CreateGym() {
  const router = useRouter();
  
  const handleBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/dashboards/super-admin"); 
  }
};

  const [createGymLoading, setCreateGymLoading] = useState(false);
  const [createGymForm, setCreateGymForm] = useState<CreateGymForm>({
    gymName: '',
    address: '',
    phone: '',
    email: '',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });

  // Memoized input handlers
  const handleGymNameChange = useCallback((text: string) => {
    setCreateGymForm(prev => ({ ...prev, gymName: text }));
  }, []);

  const handleAddressChange = useCallback((text: string) => {
    setCreateGymForm(prev => ({ ...prev, address: text }));
  }, []);

  const handlePhoneChange = useCallback((text: string) => {
    setCreateGymForm(prev => ({ ...prev, phone: text }));
  }, []);

  const handleEmailChange = useCallback((text: string) => {
    setCreateGymForm(prev => ({ ...prev, email: text }));
  }, []);

  const handleAdminNameChange = useCallback((text: string) => {
    setCreateGymForm(prev => ({ ...prev, adminName: text }));
  }, []);

  const handleAdminEmailChange = useCallback((text: string) => {
    setCreateGymForm(prev => ({ ...prev, adminEmail: text }));
  }, []);

  const handleAdminPasswordChange = useCallback((text: string) => {
    setCreateGymForm(prev => ({ ...prev, adminPassword: text }));
  }, []);

  const handleCreateGym = async () => {
    try {
      setCreateGymLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      // Validate form
      if (!createGymForm.gymName || !createGymForm.address || !createGymForm.adminName || !createGymForm.adminEmail) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

    const gymData = {
      name: createGymForm.gymName,
      address: createGymForm.address,
      phone: createGymForm.phone,
      email: createGymForm.email,
      adminName: createGymForm.adminName,
      adminEmail: createGymForm.adminEmail,
      adminPassword: createGymForm.adminPassword || 'DefaultPass123!',
    };

   const response = await axios.post(
  `${API_BASE_URL}/gyms`,
  gymData,
  { headers: { Authorization: `Bearer ${token}` } }
);

Alert.alert(
  'Success',
  'Gym center created successfully!',
  [
    {
      text: 'OK',
      onPress: handleBack,   
    },
  ]
);

      
      // Reset form
      setCreateGymForm({
        gymName: '',
        address: '',
        phone: '',
        email: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
      });
      
    } catch (error: any) {
      console.error('Error creating gym:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create gym center');
    } finally {
      setCreateGymLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Gym</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Card */}
        <LinearGradient
          colors={['#1E293B', '#334155']}
          style={styles.mainCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.cardTitle}>Gym Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Gym Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter gym name"
              placeholderTextColor="#94A3B8"
              value={createGymForm.gymName}
              onChangeText={handleGymNameChange}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter gym address"
              placeholderTextColor="#94A3B8"
              value={createGymForm.address}
              onChangeText={handleAddressChange}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              value={createGymForm.phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter gym email"
              placeholderTextColor="#94A3B8"
              value={createGymForm.email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </LinearGradient>

        {/* Admin Details Card */}
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          style={styles.adminCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.cardTitle}>Admin Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Admin Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter admin name"
              placeholderTextColor="#E9D5FF"
              value={createGymForm.adminName}
              onChangeText={handleAdminNameChange}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Admin Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter admin email"
              placeholderTextColor="#E9D5FF"
              value={createGymForm.adminEmail}
              onChangeText={handleAdminEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password (optional - default will be used)"
              placeholderTextColor="#E9D5FF"
              value={createGymForm.adminPassword}
              onChangeText={handleAdminPasswordChange}
              secureTextEntry
            />
          </View>
          
          <Text style={styles.noteText}>
            * If password is not provided, default password "DefaultPass123!" will be used
          </Text>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={createGymLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGym}
            disabled={createGymLoading}
          >
            {createGymLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.createButtonText}>Create Gym</Text>
                <Text style={styles.createButtonIcon}>🏢</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Required Fields Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>📋 Required Fields</Text>
          <Text style={styles.noticeText}>
            Please ensure you fill in all fields marked with (*) to create the gym center successfully.
          </Text>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 60,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  adminCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  noteText: {
    fontSize: 12,
    color: '#E9D5FF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  createButtonIcon: {
    fontSize: 18,
  },
  noticeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
});