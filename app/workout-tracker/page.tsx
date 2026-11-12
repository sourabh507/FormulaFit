'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    WorkoutSession,
    LoggedExercise,
    LoggedSet,
    ExerciseLibraryItem,
} from '@/lib/types';
import {
    saveWorkoutSession,
    getWorkoutSessions,
    deleteWorkoutSession,
} from '@/lib/localStorage';
import exercisesData from '@/data/exercises.json';

export default function WorkoutTrackerPage() {
    const router = useRouter();
    const [view, setView] = useState<'log' | 'history'>('log');
    const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');

    useEffect(() => {
        loadSessions();
        initializeSession();
    }, []);

    const loadSessions = () => {
        const loadedSessions = getWorkoutSessions();
        setSessions(loadedSessions);
    };

    const initializeSession = () => {
        const today = new Date().toISOString().split('T')[0];
        setCurrentSession({
            id: `session_${Date.now()}`,
            date: today,
            timestamp: Date.now(),
            exercises: [],
        });
    };

    const exercises = exercisesData.exercises as ExerciseLibraryItem[];
    const muscleGroups = ['all', ...Array.from(new Set(exercises.map(e => e.muscleGroup)))];

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMuscle = selectedMuscleGroup === 'all' || ex.muscleGroup === selectedMuscleGroup;
        return matchesSearch && matchesMuscle;
    });

    const addExercise = () => {
        if (!selectedExercise || !currentSession) return;

        const exercise = exercises.find(e => e.name === selectedExercise);
        if (!exercise) return;

        const newExercise: LoggedExercise = {
            id: `exercise_${Date.now()}`,
            exerciseName: exercise.name,
            muscleGroup: exercise.muscleGroup,
            sets: [
                { setNumber: 1, reps: 0, weight: 0, completed: false },
                { setNumber: 2, reps: 0, weight: 0, completed: false },
                { setNumber: 3, reps: 0, weight: 0, completed: false },
            ],
        };

        setCurrentSession({
            ...currentSession,
            exercises: [...currentSession.exercises, newExercise],
        });
        setSelectedExercise('');
    };

    const updateSet = (exerciseId: string, setNumber: number, field: 'reps' | 'weight', value: number) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            exercises: currentSession.exercises.map(ex =>
                ex.id === exerciseId
                    ? {
                        ...ex,
                        sets: ex.sets.map(set =>
                            set.setNumber === setNumber
                                ? { ...set, [field]: value }
                                : set
                        ),
                    }
                    : ex
            ),
        });
    };

    const toggleSetCompleted = (exerciseId: string, setNumber: number) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            exercises: currentSession.exercises.map(ex =>
                ex.id === exerciseId
                    ? {
                        ...ex,
                        sets: ex.sets.map(set =>
                            set.setNumber === setNumber
                                ? { ...set, completed: !set.completed }
                                : set
                        ),
                    }
                    : ex
            ),
        });
    };

    const addSet = (exerciseId: string) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            exercises: currentSession.exercises.map(ex =>
                ex.id === exerciseId
                    ? {
                        ...ex,
                        sets: [
                            ...ex.sets,
                            {
                                setNumber: ex.sets.length + 1,
                                reps: 0,
                                weight: 0,
                                completed: false,
                            },
                        ],
                    }
                    : ex
            ),
        });
    };

    const removeExercise = (exerciseId: string) => {
        if (!currentSession) return;

        setCurrentSession({
            ...currentSession,
            exercises: currentSession.exercises.filter(ex => ex.id !== exerciseId),
        });
    };

    const saveSession = () => {
        if (!currentSession || currentSession.exercises.length === 0) {
            alert('Please add at least one exercise before saving.');
            return;
        }

        saveWorkoutSession(currentSession);
        alert('Workout saved successfully!');
        loadSessions();
        initializeSession();
    };

    const deleteSession = (sessionId: string) => {
        if (confirm('Are you sure you want to delete this workout?')) {
            deleteWorkoutSession(sessionId);
            loadSessions();
        }
    };

    const getTotalVolume = (session: WorkoutSession): number => {
        return session.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((exTotal, set) => {
                return exTotal + (set.completed ? set.reps * set.weight : 0);
            }, 0);
        }, 0);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-primary hover:text-on-surface-variant mb-4 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
                        💪 Workout Tracker
                    </h1>
                    <p className="text-on-surface-variant">Log your workouts and track your progress</p>
                </div>

                {/* View Toggle */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setView('log')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${view === 'log'
                                ? 'bg-kinetic-gradient text-on-surface shadow-lg'
                                : 'bg-white/10 text-on-surface-variant hover:bg-white/20'
                            }`}
                    >
                        Log Workout
                    </button>
                    <button
                        onClick={() => setView('history')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${view === 'history'
                                ? 'bg-kinetic-gradient text-on-surface shadow-lg'
                                : 'bg-white/10 text-on-surface-variant hover:bg-white/20'
                            }`}
                    >
                        History
                    </button>
                </div>

                {/* Log Workout View */}
                {view === 'log' && currentSession && (
                    <div className="space-y-6">
                        {/* Exercise Selector */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold text-on-surface mb-4">Add Exercise</h2>

                            {/* Search and Filter */}
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search exercises..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-on-surface placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <select
                                    value={selectedMuscleGroup}
                                    onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {muscleGroups.map(group => (
                                        <option key={group} value={group} className="bg-surface-container-low">
                                            {group === 'all' ? 'All Muscle Groups' : group}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Exercise Dropdown */}
                            <div className="flex gap-4">
                                <select
                                    value={selectedExercise}
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="" className="bg-surface-container-low">Select an exercise</option>
                                    {filteredExercises.map(ex => (
                                        <option key={ex.name} value={ex.name} className="bg-surface-container-low">
                                            {ex.name} ({ex.muscleGroup})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={addExercise}
                                    disabled={!selectedExercise}
                                    className="px-6 py-3 bg-kinetic-gradient text-on-surface rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Current Exercises */}
                        {currentSession.exercises.length > 0 ? (
                            <div className="space-y-4">
                                {currentSession.exercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-on-surface">
                                                    {exercise.exerciseName}
                                                </h3>
                                                <p className="text-primary">{exercise.muscleGroup}</p>
                                            </div>
                                            <button
                                                onClick={() => removeExercise(exercise.id)}
                                                className="text-error hover:text-red-300 font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Sets Table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-primary text-sm">
                                                        <th className="text-left pb-2">Set</th>
                                                        <th className="text-left pb-2">Reps</th>
                                                        <th className="text-left pb-2">Weight (kg)</th>
                                                        <th className="text-left pb-2">Done</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {exercise.sets.map((set) => (
                                                        <tr key={set.setNumber} className="border-t border-white/10">
                                                            <td className="py-2 text-on-surface">{set.setNumber}</td>
                                                            <td className="py-2">
                                                                <input
                                                                    type="number"
                                                                    value={set.reps || ''}
                                                                    onChange={(e) =>
                                                                        updateSet(
                                                                            exercise.id,
                                                                            set.setNumber,
                                                                            'reps',
                                                                            parseInt(e.target.value) || 0
                                                                        )
                                                                    }
                                                                    className="w-20 px-2 py-1 rounded bg-white/5 border border-white/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                />
                                                            </td>
                                                            <td className="py-2">
                                                                <input
                                                                    type="number"
                                                                    step="0.5"
                                                                    value={set.weight || ''}
                                                                    onChange={(e) =>
                                                                        updateSet(
                                                                            exercise.id,
                                                                            set.setNumber,
                                                                            'weight',
                                                                            parseFloat(e.target.value) || 0
                                                                        )
                                                                    }
                                                                    className="w-20 px-2 py-1 rounded bg-white/5 border border-white/20 text-on-surface focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                />
                                                            </td>
                                                            <td className="py-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={set.completed}
                                                                    onChange={() =>
                                                                        toggleSetCompleted(exercise.id, set.setNumber)
                                                                    }
                                                                    className="w-5 h-5 rounded accent-primary"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <button
                                            onClick={() => addSet(exercise.id)}
                                            className="mt-4 text-primary hover:text-on-surface-variant font-semibold"
                                        >
                                            + Add Set
                                        </button>
                                    </div>
                                ))}

                                {/* Save Button */}
                                <button
                                    onClick={saveSession}
                                    className="w-full py-4 bg-kinetic-gradient text-on-primary text-on-surface rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                                >
                                    💾 Save Workout
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                                <p className="text-on-surface-variant text-lg">
                                    No exercises added yet. Select an exercise above to get started!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* History View */}
                {view === 'history' && (
                    <div className="space-y-4">
                        {sessions.length > 0 ? (
                            sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-on-surface">
                                                {new Date(session.timestamp).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </h3>
                                            <p className="text-primary">
                                                {session.exercises.length} exercises • Total Volume:{' '}
                                                {getTotalVolume(session).toFixed(0)} kg
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteSession(session.id)}
                                            className="text-error hover:text-red-300 font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {session.exercises.map((exercise) => (
                                            <div
                                                key={exercise.id}
                                                className="bg-white/5 rounded-xl p-4 border border-white/10"
                                            >
                                                <h4 className="font-semibold text-on-surface mb-2">
                                                    {exercise.exerciseName}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {exercise.sets
                                                        .filter(set => set.completed)
                                                        .map((set) => (
                                                            <span
                                                                key={set.setNumber}
                                                                className="px-3 py-1 bg-primary/30 text-on-surface-variant rounded-lg text-sm"
                                                            >
                                                                {set.reps} × {set.weight}kg
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                                <p className="text-on-surface-variant text-lg">
                                    No workout history yet. Complete your first workout to see it here!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
