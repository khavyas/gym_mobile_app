import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Consultant } from '../../services/types';

interface ProfessionalInfoFormProps {
  consultant?: Consultant | null | undefined;
  onSave: (data: any) => Promise<void>;
  editable?: boolean;
  isLoading?: boolean; // Add this line
}

export const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({
  consultant,
  onSave,
  editable = false,
}) => {
  const [formData, setFormData] = useState({
    specialty: consultant?.specialty || '',
    modeOfTraining: consultant?.modeOfTraining || 'online',
    certifications: consultant?.certifications || [],
    badges: consultant?.badges || [],
    availability: consultant?.availability || '', // Added availability property
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
  certifications: formData.certifications,
  badges: formData.badges,
  modeOfTraining: formData.modeOfTraining,
  availability: formData.availability,
});

      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <Button 
            title="Edit" 
            variant="ghost" 
            size="sm"
            onPress={() => setIsEditing(true)}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Specialty</Text>
          <Text style={styles.value}>{consultant?.specialty || 'Not specified'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Training Mode</Text>
          <Badge text={consultant?.modeOfTraining || 'online'} variant="primary" />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Certifications</Text>
          <View style={styles.badgeContainer}>
            {consultant?.certifications?.length ? (
              consultant.certifications.map((cert, index) => (
                <Badge key={index} text={cert} variant="success" style={styles.badge} />
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
                <Badge key={index} text={badge} variant="warning" style={styles.badge} />
              ))
            ) : (
              <Text style={styles.emptyText}>No badges earned</Text>
            )}
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={styles.sectionTitle}>Professional Information</Text>

      <Input
        label="Specialty"
        value={formData.specialty}
        onChangeText={(text) => setFormData({ ...formData, specialty: text })}
        placeholder="e.g. Nutritionist, Yoga Instructor"
      />

      <View style={styles.modeContainer}>
        <Text style={styles.label}>Mode of Training</Text>
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
        <Text style={styles.label}>Certifications</Text>
        <View style={styles.inputRow}>
          <Input
            value={newCertification}
            onChangeText={setNewCertification}
            placeholder="Add certification"
            containerStyle={styles.certificationInput}
          />
          <Button 
            title="Add" 
            variant="secondary" 
            size="sm"
            onPress={addCertification}
            style={styles.addButton}
          />
        </View>
        
        <View style={styles.badgeContainer}>
          {formData.certifications.map((cert, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => removeCertification(index)}
              style={styles.removableBadge}
            >
              <Badge text={`${cert} ×`} variant="success" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

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

// Styles for ProfessionalInfoForm and PricingInfoForm
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
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  badge: {
    marginRight: 8,
    marginBottom: 4,
  },
  modeContainer: {
    marginBottom: 16,
  },
  modeOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  modeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginRight: 8,
  },
  modeOptionActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  modeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  modeTextActive: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  certificationContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  certificationInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    marginBottom: 8,
  },
  removableBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 0.48,
  },
  // Pricing specific styles
  pricingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceCard: {
    flex: 0.32,
    alignItems: 'center',
    padding: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  packagesSection: {
    marginTop: 16,
  },
  packageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  packageDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  pricingInputs: {
    marginBottom: 16,
  },
  priceInput: {
    marginBottom: 12,
  },
  packageSection: {
    marginBottom: 16,
  },
  newPackageCard: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  newPackageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  packageInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationInput: {
    flex: 0.6,
    marginRight: 8,
  },
  priceInputSmall: {
    flex: 0.35,
  },
  existingPackages: {
    marginTop: 16,
  },
  packageActions: {
    alignItems: 'flex-end',
  },
  removeButton: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});