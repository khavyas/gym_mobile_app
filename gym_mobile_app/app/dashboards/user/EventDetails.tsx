
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';

const { width, height } = Dimensions.get('window');

// Define the type for route parameters
interface EventParams {
  eventId: string;
  type: string;
  title: string;
  time: string;
  duration: string;
  cost: string;
  benefits: string;
  instructor: string;
  locationType: 'online' | 'in-person' | 'hybrid'; 
  location: string; 
  meetingLink?: string;
  address?: string; 
  description: string;
  gymCenter: string;
}

export default function EventDetails() {
  const router = useRouter();
  const params = useLocalSearchParams() as unknown as EventParams;
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Get icon and metadata based on event type
  const getEventData = () => {
    const titleLower = params.title.toLowerCase();
    
    if (titleLower.includes('zumba') || titleLower.includes('dance')) {
      return {
        icon: '💃',
        gradientColors: ['#EC4899', '#8B5CF6'],
        difficulty: 'Intermediate',
        category: 'Dance Fitness',
        equipment: 'None required'
      };
    } else if (titleLower.includes('meditation') || titleLower.includes('mindfulness')) {
      return {
        icon: '🧘‍♂️',
        gradientColors: ['#3B82F6', '#1D4ED8'],
        difficulty: 'Beginner',
        category: 'Mindfulness',
        equipment: 'Yoga mat (optional)'
      };
    } else if (titleLower.includes('yoga')) {
      return {
        icon: '🧘‍♀️',
        gradientColors: ['#10B981', '#059669'],
        difficulty: 'All levels',
        category: 'Flexibility & Strength',
        equipment: 'Yoga mat, blocks'
      };
    } else if (titleLower.includes('cardio') || titleLower.includes('hiit')) {
      return {
        icon: '🔥',
        gradientColors: ['#EF4444', '#DC2626'],
        difficulty: 'High',
        category: 'Cardio Training',
        equipment: 'None required'
      };
    } else if (titleLower.includes('strength') || titleLower.includes('weight')) {
      return {
        icon: '🏋️‍♂️',
        gradientColors: ['#F59E0B', '#D97706'],
        difficulty: 'Intermediate',
        category: 'Strength Training',
        equipment: 'Weights, resistance bands'
      };
    } else if (titleLower.includes('pilates')) {
      return {
        icon: '🤸‍♀️',
        gradientColors: ['#8B5CF6', '#7C3AED'],
        difficulty: 'Intermediate',
        category: 'Core & Flexibility',
        equipment: 'Pilates mat, props'
      };
    } else {
      return {
        icon: '🎯',
        gradientColors: ['#6366F1', '#4F46E5'],
        difficulty: 'Mixed',
        category: 'Fitness',
        equipment: 'Varies'
      };
    }
  };

  const eventData = getEventData();

  const handleBookClass = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // In a real app, this would navigate to a booking screen or make an API call
    alert(`Booking ${params.title} with ${params.instructor}`);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you'd save this to backend or local storage
  };

  const handleJoinOnline = () => {
    if (params.meetingLink) {
      // In a real app, this would open the meeting link
      alert(`Opening meeting: ${params.meetingLink}`);
    } else {
      alert('Meeting link will be provided 15 minutes before the session starts.');
    }
  };

  const handleGetDirections = () => {
    if (params.address) {
      // In a real app, this would open maps with directions
      alert(`Opening directions to: ${params.address}`);
    } else {
      alert('Address details will be provided after booking.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Custom Header with Floating Back Button */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.9)', 'transparent']}
          style={styles.headerGradient}
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Class Details</Text>
          <TouchableOpacity onPress={toggleBookmark} style={styles.bookmarkButton}>
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isBookmarked ? "#F59E0B" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Card with Enhanced Design */}
        <Animated.View 
          style={[
            styles.heroContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={eventData.gradientColors as unknown as readonly [string, string]}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroPattern} />
            <View style={styles.heroContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.eventIcon}>{eventData.icon}</Text>
                <View style={styles.iconGlow} />
              </View>
              <Text style={styles.eventTitle}>{params.title}</Text>
              <Text style={styles.eventInstructor}>with {params.instructor}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{eventData.category}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={20} color="#10B981" />
            <Text style={styles.statValue}>{params.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="fitness-outline" size={20} color="#8B5CF6" />
            <Text style={styles.statValue}>{eventData.difficulty}</Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="pricetag-outline" size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{params.cost}</Text>
            <Text style={styles.statLabel}>Price</Text>
          </View>
        </View>

        {/* Enhanced Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Session Information</Text>
          
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <View style={styles.iconBackground}>
                  <Ionicons name="calendar-outline" size={20} color="#10B981" />
                </View>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Schedule</Text>
                <Text style={styles.detailValue}>{params.time}</Text>
                <Text style={styles.detailSubtext}>Please arrive 10 minutes early</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <View style={styles.iconBackground}>
                  <Ionicons name="barbell-outline" size={20} color="#8B5CF6" />
                </View>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Equipment</Text>
                <Text style={styles.detailValue}>{eventData.equipment}</Text>
                <Text style={styles.detailSubtext}>Available at the studio</Text>
              </View>
            </View>

            <View style={styles.detailDivider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <View style={styles.iconBackground}>
                  <Ionicons name="business-outline" size={20} color="#EF4444" />
                </View>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Venue</Text>
                <Text style={styles.detailValue}>{params.gymCenter}</Text>
                <Text style={styles.detailSubtext}>Certified fitness center</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Location & Access</Text>
          
          <View style={styles.locationCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <View style={[styles.iconBackground, { 
                  backgroundColor: params.locationType === 'online' 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : params.locationType === 'hybrid'
                    ? 'rgba(139, 92, 246, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)' 
                }]}>
                  <Ionicons 
                    name={params.locationType === 'online' 
                      ? "videocam-outline" 
                      : params.locationType === 'hybrid'
                      ? "layers-outline"
                      : "location-outline"
                    } 
                    size={20} 
                    color={params.locationType === 'online' 
                      ? "#3B82F6" 
                      : params.locationType === 'hybrid'
                      ? "#8B5CF6"
                      : "#EF4444"
                    } 
                  />
                </View>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Session Type</Text>
                <Text style={styles.detailValue}>
                  {params.locationType === 'online' 
                    ? 'Online Session' 
                    : params.locationType === 'hybrid'
                    ? 'Hybrid Session'
                    : 'In-Person Session'
                  }
                </Text>
                <Text style={styles.detailSubtext}>
                  {params.locationType === 'online' 
                    ? 'Join from anywhere' 
                    : params.locationType === 'hybrid'
                    ? 'Choose online or in-person'
                    : 'Physical attendance required'
                  }
                </Text>
              </View>
            </View>

            <View style={styles.detailDivider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <View style={styles.iconBackground}>
                  <Ionicons 
                    name={params.locationType === 'online' ? "globe-outline" : "map-outline"} 
                    size={20} 
                    color="#10B981" 
                  />
                </View>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  {params.locationType === 'online' ? 'Platform' : 'Venue'}
                </Text>
                <Text style={styles.detailValue}>{params.location}</Text>
                
                {/* Online Meeting Link */}
                {(params.locationType === 'online' || params.locationType === 'hybrid') && (
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={handleJoinOnline}
                  >
                    <Ionicons name="link-outline" size={14} color="#3B82F6" />
                    <Text style={styles.linkText}>
                      {params.meetingLink ? 'Join Meeting' : 'Meeting Link (Available Soon)'}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {/* In-Person Directions */}
                {(params.locationType === 'in-person' || params.locationType === 'hybrid') && params.address && (
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={handleGetDirections}
                  >
                    <Ionicons name="navigate-outline" size={14} color="#EF4444" />
                    <Text style={styles.linkText}>Get Directions</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Show address for in-person/hybrid or meeting link for online */}
            {((params.locationType !== 'online' && params.address) || 
              (params.locationType === 'online' && params.meetingLink)) && (
              <>
                <View style={styles.detailDivider} />
                
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <View style={styles.iconBackground}>
                      <Ionicons 
                        name={params.locationType === 'online' ? "link-outline" : "home-outline"} 
                        size={20} 
                        color="#8B5CF6" 
                      />
                    </View>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>
                      {params.locationType === 'online' ? 'Meeting Link' : 'Address'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {params.locationType === 'online' 
                        ? (params.meetingLink || 'Link will be provided') 
                        : (params.address || 'Address will be provided')
                      }
                    </Text>
                    <Text style={styles.detailSubtext}>
                      {params.locationType === 'online' 
                        ? 'Link available 15 minutes before class' 
                        : 'Please arrive 10 minutes early'
                      }
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Description Section */}
        {params.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About This Class</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{params.description}</Text>
            </View>
          </View>
        )}

        {/* Enhanced Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>What You'll Gain</Text>
          <View style={styles.benefitsGrid}>
            {params.benefits.split(', ').map((benefit, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.benefitCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim
                    }]
                  }
                ]}
              >
                <LinearGradient
                  colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                  style={styles.benefitGradient}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.benefitText}>{benefit.trim()}</Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Instructor Profile Card */}
        <View style={styles.instructorSection}>
          <Text style={styles.sectionTitle}>Your Instructor</Text>
          <View style={styles.instructorCard}>
            <View style={styles.instructorAvatar}>
              <Text style={styles.instructorInitial}>
                {params.instructor.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>{params.instructor}</Text>
              <Text style={styles.instructorTitle}>Certified {eventData.category} Instructor</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={12} color="#F59E0B" />
                ))}
                <Text style={styles.ratingText}>4.9 • 127 reviews</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.tryFreeButton}>
            <Ionicons name="play-outline" size={20} color="#FFFFFF" />
            <Text style={styles.tryFreeText}>Try Free Preview</Text>
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity style={styles.bookButton} onPress={handleBookClass}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.bookGradient}
              >
                <Ionicons name="calendar" size={20} color="#FFFFFF" />
                <Text style={styles.bookButtonText}>Book This Class</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 120,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookmarkButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  scrollContainer: {
    paddingTop: 120,
    paddingBottom: 40,
  },
  heroContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  heroCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
  },
  heroPattern: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  eventIcon: {
    fontSize: 56,
    zIndex: 2,
  },
  iconGlow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    zIndex: 1,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  eventInstructor: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  detailsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  detailCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 4,
  },
  detailIconContainer: {
    marginRight: 16,
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  detailSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  locationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  descriptionSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  descriptionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  descriptionText: {
    fontSize: 15,
    color: '#E2E8F0',
    lineHeight: 24,
  },
  benefitsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  benefitsGrid: {
    gap: 12,
  },
  benefitCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  benefitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  benefitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  instructorSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  instructorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  instructorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  instructorInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 6,
  },
  messageButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  actionContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tryFreeButton: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  tryFreeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bookGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

