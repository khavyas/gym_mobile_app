import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Alert, TextInput, InteractionManager} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

interface BookingData {
  consultantId: string;
  consultantName: string;
  consultantImage: string;
  specialty: string;
  packageType: string;
  packagePrice: number;
  packageDuration: string;
  selectedDate: string | null;
  selectedTime: string | null;
  mode: 'online' | 'offline' | null;
  notes: string;
  location: string;
}

const STEPS = [
  { id: 1, title: 'Package', icon: 'pricetag' },
  { id: 2, title: 'Date & Time', icon: 'calendar' },
  { id: 3, title: 'Details', icon: 'document-text' },
  { id: 4, title: 'Payment', icon: 'card' },
  { id: 5, title: 'Confirm', icon: 'checkmark-circle' },
  { id: 6, title: 'Success', icon: 'checkmark-done-circle' },
];

export default function BookingFlow() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    consultantId: params.consultantId as string,
    consultantName: params.consultantName as string,
    consultantImage: params.consultantImage as string,
    specialty: params.specialty as string,
    packageType: params.packageType as string,
    packagePrice: Number(params.packagePrice),
    packageDuration: params.packageDuration as string,
    selectedDate: null,
    selectedTime: null,
    mode: params.trainingMode === 'hybrid' ? null : params.trainingMode as any,
    notes: '',
    location: '',
  });

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Date selection state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  
  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date.toISOString().split('T')[0],
      });
    }
    return dates;
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM'
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card', recommended: true },
    { id: 'upi', name: 'UPI', icon: 'phone-portrait' },
    { id: 'wallet', name: 'Wallet', icon: 'wallet' },
  ];

  const [selectedPayment, setSelectedPayment] = useState('card');

  useEffect(() => {
    animateStepTransition();
  }, [currentStep]);

  const animateStepTransition = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

const handleNext = () => {
  if (currentStep === 1) {
    setCurrentStep(2);
  } else if (currentStep === 2) {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Required', 'Please select date and time');
      return;
    }
    setBookingData({ ...bookingData, selectedDate, selectedTime });
    setCurrentStep(3);
  } else if (currentStep === 3) {
    if (params.trainingMode === 'hybrid' && !bookingData.mode) {
      Alert.alert('Required', 'Please select training mode');
      return;
    }
    setCurrentStep(4);
  } else if (currentStep === 4) {
    setCurrentStep(5);
  } else if (currentStep === 5) {
    handleBookingConfirm();
  } else if (currentStep === 6) {  // Add this
    router.push('/dashboards/user/home');
  }
};

// Step 6: Success Screen
const renderSuccess = () => (
  <Animated.View style={[
    styles.stepContainer,
    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
  ]}>
    <View style={styles.successIconContainer}>
      <View style={[styles.successCircle, { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
      </View>
    </View>

    <Text style={styles.confirmTitle}>Booking Confirmed! 🎉</Text>
    <Text style={styles.confirmSubtitle}>
      Your consultation has been successfully booked
    </Text>

    <View style={styles.confirmationCard}>
      <View style={styles.confirmRow}>
        <Ionicons name="person-outline" size={20} color="#94A3B8" />
        <View style={styles.confirmRowContent}>
          <Text style={styles.confirmLabel}>Consultant</Text>
          <Text style={styles.confirmValue}>{bookingData.consultantName}</Text>
        </View>
      </View>

      <View style={styles.confirmRow}>
        <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
        <View style={styles.confirmRowContent}>
          <Text style={styles.confirmLabel}>Date & Time</Text>
          <Text style={styles.confirmValue}>
            {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            })} at {selectedTime}
          </Text>
        </View>
      </View>

      <View style={styles.confirmRowLast}>
        <Ionicons name="mail-outline" size={20} color="#94A3B8" />
        <View style={styles.confirmRowContent}>
          <Text style={styles.confirmLabel}>Next Steps</Text>
          <Text style={styles.confirmValue}>
            You'll receive a confirmation email shortly. The consultant will contact you before the session.
          </Text>
        </View>
      </View>
    </View>

    <View style={[styles.infoCard, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }]}>
      <Ionicons name="information-circle" size={20} color="#10B981" />
      <Text style={[styles.infoText, { color: '#6EE7B7' }]}>
        You can view and manage your appointments from the "My Appointments" section in your dashboard.
      </Text>
    </View>
  </Animated.View>
);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

