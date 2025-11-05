import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingAppointments = [
    {
      id: 1,
      type: "Personal Training",
      consultant: "Sarah Wilson",
      date: "2024-10-03",
      time: "2:00 PM",
      duration: "60min",
      status: "confirmed",
      location: "Gym Floor 2",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      type: "Nutrition Consultation",
      consultant: "Dr. Mark Chen",
      date: "2024-10-03",
      time: "4:30 PM",
      duration: "45min",
      status: "confirmed",
      location: "Online Session",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      isOnline: true,
    }
  ];

  const completedAppointments = [
    {
      id: 3,
      type: "HIIT Training",
      consultant: "Mike Johnson",
      date: "2024-09-30",
      time: "6:00 PM",
      status: "completed",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
    {
      id: 4,
      type: "Meal Planning",
      consultant: "Dr. Mark Chen",
      date: "2024-09-28",
      time: "3:00 PM",
      status: "completed",
      rating: 4,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    }
  ];

  const packages = [
    {
      id: 1,
      name: "4-Week Transformation",
      consultant: "Sarah Wilson",
      price: 24999,
      duration: "4 weeks",
      sessions: 12,
      description: "Complete fitness transformation with personalized training and nutrition guidance.",
      category: "Personal Training",
      imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      name: "Nutrition Mastery",
      consultant: "Dr. Mark Chen",
      price: 16999,
      duration: "6 weeks",
      sessions: 8,
      description: "Learn sustainable eating habits and meal planning strategies.",
      category: "Nutrition",
      imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      name: "Mindful Movement",
      consultant: "Lisa Rodriguez",
      price: 13499,
      duration: "5 weeks",
      sessions: 10,
      description: "Build flexibility, strength, and mental clarity through yoga practice.",
      category: "Yoga & Meditation",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      name: "Zumba Fitness Party",
      consultant: "Maria Garcia",
      price: 9999,
      duration: "4 weeks",
      sessions: 16,
      description: "High-energy dance workouts that combine Latin rhythms with easy-to-follow moves.",
      category: "Dance Fitness",
      imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop",
    },
    {
      id: 5,
      name: "CrossFit Strength",
      consultant: "Mike Johnson",
      price: 29999,
      duration: "8 weeks",
      sessions: 24,
      description: "Intense functional fitness program combining weightlifting, cardio, and gymnastics.",
      category: "CrossFit",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={styles.star}>
            {star <= rating ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const renderUpcomingCard = (appointment: any) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: appointment.avatarUrl }} 
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentType}>{appointment.type}</Text>
            <Text style={styles.consultantName}>with {appointment.consultant}</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.dateText}>{appointment.date}</Text>
              </View>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>🕐</Text>
                <Text style={styles.timeText}>{appointment.time}</Text>
                <Text style={styles.durationText}>({appointment.duration})</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.icon}>{appointment.isOnline ? '💻' : '📍'}</Text>
              <Text style={[styles.locationText, appointment.isOnline && styles.onlineText]}>
                {appointment.location}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>confirmed</Text>
          </View>
          <TouchableOpacity style={styles.rescheduleButton}>
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>
      {appointment.isOnline && (
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinIcon}>🎥</Text>
          <Text style={styles.joinText}>Join</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCompletedCard = (appointment: any) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: appointment.avatarUrl }} 
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentType}>{appointment.type}</Text>
            <Text style={styles.consultantName}>with {appointment.consultant}</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>📅</Text>
                <Text style={styles.dateText}>{appointment.date}</Text>
              </View>
              <View style={styles.iconTextRow}>
                <Text style={styles.icon}>🕐</Text>
                <Text style={styles.timeText}>{appointment.time}</Text>
              </View>
            </View>
            {renderStars(appointment.rating)}
          </View>
        </View>
        <View style={styles.rightSection}>
          <View style={[styles.statusBadge, styles.completedBadge]}>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>Completed</Text>
          </View>
          <TouchableOpacity style={styles.bookAgainButton}>
            <Text style={styles.bookAgainText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPackageCard = (pkg: any) => (
    <View key={pkg.id} style={styles.packageCard}>
      <Image 
        source={{ uri: pkg.imageUrl }} 
        style={styles.packageImage}
      />
      <View style={styles.packageContent}>
        <View style={styles.packageHeader}>
          <View style={styles.packageTitleSection}>
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.packageConsultant}>by {pkg.consultant}</Text>
          </View>
          <View style={styles.packagePriceSection}>
            <Text style={styles.packagePrice}>₹{pkg.price.toLocaleString('en-IN')}</Text>
            <Text style={styles.packageDuration}>{pkg.duration}</Text>
          </View>
        </View>
        
        <Text style={styles.packageDescription}>{pkg.description}</Text>
        
        <View style={styles.packageFooter}>
          <View style={styles.packageDetails}>
            <Text style={styles.packageSessions}>{pkg.sessions} sessions</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{pkg.category}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.purchaseButton}>
            <Text style={styles.purchaseText}>Purchase Package</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.scrollableHeader}>
          <View>
            <Text style={styles.title}>Sessions</Text>
            <Text style={styles.subtitle}>Manage your appointments and packages</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "completed" && styles.activeTab]}
            onPress={() => setActiveTab("completed")}
          >
            <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "packages" && styles.activeTab]}
            onPress={() => setActiveTab("packages")}
          >
            <Text style={[styles.tabText, activeTab === "packages" && styles.activeTabText]}>
              Packages
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "upcoming" && (
          <View style={styles.tabContent}>
            {upcomingAppointments.map(renderUpcomingCard)}
          </View>
        )}
        
        {activeTab === "completed" && (
          <View style={styles.tabContent}>
            {completedAppointments.map(renderCompletedCard)}
          </View>
        )}
        
        {activeTab === "packages" && (
          <View style={styles.tabContent}>
            {packages.map(renderPackageCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f2e',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollableHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b92a8',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#252b3d',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1a1f2e',
  },
  tabText: {
    fontSize: 14,
    color: '#8b92a8',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#252b3d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  consultantName: {
    fontSize: 14,
    color: '#8b92a8',
    marginBottom: 12,
  },
  dateTimeRow: {
    marginBottom: 8,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#8b92a8',
  },
  timeText: {
    fontSize: 13,
    color: '#8b92a8',
  },
  durationText: {
    fontSize: 13,
    color: '#8b92a8',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#10b981',
  },
  onlineText: {
    color: '#3b82f6',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  completedBadge: {
    backgroundColor: '#059669',
  },
  statusIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  rescheduleButton: {
    paddingVertical: 6,
  },
  rescheduleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  bookAgainButton: {
    paddingVertical: 6,
  },
  bookAgainText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  joinIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  packageCard: {
    backgroundColor: '#252b3d',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  packageImage: {
    width: '100%',
    height: 180,
  },
  packageContent: {
    padding: 20,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  packageTitleSection: {
    flex: 1,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  packageConsultant: {
    fontSize: 13,
    color: '#8b92a8',
  },
  packagePriceSection: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  packageDuration: {
    fontSize: 12,
    color: '#8b92a8',
  },
  packageDescription: {
    fontSize: 14,
    color: '#8b92a8',
    lineHeight: 20,
    marginBottom: 16,
  },
  packageFooter: {
    gap: 12,
  },
  packageDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageSessions: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#1a1f2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#8b92a8',
    fontWeight: '500',
  },
  purchaseButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  purchaseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});