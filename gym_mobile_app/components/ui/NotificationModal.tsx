import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export interface Notification {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  emoji: string;
  message: string;
  time: string;
  actionButton?: string;
  onAction?: () => void;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationModal({
  visible,
  onClose,
  notifications,
  onRemoveNotification,
  onMarkAllRead,
}: NotificationModalProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleRemove = (id: string) => {
    onRemoveNotification(id);
  };

  const getIconName = (iconType: string): any => {
    const iconMap: { [key: string]: any } = {
      activity: 'pulse',
      water: 'water',
      trophy: 'trophy',
      medical: 'medical',
      moon: 'moon',
      fitness: 'fitness',
    };
    return iconMap[iconType] || 'notifications';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <BlurView intensity={20} tint="dark" style={styles.blurView}>
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View
              style={[
                styles.notificationPanel,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Ionicons name="notifications" size={24} color="#10B981" />
                  <Text style={styles.headerTitle}>Notifications</Text>
                  {notifications.length > 0 && (
                    <View style={styles.headerBadge}>
                      <Text style={styles.headerBadgeText}>
                        {notifications.length}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.headerRight}>
                  {notifications.length > 0 && (
                    <TouchableOpacity
                      style={styles.markAllButton}
                      onPress={onMarkAllRead}
                    >
                      <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notifications List */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
              >
                {notifications.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="notifications-off-outline"
                      size={64}
                      color="#475569"
                    />
                    <Text style={styles.emptyStateText}>No notifications</Text>
                    <Text style={styles.emptyStateSubtext}>
                      You're all caught up!
                    </Text>
                  </View>
                ) : (
                  notifications.map((notification) => (
                    <View key={notification.id} style={styles.notificationCard}>
                      <View style={styles.notificationContent}>
                        {/* Icon */}
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: notification.iconBg },
                          ]}
                        >
                          <Ionicons
                            name={getIconName(notification.icon)}
                            size={20}
                            color={notification.iconColor}
                          />
                        </View>

                        {/* Content */}
                        <View style={styles.contentContainer}>
                          <View style={styles.titleRow}>
                            <Text style={styles.notificationTitle}>
                              {notification.emoji} {notification.title}
                            </Text>
                            <View style={styles.timeAndClose}>
                              <Text style={styles.notificationTime}>
                                {notification.time}
                              </Text>
                              <TouchableOpacity
                                onPress={() => handleRemove(notification.id)}
                                style={styles.removeButton}
                              >
                                <Ionicons name="close" size={18} color="#64748B" />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Text style={styles.notificationMessage}>
                            {notification.message}
                          </Text>
                          {notification.actionButton && (
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={notification.onAction}
                            >
                              <Text style={styles.actionButtonText}>
                                {notification.actionButton}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  blurView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
  },
  notificationPanel: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    backgroundColor: '#0F172A',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
  },
  markAllText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  notificationCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
    overflow: 'hidden',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  timeAndClose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#64748B',
  },
  removeButton: {
    padding: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
});
