'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Select } from '@/components/ui';
import {
    WorkoutPlan,
    WorkoutPreferences,
    ExperienceLevel,
    TrainingType,
    EXPERIENCE_LABELS,
} from '@/lib/types';
import { generateWorkoutPlan, getSplitRecommendation } from '@/lib/workoutGenerator';
import { getWorkoutPlan, saveWorkoutPlan } from '@/lib/localStorage';

const daysOptions = [
    { value: '3', label: '3 days per week' },
    { value: '4', label: '4 days per week' },
    { value: '5', label: '5 days per week' },
    { value: '6', label: '6 days per week' },
];

const experienceOptions = Object.entries(EXPERIENCE_LABELS).map(([value, label]) => ({
    value,
    label,
}));

const typeOptions = [
    { value: 'gym', label: '🏋️ Gym (with equipment)' },
    { value: 'home', label: '🏠 Home (minimal equipment)' },
];

export default function WorkoutPage() {
    const [preferences, setPreferences] = useState<WorkoutPreferences>({
        daysPerWeek: 4,
        experience: 'intermediate',
        type: 'gym',
    });
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeDay, setActiveDay] = useState(0);

    // Load existing plan on mount
    useEffect(() => {
        const existing = getWorkoutPlan();
        if (existing) {
            setWorkoutPlan(existing);
            setPreferences({
                daysPerWeek: existing.daysPerWeek,
                experience: existing.experience,
                type: existing.type,
            });
        }
    }, []);

    const handlePreferenceChange = (field: keyof WorkoutPreferences, value: string | number) => {
        setPreferences(prev => ({
            ...prev,
            [field]: field === 'daysPerWeek' ? parseInt(value as string) : value,
        }));
    };

    const handleGenerate = () => {
        setIsGenerating(true);

        // Simulate generation delay for UX
        setTimeout(() => {
            const plan = generateWorkoutPlan(preferences);
            setWorkoutPlan(plan);
            saveWorkoutPlan(plan);
            setActiveDay(0);
            setIsGenerating(false);
        }, 800);
    };

    const handleRegenerate = () => {
        setWorkoutPlan(null);
        setTimeout(() => handleGenerate(), 100);
    };

    return (
        <div className="min-h-screen bg-background py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
                        Your{' '}
                        <span className="bg-kinetic-gradient bg-clip-text text-transparent">Workout Plan</span>
                    </h1>
                    <p className="text-on-surface-variant max-w-lg mx-auto">
                        Get a personalized workout routine based on your experience level, available equipment, and schedule.
                    </p>
                </div>

                {/* Preferences Form */}
                <Card variant="gradient" className="mb-8 animate-fade-in">
                    <CardHeader>
                        <CardTitle>Workout Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Select
                                label="Training Days per Week"
                                options={daysOptions}
                                value={preferences.daysPerWeek.toString()}
                                onChange={(value) => handlePreferenceChange('daysPerWeek', value)}
                            />
                            <Select
                                label="Experience Level"
                                options={experienceOptions}
                                value={preferences.experience}
                                onChange={(value) => handlePreferenceChange('experience', value as ExperienceLevel)}
                            />
                            <Select
                                label="Training Type"
                                options={typeOptions}
                                value={preferences.type}
                                onChange={(value) => handlePreferenceChange('type', value as TrainingType)}
                            />
                        </div>

                        {/* Split Recommendation */}
                        <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-primary font-medium">Recommended Split</p>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        {getSplitRecommendation(preferences.daysPerWeek)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <Button onClick={handleGenerate} isLoading={isGenerating} className="flex-1 sm:flex-none">
                                {workoutPlan ? 'Regenerate Plan' : 'Generate Workout Plan'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Workout Plan Display */}
                {workoutPlan && (
                    <div className="animate-fade-in">
                        {/* Plan Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-on-surface">{workoutPlan.splitType} Split</h2>
                                <p className="text-on-surface-variant text-sm">
                                    {workoutPlan.daysPerWeek} days • {EXPERIENCE_LABELS[workoutPlan.experience]} •
                                    {workoutPlan.type === 'gym' ? ' Gym' : ' Home'}
                                </p>
                            </div>
                        </div>

                        {/* Day Tabs */}
                        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                            {workoutPlan.schedule.map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveDay(index)}
                                    className={`
                    px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200
                    ${activeDay === index
                                            ? 'bg-primary/20 border-2 border-primary text-primary'
                                            : 'bg-surface-container-low/50 border-2 border-outline-variant/30/50 text-on-surface-variant hover:border-outline-variant/50'
                                        }
                  `}
                                >
                                    Day {day.day}: {day.name}
                                </button>
                            ))}
                        </div>

                        {/* Active Day Workout */}
                        <Card variant="gradient">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{workoutPlan.schedule[activeDay].name}</CardTitle>
                                        <p className="text-on-surface-variant text-sm mt-1">
                                            Focus: {workoutPlan.schedule[activeDay].focus}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm text-on-surface-variant">
                                        {workoutPlan.schedule[activeDay].exercises.length} exercises
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {workoutPlan.schedule[activeDay].exercises.map((exercise, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30/50 hover:border-outline-variant/50 transition-colors"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <h4 className="text-on-surface font-medium">{exercise.name}</h4>
                                                    <p className="text-sm text-outline-variant">{exercise.muscleGroup}</p>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-outline-variant">Sets:</span>
                                                        <span className="text-on-surface font-medium">{exercise.sets}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-outline-variant">Reps:</span>
                                                        <span className="text-on-surface font-medium">{exercise.reps}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-outline-variant">Rest:</span>
                                                        <span className="text-primary font-medium">{exercise.rest}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Workout Tips */}
                                <div className="mt-6 p-4 rounded-xl bg-tertiary/10 border border-tertiary/20">
                                    <p className="text-sm text-tertiary">
                                        💡 <strong>Tip:</strong> Warm up for 5-10 minutes before starting. Focus on proper form over heavy weights,
                                        especially for compound movements.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* All Days Overview */}
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-on-surface mb-4">Weekly Overview</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {workoutPlan.schedule.map((day, index) => (
                                    <Card
                                        key={index}
                                        variant="glass"
                                        hover
                                        className="cursor-pointer"
                                        onClick={() => setActiveDay(index)}
                                    >
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-primary font-medium">Day {day.day}</span>
                                                <span className="text-xs text-outline-variant">{day.exercises.length} exercises</span>
                                            </div>
                                            <h4 className="text-on-surface font-bold">{day.name}</h4>
                                            <p className="text-sm text-on-surface-variant">{day.focus}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
