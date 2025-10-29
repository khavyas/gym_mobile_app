import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { getRandomQuote, type Quote } from './motivationalQuotes';
import { Lightbulb, Share2 } from 'lucide-react-native';
import { Video, Play, Star, Eye, Activity, Flame, Droplet, Target, Utensils, TrendingUp } from 'lucide-react-native';
import { getRandomVideo, getYouTubeThumbnail, getYouTubeUrl, type VideoRecommendation } from './videoRecommendations';
import { Linking, Image } from 'react-native';
import { BookOpen, Clock, User as UserIcon } from 'lucide-react-native';
import { getRandomBlogPosts, type BlogPost } from './blogPosts';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type TabParamList = {
  Home: undefined;
  Fitness: undefined;
  Consultants: undefined;
  Appointments: undefined;
  Shop: undefined;
  Challenges: undefined;
  Health: undefined;
  Profile: undefined;
};

// Define Event type based on your backend Event model
interface Event {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  cost: number;
  benefits: string;
  date: string;
  location?: string;
  eventType: 'online' | 'offline' | 'hybrid';
  onlineLink?: string;
  gymCenter?: {
    _id: string;
    name: string;
  };
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface WaterIntake {
  _id: string;
  user: string;
  amount: number;
  time: string;
  createdAt: string;
  updatedAt: string;
}


const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';

export default function HomeSummary() {
  const router = useRouter(); 
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayWaterIntake, setTodayWaterIntake] = useState(0);
  const [waterLoading, setWaterLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [recommendedVideo, setRecommendedVideo] = useState<VideoRecommendation | null>(null);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [allVideos, setAllVideos] = useState<VideoRecommendation[]>([]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchEvents();
    fetchTodayWaterIntake();
    fetchUserData();
  }, []);

  useEffect(() => {
    // Get a new quote daily
    const quote = getRandomQuote();
    setDailyQuote(quote);
  }, []);

  useEffect(() => {
    const video = getRandomVideo();
    setRecommendedVideo(video);
  }, []);
useEffect(() => {
  const blogs = getRandomBlogPosts(2);
  setFeaturedBlogs(blogs);
}, []);

useEffect(() => {
  // Get multiple random videos (e.g., 5 videos)
  const videos = Array.from({ length: 5 }, () => getRandomVideo());
  setAllVideos(videos);
  setRecommendedVideo(videos[0]);
}, []);

  const handleBlogPress = (blog: BlogPost) => {
    router.push({
      pathname: "/dashboards/user/BlogDetail",
      params: { id: blog.id }
    });
  };

  const handlePreviousVideo = () => {
    const newIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : allVideos.length - 1;
    setCurrentVideoIndex(newIndex);
    setRecommendedVideo(allVideos[newIndex]);
  };

  const handleNextVideo = () => {
    const newIndex = currentVideoIndex < allVideos.length - 1 ? currentVideoIndex + 1 : 0;
    setCurrentVideoIndex(newIndex);
    setRecommendedVideo(allVideos[newIndex]);
  };


