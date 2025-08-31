import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

export default function Consultants() {
  const consultants = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Sports Nutritionist",
      rating: 4.9,
      reviews: 127,
      price: 45,
      experience: "8 years",
      availability: "Available Now",
      image: "👩‍⚕️",
      badges: ["Certified", "Top Rated"],
      nextSlot: "Today 3:00 PM",
      description: "Specializes in performance nutrition and weight management"
    },
    {
      id: 2,
      name: "Alex Chen",
      specialty: "Yoga & Mindfulness Coach",
      rating: 4.8,
      reviews: 89,
      price: 35,
      experience: "5 years",
      availability: "Available Tomorrow",
      image: "🧘‍♂️",
      badges: ["Certified", "Popular"],
      nextSlot: "Tomorrow 7:00 AM",
      description: "Expert in Hatha and Vinyasa yoga with meditation focus"
    },
    {
      id: 3,
      name: "Marcus Rodriguez",
      specialty: "Strength & Conditioning",
      rating: 5.0,
      reviews: 156,
      price: 60,
      experience: "12 years",
      availability: "Busy",
      image: "💪",
      badges: ["Expert", "Premium"],
      nextSlot: "Next Week",
      description: "Former Olympic trainer specializing in strength building"
    },
    {
      id: 4,
      name: "Emma Thompson",
      specialty: "Physical Therapy",
      rating: 4.7,
      reviews: 203,
      price: 55,
      experience: "10 years",
      availability: "Available Now",
      image: "🏥",
      badges: ["Licensed", "Experienced"],
      nextSlot: "Today 5:30 PM",
      description: "Rehabilitation and injury prevention specialist"
    }
  ];

  const specialties = ["All", "Nutrition", "Training", "Therapy", "Yoga", "Cardio"];
  const selectedSpecialty = "All";

  const renderConsultantCard = (consultant: any) => (
    <TouchableOpacity key={consultant.id} style={styles.consultantCard}>
      <View style={styles.cardHeader}>
        <View style={styles.consultantInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{consultant.image}</Text>
            <View style={[
              styles.statusDot,
              consultant.availability === "Available Now" 
                ? styles.statusAvailable 
                : consultant.availability === "Available Tomorrow"
                ? styles.statusSoon
                : styles.statusBusy
            ]} />
          </View>
          <View style={styles.basicInfo}>
            <Text style={styles.consultantName}>{consultant.name}</Text>
            <Text style={styles.consultantSpecialty}>{consultant.specialty}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {consultant.rating}</Text>
              <Text style={styles.reviews}>({consultant.reviews} reviews)</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${consultant.price}</Text>
          <Text style={styles.priceUnit}>per session</Text>
        </View>
      </View>

      <Text style={styles.description}>{consultant.description}</Text>

      <View style={styles.badgesContainer}>
        {consultant.badges.map((badge: string, index: number) => (
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

      <View style={styles.cardFooter}>
        <View style={styles.availabilityInfo}>
          <Text style={styles.availabilityLabel}>Next Available:</Text>
          <Text style={styles.availabilityTime}>{consultant.nextSlot}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.bookButton,
            consultant.availability === "Busy" && styles.bookButtonDisabled
          ]}>
            <Text style={[
              styles.bookButtonText,
              consultant.availability === "Busy" && styles.bookButtonTextDisabled
            ]}>
              {consultant.availability === "Busy" ? "Unavailable" : "Book Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Find a Consultant</Text>
          <Text style={styles.subtitle}>Expert guidance for your fitness journey</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search consultants..."
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Specialty Filter */}
      <View style={styles.specialtyContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.specialtyList}>
            {specialties.map((specialty, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.specialtyChip,
                  specialty === selectedSpecialty && styles.specialtyChipActive
                ]}
              >
                <Text style={[
                  styles.specialtyText,
                  specialty === selectedSpecialty && styles.specialtyTextActive
                ]}>
                  {specialty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Featured Section */}
      <View style={styles.featuredSection}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.featuredCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>🎯 Free Consultation</Text>
            <Text style={styles.featuredSubtitle}>
              Get a 15-min free session with any new consultant
            </Text>
            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Claim Now</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Consultants List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>{consultants.length} consultants available</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sort by Rating 📊</Text>
          </TouchableOpacity>
        </View>

        {consultants.map(consultant => renderConsultantCard(consultant))}
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  specialtyContainer: {
    marginBottom: 20,
  },
  specialtyList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  specialtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  specialtyChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  specialtyText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  specialtyTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredCard: {
    borderRadius: 16,
    padding: 20,
  },
  featuredContent: {
    alignItems: 'flex-start',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  featuredButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  sortButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },
  consultantCard: {
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
    marginBottom: 12,
  },
  consultantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 40,
    width: 56,
    height: 56,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#374151',
    borderRadius: 28,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  statusAvailable: {
    backgroundColor: '#10B981',
  },
  statusSoon: {
    backgroundColor: '#F59E0B',
  },
  statusBusy: {
    backgroundColor: '#EF4444',
  },
  basicInfo: {
    flex: 1,
  },
  consultantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  consultantSpecialty: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 6,
  },
  reviews: {
    fontSize: 12,
    color: '#94A3B8',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  priceUnit: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
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
    fontSize: 10,
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  availabilityTime: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#374151',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookButtonTextDisabled: {
    color: '#94A3B8',
  },
});