import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Consultant } from '../../services/types';

// In PersonalInfoForm.tsx (and other form files)
interface PersonalInfoFormProps {
  consultant?: Consultant | null | undefined; // Accept all three
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
    image: consultant?.image || '', // Add image property
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
    // Implement image picker logic
    Alert.alert('Image Upload', 'Image upload functionality would be implemented here');
  };

  if (!isEditing) {
    return (
      <Card>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Button 
            title="Edit" 
            variant="ghost" 
            size="sm"
            onPress={() => setIsEditing(true)}
          />
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
      </Card>
    );
  }

  return (
    <Card>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <TouchableOpacity style={styles.profileImageEdit} onPress={handleImageUpload}>
        <Text style={styles.profileImageText}>📷</Text>
        <Text style={styles.uploadText}>Upload Photo</Text>
      </TouchableOpacity>

      <Input
        label="Full Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Enter your full name"
      />

      <Input
        label="Years of Experience"
        value={formData.yearsOfExperience}
        onChangeText={(text) => setFormData({ ...formData, yearsOfExperience: text })}
        placeholder="0"
        keyboardType="numeric"
      />

      <Input
        label="About You"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        placeholder="Tell us about your expertise and approach..."
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <View style={styles.buttonRow}>
        <Button 
          title="Cancel" 
          variant="secondary" 
          onPress={() => setIsEditing(false)}
          style={styles.button}
        />
        <Button 
          title="Save" 
          variant="primary" 
          onPress={handleSave}
          style={styles.button}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileImageEdit: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  profileImageText: {
    fontSize: 32,
  },
  uploadText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  experience: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  descriptionSection: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 0.48,
  },
});