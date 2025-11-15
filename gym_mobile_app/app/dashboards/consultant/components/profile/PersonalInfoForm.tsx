import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Button } from '../common/Button';
import { Consultant } from '../../services/types';

interface PersonalInfoFormProps {
  consultant?: Consultant | null | undefined;
  onSave: (data: any) => Promise<void>;
  editable?: boolean;
  isLoading?: boolean;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  consultant,
  onSave,
  editable = false,
}) => {
  const [formData, setFormData] = useState({
    name: consultant?.name || '',
    description: consultant?.description || '',
    yearsOfExperience: consultant?.yearsOfExperience?.toString() || '0',
    image: consultant?.image || '',
  });

  const [isEditing, setIsEditing] = useState(editable);

  const handleSave = async () => {
    try {
      await onSave({
        name: formData.name,
        description: formData.description,
        yearsOfExperience: formData.yearsOfExperience,
        image: formData.image,
      });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleImageUpload = () => {
    Alert.alert('Image Upload', 'Image upload functionality would be implemented here');
  };

  if (!isEditing) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileImage} onPress={handleImageUpload}>
            <Text style={styles.profileImageText}>📷</Text>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{consultant?.name || 'No name provided'}</Text>
            <Text style={styles.experience}>
              {consultant?.yearsOfExperience || 0} years of experience
            </Text>
          </View>
        </View>
        
        <View style={styles.descriptionSection}>
          <Text style={styles.label}>About</Text>
          <Text style={styles.description}>
            {consultant?.description || 'No description provided'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <TouchableOpacity style={styles.profileImageEdit} onPress={handleImageUpload}>
        <Text style={styles.profileImageText}>📷</Text>
        <Text style={styles.uploadText}>Upload Photo</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter your full name"
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          value={formData.yearsOfExperience}
          onChangeText={(text) => setFormData({ ...formData, yearsOfExperience: text })}
          placeholder="0"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>About You</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Tell us about your expertise and approach..."
          placeholderTextColor="#6B7280"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F4F4F5',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#374151',
  },
  profileImageEdit: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  profileImageText: {
    fontSize: 32,
  },
  uploadText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F4F4F5',
    marginBottom: 4,
  },
  experience: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  descriptionSection: {
    marginTop: 16,
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111111',
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  cancelButtonText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});