  const getUserInitials = (name: string) => {
    if (!name) return 'JD'; // fallback
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const fetchUserData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('userName');
      const storedEmail = await AsyncStorage.getItem('userEmail');
      
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleVideoPress = async (youtubeId: string) => {
    const url = getYouTubeUrl(youtubeId);
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL: " + url);
    }
  };


  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/events`);
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayWaterIntake = async () => {
    try {
      setWaterLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        console.log('No auth token found');
        return;
      }

      // Try fetching without date parameter first
      const response = await axios.get(`${API_BASE_URL}/water`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Water API Response:', response.data); // Add this for debugging

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Filter on client side since API might not support date filtering
      let totalIntake = 0;
      
      if (Array.isArray(response.data)) {
        totalIntake = response.data.reduce((sum: number, entry: WaterIntake) => {
          const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
          return entryDate === today ? sum + entry.amount : sum;
        }, 0);
      }

      console.log('Today water intake:', totalIntake); // Add this for debugging
      setTodayWaterIntake(totalIntake);
    } catch (error: any) {
      console.error('Error fetching water intake:', error);
      // Log more details about the error
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setWaterLoading(false);
    }
  };

  const getEventGradientColors = (title: string): [string, string] => {
    const lowercaseTitle = title.toLowerCase();
    
    if (lowercaseTitle.includes('zumba') || lowercaseTitle.includes('dance')) {
      return ['#EC4899', '#8B5CF6'];
    } else if (lowercaseTitle.includes('meditation') || lowercaseTitle.includes('mindfulness')) {
      return ['#3B82F6', '#1D4ED8'];
    } else if (lowercaseTitle.includes('yoga')) {
      return ['#10B981', '#059669'];
    } else if (lowercaseTitle.includes('cardio') || lowercaseTitle.includes('hiit')) {
      return ['#EF4444', '#DC2626'];
    } else if (lowercaseTitle.includes('strength') || lowercaseTitle.includes('weight')) {
      return ['#F59E0B', '#D97706'];
    } else {
      return ['#6366F1', '#4F46E5']; // Default purple gradient
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Good Morning! 💪";
    } else if (hour < 17) {
      return "Good Afternoon! 💪";
    } else {
      return "Good Evening! 💪";
    }
  };

  const formatEventDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (eventDate.toDateString() === now.toDateString()) {
      return `Today at ${eventDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${eventDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: "/dashboards/user/EventDetails",
      params: {
        eventId: event._id,
        type: event.title.toLowerCase().replace(/\s+/g, ''),
        title: event.title,
        time: formatEventDate(event.date),
        duration: '60 mins', // Default duration - you might want to add this to your Event model
        cost: `$${event.cost}`,
        benefits: event.benefits,
        instructor: event.instructor,
        locationType: event.eventType === 'online' ? 'online' : event.eventType === 'hybrid' ? 'hybrid' : 'in-person',
        location: event.eventType === 'online' ? 'Online Session' : event.location || 'Fitness Center',
        meetingLink: event.onlineLink || '',
        address: event.eventType !== 'online' ? event.location || '' : '',
        description: event.description,
        gymCenter: event.gymCenter?.name || 'Fitness Center'
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header Section */}


        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
             <Text style={styles.date}>{currentDate}</Text>
            <Text style={styles.date}>Ready to crush your wellness goals today?</Text>
          </View>         
        </View>

        {/* Thought for the Day */}
        {dailyQuote && (
          <View style={styles.thoughtCard}>
            <View style={styles.thoughtContent}>
              <View style={styles.bulbContainer}>
                <Lightbulb size={20} color="#FFFFFF" />
              </View>
              <View style={styles.thoughtTextContainer}>
                <View style={styles.thoughtHeader}>
                  <Text style={styles.thoughtLabel}>Thought for the Day</Text>
                  <View style={styles.motivationBadge}>
                    <Text style={styles.motivationText}>{"Motivation"}</Text>
                  </View>
                </View>
                <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
                <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
              </View>
              <TouchableOpacity style={styles.shareButton}>
                <Share2 size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}


{/* Recommended Video Section with Navigation */}
{recommendedVideo && allVideos.length > 0 && (
  <View style={styles.section}>
    <View style={styles.videoSectionHeader}>
      <Video size={20} color="#10B981" />
      <Text style={styles.sectionTitle}>Recommended for You</Text>
      <View style={styles.videoNavigationDots}>
        {allVideos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.navigationDot,
              index === currentVideoIndex && styles.navigationDotActive
            ]}
          />
        ))}
      </View>
    </View>
    
    <View style={styles.videoCarouselContainer}>
      {/* Left Arrow */}
      <TouchableOpacity 
        style={[styles.videoNavButton, styles.videoNavButtonLeft]}
        onPress={handlePreviousVideo}
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color="#FFFFFF" strokeWidth={3} />
      </TouchableOpacity>

      {/* Video Card */}
      <TouchableOpacity 
        style={styles.videoCard}
        onPress={() => handleVideoPress(recommendedVideo.youtubeId)}
        activeOpacity={0.9}
      >
        <View style={styles.videoThumbnailContainer}>
          <Image 
            source={{ uri: getYouTubeThumbnail(recommendedVideo.youtubeId, 'high') }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playButtonOverlay}>
            <View style={styles.playButton}>
              <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
          <View style={styles.videoDurationBadge}>
            <Text style={styles.videoDurationText}>{recommendedVideo.duration}</Text>
          </View>
        </View>
        
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {recommendedVideo.title}
          </Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {recommendedVideo.description}
          </Text>
          
          <View style={styles.videoMetaContainer}>
            <View style={styles.videoInstructorInfo}>
              <Text style={styles.videoInstructor}>
                {recommendedVideo.instructor}
                {recommendedVideo.credentials && `, ${recommendedVideo.credentials}`}
              </Text>
            </View>
            
            <View style={styles.videoStats}>
              {recommendedVideo.rating && (
                <View style={styles.videoStatItem}>
                  <Text style={styles.videoCategoryBadge}>{recommendedVideo.category}</Text>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.videoStatText}>{recommendedVideo.rating}</Text>
                </View>
              )}
              {recommendedVideo.views && (
                <View style={styles.videoStatItem}>
                  <Eye size={12} color="#94A3B8" />
                  <Text style={styles.videoStatText}>{recommendedVideo.views} views</Text>
                </View>
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.watchNowButton}
            onPress={() => handleVideoPress(recommendedVideo.youtubeId)}
          >
            <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.watchNowText}>Watch Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Right Arrow */}
      <TouchableOpacity 
        style={[styles.videoNavButton, styles.videoNavButtonRight]}
        onPress={handleNextVideo}
        activeOpacity={0.7}
      >
        <ChevronRight size={24} color="#FFFFFF" strokeWidth={3} />
      </TouchableOpacity>
    </View>
  </View>
)}


