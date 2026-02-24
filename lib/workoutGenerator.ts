import {
    WorkoutPreferences,
    WorkoutPlan,
    WorkoutDay,
    Exercise,
    ExperienceLevel,
    TrainingType,
} from './types';

// Exercise database organized by muscle group and training type
const EXERCISE_DATABASE: Record<TrainingType, Record<string, Exercise[]>> = {
    gym: {
        chest: [
            { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '2-3 min', muscleGroup: 'Chest' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90 sec', muscleGroup: 'Chest' },
            { name: 'Cable Flyes', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Chest' },
            { name: 'Dips (Chest)', sets: 3, reps: '8-12', rest: '90 sec', muscleGroup: 'Chest' },
        ],
        back: [
            { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '2-3 min', muscleGroup: 'Back' },
            { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '90 sec', muscleGroup: 'Back' },
            { name: 'Seated Cable Rows', sets: 3, reps: '10-12', rest: '90 sec', muscleGroup: 'Back' },
            { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60 sec', muscleGroup: 'Back' },
        ],
        shoulders: [
            { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '2-3 min', muscleGroup: 'Shoulders' },
            { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Shoulders' },
            { name: 'Rear Delt Flyes', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Shoulders' },
        ],
        biceps: [
            { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '60 sec', muscleGroup: 'Biceps' },
            { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '60 sec', muscleGroup: 'Biceps' },
            { name: 'Incline Dumbbell Curls', sets: 3, reps: '10-12', rest: '60 sec', muscleGroup: 'Biceps' },
        ],
        triceps: [
            { name: 'Close Grip Bench Press', sets: 3, reps: '10-12', rest: '90 sec', muscleGroup: 'Triceps' },
            { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Triceps' },
            { name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '60 sec', muscleGroup: 'Triceps' },
        ],
        legs: [
            { name: 'Barbell Squats', sets: 4, reps: '8-10', rest: '2-3 min', muscleGroup: 'Legs' },
            { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: '2 min', muscleGroup: 'Legs' },
            { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90 sec', muscleGroup: 'Legs' },
            { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Legs' },
            { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '60 sec', muscleGroup: 'Legs' },
        ],
        core: [
            { name: 'Cable Crunches', sets: 3, reps: '15-20', rest: '60 sec', muscleGroup: 'Core' },
            { name: 'Hanging Leg Raises', sets: 3, reps: '10-15', rest: '60 sec', muscleGroup: 'Core' },
            { name: 'Plank', sets: 3, reps: '45-60 sec', rest: '45 sec', muscleGroup: 'Core' },
        ],
    },
    home: {
        chest: [
            { name: 'Push-ups', sets: 4, reps: '12-20', rest: '60 sec', muscleGroup: 'Chest' },
            { name: 'Diamond Push-ups', sets: 3, reps: '10-15', rest: '60 sec', muscleGroup: 'Chest' },
            { name: 'Decline Push-ups', sets: 3, reps: '10-15', rest: '60 sec', muscleGroup: 'Chest' },
            { name: 'Wide Push-ups', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Chest' },
        ],
        back: [
            { name: 'Pull-ups/Chin-ups', sets: 4, reps: '6-12', rest: '90 sec', muscleGroup: 'Back' },
            { name: 'Inverted Rows', sets: 3, reps: '10-15', rest: '60 sec', muscleGroup: 'Back' },
            { name: 'Superman Hold', sets: 3, reps: '30-45 sec', rest: '45 sec', muscleGroup: 'Back' },
            { name: 'Resistance Band Rows', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Back' },
        ],
        shoulders: [
            { name: 'Pike Push-ups', sets: 3, reps: '8-12', rest: '90 sec', muscleGroup: 'Shoulders' },
            { name: 'Lateral Raises (Band/Bottles)', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Shoulders' },
            { name: 'Y-T-W Raises', sets: 3, reps: '10 each', rest: '60 sec', muscleGroup: 'Shoulders' },
        ],
        biceps: [
            { name: 'Chin-ups', sets: 3, reps: '6-10', rest: '90 sec', muscleGroup: 'Biceps' },
            { name: 'Resistance Band Curls', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Biceps' },
            { name: 'Isometric Towel Curls', sets: 3, reps: '20-30 sec', rest: '45 sec', muscleGroup: 'Biceps' },
        ],
        triceps: [
            { name: 'Diamond Push-ups', sets: 3, reps: '10-15', rest: '60 sec', muscleGroup: 'Triceps' },
            { name: 'Bench Dips', sets: 3, reps: '12-15', rest: '60 sec', muscleGroup: 'Triceps' },
            { name: 'Tricep Push-ups', sets: 3, reps: '10-12', rest: '60 sec', muscleGroup: 'Triceps' },
        ],
        legs: [
            { name: 'Bodyweight Squats', sets: 4, reps: '15-20', rest: '60 sec', muscleGroup: 'Legs' },
            { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 each', rest: '90 sec', muscleGroup: 'Legs' },
            { name: 'Glute Bridges', sets: 3, reps: '15-20', rest: '60 sec', muscleGroup: 'Legs' },
            { name: 'Lunges', sets: 3, reps: '10-12 each', rest: '60 sec', muscleGroup: 'Legs' },
            { name: 'Calf Raises', sets: 4, reps: '20-25', rest: '45 sec', muscleGroup: 'Legs' },
        ],
        core: [
            { name: 'Crunches', sets: 3, reps: '20-25', rest: '45 sec', muscleGroup: 'Core' },
            { name: 'Leg Raises', sets: 3, reps: '12-15', rest: '45 sec', muscleGroup: 'Core' },
            { name: 'Plank', sets: 3, reps: '45-60 sec', rest: '45 sec', muscleGroup: 'Core' },
            { name: 'Mountain Climbers', sets: 3, reps: '20-30', rest: '45 sec', muscleGroup: 'Core' },
        ],
    },
};

// Workout split templates
interface SplitTemplate {
    name: string;
    daysPerWeek: number[];
    schedule: { name: string; focus: string; muscleGroups: string[] }[];
}

const SPLIT_TEMPLATES: SplitTemplate[] = [
    {
        name: 'Full Body',
        daysPerWeek: [3],
        schedule: [
            { name: 'Full Body A', focus: 'Push Emphasis', muscleGroups: ['chest', 'back', 'shoulders', 'legs', 'core'] },
            { name: 'Full Body B', focus: 'Pull Emphasis', muscleGroups: ['back', 'chest', 'biceps', 'legs', 'core'] },
            { name: 'Full Body C', focus: 'Legs Emphasis', muscleGroups: ['legs', 'chest', 'back', 'triceps', 'core'] },
        ],
    },
    {
        name: 'Upper/Lower',
        daysPerWeek: [4],
        schedule: [
            { name: 'Upper A', focus: 'Push Emphasis', muscleGroups: ['chest', 'shoulders', 'triceps', 'back'] },
            { name: 'Lower A', focus: 'Quad Emphasis', muscleGroups: ['legs', 'core'] },
            { name: 'Upper B', focus: 'Pull Emphasis', muscleGroups: ['back', 'biceps', 'shoulders', 'chest'] },
            { name: 'Lower B', focus: 'Hamstring Emphasis', muscleGroups: ['legs', 'core'] },
        ],
    },
    {
        name: 'Push/Pull/Legs',
        daysPerWeek: [5, 6],
        schedule: [
            { name: 'Push', focus: 'Chest, Shoulders, Triceps', muscleGroups: ['chest', 'shoulders', 'triceps'] },
            { name: 'Pull', focus: 'Back, Biceps', muscleGroups: ['back', 'biceps'] },
            { name: 'Legs', focus: 'Quads, Hamstrings, Calves', muscleGroups: ['legs', 'core'] },
            { name: 'Push', focus: 'Chest, Shoulders, Triceps', muscleGroups: ['chest', 'shoulders', 'triceps'] },
            { name: 'Pull', focus: 'Back, Biceps', muscleGroups: ['back', 'biceps'] },
            { name: 'Legs', focus: 'Quads, Hamstrings, Calves', muscleGroups: ['legs', 'core'] },
        ],
    },
];

// Volume adjustments by experience level
const VOLUME_ADJUSTMENTS: Record<ExperienceLevel, { sets: number; exercises: number }> = {
    beginner: { sets: -1, exercises: -1 },
    intermediate: { sets: 0, exercises: 0 },
    advanced: { sets: 1, exercises: 1 },
};

function getRandomExercises(
    exercises: Exercise[],
    count: number,
    experienceLevel: ExperienceLevel
): Exercise[] {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    const adjustment = VOLUME_ADJUSTMENTS[experienceLevel];

    return shuffled.slice(0, Math.max(1, count + adjustment.exercises)).map(exercise => ({
        ...exercise,
        sets: Math.max(2, exercise.sets + adjustment.sets),
    }));
}

function selectSplit(daysPerWeek: number): SplitTemplate {
    // Find the best matching split
    const matchingSplit = SPLIT_TEMPLATES.find(split =>
        split.daysPerWeek.includes(daysPerWeek)
    );

    if (matchingSplit) return matchingSplit;

    // Default to appropriate split based on days
    if (daysPerWeek <= 3) return SPLIT_TEMPLATES[0]; // Full Body
    if (daysPerWeek === 4) return SPLIT_TEMPLATES[1]; // Upper/Lower
    return SPLIT_TEMPLATES[2]; // PPL
}

export function generateWorkoutPlan(preferences: WorkoutPreferences): WorkoutPlan {
    const { daysPerWeek, experience, type } = preferences;
    const split = selectSplit(daysPerWeek);
    const exercises = EXERCISE_DATABASE[type];

    const schedule: WorkoutDay[] = split.schedule
        .slice(0, daysPerWeek)
        .map((day, index) => {
            const dayExercises: Exercise[] = [];

            day.muscleGroups.forEach(muscleGroup => {
                const muscleExercises = exercises[muscleGroup] || [];
                const exerciseCount = muscleGroup === 'legs' ? 3 : 2;
                const selected = getRandomExercises(muscleExercises, exerciseCount, experience);
                dayExercises.push(...selected);
            });

            return {
                day: index + 1,
                name: day.name,
                focus: day.focus,
                exercises: dayExercises,
            };
        });

    return {
        daysPerWeek,
        experience,
        type,
        splitType: split.name,
        schedule,
    };
}

export function getSplitRecommendation(daysPerWeek: number): string {
    if (daysPerWeek <= 3) {
        return 'Full Body split - Hit each muscle group 3x per week for maximum efficiency';
    }
    if (daysPerWeek === 4) {
        return 'Upper/Lower split - 2 upper and 2 lower days for balanced development';
    }
    return 'Push/Pull/Legs split - Dedicated days for each movement pattern';
}
