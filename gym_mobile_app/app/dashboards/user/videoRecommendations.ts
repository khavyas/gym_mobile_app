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
    id: '1',
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
    title: 'Understanding Your Heart Health: 5 Essential Tips',
    description: 'Learn how to optimize your cardiovascular health with evidence-based strategies from leading cardiologists.',
    duration: '8:42',
    category: 'Cardiology',
    instructor: 'Dr. Sarah Mitchell',
    credentials: 'MD',
    rating: 4.9,
    views: '2.3M',
  },
  {
    id: '2',
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
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
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
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
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
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
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
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
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
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
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
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
    youtubeId: 'ZJpt_bRTC6g', // Replace with actual YouTube video ID
    title: 'Healthy Meal Prep: 5 Recipes for the Week',
    description: 'Save time and eat healthy with these simple meal prep ideas.',
    duration: '10:30',
    category: 'Cooking',
    instructor: 'Chef Amanda Lee',
    credentials: 'Culinary Nutritionist',
    rating: 4.7,
    views: '890K',
  },
];

// Function to get a random video
export const getRandomVideo = (): VideoRecommendation => {
  const randomIndex = Math.floor(Math.random() * videoRecommendations.length);
  return videoRecommendations[randomIndex];
};

// Function to get YouTube thumbnail URL
export const getYouTubeThumbnail = (youtubeId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string => {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}default.jpg`;
};

// Function to get YouTube video URL
export const getYouTubeUrl = (youtubeId: string): string => {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
};