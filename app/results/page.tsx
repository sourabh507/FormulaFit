'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { UserProfile, CalorieResults, MacroResults, GOAL_LABELS } from '@/lib/types';
import { getUserProfile, getCalorieResults, getMacroResults } from '@/lib/localStorage';
import { calculateBMI, getBMICategory, getGoalDescription } from '@/lib/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MACRO_COLORS = {
    protein: '#10b981',
    carbs: '#06b6d4',
    fat: '#f59e0b',
};

export default function ResultsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [calories, setCalories] = useState<CalorieResults | null>(null);
    const [macros, setMacros] = useState<MacroResults | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const userProfile = getUserProfile();
        const calorieResults = getCalorieResults();
        const macroResults = getMacroResults();

        if (!userProfile || !calorieResults || !macroResults) {
            router.push('/calculator');
            return;
        }

        setProfile(userProfile);
        setCalories(calorieResults);
        setMacros(macroResults);
        setIsLoaded(true);
    }, [router]);

    if (!isLoaded || !profile || !calories || !macros) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-on-surface-variant">Loading your results...</p>
                </div>
            </div>
        );
    }

    const bmi = calculateBMI(profile.weight, profile.height);
    const bmiCategory = getBMICategory(bmi);

    const macroChartData = [
        { name: 'Protein', value: macros.protein * 4, grams: macros.protein },
        { name: 'Carbs', value: macros.carbs * 4, grams: macros.carbs },
        { name: 'Fat', value: macros.fat * 9, grams: macros.fat },
    ];

    const totalMacroCalories = macroChartData.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="min-h-screen bg-background py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
                        Your{' '}
                        <span className="bg-kinetic-gradient bg-clip-text text-transparent">Personalized Results</span>
                    </h1>
                    <p className="text-on-surface-variant max-w-lg mx-auto">
                        Based on your profile, here are your recommended daily calorie and macronutrient targets.
                    </p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 animate-fade-in">
                    {/* BMR */}
                    <Card variant="glass" hover>
                        <CardContent className="text-center py-6">
                            <div className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
                                {calories.bmr.toLocaleString()}
                            </div>
                            <div className="text-sm text-on-surface-variant uppercase tracking-wide">
                                BMR (kcal/day)
                            </div>
                            <p className="text-xs text-outline-variant mt-2">
                                Calories burned at complete rest
                            </p>
                        </CardContent>
                    </Card>

                    {/* TDEE */}
                    <Card variant="glass" hover>
                        <CardContent className="text-center py-6">
                            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                                {calories.tdee.toLocaleString()}
                            </div>
                            <div className="text-sm text-on-surface-variant uppercase tracking-wide">
                                Maintenance (kcal/day)
                            </div>
                            <p className="text-xs text-outline-variant mt-2">
                                Total daily energy expenditure
                            </p>
                        </CardContent>
                    </Card>

                    {/* Target */}
                    <Card variant="gradient" hover className="border-primary/30">
                        <CardContent className="text-center py-6">
                            <div className="text-4xl md:text-5xl font-bold bg-kinetic-gradient bg-clip-text text-transparent mb-2">
                                {calories.targetCalories.toLocaleString()}
                            </div>
                            <div className="text-sm text-on-surface-variant uppercase tracking-wide">
                                Target (kcal/day)
                            </div>
                            <p className="text-xs text-outline-variant mt-2">
                                {GOAL_LABELS[profile.goal]}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Macros and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Macro Chart */}
                    <Card variant="gradient" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <CardHeader>
                            <CardTitle>Daily Macronutrients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Chart */}
                                <div className="w-48 h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={macroChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                <Cell fill={MACRO_COLORS.protein} />
                                                <Cell fill={MACRO_COLORS.carbs} />
                                                <Cell fill={MACRO_COLORS.fat} />
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/30">
                                                                <p className="text-on-surface font-medium">{data.name}</p>
                                                                <p className="text-on-surface-variant text-sm">{data.grams}g • {data.value} kcal</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="flex-1 space-y-4">
                                    {/* Protein */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full bg-primary" />
                                            <span className="text-on-surface-variant">Protein</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-on-surface font-bold">{macros.protein}g</span>
                                            <span className="text-outline-variant text-sm ml-2">
                                                ({Math.round((macros.protein * 4 / totalMacroCalories) * 100)}%)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Carbs */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full bg-secondary" />
                                            <span className="text-on-surface-variant">Carbohydrates</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-on-surface font-bold">{macros.carbs}g</span>
                                            <span className="text-outline-variant text-sm ml-2">
                                                ({Math.round((macros.carbs * 4 / totalMacroCalories) * 100)}%)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Fat */}
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full bg-tertiary" />
                                            <span className="text-on-surface-variant">Fat</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-on-surface font-bold">{macros.fat}g</span>
                                            <span className="text-outline-variant text-sm ml-2">
                                                ({Math.round((macros.fat * 9 / totalMacroCalories) * 100)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Summary */}
                    <Card variant="gradient" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <CardHeader>
                            <CardTitle>Your Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-surface-container-low/50">
                                    <p className="text-sm text-outline-variant">Age</p>
                                    <p className="text-lg font-semibold text-on-surface">{profile.age} years</p>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-container-low/50">
                                    <p className="text-sm text-outline-variant">Gender</p>
                                    <p className="text-lg font-semibold text-on-surface capitalize">{profile.gender}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-container-low/50">
                                    <p className="text-sm text-outline-variant">Height</p>
                                    <p className="text-lg font-semibold text-on-surface">{profile.height} cm</p>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-container-low/50">
                                    <p className="text-sm text-outline-variant">Weight</p>
                                    <p className="text-lg font-semibold text-on-surface">{profile.weight} kg</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-on-surface-variant">BMI</span>
                                    <span className="text-on-surface font-bold">{bmi}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-on-surface-variant">Category</span>
                                    <span className={`font-medium ${bmiCategory === 'Normal' ? 'text-primary' :
                                        bmiCategory === 'Underweight' ? 'text-tertiary' :
                                            'text-error'
                                        }`}>{bmiCategory}</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <p className="text-sm text-primary font-medium mb-1">Daily Targets</p>
                                <p className="text-xs text-on-surface-variant mb-2">{getGoalDescription(profile.goal)}</p>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/20">
                                    <span className="text-xs text-on-surface-variant">Target Fiber</span>
                                    <span className="text-sm font-bold text-on-surface">{macros.fiber}g / day</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <Link href="/workout">
                        <Button size="lg">
                            Generate Workout Plan
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Button>
                    </Link>
                    <Link href="/tracker">
                        <Button variant="outline" size="lg">
                            Start Tracking
                        </Button>
                    </Link>
                    <Link href="/calculator">
                        <Button variant="ghost" size="lg">
                            Edit Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
