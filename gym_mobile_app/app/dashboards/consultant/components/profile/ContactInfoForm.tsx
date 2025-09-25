import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Consultant } from '../../services/types';

interface ContactInfoFormProps {
  consultant?: Consultant;
  onSave: (data: any) => Promise<void>;
  editable?: boolean;
  isLoading?: boolean;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  consultant,
  onSave,
  editable = false,
}) => {
  const [formData, setFormData] = useState({
    contact: {
      phone: consultant?.contact?.phone || '',
      email: consultant?.contact?.email || '',
      location: consultant?.contact?.location || '',
      website: consultant?.contact?.website || '',
    },
  });

  const [isEditing, setIsEditing] = useState(editable);

  const handleSave = async () => {
    try {
      await onSave({
  contact: {
    phone: formData.contact.phone,
    email: formData.contact.email,
    website: formData.contact.website,
    location: formData.contact.location,
  }
});

      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact information');
    }
  };

  const handleCall = () => {
    if (consultant?.contact?.phone) {
      Linking.openURL(`tel:${consultant.contact.phone}`);
    }
  };

  const handleEmail = () => {
    if (consultant?.contact?.email) {
      Linking.openURL(`mailto:${consultant.contact.email}`);
    }
  };

  const handleWebsite = () => {
    if (consultant?.contact?.website) {
      Linking.openURL(consultant.contact.website);
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <View style={contactStyles.header}>
          <Text style={contactStyles.sectionTitle}>Contact Information</Text>
          <Button 
            title="Edit" 
            variant="ghost" 
            size="sm"
            onPress={() => setIsEditing(true)}
          />
        </View>

        <View style={contactStyles.contactList}>
          <View style={contactStyles.contactItem}>
            <Text style={contactStyles.contactIcon}>📞</Text>
            <View style={contactStyles.contactDetails}>
              <Text style={contactStyles.contactLabel}>Phone</Text>
              <Text 
                style={[contactStyles.contactValue, consultant?.contact?.phone && contactStyles.clickable]}
                onPress={consultant?.contact?.phone ? handleCall : undefined}
              >
                {consultant?.contact?.phone || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={contactStyles.contactItem}>
            <Text style={contactStyles.contactIcon}>📧</Text>
            <View style={contactStyles.contactDetails}>
              <Text style={contactStyles.contactLabel}>Email</Text>
              <Text 
                style={[contactStyles.contactValue, consultant?.contact?.email && contactStyles.clickable]}
                onPress={consultant?.contact?.email ? handleEmail : undefined}
              >
                {consultant?.contact?.email || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={contactStyles.contactItem}>
            <Text style={contactStyles.contactIcon}>📍</Text>
            <View style={contactStyles.contactDetails}>
              <Text style={contactStyles.contactLabel}>Location</Text>
              <Text style={contactStyles.contactValue}>
                {consultant?.contact?.location || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={contactStyles.contactItem}>
            <Text style={contactStyles.contactIcon}>🌐</Text>
            <View style={contactStyles.contactDetails}>
              <Text style={contactStyles.contactLabel}>Website</Text>
              <Text 
                style={[contactStyles.contactValue, consultant?.contact?.website && contactStyles.clickable]}
                onPress={consultant?.contact?.website ? handleWebsite : undefined}
              >
                {consultant?.contact?.website || 'Not provided'}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={contactStyles.sectionTitle}>Contact Information</Text>

      <Input
        label="Phone Number"
        value={formData.contact.phone}
        onChangeText={(text) => 
          setFormData({
            ...formData,
            contact: { ...formData.contact, phone: text },
          })
        }
        placeholder="+1 (555) 123-4567"
        keyboardType="phone-pad"
      />

      <Input
        label="Email Address"
        value={formData.contact.email}
        onChangeText={(text) => 
          setFormData({
            ...formData,
            contact: { ...formData.contact, email: text },
          })
        }
        placeholder="your.email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Location"
        value={formData.contact.location}
        onChangeText={(text) => 
          setFormData({
            ...formData,
            contact: { ...formData.contact, location: text },
          })
        }
        placeholder="City, State/Country"
      />

      <Input
        label="Website (Optional)"
        value={formData.contact.website}
        onChangeText={(text) => 
          setFormData({
            ...formData,
            contact: { ...formData.contact, website: text },
          })
        }
        placeholder="https://yourwebsite.com"
        keyboardType="url"
        autoCapitalize="none"
      />

      <View style={contactStyles.buttonRow}>
        <Button 
          title="Cancel" 
          variant="secondary" 
          onPress={() => setIsEditing(false)}
          style={contactStyles.button}
        />
        <Button 
          title="Save" 
          variant="primary" 
          onPress={handleSave}
          style={contactStyles.button}
        />
      </View>
    </Card>
  );
};

const contactStyles = StyleSheet.create({
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
  contactList: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#111827',
  },
  clickable: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 0.48,
  },
});
