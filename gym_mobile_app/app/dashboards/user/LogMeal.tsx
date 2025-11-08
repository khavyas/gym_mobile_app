import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image, TextInput, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Utensils, Coffee, Pizza, Apple, Moon, Drumstick, Camera, Search } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; // ← KEEP THIS for camera/gallery
import { 
  processImage, 
  validateImage, 
  formatFileSize,
  getWebFileSize,
  needsCompression 
} from '../../utils/imageCompressionUtils';
import { Animated } from 'react-native';

const API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';
const CALORIE_NINJA_API_KEY = '40zvAZsDb7q/yMbKodGj1A==6ddAOLV8qB4sxUUg';
const CALORIE_NINJA_BASE_URL = 'https://api.calorieninjas.com/v1';

// LogMeal API Configuration
const LOGMEAL_API_BASE_URL = 'https://api.logmeal.com/v2';
const LOGMEAL_API_TOKEN = '092e2e1064a1b9ba117fa6733c5c9c080e447f76';

// LogMeal Preferences (can be customized per user)
const LOGMEAL_PREFERENCES = {
  country: 'IN',    // India (use 'US', 'ES', 'GB', etc. for other countries)
  language: 'eng'   // English (use 'spa' for Spanish, 'hin' for Hindi, etc.)
};

const { width } = Dimensions.get('window');

