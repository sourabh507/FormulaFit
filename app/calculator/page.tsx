'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, Input, Select } from '@/components/ui';
import {
    UserProfile,
    Gender,
    ActivityLevel,
    FitnessGoal,
    ACTIVITY_LABELS,
    GOAL_LABELS,
} from '@/lib/types';
import { saveUserProfile, getUserProfile, saveCalorieResults, saveMacroResults } from '@/lib/localStorage';
import { calculateAllResults } from '@/lib/calculations';

const activityOptions = Object.entries(ACTIVITY_LABELS).map(([value, label]) => ({
    value,
    label,
}));

const goalOptions = Object.entries(GOAL_LABELS).map(([value, label]) => ({
    value,
    label,
}));

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

export default function CalculatorPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<UserProfile>({
        gender: 'male',
        age: 25,
        height: 170,
        weight: 70,
        activityLevel: 'moderate',
        goal: 'maintenance',
    });

    // Load existing profile on mount
    useEffect(() => {
        const existing = getUserProfile();
        if (existing) {
            setFormData(existing);
        }
    }, []);

    const handleInputChange = (field: keyof UserProfile, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when field is updated
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.age < 15 || formData.age > 100) {
            newErrors.age = 'Age must be between 15 and 100';
        }
        if (formData.height < 100 || formData.height > 250) {
            newErrors.height = 'Height must be between 100 and 250 cm';
        }
        if (formData.weight < 30 || formData.weight > 300) {
            newErrors.weight = 'Weight must be between 30 and 300 kg';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Calculate results
        const { calories, macros } = calculateAllResults(formData);

        // Save to localStorage
        saveUserProfile(formData);
        saveCalorieResults(calories);
        saveMacroResults(macros);

        // Navigate to results
        setTimeout(() => {
            router.push('/results');
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-950 py-8 md:py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Calculate Your{' '}
                        <span className="text-gradient">Calories & Macros</span>
                    </h1>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Enter your details below and we&apos;ll calculate your daily calorie needs
                        and macronutrient targets based on your goals.
                    </p>
                </div>

                {/* Form Card */}
                <Card variant="gradient" className="animate-fade-in">
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Gender
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {genderOptions.map(option => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleInputChange('gender', option.value as Gender)}
                                            className={`
                        px-4 py-3 rounded-xl font-medium transition-all duration-200
                        ${formData.gender === option.value
                                                    ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                                                    : 'bg-slate-800/50 border-2 border-slate-700/50 text-slate-300 hover:border-slate-600'
                                                }
                      `}
                                        >
                                            {option.value === 'male' ? '👨 ' : '👩 '}
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Age */}
                            <Input
                                label="Age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                                placeholder="Enter your age"
                                error={errors.age}
                                min={15}
                                max={100}
                            />

                            {/* Height & Weight - side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Height (cm)"
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                                    placeholder="e.g., 170"
                                    error={errors.height}
                                    min={100}
                                    max={250}
                                />
                                <Input
                                    label="Weight (kg)"
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                                    placeholder="e.g., 70"
                                    error={errors.weight}
                                    min={30}
                                    max={300}
                                />
                            </div>

                            {/* Activity Level */}
                            <Select
                                label="Activity Level"
                                options={activityOptions}
                                value={formData.activityLevel}
                                onChange={(value) => handleInputChange('activityLevel', value as ActivityLevel)}
                            />

                            {/* Fitness Goal */}
                            <Select
                                label="Fitness Goal"
                                options={goalOptions}
                                value={formData.goal}
                                onChange={(value) => handleInputChange('goal', value as FitnessGoal)}
                            />

                            {/* Goal Info */}
                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-300 font-medium">About your goal</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {formData.goal === 'fat_loss' && 'We\'ll create a 400 calorie deficit for sustainable fat loss of ~0.5kg per week.'}
                                            {formData.goal === 'weight_gain' && 'We\'ll add 400 extra calories to support muscle growth with minimal fat gain.'}
                                            {formData.goal === 'maintenance' && 'We\'ll calculate your exact maintenance calories to maintain your current weight.'}
                                            {formData.goal === 'recomposition' && 'A slight 200 calorie deficit to lose fat while building muscle over time.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Calculate My Results
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Formula info */}
                <p className="mt-6 text-center text-sm text-slate-500">
                    Calculations based on the Mifflin-St Jeor equation, widely regarded as the most accurate formula for BMR estimation.
                </p>
            </div>
        </div>
    );
}
