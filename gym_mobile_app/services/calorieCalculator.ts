// services/calorieCalculator.ts
import axios from 'axios';
import Constants from 'expo-constants';

// Get API key from environment variables
const API_NINJAS_KEY = Constants.expoConfig?.extra?.apiNinjasKey || process.env.EXPO_PUBLIC_API_NINJAS_KEY;

if (!API_NINJAS_KEY) {
  console.warn('⚠️ API_NINJAS_KEY not found in environment variables!');
  console.warn('Add EXPO_PUBLIC_API_NINJAS_KEY to your .env file');
}

// ==========================================
// TYPES
// ==========================================

interface ApiNinjasResponse {
  name: string;
  calories_per_hour: number;
  duration_minutes: number;
  total_calories: number;
}

interface CalorieCalculationParams {
  exerciseName: string;
  weightKg: number;
  durationMinutes: number;
  gender: 'male' | 'female';
}

// ==========================================
// EXERCISE TO API ACTIVITY MAPPING
// ==========================================

/**
 * Maps your frontend exercise names to API Ninjas activity names
 * API Ninjas has specific activity names it recognizes
 */
const EXERCISE_TO_API_ACTIVITY_MAP: Record<string, string> = {
  // Cardio
  'Running (Outdoor)': 'running',
  'Treadmill': 'running',
  'Cycling': 'cycling',
  'Rowing Machine': 'rowing',
  'Elliptical': 'elliptical',
  'Jump Rope': 'jump rope',
  'Swimming': 'swimming',
  'Stair Climbing': 'stair climbing',
  
  // Strength
  'Bench Press': 'weight lifting',
  'Squats': 'weight lifting',
  'Deadlifts': 'weight lifting',
  'Dumbbell Press': 'weight lifting',
  'Bicep Curls': 'weight lifting',
  'Shoulder Press': 'weight lifting',
  'Lat Pulldown': 'weight lifting',
  'Leg Press': 'weight lifting',
  
  // Yoga
  'Hatha Yoga': 'yoga',
  'Vinyasa Flow': 'yoga',
  'Power Yoga': 'power yoga',
  'Stretching': 'stretching',
  'Pilates': 'pilates',
  
  // HIIT
  'HIIT Training': 'circuit training',
  'Circuit Training': 'circuit training',
  'CrossFit': 'crossfit',
  'Burpees': 'calisthenics',
  'Tabata': 'circuit training',
};

/**
 * MET values for fallback calculation
 * MET = Metabolic Equivalent of Task
 */
const EXERCISE_MET_VALUES: Record<string, { low: number; medium: number; high: number }> = {
  // Cardio
  'Running (Outdoor)': { low: 6.0, medium: 9.8, high: 12.5 },
  'Treadmill': { low: 5.0, medium: 8.0, high: 11.0 },
  'Cycling': { low: 4.0, medium: 8.0, high: 12.0 },
  'Rowing Machine': { low: 4.8, medium: 7.0, high: 12.0 },
  'Elliptical': { low: 5.0, medium: 7.0, high: 9.0 },
  'Jump Rope': { low: 8.0, medium: 10.0, high: 12.0 },
  'Swimming': { low: 6.0, medium: 8.0, high: 11.0 },
  'Stair Climbing': { low: 5.0, medium: 8.0, high: 10.0 },
  
  // Strength
  'Bench Press': { low: 3.5, medium: 5.0, high: 8.0 },
  'Squats': { low: 5.0, medium: 6.0, high: 8.0 },
  'Deadlifts': { low: 4.0, medium: 6.0, high: 8.0 },
  'Dumbbell Press': { low: 3.0, medium: 5.0, high: 7.0 },
  'Bicep Curls': { low: 3.0, medium: 4.0, high: 6.0 },
  'Shoulder Press': { low: 3.5, medium: 5.0, high: 7.0 },
  'Lat Pulldown': { low: 3.0, medium: 5.0, high: 7.0 },
  'Leg Press': { low: 4.0, medium: 6.0, high: 8.0 },
  
  // Yoga
  'Hatha Yoga': { low: 2.5, medium: 3.0, high: 4.0 },
  'Vinyasa Flow': { low: 3.0, medium: 4.0, high: 5.0 },
  'Power Yoga': { low: 4.0, medium: 5.0, high: 6.0 },
  'Stretching': { low: 2.3, medium: 2.3, high: 2.3 },
  'Pilates': { low: 3.0, medium: 4.0, high: 5.0 },
  
  // HIIT
  'HIIT Training': { low: 8.0, medium: 10.0, high: 12.0 },
  'Circuit Training': { low: 6.0, medium: 8.0, high: 10.0 },
  'CrossFit': { low: 8.0, medium: 10.0, high: 13.0 },
  'Burpees': { low: 8.0, medium: 10.0, high: 12.0 },
  'Tabata': { low: 10.0, medium: 12.0, high: 14.0 },
};

