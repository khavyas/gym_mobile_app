import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'default', 
  style 
}) => {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badge_default: {
    backgroundColor: '#F3F4F6',
  },
  badge_success: {
    backgroundColor: '#D1FAE5',
  },
  badge_warning: {
    backgroundColor: '#FEF3C7',
  },
  badge_danger: {
    backgroundColor: '#FEE2E2',
  },
  badge_primary: {
    backgroundColor: '#DBEAFE',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  text_default: {
    color: '#374151',
  },
  text_success: {
    color: '#065F46',
  },
  text_warning: {
    color: '#92400E',
  },
  text_danger: {
    color: '#991B1B',
  },
  text_primary: {
    color: '#1E40AF',
  },
});