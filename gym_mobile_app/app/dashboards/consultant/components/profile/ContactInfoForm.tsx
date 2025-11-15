import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking, TouchableOpacity, TextInput } from 'react-native';
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
      <View style={contactStyles.card}>
        <View style={contactStyles.header}>
          <Text style={contactStyles.sectionTitle}>Contact Information</Text>
          <TouchableOpacity 
            style={contactStyles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={contactStyles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={contactStyles.contactList}>
          <View style={contactStyles.contactItem}>
            <Text style={contactStyles.contactIcon}>📞</Text>
            <View style={contactStyles.contactDetails}>
              <Text style={contactStyles.contactLabel}>Phone</Text>
              <TouchableOpacity 
                onPress={consultant?.contact?.phone ? handleCall : undefined}
                disabled={!consultant?.contact?.phone}
              >
                <Text 
                  style={[
                    contactStyles.contactValue, 
                    consultant?.contact?.phone && contactStyles.clickable
                  ]}
                >
                  {consultant?.contact?.phone || 'Not provided'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={contactStyles.contactItem}>
            <Text style={contactStyles.contactIcon}>📧</Text>
            <View style={contactStyles.contactDetails}>
              <Text style={contactStyles.contactLabel}>Email</Text>
              <TouchableOpacity 
                onPress={consultant?.contact?.email ? handleEmail : undefined}
                disabled={!consultant?.contact?.email}
              >
                <Text 
                  style={[
                    contactStyles.contactValue, 
                    consultant?.contact?.email && contactStyles.clickable
                  ]}
                >
                  {consultant?.contact?.email || 'Not provided'}
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity 
                onPress={consultant?.contact?.website ? handleWebsite : undefined}
                disabled={!consultant?.contact?.website}
              >
                <Text 
                  style={[
                    contactStyles.contactValue, 
                    consultant?.contact?.website && contactStyles.clickable
                  ]}
                >
                  {consultant?.contact?.website || 'Not provided'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={contactStyles.card}>
      <Text style={contactStyles.sectionTitle}>Contact Information</Text>

      <View style={contactStyles.inputContainer}>
        <Text style={contactStyles.inputLabel}>Phone Number</Text>
        <TextInput
          style={contactStyles.input}
          value={formData.contact.phone}
          onChangeText={(text) => 
            setFormData({
              ...formData,
              contact: { ...formData.contact, phone: text },
            })
          }
          placeholder="+1 (555) 123-4567"
          placeholderTextColor="#6B7280"
          keyboardType="phone-pad"
        />
      </View>

      <View style={contactStyles.inputContainer}>
        <Text style={contactStyles.inputLabel}>Email Address</Text>
        <TextInput
          style={contactStyles.input}
          value={formData.contact.email}
          onChangeText={(text) => 
            setFormData({
              ...formData,
              contact: { ...formData.contact, email: text },
            })
          }
          placeholder="your.email@example.com"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={contactStyles.inputContainer}>
        <Text style={contactStyles.inputLabel}>Location</Text>
        <TextInput
          style={contactStyles.input}
          value={formData.contact.location}
          onChangeText={(text) => 
            setFormData({
              ...formData,
              contact: { ...formData.contact, location: text },
            })
          }
          placeholder="City, State/Country"
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={contactStyles.inputContainer}>
        <Text style={contactStyles.inputLabel}>Website (Optional)</Text>
        <TextInput
          style={contactStyles.input}
          value={formData.contact.website}
          onChangeText={(text) => 
            setFormData({
              ...formData,
              contact: { ...formData.contact, website: text },
            })
          }
          placeholder="https://yourwebsite.com"
          placeholderTextColor="#6B7280"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={contactStyles.buttonRow}>
        <TouchableOpacity 
          style={contactStyles.cancelButton}
          onPress={() => setIsEditing(false)}
        >
          <Text style={contactStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={contactStyles.saveButton}
          onPress={handleSave}
        >
          <Text style={contactStyles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const contactStyles = StyleSheet.create({
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
  contactList: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
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
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#F4F4F5',
    fontWeight: '500',
  },
  clickable: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
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