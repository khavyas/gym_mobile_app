/**
 * Food Query Normalizer
 * Converts various quantity formats into CalorieNinja-compatible format
 */

export interface NormalizedQuery {
  query: string;
  originalQuantity: number;
  unit: string;
  foodName: string;
}

/**
 * Normalizes food search queries to ensure proper quantity recognition
 * 
 * Examples:
 * - "chicken fry 200g" -> "200g chicken fry"
 * - "200gms chicken fry" -> "200g chicken fry"
 * - "chicken 200 grams" -> "200g chicken"
 * - "2 eggs" -> "2 eggs"
 */
export function normalizeFoodQuery(query: string): NormalizedQuery {
  const trimmedQuery = query.trim().toLowerCase();
  
  // Pattern 1: Extract quantity with units (g, gms, grams, kg, kgs, oz, lb, lbs)
  const gramPattern = /(\d+\.?\d*)\s*(g|gm|gms|gram|grams)\b/i;
  const kgPattern = /(\d+\.?\d*)\s*(kg|kgs|kilogram|kilograms)\b/i;
  const ozPattern = /(\d+\.?\d*)\s*(oz|ounce|ounces)\b/i;
  const lbPattern = /(\d+\.?\d*)\s*(lb|lbs|pound|pounds)\b/i;
  const mlPattern = /(\d+\.?\d*)\s*(ml|milliliter|milliliters)\b/i;
  const lPattern = /(\d+\.?\d*)\s*(l|liter|liters)\b/i;
  
  let quantity = 100; // default
  let unit = 'g';
  let foodName = trimmedQuery;
  let normalizedQuery = trimmedQuery;

  // Check for grams
  if (gramPattern.test(trimmedQuery)) {
    const match = trimmedQuery.match(gramPattern);
    if (match) {
      quantity = parseFloat(match[1]);
      unit = 'g';
      foodName = trimmedQuery.replace(gramPattern, '').trim();
      normalizedQuery = `${quantity}g ${foodName}`;
    }
  }
  // Check for kilograms (convert to grams)
  else if (kgPattern.test(trimmedQuery)) {
    const match = trimmedQuery.match(kgPattern);
    if (match) {
      quantity = parseFloat(match[1]) * 1000; // Convert kg to g
      unit = 'g';
      foodName = trimmedQuery.replace(kgPattern, '').trim();
      normalizedQuery = `${quantity}g ${foodName}`;
    }
  }
  // Check for ounces
  else if (ozPattern.test(trimmedQuery)) {
    const match = trimmedQuery.match(ozPattern);
    if (match) {
      quantity = parseFloat(match[1]);
      unit = 'oz';
      foodName = trimmedQuery.replace(ozPattern, '').trim();
      normalizedQuery = `${quantity}oz ${foodName}`;
    }
  }
  // Check for pounds
  else if (lbPattern.test(trimmedQuery)) {
    const match = trimmedQuery.match(lbPattern);
    if (match) {
      quantity = parseFloat(match[1]);
      unit = 'lb';
      foodName = trimmedQuery.replace(lbPattern, '').trim();
      normalizedQuery = `${quantity}lb ${foodName}`;
    }
  }
  // Check for milliliters
  else if (mlPattern.test(trimmedQuery)) {
    const match = trimmedQuery.match(mlPattern);
    if (match) {
      quantity = parseFloat(match[1]);
      unit = 'ml';
      foodName = trimmedQuery.replace(mlPattern, '').trim();
      normalizedQuery = `${quantity}ml ${foodName}`;
    }
  }
  // Check for liters (convert to ml)
  else if (lPattern.test(trimmedQuery)) {
    const match = trimmedQuery.match(lPattern);
    if (match) {
      quantity = parseFloat(match[1]) * 1000; // Convert L to ml
      unit = 'ml';
      foodName = trimmedQuery.replace(lPattern, '').trim();
      normalizedQuery = `${quantity}ml ${foodName}`;
    }
  }
  // Pattern 2: Extract plain numbers (for items like eggs, apples, etc.)
  else {
    const plainNumberPattern = /^(\d+\.?\d*)\s+(.+)$/;
    const match = trimmedQuery.match(plainNumberPattern);
    if (match) {
      quantity = parseFloat(match[1]);
      foodName = match[2].trim();
      unit = 'item';
      normalizedQuery = `${quantity} ${foodName}`;
    }
  }

  return {
    query: normalizedQuery,
    originalQuantity: quantity,
    unit: unit,
    foodName: foodName,
  };
}

/**
 * Adjusts nutrition values based on the quantity specified
 */
export function adjustNutritionForQuantity(
  nutritionData: any,
  targetQuantity: number,
  targetUnit: string
): any {
  // If the serving size in the response doesn't match our target, adjust it
  const servingSizeG = nutritionData.serving_size_g || 100;
  
  let multiplier = 1;
  
  if (targetUnit === 'g') {
    // Direct gram comparison
    multiplier = targetQuantity / servingSizeG;
  } else if (targetUnit === 'kg') {
    // Convert kg to g
    multiplier = (targetQuantity * 1000) / servingSizeG;
  } else if (targetUnit === 'oz') {
    // 1 oz = 28.35 g
    multiplier = (targetQuantity * 28.35) / servingSizeG;
  } else if (targetUnit === 'lb') {
    // 1 lb = 453.592 g
    multiplier = (targetQuantity * 453.592) / servingSizeG;
  } else if (targetUnit === 'ml') {
    // For liquids, 1ml ≈ 1g (approximation)
    multiplier = targetQuantity / servingSizeG;
  } else if (targetUnit === 'item') {
    // For items, use the number as is
    multiplier = targetQuantity;
  }

  // Only adjust if multiplier is significantly different from 1
  if (Math.abs(multiplier - 1) > 0.01) {
    return {
      ...nutritionData,
      calories: nutritionData.calories * multiplier,
      protein_g: nutritionData.protein_g * multiplier,
      carbohydrates_total_g: nutritionData.carbohydrates_total_g * multiplier,
      fat_total_g: nutritionData.fat_total_g * multiplier,
      serving_size_g: targetUnit === 'g' ? targetQuantity : servingSizeG * multiplier,
      fiber_g: nutritionData.fiber_g * multiplier,
      sugar_g: nutritionData.sugar_g * multiplier,
      sodium_mg: nutritionData.sodium_mg * multiplier,
      cholesterol_mg: (nutritionData.cholesterol_mg || 0) * multiplier,
      saturated_fat_g: (nutritionData.saturated_fat_g || 0) * multiplier,
      potassium_mg: (nutritionData.potassium_mg || 0) * multiplier,
    };
  }

  return nutritionData;
}