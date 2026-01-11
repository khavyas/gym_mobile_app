import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Consultant } from '../../services/types';

interface ProfessionalInfoFormProps {
  consultant?: Consultant | null | undefined;
  onSave: (data: any) => Promise<void>;
  editable?: boolean;
  isLoading?: boolean;
}

export const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({
  consultant,
  onSave,
  editable = false,
}) => {
  const [formData, setFormData] = useState({
    specialty: consultant?.specialty || '',
    gymName: consultant?.gym || '',
    modeOfTraining: consultant?.modeOfTraining || 'online',
    certifications: consultant?.certifications || [],
    badges: consultant?.badges || [],
    availability: consultant?.availability || '',
  });

  const [isEditing, setIsEditing] = useState(editable);
  const [newCertification, setNewCertification] = useState('');

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()],
      });
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    try {
      await onSave({
        specialty: formData.specialty,
        gym: formData.gymName, // Backend expects 'gym' not 'gymName'
        certifications: formData.certifications,
        badges: formData.badges,
        modeOfTraining: formData.modeOfTraining,
        availability: formData.availability,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Professional information saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  if (!isEditing) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Specialty</Text>
          <Text style={styles.value}>{consultant?.specialty || 'Not specified'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Gym/Wellness Center</Text>
          <Text style={styles.value}>{consultant?.gym || 'Not specified'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Training Mode</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>
              {consultant?.modeOfTraining || 'online'}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Certifications</Text>
          <View style={styles.badgeContainer}>
            {consultant?.certifications?.length ? (
              consultant.certifications.map((cert, index) => (
                <View key={index} style={styles.certBadge}>
                  <Text style={styles.certBadgeText}>{cert}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No certifications added</Text>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Badges</Text>
          <View style={styles.badgeContainer}>
            {consultant?.badges?.length ? (
              consultant.badges.map((badge, index) => (
                <View key={index} style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeText}>{badge}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No badges earned</Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Professional Information</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Specialty</Text>
        <TextInput
          style={styles.input}
          value={formData.specialty}
          onChangeText={(text) => setFormData({ ...formData, specialty: text })}
          placeholder="e.g. Nutritionist, Yoga Instructor"
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Gym/Wellness Center</Text>
        <TextInput
          style={styles.input}
          value={formData.gymName}
          onChangeText={(text) => setFormData({ ...formData, gymName: text })}
          placeholder="e.g. Gold's Gym, Wellness World"
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.modeContainer}>
        <Text style={styles.inputLabel}>Mode of Training</Text>
        <View style={styles.modeOptions}>
          {['online', 'offline', 'hybrid'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeOption,
                formData.modeOfTraining === mode && styles.modeOptionActive,
              ]}
              onPress={() => setFormData({ ...formData, modeOfTraining: mode as any })}
            >
              <Text
                style={[
                  styles.modeText,
                  formData.modeOfTraining === mode && styles.modeTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.certificationContainer}>
        <Text style={styles.inputLabel}>Certifications</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.certificationInput]}
            value={newCertification}
            onChangeText={setNewCertification}
            placeholder="Add certification"
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={addCertification}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.badgeContainer}>
          {formData.certifications.map((cert, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => removeCertification(index)}
              style={styles.removableBadge}
            >
              <Text style={styles.removableBadgeText}>{cert} ×</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  infoRow: {
    marginBottom: 20,
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
  value: {
    fontSize: 16,
    color: '#F4F4F5',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  certBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  certBadgeText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
  },
  achievementBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  achievementBadgeText: {
    color: '#FBB936',
    fontSize: 13,
    fontWeight: '600',
  },
  modeBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignSelf: 'flex-start',
  },
  modeBadgeText: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  modeContainer: {
    marginBottom: 20,
  },
  modeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  modeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
  },
  modeOptionActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  modeText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  modeTextActive: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  certificationContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  certificationInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  addButtonText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '600',
  },
  removableBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  removableBadgeText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
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