// ==========================================
// CALORIE CALCULATION FUNCTIONS
// ==========================================

/**
 * Calculate calories using API Ninjas (Primary Method)
 */
export async function calculateCaloriesWithAPI(
  params: CalorieCalculationParams
): Promise<number> {
  const { exerciseName, weightKg, durationMinutes } = params;
  
  try {
    // Map exercise name to API activity
    const apiActivity = EXERCISE_TO_API_ACTIVITY_MAP[exerciseName] 
      || exerciseName.toLowerCase();
    
    // Convert kg to lbs (API Ninjas uses pounds)
    const weightLbs = Math.round(weightKg * 2.20462);
    
    console.log(`📊 Calling API Ninjas:`);
    console.log(`   Exercise: ${exerciseName} → ${apiActivity}`);
    console.log(`   Weight: ${weightKg}kg (${weightLbs}lbs)`);
    console.log(`   Duration: ${durationMinutes} min`);
    
    const response = await axios.get<ApiNinjasResponse[]>(
      'https://api.api-ninjas.com/v1/caloriesburned',
      {
        params: {
          activity: apiActivity,
          weight: weightLbs,
          duration: durationMinutes
        },
        headers: {
          'X-Api-Key': API_NINJAS_KEY
        },
        timeout: 5000 // 5 second timeout
      }
    );

    console.log('✅ API Ninjas response:', response.data);

    if (response.data && response.data.length > 0) {
      const caloriesBurned = Math.round(response.data[0].total_calories);
      console.log(`✅ API Calculated: ${caloriesBurned} calories`);
      return caloriesBurned;
    }
    
    throw new Error('No data returned from API Ninjas');
    
  } catch (error: any) {
    console.error('❌ API Ninjas error:', error.message);
    throw error; // Let the caller handle the fallback
  }
}

/**
 * Calculate calories using MET formula (Fallback Method)
 * Formula: (MET * 3.5 * weight_kg / 200) * duration_minutes
 */
export function calculateCaloriesWithMET(
  exerciseName: string,
  intensity: 'low' | 'medium' | 'high',
  weightKg: number,
  durationMinutes: number,
  gender: 'male' | 'female' = 'male'
): number {
  // Get MET value for this exercise and intensity
  const metValues = EXERCISE_MET_VALUES[exerciseName];
  
  if (!metValues) {
    console.warn(`⚠️ No MET values found for ${exerciseName}, using defaults`);
    // Default MET values if exercise not found
    const defaultMets = { low: 4.0, medium: 7.0, high: 10.0 };
    const metValue = defaultMets[intensity];
    const genderMultiplier = gender === 'male' ? 1.0 : 0.9;
    return Math.round((metValue * 3.5 * weightKg / 200) * durationMinutes * genderMultiplier);
  }
  
  const metValue = metValues[intensity];
  const genderMultiplier = gender === 'male' ? 1.0 : 0.9;
  
  const calories = Math.round(
    (metValue * 3.5 * weightKg / 200) * durationMinutes * genderMultiplier
  );
  
  console.log(`📊 MET Calculation (Fallback):`);
  console.log(`   Exercise: ${exerciseName}`);
  console.log(`   MET Value: ${metValue}`);
  console.log(`   Weight: ${weightKg}kg`);
  console.log(`   Duration: ${durationMinutes} min`);
  console.log(`   Gender Multiplier: ${genderMultiplier}`);
  console.log(`   ✅ Calculated: ${calories} calories`);
  
  return calories;
}

/**
 * Smart calorie calculation with automatic fallback
 * This is the main function you should use
 */
export async function calculateCaloriesBurned(
  params: CalorieCalculationParams,
  intensity: 'low' | 'medium' | 'high' = 'medium'
): Promise<{ calories: number; method: 'api' | 'met' }> {
  const { exerciseName, weightKg, durationMinutes, gender } = params;
  
  // Try API Ninjas first
  if (API_NINJAS_KEY) {
    try {
      const calories = await calculateCaloriesWithAPI(params);
      return { calories, method: 'api' };
    } catch (error) {
      console.log('⚠️ API Ninjas failed, falling back to MET calculation');
    }
  } else {
    console.log('⚠️ No API key, using MET calculation');
  }
  
  // Fallback to MET calculation
  const calories = calculateCaloriesWithMET(
    exerciseName,
    intensity,
    weightKg,
    durationMinutes,
    gender
  );
  
  return { calories, method: 'met' };
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get all supported exercises
 */
export function getSupportedExercises(): string[] {
  return Object.keys(EXERCISE_TO_API_ACTIVITY_MAP);
}

/**
 * Check if an exercise is supported
 */
export function isExerciseSupported(exerciseName: string): boolean {
  return exerciseName in EXERCISE_TO_API_ACTIVITY_MAP;
}

/**
 * Get MET values for an exercise (for UI display)
 */
export function getExerciseMETValues(exerciseName: string) {
  return EXERCISE_MET_VALUES[exerciseName] || null;
}