interface MealEntry {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

interface APIMealEntry {
  _id: string;
  user: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  createdAt: string;
  updatedAt: string;
}

interface NutritionItem {
  name: string;
  calories: number;
  protein_g: number;
  carbohydrates_total_g: number;
  fat_total_g: number;
  serving_size_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  cholesterol_mg?: number;
  saturated_fat_g?: number;
  potassium_mg?: number;
}

interface LogMealDishCandidate {
  id: number;
  name: string;
  prob: number;
}

interface LogMealFoodItem {
  food_item_position: number;
  recognition_results: LogMealDishCandidate[];
  contained_bbox?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  center?: {
    x: number;
    y: number;
  };
  serving_size?: number;
}

interface LogMealResponse {
  imageId: string;
  occasion?: string;
  foodType?: {
    id: number;
    name: string;
  };
  segmentation_results: LogMealFoodItem[];
}

const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
 
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastIcon}>✓</Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default function LogMeal() {
  const router = useRouter();
  const [totalCalories, setTotalCalories] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NutritionItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<NutritionItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [logMealImageId, setLogMealImageId] = useState<string>('');
  const [detectedDishes, setDetectedDishes] = useState<LogMealFoodItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const mealTypes = [
    { 
      label: 'Breakfast', 
      value: 'breakfast' as const,
      icon: Coffee,
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706']
    },
    { 
      label: 'Lunch', 
      value: 'lunch' as const,
      icon: Utensils,
      color: '#10B981',
      gradient: ['#10B981', '#059669']
    },
    { 
      label: 'Dinner', 
      value: 'dinner' as const,
      icon: Drumstick,
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626']
    },
    { 
      label: 'Snack', 
      value: 'snack' as const,
      icon: Apple,
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED']
    },
  ];

  const progressPercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  useEffect(() => {
    fetchTodayMealData();
    if (Platform.OS !== 'web') {
      requestPermissions();
    }
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to scan meals.');
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // WEB: Handle camera/file input for web
  const handleWebImageCapture = () => {
    if (Platform.OS === 'web') {
      if (!fileInputRef.current) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.style.display = 'none';
        
        input.onchange = async (e: any) => {
          const file = e.target.files?.[0];
          if (!file) return;

          try {
            // Step 1: Validate the image
            const validation = validateImage(file);
            if (!validation.valid) {
              Alert.alert('Invalid Image', validation.message || 'Please select a valid image');
              return;
            }

            // Step 2: Check size and log it
            const originalSize = getWebFileSize(file);
            console.log(`📸 Original image size: ${formatFileSize(originalSize)}`);

            // Step 3: Process (compress if needed)
            const processedFile = await processImage(file, true);
            
            if (processedFile instanceof File) {
              const newSize = getWebFileSize(processedFile);
              console.log(`📸 Processed image size: ${formatFileSize(newSize)}`);
            }

            // Step 4: Analyze with LogMeal
            await analyzeImageWithLogMeal(processedFile as File);
            
          } catch (error) {
            console.error('Error processing image:', error);
            Alert.alert('Error', 'Failed to process image. Please try a different photo.');
          }
        };
        
        document.body.appendChild(input);
        fileInputRef.current = input;
      }
      
      fileInputRef.current.click();
    }
  };

  // LogMeal Image Analysis (Web & Native) - FIXED VERSION
  const analyzeImageWithLogMeal = async (file: File | any) => {
    setIsAnalyzingImage(true);
    try {
      const formData = new FormData();
      
      // Ensure the file has proper JPEG extension and type
      if (file instanceof File) {
        // Web platform - create new file with proper .jpg extension
        const properFile = new File([file], 'meal_photo.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        formData.append('image', properFile);
      } else {
        // This shouldn't happen, but handle it
        formData.append('image', file);
      }

      console.log('📤 Uploading to LogMeal API...');

      // IMPORTANT: Include language and country preferences in the request
      const response = await axios.post<LogMealResponse>(
        `${LOGMEAL_API_BASE_URL}/image/segmentation/complete`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${LOGMEAL_API_TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          params: {
            // Add preferences as query parameters
            language: LOGMEAL_PREFERENCES.language,
            country: LOGMEAL_PREFERENCES.country,
          },
          timeout: 30000,
        }
      );

      const data = response.data;
      
      if (data.segmentation_results && data.segmentation_results.length > 0) {
        setLogMealImageId(data.imageId);
        setDetectedDishes(data.segmentation_results);
        
        // Get nutrition info for detected dishes
        await fetchNutritionForDetectedDishes(data.segmentation_results);
        
        Alert.alert(
          'Food Detected! 🍽️',
          `Found ${data.segmentation_results.length} food item(s) in your meal. Review and confirm below.`,
          [{ text: 'Review', style: 'default' }]
        );
      } else {
        Alert.alert(
          'No Food Detected',
          'Could not detect any food items in the image. Please try:\n• Taking a clearer photo\n• Ensuring good lighting\n• Capturing the entire dish'
        );
      }
    } catch (error: any) {
      console.error('Error analyzing image with LogMeal:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Authentication Error', 
          'Invalid API token. Please verify your LogMeal API credentials.'
        );
      } else if (error.response?.status === 429) {
        Alert.alert('Rate Limit', 'Too many requests. Please try again in a few moments.');
      } else if (error.response?.status === 413 || error.response?.data?.code === 715) {
        Alert.alert('Image Too Large', 'Please use a smaller image (recommended: under 1MB).');
      } else if (error.response?.data?.code === 711) {
        Alert.alert(
          'Invalid Image Format',
          'The image format is not supported. Please try:\n• Taking a new photo\n• Using a different image\n• Ensuring the image is a valid JPEG'
        );
      } else {
        Alert.alert(
          'Analysis Error',
          `Failed to analyze the image. ${error.response?.data?.message || error.message || 'Please try again.'}`
        );
      }
    } finally {
      setIsAnalyzingImage(false);
    }
  };


  // Fetch nutrition info for detected dishes using CalorieNinjas
  const fetchNutritionForDetectedDishes = async (dishes: LogMealFoodItem[]) => {
    try {
      const nutritionPromises = dishes.map(async (dish) => {
        const topDish = dish.recognition_results[0];
        if (!topDish) return null;

        try {
          const response = await axios.get(
            `${CALORIE_NINJA_BASE_URL}/nutrition?query=${encodeURIComponent(topDish.name)}`,
            {
              headers: {
                'X-Api-Key': CALORIE_NINJA_API_KEY,
              },
            }
          );

          if (response.data.items && response.data.items.length > 0) {
            const item = response.data.items[0];
            return {
              ...item,
              dishId: topDish.id,
              dishName: topDish.name,
              probability: topDish.prob,
              position: dish.food_item_position,
            };
          }
        } catch (error) {
          console.error(`Error fetching nutrition for ${topDish.name}:`, error);
        }
        return null;
      });

      const nutritionResults = await Promise.all(nutritionPromises);
      const validResults = nutritionResults.filter(r => r !== null) as NutritionItem[];
      
      if (validResults.length > 0) {
        setSearchResults(validResults);
        setSelectedItems(validResults);
      }
    } catch (error) {
      console.error('Error fetching nutrition info:', error);
    }
  };

  // NATIVE: Scan meal from camera
  const scanMealFromImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await analyzeImageNative(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await analyzeImageNative(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Analyze image for native platforms - FIXED VERSION
  const analyzeImageNative = async (imageUri: string) => {
    setIsAnalyzingImage(true);
    try {
      // Step 1: Validate the image URI
      const validation = validateImage(imageUri);
      if (!validation.valid) {
        Alert.alert('Invalid Image', validation.message || 'Please select a valid image');
        return;
      }

      // Step 2: Process (compress) the image
      console.log(`📸 Processing native image: ${imageUri}`);
      const processedUri = await processImage(imageUri, true);

      // Step 3: Prepare FormData
      const formData = new FormData();
      const filename = (processedUri as string).split('/').pop() || 'image.jpg';
      const type = 'image/jpeg'; // Always JPEG after compression

      formData.append('image', {
        uri: processedUri,
        name: filename,
        type: type,
      } as any);

      console.log('📤 Uploading compressed image to LogMeal API...');

      // Step 4: Upload to LogMeal API
      const response = await axios.post<LogMealResponse>(
        `${LOGMEAL_API_BASE_URL}/image/segmentation/complete`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${LOGMEAL_API_TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
          params: {
            language: LOGMEAL_PREFERENCES.language,
            country: LOGMEAL_PREFERENCES.country,
          },
          timeout: 30000,
        }
      );

      const data = response.data;
      
      if (data.segmentation_results && data.segmentation_results.length > 0) {
        setLogMealImageId(data.imageId);
        setDetectedDishes(data.segmentation_results);
        
        await fetchNutritionForDetectedDishes(data.segmentation_results);
        
        Alert.alert(
          'Food Detected! 🍽️',
          `Found ${data.segmentation_results.length} food item(s). Review below.`
        );
      } else {
        Alert.alert('No Food Detected', 'Could not detect any food items. Please try a different image.');
      }
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 413 || error.response?.data?.code === 715) {
        Alert.alert(
          'Image Too Large',
          'The image is still too large after compression. Please try:\n• Taking a new photo with lower resolution\n• Choosing a different image\n• Reducing image quality in your camera settings'
        );
      } else if (error.response?.status === 401) {
        Alert.alert(
          'Authentication Error', 
          'Invalid API token. Please verify your LogMeal API credentials.'
        );
      } else if (error.response?.status === 429) {
        Alert.alert('Rate Limit', 'Too many requests. Please try again in a few moments.');
      } else {
        Alert.alert(
          'Analysis Error', 
          `Failed to analyze the image. ${error.response?.data?.message || error.message || 'Please try again.'}`
        );
      }
    } finally {
      setIsAnalyzingImage(false);
    }
  };


  const showImageOptions = () => {
    if (Platform.OS === 'web') {
      handleWebImageCapture();
    } else {
      Alert.alert(
        'Scan Meal',
        'Choose an option:',
        [
          {
            text: 'Take Photo',
            onPress: scanMealFromImage,
          },
          {
            text: 'Choose from Gallery',
            onPress: pickImageFromGallery,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  // Search food nutrition using CalorieNinjas API
  const searchFoodNutrition = async (query: string) => {
    if (!query.trim()) {
      Alert.alert('Empty Query', 'Please enter a food item to search.');
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `${CALORIE_NINJA_BASE_URL}/nutrition?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'X-Api-Key': CALORIE_NINJA_API_KEY,
          },
        }
      );

      if (response.data.items && response.data.items.length > 0) {
        const items: NutritionItem[] = response.data.items;
        setSearchResults(items);
        setSelectedItems(items);
        Alert.alert('Success', `Found ${items.length} item(s). Review the details below.`);
      } else {
        Alert.alert('Not Found', 'No nutrition information found for this food item. Try a different query.');
        setSearchResults([]);
        setSelectedItems([]);
      }
    } catch (error: any) {
      console.error('Error searching nutrition:', error);
      Alert.alert('Search Error', 'Failed to fetch nutrition data. Please try again.');
      setSearchResults([]);
      setSelectedItems([]);
    } finally {
      setIsSearching(false);
    }
  };

  const logMealToAPI = async (mealData: Omit<MealEntry, 'id' | 'time'>): Promise<boolean> => {
    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        return false;
      }

      const response = await axios.post(
        `${API_BASE_URL}/meals`,
        mealData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error logging meal to API:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
      return false;
    }
  };

  const fetchTodayMealData = async () => {
    try {
      setIsLoading(true);
      const token = await getAuthToken();
      if (!token) {
        console.log('No auth token found');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/meals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const today = new Date().toISOString().split('T')[0];
      const todayEntries = response.data.filter((entry: APIMealEntry) => {
        const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
        return entryDate === today;
      });

      const totalCals = todayEntries.reduce((sum: number, entry: APIMealEntry) => sum + entry.calories, 0);
      setTotalCalories(totalCals);

      const localEntries: MealEntry[] = todayEntries.map((entry: APIMealEntry) => ({
        id: entry._id,
        mealType: entry.mealType as any,
        foodName: entry.foodName,
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fats: entry.fats,
        time: new Date(entry.createdAt).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
      }));

      setMealHistory(localEntries);

    } catch (error: any) {
      console.error('Error fetching meal data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSelectedItems = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items', 'Please search and select food items to save.');
      return;
    }

    setIsSaving(true);
    
    try {
      const totalNutrition = selectedItems.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein_g,
        carbs: acc.carbs + item.carbohydrates_total_g,
        fats: acc.fats + item.fat_total_g,
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

      const foodNames = selectedItems.map(item => item.name).join(', ');

      const mealData = {
        mealType: selectedMealType,
        foodName: foodNames,
        calories: Math.round(totalNutrition.calories),
        protein: Math.round(totalNutrition.protein),
        carbs: Math.round(totalNutrition.carbs),
        fats: Math.round(totalNutrition.fats),
      };

      // Skip backend API call - just log locally and show toast
      addMealLocally(mealData);
      clearSearchResults();
      
      // Show success toast
      setToastMessage(`Meal logged successfully! 🍽️`);
      setShowToast(true);
      
    } catch (error) {
      console.error('Error saving items:', error);
      Alert.alert('Error', 'Failed to save meal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };


  const clearSearchResults = () => {
    setSearchResults([]);
    setSelectedItems([]);
    setSearchQuery('');
    setDetectedDishes([]);
    setLogMealImageId('');
  };

  const toggleItemSelection = (item: NutritionItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.name === item.name);
      if (isSelected) {
        return prev.filter(i => i.name !== item.name);
      } else {
        return [...prev, item];
      }
    });
  };

  const addMealLocally = (mealData: Omit<MealEntry, 'id' | 'time'>) => {
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      ...mealData,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };

    setMealHistory(prev => [newEntry, ...prev]);
    setTotalCalories(prev => prev + mealData.calories);

    if (totalCalories + mealData.calories >= dailyGoal && totalCalories < dailyGoal) {
      // Delay the goal achievement alert slightly so toast shows first
      setTimeout(() => {
        Alert.alert(
          "🎉 Daily Goal Reached!",
          "You've reached your daily calorie goal!",
          [{ text: "Great!", style: "default" }]
        );
      }, 500);
    }
  };


  const removeMealEntry = (id: string) => {
    const entry = mealHistory.find(e => e.id === id);
    if (entry) {
      setMealHistory(prev => prev.filter(e => e.id !== id));
      setTotalCalories(prev => Math.max(0, prev - entry.calories));
      
      // Show toast for removal
      setToastMessage(`${entry.foodName} removed from log`);
      setShowToast(true);
    }
  };

  const getMealTypeIcon = (type: string) => {
    const meal = mealTypes.find(m => m.value === type);
    return meal ? meal.icon : Utensils;
  };

  const getMealTypeColor = (type: string) => {
    const meal = mealTypes.find(m => m.value === type);
    return meal ? meal.color : '#10B981';
  };

  const getEncouragementMessage = () => {
    if (progressPercentage === 0) return "Start tracking your meals! 🍽️";
    if (progressPercentage < 25) return "Great start on your nutrition! 🌱";
    if (progressPercentage < 50) return "You're doing awesome! 🌟";
    if (progressPercentage < 75) return "More than halfway there! 🚀";
    if (progressPercentage < 100) return "Almost at your goal! 💪";
    return "Daily goal achieved! Well done! 🎉";
  };

  const getMealsByType = (type: string) => {
    return mealHistory.filter(meal => meal.mealType === type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

    <Toast 
        visible={showToast} 
        message={toastMessage} 
        onHide={() => setShowToast(false)} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Meal Tracker</Text>
            <Text style={styles.headerSubtitle}>{currentDate}</Text>
          </View>
          {/* <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
        </View>

        {/* Calorie Progress Card */}
        <View style={styles.progressSection}>
          <View style={styles.calorieCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80' }}
              style={styles.calorieCardBackground}
            />
            <View style={styles.calorieCardOverlay} />
            
            <View style={styles.calorieCardContent}>
              <View style={styles.calorieDisplay}>
                <Text style={styles.currentCalories}>{totalCalories}</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
              </View>
              <Text style={styles.goalText}>of {dailyGoal} kcal goal</Text>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.encouragementText}>
                {getEncouragementMessage()}
              </Text>

              <View style={styles.macroSummary}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {mealHistory.reduce((sum, meal) => sum + meal.protein, 0)}g
                  </Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {mealHistory.reduce((sum, meal) => sum + meal.carbs, 0)}g
                  </Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroValue}>
                    {mealHistory.reduce((sum, meal) => sum + meal.fats, 0)}g
                  </Text>
                  <Text style={styles.macroLabel}>Fats</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Button */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={showImageOptions}
            disabled={isAnalyzingImage}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.quickActionGradient}
            >
              {isAnalyzingImage ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Camera size={24} color="#FFFFFF" strokeWidth={2.5} />
              )}
              <Text style={styles.quickActionText}>
                {isAnalyzingImage ? 'Analyzing with LogMeal AI...' : Platform.OS === 'web' ? 'Upload Meal Photo 📸' : 'Scan Meal with AI 🤖'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Food Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Or Search Food Manually</Text>
          <View style={styles.searchCard}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#94A3B8" strokeWidth={2.5} />
              <TextInput
                style={styles.searchInput}
                placeholder="e.g., 2 eggs and toast, 100g chicken breast"
                placeholderTextColor="#64748B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => searchFoodNutrition(searchQuery)}
              />
            </View>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => searchFoodNutrition(searchQuery)}
              disabled={isSearching}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.searchButtonGradient}
              >
                {isSearching ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.searchButtonText}>Search</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={styles.searchHint}>
            💡 Tip: You can specify quantities like "3 tomatoes" or "1lb beef"
          </Text>
        </View>

        {/* Nutrition Results Display */}
        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsSectionHeader}>
              <Text style={styles.sectionTitle}>
                {detectedDishes.length > 0 ? '🤖 AI Detected Foods' : 'Nutrition Information'}
              </Text>
              <TouchableOpacity onPress={clearSearchResults}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.resultsContainer}>
              {searchResults.map((item, index) => {
                const isSelected = selectedItems.some(i => i.name === item.name);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.nutritionCard, isSelected && styles.nutritionCardSelected]}
                    onPress={() => toggleItemSelection(item)}
                  >
                    <View style={styles.nutritionHeader}>
                      <Text style={styles.nutritionName}>{item.name}</Text>
                      <View style={styles.checkboxContainer}>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        )}
                        {!isSelected && (
                          <Ionicons name="ellipse-outline" size={24} color="#64748B" />
                        )}
                      </View>
                    </View>
                    
                    <Text style={styles.servingSize}>
                      Serving: {Math.round(item.serving_size_g)}g
                    </Text>
                    
                    <View style={styles.nutritionGrid}>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{Math.round(item.calories)}</Text>
                        <Text style={styles.nutritionLabel}>Calories</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{item.protein_g.toFixed(1)}g</Text>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{item.carbohydrates_total_g.toFixed(1)}g</Text>
                        <Text style={styles.nutritionLabel}>Carbs</Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{item.fat_total_g.toFixed(1)}g</Text>
                        <Text style={styles.nutritionLabel}>Fat</Text>
                      </View>
                    </View>

                    <View style={styles.additionalNutrition}>
                      <View style={styles.nutritionRow}>
                        <Text style={styles.nutritionRowLabel}>Fiber</Text>
                        <Text style={styles.nutritionRowValue}>{item.fiber_g.toFixed(1)}g</Text>
                      </View>
                      <View style={styles.nutritionRow}>
                        <Text style={styles.nutritionRowLabel}>Sugar</Text>
                        <Text style={styles.nutritionRowValue}>{item.sugar_g.toFixed(1)}g</Text>
                      </View>
                      <View style={styles.nutritionRow}>
                        <Text style={styles.nutritionRowLabel}>Sodium</Text>
                        <Text style={styles.nutritionRowValue}>{Math.round(item.sodium_mg)}mg</Text>
                      </View>
                      {item.cholesterol_mg !== undefined && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionRowLabel}>Cholesterol</Text>
                          <Text style={styles.nutritionRowValue}>{Math.round(item.cholesterol_mg)}mg</Text>
                        </View>
                      )}
                      {item.saturated_fat_g !== undefined && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionRowLabel}>Saturated Fat</Text>
                          <Text style={styles.nutritionRowValue}>{item.saturated_fat_g.toFixed(1)}g</Text>
                        </View>
                      )}
                      {item.potassium_mg !== undefined && (
                        <View style={styles.nutritionRow}>
                          <Text style={styles.nutritionRowLabel}>Potassium</Text>
                          <Text style={styles.nutritionRowValue}>{Math.round(item.potassium_mg)}mg</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Meal Type Selection */}
            <View style={styles.mealTypeCompactSection}>
              <Text style={styles.compactLabel}>Select Meal Type:</Text>
              <View style={styles.mealTypeCompact}>
                {mealTypes.map((meal) => {
                  const IconComponent = meal.icon;
                  const isSelected = selectedMealType === meal.value;
                  return (
                    <TouchableOpacity
                      key={meal.value}
                      style={[
                        styles.mealTypeCompactButton,
                        isSelected && { backgroundColor: meal.color }
                      ]}
                      onPress={() => setSelectedMealType(meal.value)}
                    >
                      <IconComponent size={20} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.mealTypeCompactLabel}>{meal.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveSelectedItems}
              disabled={isSaving || selectedItems.length === 0}
            >
              <LinearGradient
                colors={selectedItems.length > 0 ? ['#10B981', '#059669'] : ['#64748B', '#475569']}
                style={styles.saveButtonGradient}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="save" size={24} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>
                      Save to Meal Log ({selectedItems.length})
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Today's Meals History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <Text style={styles.historyCount}>
              {mealHistory.length} meals
            </Text>
          </View>
          
          {mealHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <View style={styles.emptyHistoryIconContainer}>
                <Utensils size={40} color="#64748B" strokeWidth={2} />
              </View>
              <Text style={styles.emptyHistoryText}>No meals logged yet</Text>
              <Text style={styles.emptyHistorySubtext}>Start tracking your nutrition!</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {mealHistory.map((entry) => {
                const IconComponent = getMealTypeIcon(entry.mealType);
                return (
                  <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <View style={[
                        styles.historyIcon,
                        { backgroundColor: getMealTypeColor(entry.mealType) }
                      ]}>
                        <IconComponent size={20} color="#FFFFFF" strokeWidth={2.5} />
                      </View>
                      <View style={styles.historyDetails}>
                        <Text style={styles.historyFoodName}>{entry.foodName}</Text>
                        <Text style={styles.historyMealType}>
                          {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)} • {entry.time}
                        </Text>
                        <View style={styles.macroRow}>
                          <Text style={styles.macroText}>{entry.calories} cal</Text>
                          {entry.protein > 0 && (
                            <Text style={styles.macroText}>P: {entry.protein}g</Text>
                          )}
                          {entry.carbs > 0 && (
                            <Text style={styles.macroText}>C: {entry.carbs}g</Text>
                          )}
                          {entry.fats > 0 && (
                            <Text style={styles.macroText}>F: {entry.fats}g</Text>
                          )}
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeMealEntry(entry.id)}
                    >
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Meal Breakdown</Text>
          <View style={styles.statsGrid}>
            {mealTypes.map((meal) => {
              const meals = getMealsByType(meal.value);
              const totalCals = meals.reduce((sum, m) => sum + m.calories, 0);
              const IconComponent = meal.icon;
              
              return (
                <View key={meal.value} style={styles.statCard}>
                  <IconComponent size={24} color={meal.color} strokeWidth={2.5} />
                  <Text style={styles.statValue}>{totalCals}</Text>
                  <Text style={styles.statLabel}>{meal.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: '#065F46',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastIcon: {
    fontSize: 20,
    color: '#10B981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  toastMessage: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  progressSection: {
    marginBottom: 24,
  },
  calorieCard: {
    borderRadius: 24,
    minHeight: 280,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  calorieCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  calorieCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  calorieCardContent: {
    padding: 24,
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
  },
  calorieDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentCalories: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calorieUnit: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
  },
  goalText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  encouragementText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 20,
  },
  macroSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  macroLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchSection: {
    marginBottom: 24,
  },
  searchCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchHint: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 12,
    fontStyle: 'italic',
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  resultsContainer: {
    maxHeight: 400,
  },
  nutritionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },
  nutritionCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  servingSize: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  additionalNutrition: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
    gap: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  nutritionRowLabel: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  nutritionRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mealTypeCompactSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 12,
  },
  mealTypeCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealTypeCompactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#374151',
    borderRadius: 12,
    gap: 8,
  },
  mealTypeCompactLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historySection: {
    marginBottom: 32,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  historyCount: {
    fontSize: 14,
    color: '#94A3B8',
  },
  emptyHistory: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  emptyHistoryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#94A3B8',
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#374151',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyFoodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  historyMealType: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 6,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});