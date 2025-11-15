import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Notification {
  id: string;
  icon: string; // Changed from strict type to flexible string
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function NotificationModal({
  visible,
  onClose,
  notifications,
  onRemoveNotification,
  onMarkAllRead,
}: NotificationModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="notifications" size={24} color="#fff" />
              <Text style={styles.modalTitle}>
                Notifications ({notifications.length})
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Notifications List - Scrollable */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.notificationsList}
            showsVerticalScrollIndicator={true}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                <Text style={styles.emptyTitle}>All Caught Up!</Text>
                <Text style={styles.emptyMessage}>
                  You have no new notifications
                </Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationCard}>
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: notification.iconBg },
                    ]}
                  >
                    <Ionicons
                      name={notification.icon as any}
                      size={24}
                      color={notification.iconColor}
                    />
                  </View>

                  {/* Content */}
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>
                        {notification.emoji} {notification.title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => onRemoveNotification(notification.id)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="close-circle" size={20} color="#64748b" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>

                    <View style={styles.notificationFooter}>
                      <Text style={styles.notificationTime}>
                        {notification.time}
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

          {/* Footer */}
          {notifications.length > 0 && (
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={onMarkAllRead}
              >
                <Ionicons name="checkmark-done" size={20} color="#fff" />
                <Text style={styles.markAllText}>Mark All Read</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.85,
    height: SCREEN_HEIGHT * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  notificationsList: {
    padding: 16,
    paddingBottom: 24,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 2,
  },
  notificationMessage: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  notificationTime: {
    color: '#64748b',
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyMessage: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  markAllButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 8,
  },
  markAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});