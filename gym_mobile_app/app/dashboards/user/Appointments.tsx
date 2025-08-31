import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

export default function Appointments() {
  const upcomingAppointments = [
    {
      id: 1,
      type: "Personal Training",
      consultant: "Marcus Rodriguez",
      date: "Today",
      time: "3:00 PM - 4:00 PM",
      duration: "60 min",
      status: "confirmed",
      location: "Studio A",
      avatar: "💪",
      specialty: "Strength Training",
      price: 60,
      notes: "Focus on upper body strength"
    },
    {
      id: 2,
      type: "Nutrition Consultation",
      consultant: "Dr. Sarah Johnson",
      date: "Tomorrow",
      time: "10:00 AM - 10:30 AM",
      duration: "30 min",
      status: "confirmed",
      location: "Online",
      avatar: "👩‍⚕️",
      specialty: "Sports Nutrition",
      price: 45,
      notes: "Meal plan review and adjustments"
    },
    {
      id: 3,
      type: "Yoga Session",
      consultant: "Alex Chen",
      date: "Dec 28",
      time: "7:00 AM - 8:00 AM",
      duration: "60 min",
      status: "pending",
      location: "Yoga Studio",
      avatar: "🧘‍♂️",
      specialty: "Hatha Yoga",
      price: 35,
      notes: "Morning flow session"
    }
  ];

  const pastAppointments = [
    {
      id: 4,
      type: "Physical Therapy",
      consultant: "Emma Thompson",
      date: "Dec 20",
      time: "2:00 PM - 3:00 PM",
      status: "completed",
      rating: 5,
      avatar: "🏥"
    },
    {
      id: 5,
      type: "Personal Training",
      consultant: "Marcus Rodriguez",
      date: "Dec 18",
      time: "3:00 PM - 4:00 PM",
      status: "completed",
      rating: 5,
      avatar: "💪"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'completed':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderAppointmentCard = (appointment: any, isPast: boolean = false) => (
    <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.appointmentInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{appointment.avatar}</Text>
          </View>
          <View style={styles.basicInfo}>
            <Text style={styles.appointmentType}>{appointment.type}</Text>
            <Text style={styles.consultantName}>{appointment.consultant}</Text>
            {!isPast && <Text style={styles.specialty}>{appointment.specialty}</Text>}
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
          </View>
          {!isPast && (
            <Text style={styles.price}>${appointment.price}</Text>
          )}
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>{appointment.date} • {appointment.time}</Text>
        </View>
        
        {!isPast && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.detailText}>{appointment.duration}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{appointment.location}</Text>
            </View>

            {appointment.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📝</Text>
                <Text style={styles.detailText}>{appointment.notes}</Text>
              </View>
            )}
          </>
        )}

        {isPast && appointment.rating && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>⭐</Text>
            <Text style={styles.detailText}>Rated {appointment.rating}/5</Text>
          </View>
        )}
      </View>

      {!isPast && (
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💬 Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📅 Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>❌ Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Appointments</Text>
          <Text style={styles.subtitle}>Manage your fitness sessions</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </LinearGradient>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        {/* Next Appointment Highlight */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Next Session</Text>
            <LinearGradient
              colors={['#DC2626', '#B91C1C']}
              style={styles.nextAppointmentCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.nextAppointmentContent}>
                <Text style={styles.nextAppointmentType}>{upcomingAppointments[0].type}</Text>
                <Text style={styles.nextAppointmentTime}>
                  {upcomingAppointments[0].date} at {upcomingAppointments[0].time.split(' - ')[0]}
                </Text>
                <Text style={styles.nextAppointmentConsultant}>
                  with {upcomingAppointments[0].consultant}
                </Text>
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 Upcoming Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => renderAppointmentCard(appointment))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📅</Text>
              <Text style={styles.emptyStateTitle}>No Upcoming Appointments</Text>
              <Text style={styles.emptyStateSubtitle}>Book a session with our expert consultants</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Browse Consultants</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📋 Recent Sessions</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View History</Text>
              </TouchableOpacity>
            </View>
            
            {pastAppointments.map(appointment => renderAppointmentCard(appointment, true))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>🔍</Text>
            <Text style={styles.quickActionText}>Find Consultant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>View Analytics</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  nextAppointmentCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextAppointmentContent: {
    flex: 1,
  },
  nextAppointmentType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nextAppointmentTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  nextAppointmentConsultant: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  joinButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  appointmentInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
    width: 48,
    height: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#374151',
    borderRadius: 24,
  },
  basicInfo: {
    flex: 1,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  consultantName: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#DC2626',
  },
  cancelButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});