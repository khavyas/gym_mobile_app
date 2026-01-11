import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Consultant, Package } from '../../services/types';

interface PricingInfoFormProps {
  consultant?: Consultant | null | undefined;
  onSave: (data: any) => Promise<void>;
  editable?: boolean;
  isLoading?: boolean; 
}

export const PricingInfoForm: React.FC<PricingInfoFormProps> = ({
  consultant,
  onSave,
  editable = false,
}) => {
  const [formData, setFormData] = useState({
    pricing: {
      perSession: consultant?.pricing?.perSession?.toString() || '',
      perWeek: consultant?.pricing?.perWeek?.toString() || '',
      perMonth: consultant?.pricing?.perMonth?.toString() || '',
      packages: consultant?.pricing?.packages || [],
    },
  });

  const [isEditing, setIsEditing] = useState(editable);
  const [newPackage, setNewPackage] = useState<Package>({ 
    title: '', 
    duration: '', 
    price: 0 
  });

  const addPackage = () => {
    if (newPackage.title && newPackage.duration && newPackage.price > 0) {
      setFormData({
        ...formData,
        pricing: {
          ...formData.pricing,
          packages: [...formData.pricing.packages, newPackage],
        },
      });
      setNewPackage({ title: '', duration: '', price: 0 });
    } else {
      Alert.alert('Invalid Package', 'Please fill all package details');
    }
  };

  const removePackage = (index: number) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        packages: formData.pricing.packages.filter((_, i) => i !== index),
      },
    });
  };

  const handleSave = async () => {
    try {
      await onSave({
        pricing: {
          perSession: parseFloat(formData.pricing.perSession) || undefined,
          perWeek: parseFloat(formData.pricing.perWeek) || undefined,
          perMonth: parseFloat(formData.pricing.perMonth) || undefined,
          currency: 'INR',
          packages: formData.pricing.packages,
        }
      });
      setIsEditing(false);
      Alert.alert('Success', 'Pricing information saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save pricing information');
    }
  };

  if (!isEditing) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Pricing Information</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pricingGrid}>
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Per Session</Text>
            <Text style={styles.priceValue}>
              ₹{consultant?.pricing?.perSession || '0'}
            </Text>
          </View>
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Per Week</Text>
            <Text style={styles.priceValue}>
              ₹{consultant?.pricing?.perWeek || '0'}
            </Text>
          </View>
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Per Month</Text>
            <Text style={styles.priceValue}>
              ₹{consultant?.pricing?.perMonth || '0'}
            </Text>
          </View>
        </View>

        <View style={styles.packagesSection}>
          <Text style={styles.label}>Packages</Text>
          {consultant?.pricing?.packages?.length ? (
            consultant.pricing.packages.map((pkg, index) => (
              <View key={index} style={styles.packageCard}>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageTitle}>{pkg.title}</Text>
                  <Text style={styles.packageDuration}>{pkg.duration}</Text>
                </View>
                <Text style={styles.packagePrice}>₹{pkg.price}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No packages created</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Pricing Information</Text>

      <View style={styles.pricingInputs}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Per Session (₹)</Text>
          <TextInput
            style={styles.input}
            value={formData.pricing.perSession}
            onChangeText={(text) => 
              setFormData({
                ...formData,
                pricing: { ...formData.pricing, perSession: text },
              })
            }
            placeholder="0"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Per Week (₹)</Text>
          <TextInput
            style={styles.input}
            value={formData.pricing.perWeek}
            onChangeText={(text) => 
              setFormData({
                ...formData,
                pricing: { ...formData.pricing, perWeek: text },
              })
            }
            placeholder="0"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Per Month (₹)</Text>
          <TextInput
            style={styles.input}
            value={formData.pricing.perMonth}
            onChangeText={(text) => 
              setFormData({
                ...formData,
                pricing: { ...formData.pricing, perMonth: text },
              })
            }
            placeholder="0"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.packageSection}>
        <Text style={styles.label}>Packages</Text>
        
        <View style={styles.newPackageCard}>
          <Text style={styles.newPackageTitle}>Add New Package</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Package Title</Text>
            <TextInput
              style={styles.input}
              value={newPackage.title}
              onChangeText={(text) => setNewPackage({ ...newPackage, title: text })}
              placeholder="e.g. 3-Month Transformation"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.packageInputRow}>
            <View style={[styles.inputContainer, styles.durationInput]}>
              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.input}
                value={newPackage.duration}
                onChangeText={(text) => setNewPackage({ ...newPackage, duration: text })}
                placeholder="e.g. 3 months"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View style={[styles.inputContainer, styles.priceInputSmall]}>
              <Text style={styles.inputLabel}>Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={newPackage.price > 0 ? newPackage.price.toString() : ''}
                onChangeText={(text) => setNewPackage({ ...newPackage, price: parseFloat(text) || 0 })}
                placeholder="0"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addPackageButton} onPress={addPackage}>
            <Text style={styles.addPackageButtonText}>Add Package</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.existingPackages}>
          {formData.pricing.packages.map((pkg, index) => (
            <View key={index} style={styles.packageCard}>
              <View style={styles.packageInfo}>
                <Text style={styles.packageTitle}>{pkg.title}</Text>
                <Text style={styles.packageDuration}>{pkg.duration}</Text>
              </View>
              <View style={styles.packageActions}>
                <Text style={styles.packagePrice}>₹{pkg.price}</Text>
                <TouchableOpacity onPress={() => removePackage(index)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  pricingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  priceCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  priceLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  packagesSection: {
    marginTop: 8,
  },
  packageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F4F5',
    marginBottom: 4,
  },
  packageDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  pricingInputs: {
    marginBottom: 24,
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
  packageSection: {
    marginBottom: 24,
  },
  newPackageCard: {
    padding: 20,
    backgroundColor: '#111111',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  newPackageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4F4F5',
    marginBottom: 16,
  },
  packageInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  durationInput: {
    flex: 0.6,
  },
  priceInputSmall: {
    flex: 0.35,
  },
  addPackageButton: {
    backgroundColor: '#374151',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  addPackageButtonText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
  },
  existingPackages: {
    marginTop: 8,
  },
  packageActions: {
    alignItems: 'flex-end',
  },
  removeButton: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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