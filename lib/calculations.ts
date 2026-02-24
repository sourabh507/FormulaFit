import {
    UserProfile,
    CalorieResults,
    MacroResults,
    ActivityLevel,
    FitnessGoal,
} from './types';

// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
};

// Goal calorie adjustments (added/subtracted from TDEE)
const GOAL_ADJUSTMENTS: Record<FitnessGoal, number> = {
    fat_loss: -400,
    weight_gain: 400,
    maintenance: 0,
    recomposition: -200,
};

// Protein multipliers based on goal (grams per kg bodyweight)
const PROTEIN_MULTIPLIERS: Record<FitnessGoal, number> = {
    fat_loss: 2.0,
    weight_gain: 1.8,
    maintenance: 1.6,
    recomposition: 2.0,
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Formula
 * Male: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
 * Female: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 */
export function calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female'
): number {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(gender === 'male' ? base + 5 : base - 161);
}

/**
 * Calculate Total Daily Energy Expenditure
 * TDEE = BMR × Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Calculate target calories based on fitness goal
 */
export function calculateTargetCalories(tdee: number, goal: FitnessGoal): number {
    return Math.round(tdee + GOAL_ADJUSTMENTS[goal]);
}

/**
 * Calculate all calorie values from user profile
 */
export function calculateCalories(profile: UserProfile): CalorieResults {
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const tdee = calculateTDEE(bmr, profile.activityLevel);
    const targetCalories = calculateTargetCalories(tdee, profile.goal);

    return { bmr, tdee, targetCalories };
}

/**
 * Calculate macronutrients based on target calories and goal
 * - Protein: Based on goal (1.6 - 2.0g per kg bodyweight)
 * - Fat: 25% of total calories (9 cal per gram)
 * - Carbs: Remaining calories (4 cal per gram)
 */
export function calculateMacros(
    targetCalories: number,
    weight: number,
    goal: FitnessGoal
): MacroResults {
    // Protein: grams based on bodyweight and goal
    const protein = Math.round(weight * PROTEIN_MULTIPLIERS[goal]);
    const proteinCalories = protein * 4;

    // Fat: 25% of total calories, converted to grams
    const fatCalories = targetCalories * 0.25;
    const fat = Math.round(fatCalories / 9);

    // Carbs: Remaining calories after protein and fat
    const remainingCalories = targetCalories - proteinCalories - fatCalories;
    const carbs = Math.round(Math.max(0, remainingCalories / 4));

    // Fiber: Standard recommendation
    const fiber = 30;

    return { protein, carbs, fat, fiber };
}

/**
 * Calculate all results from user profile
 */
export function calculateAllResults(profile: UserProfile): {
    calories: CalorieResults;
    macros: MacroResults;
} {
    const calories = calculateCalories(profile);
    const macros = calculateMacros(calories.targetCalories, profile.weight, profile.goal);

    return { calories, macros };
}

/**
 * Get goal description text
 */
export function getGoalDescription(goal: FitnessGoal): string {
    const descriptions: Record<FitnessGoal, string> = {
        fat_loss: 'Caloric deficit of 400 kcal for sustainable fat loss',
        weight_gain: 'Caloric surplus of 400 kcal for muscle building',
        maintenance: 'Eating at maintenance to maintain current weight',
        recomposition: 'Slight deficit of 200 kcal to lose fat while building muscle',
    };
    return descriptions[goal];
}

/**
 * Calculate BMI (for reference, not primary focus)
 */
export function calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}