// helper inside BookingFlow.tsx (add near top)
const makeIsoFromDateAndTime = (dateStr: string, timeStr: string) => {
  const [time, meridiem] = timeStr.split(' ');
  let [hh, mm] = time.split(':').map(Number);
  if (meridiem === 'PM' && hh !== 12) hh += 12;
  if (meridiem === 'AM' && hh === 12) hh = 0;
  const [year, month, day] = dateStr.split('-').map(Number);
  // create UTC time so backend receives consistent timestamp
  const dt = new Date(Date.UTC(year, month - 1, day, hh, mm, 0));
  return dt.toISOString();
};

const handleBookingConfirm = async () => {
  // Prevent multiple clicks
  if (isBooking) return;
  
  try {
    if (!bookingData.selectedDate || !bookingData.selectedTime) {
      Alert.alert('Required', 'Please select date and time');
      return;
    }
    
    console.log('=== BOOKING ATTEMPT ===');
    console.log('Current step:', currentStep);
    console.log('isBooking:', isBooking);
    console.log('Selected date:', bookingData.selectedDate);
    console.log('Selected time:', bookingData.selectedTime);
    
    setIsBooking(true); // Start loading
    
    const token = await AsyncStorage.getItem('userToken');
    const startAt = makeIsoFromDateAndTime(bookingData.selectedDate!, bookingData.selectedTime!);
    const endAt = new Date(new Date(startAt).getTime() + 30 * 60 * 1000).toISOString();

    const payload = {
      consultant: bookingData.consultantId,
      startAt,
      endAt,
      title: `${bookingData.packageType} - ${bookingData.packageDuration}`,
      notes: bookingData.notes,
      mode: bookingData.mode,
      price: bookingData.packagePrice,
      location: bookingData.location,
    };

    console.log('Sending booking request:', payload);

    const res = await axios.post(`${API_BASE_URL}/appointments`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Booking successful:', res.data);
    setIsBooking(false);
    setCurrentStep(6);
    
    } catch (error: any) {
        console.log('=== BOOKING ERROR ===');
        setIsBooking(false);
        
        const status = error.response?.status;
        const message = error.response?.data?.message || 'An error occurred';
        
        console.log('Booking error - Status:', status);
        console.log('Booking error - Message:', message);
        
        // Wait for interactions to complete before showing alert
        InteractionManager.runAfterInteractions(() => {
          if (status === 409) {
            Alert.alert(
              '⚠️ Duplicate Booking',
              'You already have an appointment booked for this time slot with this consultant.\n\nPlease choose a different date and time.',
              [
                { 
                  text: 'Choose Different Time', 
                  onPress: () => {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setCurrentStep(2);
                  },
                  style: 'default'
                },
                { 
                  text: 'Cancel', 
                  style: 'cancel' 
                },
              ],
              { cancelable: false }
            );
          } else if (status === 400) {
            Alert.alert('Invalid Booking', message, [{ text: 'OK' }]);
          } else if (status === 404) {
            Alert.alert(
              'Consultant Not Found',
              'The selected consultant is no longer available.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          } else {
            Alert.alert('Booking Failed', message || 'Please try again.', [{ text: 'OK' }]);
          }
        });
      }
};


  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {STEPS.map((step, index) => (
        <View key={step.id} style={styles.progressStepContainer}>
          <View style={[
            styles.progressDot,
            currentStep >= step.id && styles.progressDotActive,
            currentStep > step.id && styles.progressDotCompleted
          ]}>
            {currentStep > step.id ? (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.progressDotText,
                currentStep >= step.id && styles.progressDotTextActive
              ]}>{step.id}</Text>
            )}
          </View>
          {index < STEPS.length - 1 && (
            <View style={[
              styles.progressLine,
              currentStep > step.id && styles.progressLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepTitle = () => {
    const currentStepData = STEPS[currentStep - 1];
    return (
      <View style={styles.stepTitleContainer}>
        <View style={styles.stepIconContainer}>
          <Ionicons name={currentStepData.icon as any} size={24} color="#10B981" />
        </View>
        <View>
          <Text style={styles.stepNumber}>Step {currentStep} of {STEPS.length}</Text>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
        </View>
      </View>
    );
  };

  // Step 1: Package Confirmation
  const renderPackageConfirmation = () => (
    <Animated.View style={[
      styles.stepContainer,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <View style={styles.consultantSummary}>
        <View style={styles.consultantHeader}>
          <Text style={styles.consultantAvatar}>{bookingData.consultantImage}</Text>
          <View style={styles.consultantInfo}>
            <Text style={styles.consultantName}>{bookingData.consultantName}</Text>
            <Text style={styles.consultantSpecialty}>{bookingData.specialty}</Text>
          </View>
        </View>
      </View>

      <View style={styles.packageCard}>
        <LinearGradient colors={['#10B981', '#059669']} style={styles.packageGradient}>
          <View style={styles.packageHeader}>
            <Ionicons name="pricetag" size={24} color="#FFFFFF" />
            <Text style={styles.packageTitle}>Selected Package</Text>
          </View>
          
          <View style={styles.packageDetails}>
            <Text style={styles.packageName}>{bookingData.packageDuration}</Text>
            <Text style={styles.packageDescription}>
              {bookingData.packageType === 'session' ? 'One-time consultation session' : 
               bookingData.packageType === 'month' ? 'Monthly unlimited consultations' :
               bookingData.packageType === 'week' ? 'Weekly session package' : 
               'Custom package'}
            </Text>
          </View>

          <View style={styles.packagePriceContainer}>
            <Text style={styles.packagePrice}>${bookingData.packagePrice}</Text>
            <Text style={styles.packagePriceLabel}>Total Amount</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.benefitsList}>
        <Text style={styles.benefitsTitle}>What's included:</Text>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.benefitText}>Professional consultation</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.benefitText}>Personalized fitness plan</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.benefitText}>Progress tracking & support</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.benefitText}>Direct messaging access</Text>
        </View>
      </View>
    </Animated.View>
  );

  // Step 2: Date & Time Selection
  const renderDateTimeSelection = () => (
    <Animated.View style={[
      styles.stepContainer,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {generateDates().map((date) => (
          <TouchableOpacity
            key={date.fullDate}
            style={[
              styles.dateCard,
              selectedDate === date.fullDate && styles.dateCardSelected
            ]}
            onPress={() => setSelectedDate(date.fullDate)}
          >
            <Text style={[
              styles.dateDay,
              selectedDate === date.fullDate && styles.dateTextSelected
            ]}>{date.day}</Text>
            <Text style={[
              styles.dateNumber,
              selectedDate === date.fullDate && styles.dateTextSelected
            ]}>{date.date}</Text>
            <Text style={[
              styles.dateMonth,
              selectedDate === date.fullDate && styles.dateTextSelected
            ]}>{date.month}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Select Time</Text>
      <View style={styles.timeSlotsContainer}>
        {timeSlots.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.timeSlotSelected
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={selectedTime === time ? '#FFFFFF' : '#94A3B8'} 
            />
            <Text style={[
              styles.timeSlotText,
              selectedTime === time && styles.timeSlotTextSelected
            ]}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // Step 3: Session Details
  const renderSessionDetails = () => (
    <Animated.View style={[
      styles.stepContainer,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      {params.trainingMode === 'hybrid' && (
        <>
          <Text style={styles.sectionTitle}>Training Mode</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeCard,
                bookingData.mode === 'online' && styles.modeCardSelected
              ]}
              onPress={() => setBookingData({ ...bookingData, mode: 'online' })}
            >
              <Ionicons 
                name="laptop-outline" 
                size={32} 
                color={bookingData.mode === 'online' ? '#10B981' : '#94A3B8'} 
              />
              <Text style={[
                styles.modeTitle,
                bookingData.mode === 'online' && styles.modeTextSelected
              ]}>Online</Text>
              <Text style={styles.modeDescription}>Video call session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeCard,
                bookingData.mode === 'offline' && styles.modeCardSelected
              ]}
              onPress={() => setBookingData({ ...bookingData, mode: 'offline' })}
            >
              <Ionicons 
                name="business-outline" 
                size={32} 
                color={bookingData.mode === 'offline' ? '#10B981' : '#94A3B8'} 
              />
              <Text style={[
                styles.modeTitle,
                bookingData.mode === 'offline' && styles.modeTextSelected
              ]}>In-Person</Text>
              <Text style={styles.modeDescription}>At consultant's location</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Additional Notes (Optional)</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Share your goals, concerns, or any specific requirements..."
        placeholderTextColor="#64748B"
        multiline
        numberOfLines={4}
        value={bookingData.notes}
        onChangeText={(text) => setBookingData({ ...bookingData, notes: text })}
        textAlignVertical="top"
      />

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color="#3B82F6" />
        <Text style={styles.infoText}>
          Your consultant will review these details before the session and may contact you for clarification.
        </Text>
      </View>
    </Animated.View>
  );

  // Step 4: Payment
  const renderPayment = () => (
    <Animated.View style={[
      styles.stepContainer,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentMethod,
            selectedPayment === method.id && styles.paymentMethodSelected
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <View style={styles.paymentMethodLeft}>
            <View style={styles.paymentIconContainer}>
              <Ionicons name={method.icon as any} size={24} color="#10B981" />
            </View>
            <View>
              <Text style={styles.paymentMethodName}>{method.name}</Text>
              {method.recommended && (
                <Text style={styles.recommendedTag}>Recommended</Text>
              )}
            </View>
          </View>
          <View style={[
            styles.radioButton,
            selectedPayment === method.id && styles.radioButtonSelected
          ]}>
            {selectedPayment === method.id && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Price Breakdown</Text>
      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Package Price</Text>
          <Text style={styles.priceValue}>${bookingData.packagePrice}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Service Fee</Text>
          <Text style={styles.priceValue}>$0</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Taxes</Text>
          <Text style={styles.priceValue}>${(bookingData.packagePrice * 0.1).toFixed(2)}</Text>
        </View>
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>${(bookingData.packagePrice * 1.1).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.securePaymentInfo}>
        <Ionicons name="shield-checkmark" size={20} color="#10B981" />
        <Text style={styles.secureText}>Secure payment powered by Stripe</Text>
      </View>
    </Animated.View>
  );

  // Step 5: Confirmation
  const renderConfirmation = () => (
    <Animated.View style={[
      styles.stepContainer,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <View style={styles.successIconContainer}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={48} color="#10B981" />
        </View>
      </View>

      <Text style={styles.confirmTitle}>Review Your Booking</Text>
      <Text style={styles.confirmSubtitle}>Please review all details before confirming</Text>

      <View style={styles.confirmationCard}>
        <View style={styles.confirmRow}>
          <Ionicons name="person-outline" size={20} color="#94A3B8" />
          <View style={styles.confirmRowContent}>
            <Text style={styles.confirmLabel}>Consultant</Text>
            <Text style={styles.confirmValue}>{bookingData.consultantName}</Text>
          </View>
        </View>

        <View style={styles.confirmRow}>
          <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
          <View style={styles.confirmRowContent}>
            <Text style={styles.confirmLabel}>Date</Text>
            <Text style={styles.confirmValue}>
              {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </Text>
          </View>
        </View>

        <View style={styles.confirmRow}>
          <Ionicons name="time-outline" size={20} color="#94A3B8" />
          <View style={styles.confirmRowContent}>
            <Text style={styles.confirmLabel}>Time</Text>
            <Text style={styles.confirmValue}>{selectedTime}</Text>
          </View>
        </View>

        <View style={styles.confirmRow}>
          <Ionicons name="pricetag-outline" size={20} color="#94A3B8" />
          <View style={styles.confirmRowContent}>
            <Text style={styles.confirmLabel}>Package</Text>
            <Text style={styles.confirmValue}>{bookingData.packageDuration}</Text>
          </View>
        </View>

        {bookingData.mode && (
          <View style={styles.confirmRow}>
            <Ionicons name="location-outline" size={20} color="#94A3B8" />
            <View style={styles.confirmRowContent}>
              <Text style={styles.confirmLabel}>Mode</Text>
              <Text style={styles.confirmValue}>
                {bookingData.mode === 'online' ? 'Online (Video Call)' : 'In-Person'}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.confirmRow, styles.confirmRowLast]}>
          <Ionicons name="card-outline" size={20} color="#94A3B8" />
          <View style={styles.confirmRowContent}>
            <Text style={styles.confirmLabel}>Total Amount</Text>
            <Text style={[styles.confirmValue, styles.confirmPrice]}>
              ${(bookingData.packagePrice * 1.1).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.termsContainer}>
        <Ionicons name="information-circle-outline" size={16} color="#64748B" />
        <Text style={styles.termsText}>
          By confirming, you agree to our terms of service and cancellation policy
        </Text>
      </View>
     
      <View style={[styles.infoCard, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B', marginTop: 16 }]}>
        <Ionicons name="warning-outline" size={20} color="#F59E0B" />
        <Text style={[styles.infoText, { color: '#FCD34D' }]}>
          Please ensure you don't have another appointment at this time. Duplicate bookings are not allowed.
        </Text>
      </View>
    </Animated.View>
  );

const renderStepContent = () => {
  switch (currentStep) {
    case 1:
      return renderPackageConfirmation();
    case 2:
      return renderDateTimeSelection();
    case 3:
      return renderSessionDetails();
    case 4:
      return renderPayment();
    case 5:
      return renderConfirmation();
    case 6:  // Add this
      return renderSuccess();
    default:
      return null;
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Consultation</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}
      
      {/* Step Title */}
      {renderStepTitle()}

      {/* Step Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.continueButton, isBooking && styles.continueButtonDisabled]} 
          onPress={handleNext}
          disabled={isBooking}
        >
          <LinearGradient colors={['#10B981', '#059669']} style={styles.continueGradient}>
            {isBooking ? (
              <>
                <Text style={styles.continueButtonText}>Processing...</Text>
                <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
              </>
            ) : (
              <>
                <Text style={styles.continueButtonText}>
                  {currentStep === 5 ? 'Confirm Booking' : 
                  currentStep === 6 ? 'Go to Dashboard' : 'Continue'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    continueButtonDisabled: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  progressDotActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  progressDotCompleted: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  progressDotText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  progressDotTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#374151',
    marginHorizontal: 4,
  },
  progressLineActive: {
    backgroundColor: '#10B981',
  },
  stepTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  consultantSummary: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  consultantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consultantAvatar: {
    fontSize: 40,
    width: 60,
    height: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#374151',
    borderRadius: 30,
    marginRight: 12,
  },
  consultantInfo: {
    flex: 1,
  },
  consultantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  consultantSpecialty: {
    fontSize: 14,
    color: '#10B981',
  },
  packageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  packageGradient: {
    padding: 20,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
  packageDetails: {
    marginBottom: 16,
  },
  packageName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  packagePriceContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  packagePriceLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  benefitsList: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  dateScroll: {
    marginBottom: 16,
  },
  dateCard: {
    width: 70,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },
  dateCardSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dateDay: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateMonth: {
    fontSize: 12,
    color: '#94A3B8',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#374151',
    gap: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  modeCardSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  modeTextSelected: {
    color: '#10B981',
  },
  modeDescription: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 120,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#93C5FD',
    marginLeft: 12,
    lineHeight: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },
  paymentMethodSelected: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  recommendedTag: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#10B981',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  priceBreakdown: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  priceValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  securePaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secureText: {
    fontSize: 13,
    color: '#94A3B8',
    marginLeft: 8,
  },
  successIconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#10B981',
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
  },
  confirmationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  confirmRowLast: {
    borderBottomWidth: 0,
  },
  confirmRowContent: {
    flex: 1,
    marginLeft: 12,
  },
  confirmLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  confirmValue: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  confirmPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 8,
    lineHeight: 18,
  },
  bottomBar: {
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
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});