{/* Continue Learning Section */}
<View style={styles.section}>
  <View style={styles.learningSectionHeader}>
    <BookOpen size={20} color="#10B981" />
    <Text style={styles.sectionTitle}>Continue Learning</Text>
  </View>
  
  {featuredBlogs.map((blog, index) => (
    <TouchableOpacity
      key={blog.id}
      style={styles.blogCard}
      onPress={() => handleBlogPress(blog)}
      activeOpacity={0.8}
    >
      <View style={styles.blogImageContainer}>
        <Image 
          source={{ uri: blog.imageUrl }}
          style={styles.blogImage}
          resizeMode="cover"
        />
        <View style={styles.blogPlayOverlay}>
          <View style={styles.blogPlayIcon}>
            <BookOpen size={20} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.blogDurationBadge}>
          <Text style={styles.blogDurationText}>{blog.readTime}</Text>
        </View>
      </View>
      
      <View style={styles.blogInfo}>
        <Text style={styles.blogTitle} numberOfLines={2}>
          {blog.title}
        </Text>
        <Text style={styles.blogDescription} numberOfLines={2}>
          {blog.description}
        </Text>
        
        <View style={styles.blogMetaContainer}>
          <View style={styles.blogAuthorInfo}>
            <UserIcon size={14} color="#94A3B8" />
            <Text style={styles.blogAuthor} numberOfLines={1}>
              {blog.author}, {blog.credentials}
            </Text>
          </View>
          
          <View style={styles.blogCategoryBadge}>
            <Text style={styles.blogCategoryText}>{blog.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ))}
  
  <TouchableOpacity 
    style={styles.exploreLibraryButton}
    onPress={() => router.push('/dashboards/user/HealthLibrary')}
  >
    <BookOpen size={18} color="#FFFFFF" />
    <Text style={styles.exploreLibraryText}>Explore Health Library</Text>
  </TouchableOpacity>
</View>


{/* Today's Progress Card - New Design */}
<View style={styles.progressCard}>
  <View style={styles.progressHeader}>
    <View style={styles.progressIcon}>
      <Target size={18} color="#FFFFFF" strokeWidth={2.5} />
    </View>
    <Text style={styles.progressCardTitle}>  Today's Progress</Text>
  </View>

  {/* Steps */}
  <View style={styles.progressItem}>
     <View style={styles.progressItemLeft}>
      <View style={[styles.progressItemIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
        <Activity size={20} color="#10B981" strokeWidth={2.5} />
      </View>
      <View style={styles.progressItemInfo}>
        <Text style={styles.progressItemTitle}>Steps</Text>
        <Text style={styles.progressItemValue}>8,234 / 10,000</Text>
    </View>
  </View>
    <View style={styles.progressItemRight}>
      <Text style={styles.progressPercentage}>82%</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: '82%', backgroundColor: '#10B981' }]} />
      </View>
    </View>
  </View>

  {/* Calories Burned */}
  <View style={styles.progressItem}>
    <View style={styles.progressItemLeft}>
      <View style={[styles.progressItemIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
        <Flame size={20} color="#F59E0B" strokeWidth={2.5} />
      </View>
      <View style={styles.progressItemInfo}>
        <Text style={styles.progressItemTitle}>Calories Burned</Text>
        <Text style={styles.progressItemValue}>420 / 600</Text>
      </View>
    </View>
    <View style={styles.progressItemRight}>
      <Text style={styles.progressPercentage}>70%</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: '70%', backgroundColor: '#10B981' }]} />
      </View>
    </View>
  </View>

  {/* Water Intake */}
  <View style={styles.progressItem}>
    <View style={styles.progressItemLeft}>
      <View style={[styles.progressItemIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
        <Droplet size={20} color="#3B82F6" strokeWidth={2.5} />
      </View>
      <View style={styles.progressItemInfo}>
        <Text style={styles.progressItemTitle}>Water Intake</Text>
        <Text style={styles.progressItemValue}>
          {waterLoading ? 'Loading...' : `${(todayWaterIntake / 1000).toFixed(1)} / 2.0 glasses`}
        </Text>
      </View>
  </View>
    <View style={styles.progressItemRight}>
      <Text style={styles.progressPercentage}>
        {waterLoading ? '...' : `${Math.round((todayWaterIntake / 2000) * 100)}%`}
      </Text>
      <View style={styles.progressBarContainer}>
        <View style={[
          styles.progressBarFill, 
          { 
            width: waterLoading ? '0%' : `${Math.min((todayWaterIntake / 2000) * 100, 100)}%`,
            backgroundColor: '#10B981' 
          }
        ]} />
      </View>
    </View>
  </View>
</View>




{/* Quick Actions */}
<View style={styles.quickActionsContainer}>
  <View style={styles.quickActionsHeader}>
    <View style={styles.quickActionsIcon}>
      <Target size={18} color="#FFFFFF" strokeWidth={2.5} />
    </View>
    <Text style={styles.quickActionsTitle}>Quick Actions</Text>
  </View>
  
  <View style={styles.quickActions}>
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={() => router.push('/dashboards/user/WaterIntake')}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
        <Droplet size={24} color="#3B82F6" strokeWidth={2} />
      </View>
      <Text style={styles.actionText}>Log Water</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.actionButton}
      onPress={() => router.push('/dashboards/user/LogMeal')}  // Add this line
    >
      <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
        <Utensils size={24} color="#10B981" strokeWidth={2} />
      </View>
      <Text style={styles.actionText}>Log Meal</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.actionButton}
      onPress={() => router.push('/dashboards/user/StartWorkout')}  // Add this line
    >
      <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
        <TrendingUp size={24} color="#10B981" strokeWidth={2} />
      </View>
      <Text style={styles.actionText}>Start Workout</Text>
    </TouchableOpacity>
  </View>
