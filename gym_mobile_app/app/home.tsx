import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dumbbell, Users, Calendar, Trophy, Target, TrendingUp, Zap, Heart, Clock } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';

const { width, height } = Dimensions.get('window');

// Animated Counter Component with trigger control
function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = '', 
  style,
  shouldStart = false 
}: { 
  end: number | string; 
  duration?: number; 
  suffix?: string; 
  style?: any;
  shouldStart?: boolean;
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(`0${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (shouldStart && !hasAnimated.current) {
      hasAnimated.current = true;
      
      Animated.timing(animatedValue, {
        toValue: parseFloat(end.toString().replace(/[^0-9.]/g, '')),
        duration: duration,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        const formattedValue = end.toString().includes('.')
          ? value.toFixed(1)
          : Math.floor(value).toLocaleString();
        setDisplayValue(`${formattedValue}${suffix}`);
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    }
  }, [shouldStart, end, suffix, duration, animatedValue]);

  return (
    <Text style={style}>
      {displayValue}
    </Text>
  );
}

export default function Home() {
  const router = useRouter();
  const [startAnimation, setStartAnimation] = useState(false);
  const statsRef = useRef<View>(null);

  const workoutScrollRef = useRef<ScrollView>(null);
const scrollPosition = useRef(0);

useEffect(() => {
  const scrollInterval = setInterval(() => {
    if (workoutScrollRef.current) {
      scrollPosition.current += 1;
      
      workoutScrollRef.current.scrollTo({
        x: scrollPosition.current,
        animated: true,
      });
      
      // Calculate total scroll width: 6 cards × 296px (280 + 16 margin)
      const totalWidth = 6 * 296;
      
      // Reset to beginning when reaching the end for circular effect
      if (scrollPosition.current >= totalWidth) {
        setTimeout(() => {
          workoutScrollRef.current?.scrollTo({
            x: 0,
            animated: false, // Instantly jump back
          });
          scrollPosition.current = 0;
        }, 500);
      }
    }
  }, 30);

  return () => clearInterval(scrollInterval);
}, []);
 

const features = [
  {
    icon: Dumbbell,
    title: 'Personalized Workouts',
    description: 'Custom fitness plans tailored to your goals',
    color: '#10B981',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
  },
  {
    icon: Users,
    title: 'Expert Trainers',
    description: 'Connect with certified fitness professionals',
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    icon: Calendar,
    title: 'Class Scheduling',
    description: 'Book your favorite classes anytime',
    color: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&q=80',
  },
  {
    icon: Trophy,
    title: 'Track Progress',
    description: 'Monitor your fitness journey with detailed analytics',
    color: '#EF4444',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
  },
];

  const stats = [
    { number: 10, suffix: 'K+', label: 'Active Members' },
    { number: 500, suffix: '+', label: 'Workout Plans' },
    { number: 50, suffix: '+', label: 'Expert Trainers' },
    { number: 4.9, suffix: '', label: 'App Rating' },
  ];

  // Handle scroll to detect when stats section is visible
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    
    // Trigger animation when user scrolls past hero section (adjust threshold as needed)
    if (scrollY > height * 0.4 && !startAnimation) {
      setStartAnimation(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.2)', 'rgba(15, 23, 42, 0.95)']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.logoContainer}>
                <Dumbbell size={40} color="#10B981" strokeWidth={2.5} />
              </View>
              <Text style={styles.appName}>HiWox</Text>
              <Text style={styles.heroTitle}>Transform Your Body,{'\n'}Transform Your Life</Text>
              <Text style={styles.heroSubtitle}>
                Join thousands of members achieving their fitness goals with personalized workouts and expert guidance
              </Text>
              
              {/* Hero Image */}
              <View style={styles.heroImageContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' }}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
              </View>

              <View style={styles.heroCTA}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => router.push('/register')}
                >
                  <Text style={styles.primaryButtonText}>Get Started Free</Text>
                  <Zap size={20} color="#FFFFFF" fill="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => router.push('/login')}
                >
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection} ref={statsRef}>
          <View style={styles.statsContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' }}
              style={styles.statsBackgroundImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(15, 23, 42, 0.92)', 'rgba(30, 41, 59, 0.92)']}
              style={styles.statsOverlay}
            >
              {/* First Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <AnimatedCounter 
                    end={stats[0].number} 
                    suffix={stats[0].suffix}
                    duration={2500}
                    shouldStart={startAnimation}
                    style={styles.statNumber}
                  />
                  <Text style={styles.statLabel}>{stats[0].label}</Text>
                </View>
                <View style={styles.statItem}>
                  <AnimatedCounter 
                    end={stats[1].number} 
                    suffix={stats[1].suffix}
                    duration={2500}
                    shouldStart={startAnimation}
                    style={styles.statNumber}
                  />
                  <Text style={styles.statLabel}>{stats[1].label}</Text>
                </View>
              </View>

              {/* Second Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <AnimatedCounter 
                    end={stats[2].number} 
                    suffix={stats[2].suffix}
                    duration={2500}
                    shouldStart={startAnimation}
                    style={styles.statNumber}
                  />
                  <Text style={styles.statLabel}>{stats[2].label}</Text>
                </View>
                <View style={styles.statItem}>
                  <AnimatedCounter 
                    end={stats[3].number} 
                    suffix={stats[3].suffix}
                    duration={2500}
                    shouldStart={startAnimation}
                    style={styles.statNumber}
                  />
                  <Text style={styles.statLabel}>{stats[3].label}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <Text style={styles.sectionSubtitle}>Everything you need to achieve your fitness goals</Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Image
                  source={{ uri: feature.image }}
                  style={styles.featureBackgroundImage}
                  resizeMode="cover"
                />
                <View style={styles.featureOverlay} />
                <View style={styles.featureContent}>
                  <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
                    <feature.icon size={28} color={feature.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Workout Showcase */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Workouts</Text>
          <ScrollView 
            ref={workoutScrollRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.workoutScroll}
            scrollEventThrottle={16}
          >
            <View style={styles.workoutCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80' }}
                style={styles.workoutImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.workoutGradient}
              >
                <View style={styles.workoutBadge}>
                  <Clock size={12} color="#FFFFFF" />
                  <Text style={styles.workoutBadgeText}>30 min</Text>
                </View>
                <Text style={styles.workoutTitle}>HIIT Training</Text>
                <Text style={styles.workoutCategory}>Cardio • Advanced</Text>
              </LinearGradient>
            </View>

            <View style={styles.workoutCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80' }}
                style={styles.workoutImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.workoutGradient}
              >
                <View style={styles.workoutBadge}>
                  <Clock size={12} color="#FFFFFF" />
                  <Text style={styles.workoutBadgeText}>45 min</Text>
                </View>
                <Text style={styles.workoutTitle}>Yoga Flow</Text>
                <Text style={styles.workoutCategory}>Flexibility • All Levels</Text>
              </LinearGradient>
            </View>

            <View style={styles.workoutCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' }}
                style={styles.workoutImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.workoutGradient}
              >
                <View style={styles.workoutBadge}>
                  <Clock size={12} color="#FFFFFF" />
                  <Text style={styles.workoutBadgeText}>60 min</Text>
                </View>
                <Text style={styles.workoutTitle}>Strength Training</Text>
                <Text style={styles.workoutCategory}>Weights • Intermediate</Text>
              </LinearGradient>
            </View>

            <View style={styles.workoutCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80' }}
                style={styles.workoutImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.workoutGradient}
              >
                <View style={styles.workoutBadge}>
                  <Clock size={12} color="#FFFFFF" />
                  <Text style={styles.workoutBadgeText}>20 min</Text>
                </View>
                <Text style={styles.workoutTitle}>Meditation</Text>
                <Text style={styles.workoutCategory}>Mindfulness • All Levels</Text>
              </LinearGradient>
            </View>

            <View style={styles.workoutCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' }}
                style={styles.workoutImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.workoutGradient}
              >
                <View style={styles.workoutBadge}>
                  <Clock size={12} color="#FFFFFF" />
                  <Text style={styles.workoutBadgeText}>50 min</Text>
                </View>
                <Text style={styles.workoutTitle}>Zumba Dance</Text>
                <Text style={styles.workoutCategory}>Dance • Beginner</Text>
              </LinearGradient>
            </View>

            <View style={styles.workoutCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80' }}
                style={styles.workoutImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.workoutGradient}
              >
                <View style={styles.workoutBadge}>
                  <Clock size={12} color="#FFFFFF" />
                  <Text style={styles.workoutBadgeText}>24/7</Text>
                </View>
                <Text style={styles.workoutTitle}>Smart Watch Sync</Text>
                <Text style={styles.workoutCategory}>Tracking • All Devices</Text>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Target size={24} color="#10B981" strokeWidth={2.5} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Goal-Oriented Plans</Text>
              <Text style={styles.benefitText}>Customized workouts designed to help you reach your specific fitness goals</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Heart size={24} color="#EF4444" strokeWidth={2.5} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Health Monitoring</Text>
              <Text style={styles.benefitText}>Track your progress with comprehensive health and fitness metrics</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <TrendingUp size={24} color="#3B82F6" strokeWidth={2.5} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Progress Analytics</Text>
              <Text style={styles.benefitText}>Detailed insights and analytics to keep you motivated and on track</Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>
            <Text style={styles.ctaSubtitle}>Join our community today and get 7 days free trial</Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.ctaButtonText}>Start Free Trial</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 HiWox. All rights reserved.</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerDivider}>•</Text>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appName: {
  fontSize: 28,
  fontWeight: '700',
  color: '#10B981',
  marginBottom: 16,
  letterSpacing: 0.5,
},
  featureBackgroundImage: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: 16,
},
featureOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.88)',
  borderRadius: 16,
},
featureContent: {
  position: 'relative',
  zIndex: 1,
},
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  heroSection: {
    minHeight: height * 0.7,
    marginBottom: 20,
  },
  heroGradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  heroContent: {
    flex: 1,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 44,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  heroCTA: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  statsContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statsBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  statsOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#E2E8F0',
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 32,
  },
  featuresGrid: {
    gap: 16,
  },
featureCard: {
  backgroundColor: '#1E293B',
  borderRadius: 16,
  padding: 24,
  borderWidth: 1,
  borderColor: '#334155',
  position: 'relative',
  overflow: 'hidden',  // This is the key fix
  minHeight: 180,
},
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  workoutScroll: {
    paddingRight: 24,
  },
  workoutCard: {
    width: 280,
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  workoutImage: {
    width: '100%',
    height: '100%',
  },
  workoutGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 20,
    justifyContent: 'flex-end',
  },
  workoutBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  workoutBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutCategory: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  benefitsSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
    gap: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 16,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  ctaGradient: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLink: {
    fontSize: 12,
    color: '#64748B',
  },
  footerDivider: {
    fontSize: 12,
    color: '#64748B',
  },
});