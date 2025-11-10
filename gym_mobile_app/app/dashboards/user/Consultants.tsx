import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

interface Consultant {
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
}

export default function Consultants() {
  const router = useRouter();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');

  // const specialties = ["All", "Nutrition", "Training", "Therapy", "Yoga", "Cardio"];

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Please log in to view consultants');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/consultants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setConsultants(response.data);
    } catch (err) {
      console.error('Error fetching consultants:', err);
      setError('Failed to load consultants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedConsultants = useMemo(() => {
    let filtered = consultants;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(consultant => {
        return (
          // Search in name
          (consultant.name?.toLowerCase() || '').includes(query) ||
          // Search in specialty
          (consultant.specialty?.toLowerCase() || '').includes(query) ||
          // Search in description
          (consultant.description?.toLowerCase() || '').includes(query) ||
          // Search in badges
          (consultant.badges && consultant.badges.some(badge => badge?.toLowerCase().includes(query))) ||
          // Search in certifications
          (consultant.certifications && consultant.certifications.some(cert => cert?.toLowerCase().includes(query))) ||
          // Search in mode of training
          (consultant.modeOfTraining?.toLowerCase() || '').includes(query) ||
          // Search in availability status
          (consultant.availability?.status?.toLowerCase() || '').includes(query)
        );
      });
    }

    if (selectedSpecialty !== "All") {
      filtered = filtered.filter(consultant => 
        consultant.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return a.pricing.perSession - b.pricing.perSession;
        case 'experience':
          return b.yearsOfExperience - a.yearsOfExperience;
        default:
          return 0;
      }
    });

    return sorted;
  }, [consultants, searchQuery, selectedSpecialty, sortBy]);

  const handleConsultantPress = (consultant: Consultant) => {
    router.push({
      pathname: "/dashboards/user/ConsultantDetails",
      params: {
        consultantId: consultant._id,
        name: consultant.name,
        specialty: consultant.specialty,
        image: consultant.image,
      }
    });
  };

  const handleSpecialtyPress = (specialty: string) => {
    setSelectedSpecialty(specialty);
  };

  const handleSortPress = () => {
    const sortOptions = ['rating', 'price', 'experience'] as const;
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };

  const getSortText = () => {
    switch (sortBy) {
      case 'rating':
        return 'Sort by Rating ⭐';
      case 'price':
        return 'Sort by Price 💰';
      case 'experience':
        return 'Sort by Experience 🎓';
      default:
        return 'Sort by Rating ⭐';
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderConsultantCard = (consultant: Consultant) => (
    <TouchableOpacity 
      key={consultant._id} 
      style={styles.consultantCard}
      onPress={() => handleConsultantPress(consultant)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.consultantInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{consultant.image}</Text>
            <View style={[
              styles.statusDot,
              consultant.availability.status === "Available Now" 
                ? styles.statusAvailable 
                : consultant.availability.status === "Available Tomorrow"
                ? styles.statusSoon
                : styles.statusBusy
            ]} />
          </View>
          <View style={styles.basicInfo}>
            <Text style={styles.consultantName}>{consultant.name}</Text>
            <Text style={styles.consultantSpecialty}>{consultant.specialty}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {consultant.rating || 'New'}</Text>
              <Text style={styles.reviews}>({consultant.reviewsCount} reviews)</Text>
              <Text style={styles.experience}>• {consultant.yearsOfExperience}y exp</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{consultant.pricing.perSession}</Text>
          <Text style={styles.priceUnit}>per session</Text>
          <Text style={styles.trainingMode}>{consultant.modeOfTraining}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>{consultant.description}</Text>

      <View style={styles.badgesContainer}>
        {consultant.badges.slice(0, 3).map((badge: string, index: number) => (
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
        {consultant.badges.length > 3 && (
          <View style={styles.badgeMore}>
            <Text style={styles.badgeMoreText}>+{consultant.badges.length - 3}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.availabilityInfo}>
          <Text style={styles.availabilityLabel}>Next Available:</Text>
          <Text style={styles.availabilityTime}>{consultant.availability.nextSlot}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageButtonText}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[
            styles.bookButton,
            consultant.availability.status === "Busy" && styles.bookButtonDisabled
          ]}>
            <Text style={[
              styles.bookButtonText,
              consultant.availability.status === "Busy" && styles.bookButtonTextDisabled
            ]}>
              {consultant.availability.status === "Busy" ? "Unavailable" : "Book Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading consultants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConsultants}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* MAIN SCROLLVIEW - Everything scrolls together now */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        stickyHeaderIndices={[]} // Remove if you don't want any sticky headers
      >
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

        {/* View My Appointments Button */}
        <View style={styles.appointmentsButtonContainer}>
          <TouchableOpacity 
            style={styles.appointmentsButton}
            onPress={() => router.push('/dashboards/user/Appointments')}
          >
            <View style={styles.appointmentsButtonContent}>
              <View style={styles.appointmentsIconContainer}>
                <Text style={styles.appointmentsIcon}>📅</Text>
              </View>
              <View style={styles.appointmentsTextContainer}>
                <Text style={styles.appointmentsButtonTitle}>My Appointments</Text>
                <Text style={styles.appointmentsButtonSubtitle}>View your scheduled sessions</Text>
              </View>
              <Text style={styles.appointmentsArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>


        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, specialty, skills..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          {searchQuery.length > 0 && (
            <Text style={styles.searchHint}>
              Searching across name, specialty, description, badges & skills
            </Text>
          )}
        </View>

        {/* Specialty Filter */}
        {/* <View style={styles.specialtyContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.specialtyList}>
              {specialties.map((specialty, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.specialtyChip,
                    specialty === selectedSpecialty && styles.specialtyChipActive
                  ]}
                  onPress={() => handleSpecialtyPress(specialty)}
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
        </View> */}

        {/* Results Header with Enhanced Sort */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredAndSortedConsultants.length} consultant{filteredAndSortedConsultants.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </Text>
          <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
            <Text style={styles.sortText}>{getSortText()}</Text>
          </TouchableOpacity>
        </View>

        {/* Consultants List */}
        {filteredAndSortedConsultants.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsEmoji}>🔍</Text>
            <Text style={styles.noResultsTitle}>No consultants found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search terms or filters
            </Text>
            {(searchQuery || selectedSpecialty !== "All") && (
              <TouchableOpacity 
                style={styles.clearFiltersButton} 
                onPress={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("All");
                }}
              >
                <Text style={styles.clearFiltersText}>Clear all filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredAndSortedConsultants.map(consultant => renderConsultantCard(consultant))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appointmentsButtonContainer: {
  paddingHorizontal: 20,
  marginBottom: 20,
},
appointmentsButton: {
  backgroundColor: '#1E293B',
  borderRadius: 16,
  padding: 16,
  borderWidth: 1,
  borderColor: '#10B981',
  shadowColor: '#10B981',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
},
appointmentsButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},
appointmentsIconContainer: {
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  justifyContent: 'center',
  alignItems: 'center',
},
appointmentsIcon: {
  fontSize: 24,
},
appointmentsTextContainer: {
  flex: 1,
},
appointmentsButtonTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#FFFFFF',
  marginBottom: 2,
},
appointmentsButtonSubtitle: {
  fontSize: 13,
  color: '#94A3B8',
},
appointmentsArrow: {
  fontSize: 20,
  color: '#10B981',
  fontWeight: '600',
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
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContainer: {
    paddingBottom: 20,
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
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#94A3B8',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchHint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  specialtyContainer: {
    marginBottom: 16,
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
    flex: 1,
  },
  sortButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
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
    flexWrap: 'wrap',
  },
  rating: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 6,
  },
  reviews: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 6,
  },
  experience: {
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
  trainingMode: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'capitalize',
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
    alignItems: 'center',
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
  badgeMore: {
    backgroundColor: '#64748B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeMoreText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
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
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResultsEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
