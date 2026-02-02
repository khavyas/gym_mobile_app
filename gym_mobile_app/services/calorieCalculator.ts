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

// 🔥 NEW: Exercise-specific parameters for calorie adjustment
export interface ExerciseParameters {
  // Strength training
  weightLifted?: number;  // kg
  reps?: number;
  sets?: number;
  
  // Cardio
  distance?: number;      // km
  speed?: number;         // km/h
  incline?: number;       // percentage
  resistance?: number;    // 1-10 scale
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
// 🔥 NEW: CALORIE ADJUSTMENT FUNCTIONS
// ==========================================

/**
 * Adjust calories for strength training based on weight, reps, and sets
 */
function adjustCaloriesForStrength(
  baseCalories: number,
  params: ExerciseParameters,
  bodyWeightKg: number,
  exerciseName: string
): number {
  let adjustedCalories = baseCalories;
  
  const { weightLifted, reps, sets } = params;
  
  // If no parameters provided, return base calories
  if (!weightLifted && !reps && !sets) {
    return baseCalories;
  }
  
  // Calculate intensity multiplier based on weight lifted
  if (weightLifted) {
    // Heavier weights = more calories
    // Assumption: lifting bodyweight = 1.0x, 1.5x bodyweight = 1.3x, 2x bodyweight = 1.5x
    const weightRatio = weightLifted / bodyWeightKg;
    let weightMultiplier = 1.0;
    
    if (weightRatio > 1.5) {
      weightMultiplier = 1.3; // Heavy lifting
    } else if (weightRatio > 1.0) {
      weightMultiplier = 1.15; // Moderate-heavy
    } else if (weightRatio > 0.5) {
      weightMultiplier = 1.0; // Moderate
    } else {
      weightMultiplier = 0.85; // Light weight
    }
    
    adjustedCalories *= weightMultiplier;
  }
  
  // Adjust based on reps (higher reps = slightly more calories for endurance)
  if (reps) {
    let repsMultiplier = 1.0;
    
    if (reps > 15) {
      repsMultiplier = 1.1; // High rep endurance work
    } else if (reps > 10) {
      repsMultiplier = 1.05; // Moderate reps
    } else if (reps <= 5) {
      repsMultiplier = 0.95; // Low reps (strength focus, less metabolic)
    }
    
    adjustedCalories *= repsMultiplier;
  }
  
  // Adjust based on sets (more sets = proportionally more work)
  if (sets) {
    // Each additional set beyond the base (assumed 3 sets) adds calories
    const baseSets = 3;
    if (sets > baseSets) {
      const additionalSets = sets - baseSets;
      adjustedCalories *= (1 + (additionalSets * 0.15)); // +15% per extra set
    } else if (sets < baseSets) {
      const fewerSets = baseSets - sets;
      adjustedCalories *= (1 - (fewerSets * 0.15)); // -15% per fewer set
    }
  }
  
  console.log(`💪 Strength Adjustment:`, {
    baseCalories,
    weightLifted,
    reps,
    sets,
    adjustedCalories: Math.round(adjustedCalories),
    change: `${((adjustedCalories / baseCalories - 1) * 100).toFixed(1)}%`
  });
  
  return Math.round(adjustedCalories);
}

/**
 * Adjust calories for cardio based on distance, speed, incline, resistance
 */
function adjustCaloriesForCardio(
  baseCalories: number,
  params: ExerciseParameters,
  exerciseName: string,
  durationMinutes: number
): number {
  let adjustedCalories = baseCalories;
  
  const { distance, speed, incline, resistance } = params;
  
  // If no parameters provided, return base calories
  if (!distance && !speed && !incline && !resistance) {
    return baseCalories;
  }
  
  // Adjust based on speed (for running/cycling)
  if (speed) {
    let speedMultiplier = 1.0;
    
    // Running speed adjustments (km/h)
    if (exerciseName.includes('Running') || exerciseName.includes('Treadmill')) {
      if (speed > 12) {
        speedMultiplier = 1.4; // Very fast running
      } else if (speed > 10) {
        speedMultiplier = 1.25; // Fast running
      } else if (speed > 8) {
        speedMultiplier = 1.1; // Moderate running
      } else if (speed > 6) {
        speedMultiplier = 1.0; // Light jogging
      } else {
        speedMultiplier = 0.85; // Walking pace
      }
    }
    
    // Cycling speed adjustments (km/h)
    if (exerciseName.includes('Cycling')) {
      if (speed > 25) {
        speedMultiplier = 1.4; // Very fast cycling
      } else if (speed > 20) {
        speedMultiplier = 1.25; // Fast cycling
      } else if (speed > 15) {
        speedMultiplier = 1.1; // Moderate cycling
      } else {
        speedMultiplier = 0.9; // Leisurely cycling
      }
    }
    
    adjustedCalories *= speedMultiplier;
  }
  
  // Adjust based on incline (for treadmill)
  if (incline) {
    // Incline significantly increases calorie burn
    // +5% incline = +20% calories, +10% incline = +40% calories
    const inclineMultiplier = 1 + (incline * 0.04);
    adjustedCalories *= inclineMultiplier;
  }
  
  // Adjust based on resistance (for cycling, rowing, elliptical)
  if (resistance) {
    // Resistance on 1-10 scale
    let resistanceMultiplier = 1.0;
    
    if (resistance >= 8) {
      resistanceMultiplier = 1.3; // High resistance
    } else if (resistance >= 6) {
      resistanceMultiplier = 1.15; // Medium-high resistance
    } else if (resistance >= 4) {
      resistanceMultiplier = 1.0; // Medium resistance
    } else {
      resistanceMultiplier = 0.85; // Low resistance
    }
    
    adjustedCalories *= resistanceMultiplier;
  }
  
  // Verify distance consistency
  if (distance && speed) {
    const expectedDuration = (distance / speed) * 60; // minutes
    if (Math.abs(expectedDuration - durationMinutes) > durationMinutes * 0.3) {
      console.warn('⚠️ Distance and speed don\'t match duration - using speed as primary factor');
    }
  }
  
  console.log(`🏃 Cardio Adjustment:`, {
    baseCalories,
    distance,
    speed,
    incline,
    resistance,
    adjustedCalories: Math.round(adjustedCalories),
    change: `${((adjustedCalories / baseCalories - 1) * 100).toFixed(1)}%`
  });
  
  return Math.round(adjustedCalories);
}

/**
 * Adjust calories for HIIT based on sets and reps
 */
function adjustCaloriesForHIIT(
  baseCalories: number,
  params: ExerciseParameters
): number {
  let adjustedCalories = baseCalories;
  
  const { sets, reps } = params;
  
  // If no parameters provided, return base calories
  if (!sets && !reps) {
    return baseCalories;
  }
  
  // More rounds/sets = proportionally more work
  if (sets) {
    const baseSets = 4; // Assume base is 4 rounds
    if (sets > baseSets) {
      adjustedCalories *= (1 + ((sets - baseSets) * 0.2)); // +20% per extra round
    } else if (sets < baseSets) {
      adjustedCalories *= (1 - ((baseSets - sets) * 0.2)); // -20% per fewer round
    }
  }
  
  // Higher reps = more work
  if (reps) {
    if (reps > 20) {
      adjustedCalories *= 1.15;
    } else if (reps > 15) {
      adjustedCalories *= 1.1;
    } else if (reps < 10) {
      adjustedCalories *= 0.9;
    }
  }
  
  console.log(`🔥 HIIT Adjustment:`, {
    baseCalories,
    sets,
    reps,
    adjustedCalories: Math.round(adjustedCalories),
    change: `${((adjustedCalories / baseCalories - 1) * 100).toFixed(1)}%`
  });
  
  return Math.round(adjustedCalories);
}

/**
 * Main adjustment function that routes to appropriate exercise type
 */
function adjustCaloriesForExerciseParams(
  baseCalories: number,
  exerciseName: string,
  categoryId: string,
  params: ExerciseParameters,
  bodyWeightKg: number,
  durationMinutes: number
): number {
  // No adjustments for yoga/stretching
  if (categoryId === 'yoga') {
    return baseCalories;
  }
  
  // Route to appropriate adjustment function
  if (categoryId === 'strength') {
    return adjustCaloriesForStrength(baseCalories, params, bodyWeightKg, exerciseName);
  }
  
  if (categoryId === 'cardio') {
    return adjustCaloriesForCardio(baseCalories, params, exerciseName, durationMinutes);
  }
  
  if (categoryId === 'hiit') {
    return adjustCaloriesForHIIT(baseCalories, params);
  }
  
  return baseCalories;
}

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
 * 🔥 NEW: Smart calorie calculation with parameter adjustments
 * This is the main function you should use
 */
export async function calculateCaloriesBurned(
  params: CalorieCalculationParams,
  intensity: 'low' | 'medium' | 'high' = 'medium',
  exerciseParams?: ExerciseParameters,
  categoryId?: string
): Promise<{ calories: number; method: 'api' | 'met'; baseCalories?: number }> {
  const { exerciseName, weightKg, durationMinutes, gender } = params;
  
  let baseCalories = 0;
  let method: 'api' | 'met' = 'met';
  
  // Try API Ninjas first
  if (API_NINJAS_KEY) {
    try {
      baseCalories = await calculateCaloriesWithAPI(params);
      method = 'api';
    } catch (error) {
      console.log('⚠️ API Ninjas failed, falling back to MET calculation');
      baseCalories = calculateCaloriesWithMET(
        exerciseName,
        intensity,
        weightKg,
        durationMinutes,
        gender
      );
      method = 'met';
    }
  } else {
    console.log('⚠️ No API key, using MET calculation');
    baseCalories = calculateCaloriesWithMET(
      exerciseName,
      intensity,
      weightKg,
      durationMinutes,
      gender
    );
  }
  
  // 🔥 NEW: Apply exercise-specific parameter adjustments
  let finalCalories = baseCalories;
  
  if (exerciseParams && categoryId) {
    finalCalories = adjustCaloriesForExerciseParams(
      baseCalories,
      exerciseName,
      categoryId,
      exerciseParams,
      weightKg,
      durationMinutes
    );
  }
  
  return { 
    calories: finalCalories, 
    method,
    baseCalories // Include base for comparison
  };
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