</View>

        {/* Upcoming Session */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Session</Text>
          <View style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>High Intensity Yoga</Text>
              <Text style={styles.sessionTime}>Today at 6:00 PM</Text>
              <Text style={styles.sessionInstructor}>with Sarah Johnson</Text>
            </View>
            <View style={styles.sessionActions}>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rescheduleButton}>
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}

        {/* Classes Banner - Updated with API data */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Classes</Text>
            {error && (
              <TouchableOpacity onPress={fetchEvents} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No upcoming events found</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.bannerContainer}
            >
              {events.map((event) => {
                const gradientColors = getEventGradientColors(event.title);
                
                return (
                  <TouchableOpacity 
                    key={event._id}
                    style={styles.bannerCard}
                    onPress={() => handleEventPress(event)}
                  >
                    <LinearGradient
                      colors={gradientColors}
                      style={styles.bannerGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.bannerTitle}>{event.title}</Text>
                      <Text style={styles.bannerText}>{formatEventDate(event.date)}</Text>
                      <Text style={styles.bannerInstructor}>with {event.instructor}</Text>
                      <View style={styles.bannerFooter}>
                        <Text style={styles.bannerCost}>${event.cost}</Text>
                        <Text style={styles.bannerCta}>Tap for details →</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View> */}

        {/* Weekly Overview */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyStats}>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyNumber}>4</Text>
                <Text style={styles.weeklyLabel}>Workouts</Text>
              </View>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyNumber}>1,280</Text>
                <Text style={styles.weeklyLabel}>Calories Burned</Text>
              </View>
              <View style={styles.weeklyStat}>
                <Text style={styles.weeklyNumber}>12.5</Text>
                <Text style={styles.weeklyLabel}>Hours Active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewProgressButton}>
              <Text style={styles.viewProgressText}>View Full Progress →</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Achievement Badge */}
        {/* <View style={styles.achievementCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>🏆</Text>
          </View>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Streak Master!</Text>
            <Text style={styles.achievementDesc}>You've worked out 7 days in a row</Text>
          </View>
        </View> */}


        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  videoCarouselContainer: {
  position: 'relative',
  marginHorizontal: 20,
},
videoNavButton: {
  position: 'absolute',
  top: '35%',
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(16, 185, 129, 0.9)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
videoNavButtonLeft: {
  left: -15,
},
videoNavButtonRight: {
  right: -15,
},
videoNavigationDots: {
  flexDirection: 'row',
  gap: 6,
  marginLeft: 'auto',
},
navigationDot: {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: '#334155',
},
navigationDotActive: {
  backgroundColor: '#10B981',
  width: 20,
},

    thumbnailFallback: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B', // Dark gray-blue as fallback
  },
   thumbnailGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
quickActionsContainer: {
  backgroundColor: '#1E293B',
  marginHorizontal: 20,
  borderRadius: 20,
  padding: 20,
  marginBottom: 24,
  borderWidth: 1,
  borderColor: '#334155',
},
quickActionsHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
quickActionsIcon: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#10B981',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
quickActionsTitle: {
  fontSize: 20,
  fontWeight: '600',
  color: '#FFFFFF',
},

// Modify existing quickActions style:
quickActions: {
  flexDirection: 'row',
  gap: 12,
  // Remove paddingHorizontal: 20,
},

// Modify existing actionButton style:
actionButton: {
  flex: 1,
  backgroundColor: '#0F172A', // Changed from '#1E293B' to differentiate from container
  padding: 20,
  borderRadius: 16,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#334155',
},

 
actionIconContainer: {
  width: 48,
  height: 48,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
},
actionText: {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: '600',
  textAlign: 'center',
},

  progressCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressIconContainer: {
    marginRight: 12,
  },
progressIcon: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#10B981',
  justifyContent: 'center',
  alignItems: 'center',
},
  progressIconText: {
    fontSize: 16,
  },
  progressCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressItemEmoji: {
    fontSize: 20,
  },
  progressItemInfo: {
    flex: 1,
  },
  progressItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressItemValue: {
    fontSize: 13,
    color: '#94A3B8',
  },
  progressItemRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  progressBarContainer: {
    width: 100,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  learningSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  blogCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a3441',
  },
  blogImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  blogImage: {
    width: '100%',
    height: '100%',
  },
  blogPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  blogPlayIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  blogDurationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  blogDurationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  blogInfo: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 22,
  },
  blogDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  blogMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blogAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  blogAuthor: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    flex: 1,
  },
  blogCategoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  blogCategoryText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  exploreLibraryButton: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  exploreLibraryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  
   videoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  videoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a3441',
  },
