export interface VideoRecommendation {
  id: string;
  youtubeId: string; // The YouTube video ID (from the URL)
  title: string;
  description: string;
  duration: string; // e.g., "8:42"
  category: string;
  instructor: string;
  credentials?: string;
  rating?: number;
  views?: string;
  thumbnailUrl?: string; // Optional: YouTube provides auto thumbnails
}

export const videoRecommendations: VideoRecommendation[] = [
  {
    id: '2',
    youtubeId: 'v7AYKMP6rOE', // Morning Yoga Flow
    title: '10-Minute Morning Yoga Flow for Beginners',
    description: 'Start your day with energy and flexibility through this simple yet effective yoga routine.',
    duration: '10:15',
    category: 'Yoga',
    instructor: 'Emma Thompson',
    credentials: 'Certified Yoga Instructor',
    rating: 4.8,
    views: '1.8M',
  },
  {
    id: '3',
    youtubeId: 'qcpY-8HRKxA', // Nutrition Basics
    title: 'Nutrition Basics: What to Eat for Optimal Health',
    description: 'Discover the fundamental principles of nutrition and how to build a balanced diet.',
    duration: '7:30',
    category: 'Nutrition',
    instructor: 'Dr. James Rodriguez',
    credentials: 'Nutritionist, PhD',
    rating: 4.7,
    views: '980K',
  },
  {
    id: '4',
    youtubeId: 'ml6cT4AZdqI', // HIIT Workout
    title: 'Quick HIIT Workout: Burn Calories in 8 Minutes',
    description: 'High-intensity interval training that maximizes calorie burn in minimal time.',
    duration: '8:00',
    category: 'Fitness',
    instructor: 'Mike Chen',
    credentials: 'Personal Trainer',
    rating: 4.9,
    views: '3.1M',
  },
  {
    id: '5',
    youtubeId: 'EiYm20F9WXU', // Sleep Better
    title: 'Sleep Better: 5 Science-Backed Techniques',
    description: 'Improve your sleep quality with proven methods recommended by sleep specialists.',
    duration: '9:20',
    category: 'Wellness',
    instructor: 'Dr. Lisa Chang',
    credentials: 'Sleep Specialist, MD',
    rating: 4.8,
    views: '1.5M',
  },
  {
    id: '6',
    youtubeId: 'inpok4MKVLM', // Meditation
    title: 'Meditation for Stress Relief: A Beginner\'s Guide',
    description: 'Learn meditation techniques to reduce stress and improve mental clarity.',
    duration: '6:45',
    category: 'Mindfulness',
    instructor: 'David Kumar',
    credentials: 'Meditation Coach',
    rating: 4.9,
    views: '2.7M',
  },
  {
    id: '7',
    youtubeId: 'R6gZoAzAhCg', // Strength Training for Women
    title: 'Strength Training Fundamentals for Women',
    description: 'Build strength and confidence with proper weightlifting techniques.',
    duration: '9:55',
    category: 'Strength',
    instructor: 'Jessica Martinez',
    credentials: 'Certified Strength Coach',
    rating: 4.8,
    views: '1.2M',
  },
  {
    id: '8',
    youtubeId: '8nGC35uEgGQ', // Meal Prep
    title: 'Healthy Meal Prep: 5 Recipes for the Week',
    description: 'Save time and eat healthy with these simple meal prep ideas.',
    duration: '10:30',
    category: 'Cooking',
    instructor: 'Chef Amanda Lee',
    credentials: 'Culinary Nutritionist',
    rating: 4.7,
    views: '890K',
  },
  {
    id: '9',
    youtubeId: 'COp7BR_Dvps', // Stretching Routine
    title: 'Full Body Stretching Routine for Flexibility',
    description: 'Improve flexibility and reduce muscle tension with this comprehensive stretching guide.',
    duration: '12:18',
    category: 'Flexibility',
    instructor: 'Alex Morgan',
    credentials: 'Physical Therapist',
    rating: 4.8,
    views: '1.4M',
  },
  {
    id: '10',
    youtubeId: 'sTANio_2E0Q', // Posture Correction
    title: 'Fix Your Posture: Essential Exercises',
    description: 'Correct poor posture and relieve back pain with these simple daily exercises.',
    duration: '10:22',
    category: 'Physical Therapy',
    instructor: 'Dr. Rachel Foster',
    credentials: 'DPT, Physical Therapist',
    rating: 4.9,
    views: '2.4M',
  },
  {
    id: '11',
    youtubeId: 'aUaInS6HIGo', // Core Workout
    title: 'Effective Core Strengthening Exercises',
    description: 'Build a strong core with these targeted exercises that improve posture and stability.',
    duration: '11:30',
    category: 'Strength',
    instructor: 'Ryan Peterson',
    credentials: 'Fitness Coach',
    rating: 4.7,
    views: '1.6M',
  },
  {
    id: '12',
    youtubeId: 'hJbRpHZr_d0', // Walking for Health
    title: 'Walking for Health: Complete Guide',
    description: 'Discover the incredible health benefits of walking and how to optimize your routine.',
    duration: '9:45',
    category: 'Cardiology',
    instructor: 'Dr. Michael Brown',
    credentials: 'Sports Medicine, MD',
    rating: 4.8,
    views: '950K',
  },
];

// Function to get a random video (with shuffling to avoid repetition)
export const getRandomVideo = (): VideoRecommendation => {
  const randomIndex = Math.floor(Math.random() * videoRecommendations.length);
  return videoRecommendations[randomIndex];
};

// Function to get multiple unique random videos
export const getRandomVideos = (count: number): VideoRecommendation[] => {
  // Create a shuffled copy of the array
  const shuffled = [...videoRecommendations].sort(() => Math.random() - 0.5);
  // Return the first 'count' items
  return shuffled.slice(0, Math.min(count, videoRecommendations.length));
};

// Function to get YouTube thumbnail URL with better quality fallback
export const getYouTubeThumbnail = (
  youtubeId: string, 
  quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'
): string => {
  // Using i.ytimg.com for better reliability
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
};

// Function to get YouTube video URL
export const getYouTubeUrl = (youtubeId: string): string => {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
};