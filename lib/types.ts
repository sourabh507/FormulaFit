// User Profile Types
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';
export type FitnessGoal = 'fat_loss' | 'weight_gain' | 'maintenance' | 'recomposition';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type TrainingType = 'gym' | 'home';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface UserProfile {
    gender: Gender;
    age: number;
    height: number; // cm
    weight: number; // kg
    activityLevel: ActivityLevel;
    goal: FitnessGoal;
}

export interface CalorieResults {
    bmr: number;
    tdee: number;
    targetCalories: number;
}

export interface MacroResults {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    fiber: number; // grams
}

// Workout Types
export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    muscleGroup: string;
}

export interface WorkoutDay {
    day: number;
    name: string;
    focus: string;
    exercises: Exercise[];
}

export interface WorkoutPlan {
    daysPerWeek: number;
    experience: ExperienceLevel;
    type: TrainingType;
    splitType: string;
    schedule: WorkoutDay[];
}

export interface WorkoutPreferences {
    daysPerWeek: number;
    experience: ExperienceLevel;
    type: TrainingType;
}

// Food Types
export interface FoodItem {
    name: string;
    category: 'vegetarian' | 'non-vegetarian' | 'vegan';
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    fiberPer100g: number;
    caloriesPer100g: number;
    servingNote: string;
}

// Tracker Types
export interface Meal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    timestamp: number;
}

export interface DailyLog {
    date: string; // YYYY-MM-DD
    meals: Meal[];
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
    };
}

// Workout Tracker Types
export interface LoggedSet {
    setNumber: number;
    reps: number;
    weight: number; // kg
    completed: boolean;
}

export interface LoggedExercise {
    id: string;
    exerciseName: string;
    muscleGroup: string;
    sets: LoggedSet[];
    notes?: string;
}

export interface WorkoutSession {
    id: string;
    date: string; // YYYY-MM-DD
    timestamp: number;
    exercises: LoggedExercise[];
    duration?: number; // minutes
    notes?: string;
}

export interface ExerciseLibraryItem {
    name: string;
    muscleGroup: string;
    equipment: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    instructions?: string;
}

// Activity Level Labels
export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
    sedentary: 'Sedentary (little to no exercise)',
    light: 'Lightly Active (1-3 days/week)',
    moderate: 'Moderately Active (3-5 days/week)',
    very_active: 'Very Active (6-7 days/week)',
};

// Goal Labels
export const GOAL_LABELS: Record<FitnessGoal, string> = {
    fat_loss: 'Fat Loss',
    weight_gain: 'Weight/Muscle Gain',
    maintenance: 'Maintain Weight',
    recomposition: 'Body Recomposition',
};

// Experience Labels
export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
    beginner: 'Beginner (0-1 year)',
    intermediate: 'Intermediate (1-3 years)',
    advanced: 'Advanced (3+ years)',
};