videoThumbnailContainer: {
  width: '100%',
  height: 200,
  position: 'relative',
  backgroundColor: '#1E293B', // Add this line
},
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  videoDurationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoDurationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  videoDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  videoMetaContainer: {
    marginBottom: 16,
  },
  videoInstructorInfo: {
    marginBottom: 8,
  },
  videoInstructor: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  videoStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoCategoryBadge: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 8,
  },
  videoStatText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  watchNowButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  watchNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  
thoughtCard: {
  backgroundColor: '#0e292e',
  marginHorizontal: 20,
  borderRadius: 16,
  padding: 16,
  marginBottom: 24,
  borderWidth: 1,
  borderColor: '#2a3441',
},
thoughtContent: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
},
bulbContainer: {
  width: 40,
  height: 40,
  backgroundColor: '#0F3D3E',  // Same as card background
  borderRadius: 12,              // Rounded square corners
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
},
thoughtTextContainer: {
  flex: 1,
},
thoughtHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
},
thoughtLabel: {
  fontSize: 15,
  fontWeight: '600',
  color: '#FFFFFF',
},
motivationBadge: {
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#2a3441',
},
motivationText: {
  fontSize: 11,
  color: '#FFFFFF',
  fontWeight: '500',
},
shareButton: {
  width: 32,
  height: 32,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
},
quoteText: {
  fontSize: 14,
  color: '#94A3B8',
  lineHeight: 22,
  fontStyle: 'italic',
  marginBottom: 8,
},
quoteAuthor: {
  fontSize: 12,
  color: '#94A3B8',
  textAlign: 'right',
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mainCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#D1FAE5',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#D1FAE5',
    textAlign: 'center',
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
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  waterButton: {
    backgroundColor: '#1E40AF',
  },
  calorieButton: {
    backgroundColor: '#DC2626',
  },
  workoutButton: {
    backgroundColor: '#7C2D12',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  sessionCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  sessionInfo: {
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 2,
  },
  sessionInstructor: {
    fontSize: 12,
    color: '#94A3B8',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  rescheduleButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    flex: 1,
  },
  rescheduleText: {
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  bannerContainer: {
    paddingHorizontal: 20,
  },
  bannerCard: {
    width: width * 0.7,
    height: 140,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  bannerGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  bannerInstructor: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  bannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerCost: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bannerCta: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  weeklyCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weeklyNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weeklyLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  viewProgressButton: {
    alignSelf: 'center',
  },
  viewProgressText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  achievementCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  badge: {
    width: 48,
    height: 48,
    backgroundColor: '#F59E0B',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  badgeIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#94A3B8',
  },
});




