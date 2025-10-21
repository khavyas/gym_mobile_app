import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

interface ConsultantDetails {
  _id: string;
  name: string;
  specialty: string;
  description: string;
  yearsOfExperience: number;
  certifications: string[];
  badges: string[];
  modeOfTraining: 'online' | 'offline' | 'hybrid';
  rating: number;
  reviewsCount: number;
  image: string;
  isVerified: boolean;
  pricing: {
    perSession: number;
    perMonth?: number;
    perWeek?: number;
    packages: Array<{
      title: string;
      duration: string;
      price: number;
      _id: string;
    }>;
  };
  availability: {
    workingHours: {
      start: string;
      end: string;
    };
    status: string;
    nextSlot: string;
    workingDays: string[];
  };
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ConsultantDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { consultantId } = params;

  const [consultant, setConsultant] = useState<ConsultantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('session');

  useEffect(() => {
    if (consultantId) {
      fetchConsultantDetails();
    }
  }, [consultantId]);

  const fetchConsultantDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Please log in to view consultant details');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/consultants/${consultantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setConsultant(response.data);
    } catch (err) {
      console.error('Error fetching consultant details:', err);
      setError('Failed to load consultant details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleBookConsultation = () => {
  if (!consultant) return;

  let price = 0;
  let duration = '';
  let packageType = selectedPackage;

  if (selectedPackage === 'session') {
    price = consultant.pricing.perSession;
    duration = '1 Session';
  } else if (selectedPackage === 'month' && consultant.pricing.perMonth) {
    price = consultant.pricing.perMonth;
    duration = '1 Month';
  } else if (selectedPackage === 'week' && consultant.pricing.perWeek) {
    price = consultant.pricing.perWeek;
    duration = '1 Week';
  } else {
    const pkg = consultant.pricing.packages.find(p => p._id === selectedPackage);
    if (pkg) {
      price = pkg.price;
      duration = pkg.duration;
    }
  }

  // Navigate to booking flow
  router.push({
    pathname: "/dashboards/user/BookingFlow",
    params: {
      consultantId: consultant._id,
      consultantName: consultant.name,
      consultantImage: consultant.image,
      specialty: consultant.specialty,
      packageType: packageType,
      packagePrice: price.toString(),
      packageDuration: duration,
      trainingMode: consultant.modeOfTraining,
    }
  });
};

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online': return '💻';
      case 'offline': return '🏢';
      case 'hybrid': return '🔄';
      default: return '📍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available Now': return '#10B981';
      case 'Available Tomorrow': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading consultant details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !consultant) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Consultant not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConsultantDetails}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultant Details</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={['#1E293B', '#334155']}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{consultant.image}</Text>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(consultant.availability.status) }
                ]} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.consultantName}>{consultant.name}</Text>
                <Text style={styles.consultantSpecialty}>{consultant.specialty}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {consultant.rating || 'New'}</Text>
                  <Text style={styles.reviews}>({consultant.reviewsCount} reviews)</Text>
                  {consultant.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <Text style={styles.description}>{consultant.description}</Text>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{consultant.yearsOfExperience}</Text>
                <Text style={styles.statLabel}>Years Exp.</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getModeIcon(consultant.modeOfTraining)}</Text>
                <Text style={styles.statLabel}>{consultant.modeOfTraining}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{consultant.certifications.length}</Text>
                <Text style={styles.statLabel}>Certifications</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Badges */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesContainer}>
            {consultant.badges.map((badge, index) => (
              <View key={index} style={[
                styles.badge,
                badge === "Expert" || badge === "Premium" ? styles.badgePremium :
                badge === "Top Rated" || badge === "Popular" ? styles.badgePopular :
                styles.badgeDefault
              ]}>
                <Text style={[
                  styles.badgeText,
                  badge === "Expert" || badge === "Premium" ? styles.badgeTextPremium :
                  badge === "Top Rated" || badge === "Popular" ? styles.badgeTextPopular :
                  styles.badgeTextDefault
                ]}>
                  {badge}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.certificationsSection}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.certificationsContainer}>
            {consultant.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <Ionicons name="medal" size={20} color="#F59E0B" />
                <Text style={styles.certificationText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.availabilitySection}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityHeader}>
              <View style={[
                styles.availabilityStatus,
                { backgroundColor: getStatusColor(consultant.availability.status) }
              ]}>
                <Text style={styles.availabilityStatusText}>{consultant.availability.status}</Text>
              </View>
              <Text style={styles.nextSlot}>Next: {consultant.availability.nextSlot}</Text>
            </View>
            
            <View style={styles.workingHoursContainer}>
              <Text style={styles.workingHoursTitle}>Working Hours</Text>
              <Text style={styles.workingHours}>
                {consultant.availability.workingHours.start} - {consultant.availability.workingHours.end}
              </Text>
            </View>

            <View style={styles.workingDaysContainer}>
              <Text style={styles.workingDaysTitle}>Working Days</Text>
              <View style={styles.daysContainer}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <View key={day} style={[
                    styles.dayChip,
                    consultant.availability.workingDays.includes(day) ? styles.dayActive : styles.dayInactive
                  ]}>
                    <Text style={[
                      styles.dayText,
                      consultant.availability.workingDays.includes(day) ? styles.dayTextActive : styles.dayTextInactive
                    ]}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Pricing Options</Text>
          
          {/* Per Session */}
          <TouchableOpacity 
            style={[
              styles.pricingOption,
              selectedPackage === 'session' && styles.pricingOptionSelected
            ]}
            onPress={() => setSelectedPackage('session')}
          >
            <View style={styles.pricingInfo}>
              <Text style={styles.pricingTitle}>Per Session</Text>
              <Text style={styles.pricingDescription}>One-time consultation</Text>
            </View>
            <Text style={styles.pricingPrice}>${consultant.pricing.perSession}</Text>
          </TouchableOpacity>

          {/* Per Month */}
          {consultant.pricing.perMonth && (
            <TouchableOpacity 
              style={[
                styles.pricingOption,
                selectedPackage === 'month' && styles.pricingOptionSelected
              ]}
              onPress={() => setSelectedPackage('month')}
            >
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingTitle}>Monthly Plan</Text>
                <Text style={styles.pricingDescription}>Unlimited consultations for a month</Text>
              </View>
              <Text style={styles.pricingPrice}>${consultant.pricing.perMonth}</Text>
            </TouchableOpacity>
          )}

          {/* Per Week */}
          {consultant.pricing.perWeek && (
            <TouchableOpacity 
              style={[
                styles.pricingOption,
                selectedPackage === 'week' && styles.pricingOptionSelected
              ]}
              onPress={() => setSelectedPackage('week')}
            >
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingTitle}>Weekly Plan</Text>
                <Text style={styles.pricingDescription}>Weekly sessions</Text>
              </View>
              <Text style={styles.pricingPrice}>${consultant.pricing.perWeek}</Text>
            </TouchableOpacity>
          )}

          {/* Packages */}
          {consultant.pricing.packages.map((pkg) => (
            <TouchableOpacity 
              key={pkg._id}
              style={[
                styles.pricingOption,
                selectedPackage === pkg._id && styles.pricingOptionSelected
              ]}
              onPress={() => setSelectedPackage(pkg._id)}
            >
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingTitle}>{pkg.title}</Text>
                <Text style={styles.pricingDescription}>{pkg.duration}</Text>
              </View>
              <Text style={styles.pricingPrice}>${pkg.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBookConsultation}
          disabled={consultant.availability.status === 'Busy'}
        >
          <LinearGradient
            colors={consultant.availability.status === 'Busy' ? ['#6B7280', '#6B7280'] : ['#10B981', '#059669']}
            style={styles.bookButtonGradient}
          >
            <Text style={styles.bookButtonText}>
              {consultant.availability.status === 'Busy' ? 'Not Available' : 'Book Consultation'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    fontSize: 60,
    width: 80,
    height: 80,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#374151',
    borderRadius: 40,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  profileInfo: {
    flex: 1,
    paddingTop: 8,
  },
  consultantName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  consultantSpecialty: {
    fontSize: 16,
    color: '#10B981',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: '#94A3B8',
    marginRight: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  badgesSection: {
    marginBottom: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeDefault: {
    backgroundColor: '#374151',
  },
  badgePopular: {
    backgroundColor: '#3B82F6',
  },
  badgePremium: {
    backgroundColor: '#F59E0B',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeTextDefault: {
    color: '#D1D5DB',
  },
  badgeTextPopular: {
    color: '#FFFFFF',
  },
  badgeTextPremium: {
    color: '#FFFFFF',
  },
  certificationsSection: {
    marginBottom: 24,
  },
  certificationsContainer: {
    gap: 12,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  certificationText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  availabilitySection: {
    marginBottom: 24,
  },
  availabilityCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  availabilityStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availabilityStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  nextSlot: {
    fontSize: 14,
    color: '#94A3B8',
  },
  workingHoursContainer: {
    marginBottom: 16,
  },
  workingHoursTitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  workingHours: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  workingDaysContainer: {
    marginBottom: 0,
  },
  workingDaysTitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
  },
  dayActive: {
    backgroundColor: '#10B981',
  },
  dayInactive: {
    backgroundColor: '#374151',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  dayTextInactive: {
    color: '#94A3B8',
  },
  pricingSection: {
    marginBottom: 24,
  },
  pricingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },
  pricingOptionSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  pricingInfo: {
    flex: 1,
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  pricingDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  pricingPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  bookButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});