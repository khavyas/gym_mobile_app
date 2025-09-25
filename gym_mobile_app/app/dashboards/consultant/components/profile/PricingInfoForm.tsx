import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
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
      const pricingData = {
        pricing: {
          perSession: parseFloat(formData.pricing.perSession) || undefined,
          perWeek: parseFloat(formData.pricing.perWeek) || undefined,
          perMonth: parseFloat(formData.pricing.perMonth) || undefined,
          packages: formData.pricing.packages,
        },
      };
await onSave({
  pricing: {
    perSession: parseFloat(formData.pricing.perSession) || undefined,
    perWeek: parseFloat(formData.pricing.perWeek) || undefined,
    perMonth: parseFloat(formData.pricing.perMonth) || undefined,
    packages: formData.pricing.packages,
  }
});

      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save pricing information');
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Pricing Information</Text>
          <Button 
            title="Edit" 
            variant="ghost" 
            size="sm"
            onPress={() => setIsEditing(true)}
          />
        </View>

        <View style={styles.pricingGrid}>
          <Card style={styles.priceCard}>
            <Text style={styles.priceLabel}>Per Session</Text>
            <Text style={styles.priceValue}>
              ${consultant?.pricing?.perSession || '0'}
            </Text>
          </Card>
          <Card style={styles.priceCard}>
            <Text style={styles.priceLabel}>Per Week</Text>
            <Text style={styles.priceValue}>
              ${consultant?.pricing?.perWeek || '0'}
            </Text>
          </Card>
          <Card style={styles.priceCard}>
            <Text style={styles.priceLabel}>Per Month</Text>
            <Text style={styles.priceValue}>
              ${consultant?.pricing?.perMonth || '0'}
            </Text>
          </Card>
        </View>

        <View style={styles.packagesSection}>
          <Text style={styles.label}>Packages</Text>
          {consultant?.pricing?.packages?.length ? (
            consultant.pricing.packages.map((pkg, index) => (
              <Card key={index} style={styles.packageCard}>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageTitle}>{pkg.title}</Text>
                  <Text style={styles.packageDuration}>{pkg.duration}</Text>
                </View>
                <Text style={styles.packagePrice}>${pkg.price}</Text>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyText}>No packages created</Text>
          )}
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={styles.sectionTitle}>Pricing Information</Text>

      <View style={styles.pricingInputs}>
        <Input
          label="Per Session ($)"
          value={formData.pricing.perSession}
          onChangeText={(text) => 
            setFormData({
              ...formData,
              pricing: { ...formData.pricing, perSession: text },
            })
          }
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.priceInput}
        />
        <Input
          label="Per Week ($)"
          value={formData.pricing.perWeek}
          onChangeText={(text) => 
            setFormData({
              ...formData,
              pricing: { ...formData.pricing, perWeek: text },
            })
          }
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.priceInput}
        />
        <Input
          label="Per Month ($)"
          value={formData.pricing.perMonth}
          onChangeText={(text) => 
            setFormData({
              ...formData,
              pricing: { ...formData.pricing, perMonth: text },
            })
          }
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.priceInput}
        />
      </View>

      <View style={styles.packageSection}>
        <Text style={styles.label}>Packages</Text>
        
        <Card style={styles.newPackageCard}>
          <Text style={styles.newPackageTitle}>Add New Package</Text>
          <Input
            label="Package Title"
            value={newPackage.title}
            onChangeText={(text) => setNewPackage({ ...newPackage, title: text })}
            placeholder="e.g. 3-Month Transformation"
          />
          <View style={styles.packageInputRow}>
            <Input
              label="Duration"
              value={newPackage.duration}
              onChangeText={(text) => setNewPackage({ ...newPackage, duration: text })}
              placeholder="e.g. 3 months"
              containerStyle={styles.durationInput}
            />
            <Input
              label="Price ($)"
              value={newPackage.price.toString()}
              onChangeText={(text) => setNewPackage({ ...newPackage, price: parseFloat(text) || 0 })}
              placeholder="0"
              keyboardType="numeric"
              containerStyle={styles.priceInputSmall}
            />
          </View>
          <Button title="Add Package" variant="secondary" onPress={addPackage} />
        </Card>

        <View style={styles.existingPackages}>
          {formData.pricing.packages.map((pkg, index) => (
            <Card key={index} style={styles.packageCard}>
              <View style={styles.packageInfo}>
                <Text style={styles.packageTitle}>{pkg.title}</Text>
                <Text style={styles.packageDuration}>{pkg.duration}</Text>
              </View>
              <View style={styles.packageActions}>
                <Text style={styles.packagePrice}>${pkg.price}</Text>
                <TouchableOpacity onPress={() => removePackage(index)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            </Card>
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
