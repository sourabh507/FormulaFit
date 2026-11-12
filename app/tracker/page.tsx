'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, ProgressBar, Modal } from '@/components/ui';
import { Meal, DailyLog, CalorieResults, MacroResults, FoodItem } from '@/lib/types';
import { getTodayLog, saveTodayLog, resetTodayLog, getCalorieResults, getMacroResults, getDailyLogs } from '@/lib/localStorage';
import foodsData from '@/data/foods.json';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sparkles, Loader2, Plus, Search, Trash2, RefreshCw } from 'lucide-react';

const MACRO_COLORS = {
    protein: '#10b981', // emerald-500
    carbs: '#06b6d4',   // cyan-500
    fat: '#f59e0b',     // amber-500
};

export default function TrackerPage() {
    const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
    const [calorieResults, setCalorieResults] = useState<CalorieResults | null>(null);
    const [macroResults, setMacroResults] = useState<MacroResults | null>(null);
    const [isAddingMeal, setIsAddingMeal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);

    // Food selection state
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [weight, setWeight] = useState('');
    const [showFoodDropdown, setShowFoodDropdown] = useState(false);

    // AI Smart Add state
    const [smartInput, setSmartInput] = useState('');
    const [isSmartAdding, setIsSmartAdding] = useState(false);
    const [smartAddError, setSmartAddError] = useState('');

    const foods = foodsData.foods as FoodItem[];
    const today = new Date().toISOString().split('T')[0];

    // Filter foods based on search
    const filteredFoods = useMemo(() => {
        if (!searchQuery.trim()) return foods;
        return foods.filter(food =>
            food.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, foods]);

    // Calculate nutrition based on selected food and weight
    const calculatedNutrition = useMemo(() => {
        if (!selectedFood || !weight) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        const weightNum = parseFloat(weight) || 0;
        const ratio = weightNum / 100;
        return {
            calories: Math.round(selectedFood.caloriesPer100g * ratio),
            protein: Math.round(selectedFood.proteinPer100g * ratio * 10) / 10,
            carbs: Math.round(selectedFood.carbsPer100g * ratio * 10) / 10,
            fat: Math.round(selectedFood.fatPer100g * ratio * 10) / 10,
            fiber: Math.round(selectedFood.fiberPer100g * ratio * 10) / 10,
        };
    }, [selectedFood, weight]);

    useEffect(() => {
        const log = getTodayLog();
        const calories = getCalorieResults();
        const macros = getMacroResults();
        const logs = getDailyLogs();

        setCalorieResults(calories);
        setMacroResults(macros);
        setRecentLogs(logs.filter(l => l.date !== today).slice(0, 7));

        if (log) {
            setTodayLog(log);
        } else {
            const newLog: DailyLog = {
                date: today,
                meals: [],
                totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
            };
            setTodayLog(newLog);
        }
    }, [today]);

    const handleSelectFood = (food: FoodItem) => {
        setSelectedFood(food);
        setSearchQuery(food.name);
        setShowFoodDropdown(false);
    };

    const handleAddMeal = (food: FoodItem, mealWeight: number) => {
        if (!todayLog) return;

        const ratio = mealWeight / 100;
        const newMeal: Meal = {
            id: Math.random().toString(36).substr(2, 9),
            name: `${food.name} (${mealWeight}g)`,
            calories: Math.round(food.caloriesPer100g * ratio),
            protein: Math.round(food.proteinPer100g * ratio * 10) / 10,
            carbs: Math.round(food.carbsPer100g * ratio * 10) / 10,
            fat: Math.round(food.fatPer100g * ratio * 10) / 10,
            fiber: Math.round(food.fiberPer100g * ratio * 10) / 10,
            timestamp: Date.now(),
        };

        return newMeal;
    };

    const handleAddSingleMeal = () => {
        if (!selectedFood || !weight || !todayLog) return;

        const newMeal = handleAddMeal(selectedFood, parseFloat(weight));
        if (!newMeal) return;

        const updatedLog: DailyLog = {
            ...todayLog,
            meals: [...todayLog.meals, newMeal],
            totals: {
                calories: (todayLog.totals.calories || 0) + newMeal.calories,
                protein: (todayLog.totals.protein || 0) + newMeal.protein,
                carbs: (todayLog.totals.carbs || 0) + newMeal.carbs,
                fat: (todayLog.totals.fat || 0) + newMeal.fat,
                fiber: (todayLog.totals.fiber || 0) + newMeal.fiber,
            },
        };

        setTodayLog(updatedLog);
        saveTodayLog(updatedLog);

        setSelectedFood(null);
        setSearchQuery('');
        setWeight('');
        setIsAddingMeal(false);
    };

    const handleSmartAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!smartInput.trim() || isSmartAdding || !todayLog) return;

        setIsSmartAdding(true);
        setSmartAddError('');

        try {
            const response = await fetch('/api/parse-food', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: smartInput }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to parse food');

            const parsedItems = data.items as { foodName: string; weight: number }[];
            const newMeals: Meal[] = [];
            let addedCount = 0;

            parsedItems.forEach(item => {
                const foundFood = foods.find(f => f.name.toLowerCase() === item.foodName.toLowerCase());
                if (foundFood) {
                    const meal = handleAddMeal(foundFood, item.weight);
                    if (meal) {
                        newMeals.push(meal);
                        addedCount++;
                    }
                }
            });

            if (newMeals.length > 0) {
                const updatedLog: DailyLog = {
                    ...todayLog,
                    meals: [...todayLog.meals, ...newMeals],
                    totals: {
                        calories: (todayLog.totals.calories || 0) + newMeals.reduce((sum, m) => sum + m.calories, 0),
                        protein: (todayLog.totals.protein || 0) + newMeals.reduce((sum, m) => sum + m.protein, 0),
                        carbs: (todayLog.totals.carbs || 0) + newMeals.reduce((sum, m) => sum + m.carbs, 0),
                        fat: (todayLog.totals.fat || 0) + newMeals.reduce((sum, m) => sum + m.fat, 0),
                        fiber: (todayLog.totals.fiber || 0) + newMeals.reduce((sum, m) => sum + m.fiber, 0),
                    },
                };
                setTodayLog(updatedLog);
                saveTodayLog(updatedLog);
                setSmartInput('');
            } else {
                setSmartAddError("Sorry, I couldn't match those foods to our Indian database. Try adding them manually!");
            }
        } catch (error: any) {
            setSmartAddError(error.message || 'Something went wrong with AI parsing.');
        } finally {
            setIsSmartAdding(false);
        }
    };

    const handleRemoveMeal = (mealId: string) => {
        if (!todayLog) return;

        const mealToRemove = todayLog.meals.find(m => m.id === mealId);
        if (!mealToRemove) return;

        const updatedLog: DailyLog = {
            ...todayLog,
            meals: todayLog.meals.filter(m => m.id !== mealId),
            totals: {
                calories: (todayLog.totals.calories || 0) - mealToRemove.calories,
                protein: (todayLog.totals.protein || 0) - mealToRemove.protein,
                carbs: (todayLog.totals.carbs || 0) - (mealToRemove.carbs || 0),
                fat: (todayLog.totals.fat || 0) - (mealToRemove.fat || 0),
                fiber: (todayLog.totals.fiber || 0) - (mealToRemove.fiber || 0),
            },
        };

        setTodayLog(updatedLog);
        saveTodayLog(updatedLog);
    };

    const handleReset = () => {
        resetTodayLog();
        const newLog: DailyLog = {
            date: today,
            meals: [],
            totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
        };
        setTodayLog(newLog);
        setShowResetConfirm(false);
    };

    const handleCloseModal = () => {
        setIsAddingMeal(false);
        setSelectedFood(null);
        setSearchQuery('');
        setWeight('');
        setShowFoodDropdown(false);
    };

    const targetCalories = calorieResults?.targetCalories || 2000;
    const targetProtein = macroResults?.protein || 150;
    const targetCarbs = macroResults?.carbs || 250;
    const targetFat = macroResults?.fat || 65;
    const targetFiber = macroResults?.fiber || 30;

    const macroChartData = [
        { name: 'Protein', value: Math.max(0, (todayLog?.totals.protein || 0) * 4) },
        { name: 'Carbs', value: Math.max(0, (todayLog?.totals.carbs || 0) * 4) },
        { name: 'Fat', value: Math.max(0, (todayLog?.totals.fat || 0) * 9) },
    ];

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-background py-8 md:py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
                        Daily{' '}
                        <span className="bg-kinetic-gradient bg-clip-text text-transparent">Calorie Tracker</span>
                    </h1>
                    <p className="text-on-surface-variant max-w-lg mx-auto">
                        Indian food database with complete macro tracking including carbs, fats, and fiber.
                    </p>
                </div>

                {/* Today's Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Calorie Card with Pie Chart */}
                    <Card variant="gradient" className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Calorie & Macro Distribution</CardTitle>
                                <span className="text-sm text-on-surface-variant">{formatDate(today)}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-full md:w-1/2 h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={macroChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                <Cell fill={MACRO_COLORS.protein} />
                                                <Cell fill={MACRO_COLORS.carbs} />
                                                <Cell fill={MACRO_COLORS.fat} />
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="w-full md:w-1/2 space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-on-surface-variant font-medium">Daily Calories</span>
                                            <span className="text-2xl font-bold text-on-surface">
                                                {todayLog?.totals.calories.toLocaleString() || 0}
                                                <span className="text-sm text-outline-variant font-normal"> / {targetCalories.toLocaleString()}</span>
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={todayLog?.totals.calories || 0}
                                            max={targetCalories}
                                            showValue={false}
                                            size="lg"
                                        />
                                        <p className="text-xs text-outline-variant mt-2">
                                            {targetCalories - (todayLog?.totals.calories || 0) > 0
                                                ? `${(targetCalories - (todayLog?.totals.calories || 0)).toLocaleString()} kcal left`
                                                : 'Target reached!'
                                            }
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/30/50">
                                        <div className="p-3 rounded-xl bg-surface-container-low/50">
                                            <p className="text-xs text-outline-variant mb-1">Fats Progress</p>
                                            <p className="text-lg font-bold text-tertiary">{Math.round(todayLog?.totals.fat || 0)}g / {targetFat}g</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-surface-container-low/50">
                                            <p className="text-xs text-outline-variant mb-1">Fiber Progress</p>
                                            <p className="text-lg font-bold text-primary">{Math.round(todayLog?.totals.fiber || 0)}g / {targetFiber}g</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Macro Progress Bars */}
                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>Macros Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-primary font-medium">Protein</span>
                                    <span className="text-on-surface">{Math.round(todayLog?.totals.protein || 0)}g / {targetProtein}g</span>
                                </div>
                                <ProgressBar value={todayLog?.totals.protein || 0} max={targetProtein} variant="success" size="md" showValue={false} />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-secondary font-medium">Carbs</span>
                                    <span className="text-on-surface">{Math.round(todayLog?.totals.carbs || 0)}g / {targetCarbs}g</span>
                                </div>
                                <ProgressBar value={todayLog?.totals.carbs || 0} max={targetCarbs} variant="default" size="md" showValue={false} />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-tertiary font-medium">Fats</span>
                                    <span className="text-on-surface">{Math.round(todayLog?.totals.fat || 0)}g / {targetFat}g</span>
                                </div>
                                <ProgressBar value={todayLog?.totals.fat || 0} max={targetFat} variant="warning" size="md" showValue={false} />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-primary font-medium">Fiber</span>
                                    <span className="text-on-surface">{Math.round(todayLog?.totals.fiber || 0)}g / {targetFiber}g</span>
                                </div>
                                <ProgressBar value={todayLog?.totals.fiber || 0} max={targetFiber} variant="default" size="md" showValue={false} className="opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Smart Add Section */}
                <Card variant="glass" className="mb-8 border-primary/20 shadow-lg shadow-emerald-500/5">
                    <CardContent className="py-6">
                        <form onSubmit={handleSmartAdd} className="space-y-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h3 className="text-on-surface font-bold">AI Smart Add</h3>
                                <span className="text-[10px] bg-primary text-on-surface px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">New</span>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={smartInput}
                                        onChange={(e) => setSmartInput(e.target.value)}
                                        placeholder='e.g., "I had 2 rotis and 100g paneer for lunch"'
                                        className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-outline-variant"
                                        disabled={isSmartAdding}
                                    />
                                    <p className="text-[10px] text-outline-variant mt-2 ml-1 italic">
                                        Type what you ate in natural language — our AI will identify and log it automatically.
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!smartInput.trim() || isSmartAdding}
                                    className="px-6 h-[46px] rounded-xl flex items-center space-x-2"
                                >
                                    {isSmartAdding ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Plus className="w-5 h-5" />
                                    )}
                                    <span>Log It</span>
                                </Button>
                            </div>
                            {smartAddError && (
                                <p className="text-error text-xs mt-2 text-center animate-in fade-in duration-300">
                                    {smartAddError}
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Meal List & History Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card variant="glass" className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Today&apos;s Meals</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(true)} className="flex items-center space-x-1">
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Reset</span>
                                    </Button>
                                    <Button size="sm" onClick={() => setIsAddingMeal(true)} className="flex items-center space-x-1">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Food</span>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {todayLog && todayLog.meals.length > 0 ? (
                                <div className="space-y-3">
                                    {todayLog.meals.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30/50 group hover:border-outline-variant/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-on-surface font-medium">{meal.name}</h4>
                                                    <span className="text-xs text-outline-variant">{formatTime(meal.timestamp)}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                                                    <span className="text-secondary font-medium">{meal.calories} kcal</span>
                                                    <span className="text-primary">P: {meal.protein}g</span>
                                                    <span className="text-secondary">C: {meal.carbs}g</span>
                                                    <span className="text-tertiary">F: {meal.fat}g</span>
                                                    {meal.fiber > 0 && <span className="text-primary text-xs">Fib: {meal.fiber}g</span>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMeal(meal.id)}
                                                className="p-2 rounded-lg text-outline-variant hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-outline-variant" />
                                    </div>
                                    <p className="text-on-surface-variant mb-4">No meals logged today</p>
                                    <Button size="sm" onClick={() => setIsAddingMeal(true)}>
                                        Add Your First Food
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardHeader>
                            <CardTitle>Recent History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log) => (
                                        <div
                                            key={log.date}
                                            className="p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/30/30"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-on-surface font-medium text-sm">{formatDate(log.date)}</p>
                                                <p className="text-xs text-secondary font-bold">{log.totals.calories} kcal</p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                                <div className="h-1 bg-primary/30 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (log.totals.protein / targetProtein) * 100)}%` }} />
                                                </div>
                                                <div className="h-1 bg-secondary/30 rounded-full overflow-hidden">
                                                    <div className="h-full bg-secondary" style={{ width: `${Math.min(100, (log.totals.carbs / targetCarbs) * 100)}%` }} />
                                                </div>
                                                <div className="h-1 bg-tertiary/30 rounded-full overflow-hidden">
                                                    <div className="h-full bg-tertiary" style={{ width: `${Math.min(100, (log.totals.fat / targetFat) * 100)}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-outline-variant text-sm py-4">No history yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Add Food Modal */}
                <Modal
                    isOpen={isAddingMeal}
                    onClose={handleCloseModal}
                    title="Add Food Item"
                    size="md"
                >
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-on-surface-variant mb-2">
                                Select Food Item
                            </label>
                            <input
                                type="text"
                                placeholder="Search e.g. Paneer, Roti, Dal..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowFoodDropdown(true);
                                    if (selectedFood && e.target.value !== selectedFood.name) {
                                        setSelectedFood(null);
                                    }
                                }}
                                onFocus={() => setShowFoodDropdown(true)}
                                className="w-full px-4 py-3 rounded-xl bg-surface-container-low/80 border border-outline-variant/30/50 text-on-surface placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-primary/50"
                            />

                            {showFoodDropdown && (
                                <div className="absolute z-10 w-full mt-2 max-h-60 overflow-y-auto rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-xl scrollbar-thin">
                                    {filteredFoods.length > 0 ? (
                                        filteredFoods.map((food, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSelectFood(food)}
                                                className={`w-full px-4 py-3 text-left hover:bg-surface-container-high/50 transition-colors flex items-center justify-between border-b border-outline-variant/30/30 last:border-0 ${selectedFood?.name === food.name ? 'bg-primary/10' : ''
                                                    }`}
                                            >
                                                <div className="flex-1 pr-4">
                                                    <p className="text-on-surface font-medium">{food.name}</p>
                                                    <p className="text-xs text-outline-variant">{food.category}</p>
                                                </div>
                                                <div className="text-right whitespace-nowrap">
                                                    <p className="text-primary text-sm font-medium">P: {food.proteinPer100g}g</p>
                                                    <p className="text-on-surface-variant text-xs">{food.caloriesPer100g} kcal</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-4 py-3 text-outline-variant text-center">No Indian foods found</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedFood && (
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <p className="text-sm text-primary font-bold">{selectedFood.name}</p>
                                </div>
                                <p className="text-xs text-on-surface-variant">Protein: {selectedFood.proteinPer100g}g</p>
                                <p className="text-xs text-on-surface-variant">Carbs: {selectedFood.carbsPer100g}g</p>
                                <p className="text-xs text-on-surface-variant">Fat: {selectedFood.fatPer100g}g</p>
                                <p className="text-xs text-on-surface-variant">Fiber: {selectedFood.fiberPer100g}g</p>
                                <p className="text-xs text-outline-variant col-span-2 mt-1 italic">
                                    💡 {selectedFood.servingNote}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Weight (grams)"
                                type="number"
                                placeholder="e.g., 150"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                            <div className="flex flex-col justify-end">
                                <p className="text-xs text-outline-variant mb-2">Popular sizes:</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setWeight('50')} className="px-2 py-1 text-xs rounded-lg bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high">50g</button>
                                    <button onClick={() => setWeight('100')} className="px-2 py-1 text-xs rounded-lg bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high">100g</button>
                                    <button onClick={() => setWeight('150')} className="px-2 py-1 text-xs rounded-lg bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high">150g</button>
                                </div>
                            </div>
                        </div>

                        {selectedFood && weight && (
                            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30/50">
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="p-2">
                                        <p className="text-lg font-bold text-on-surface">{calculatedNutrition.calories}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-outline-variant">Kcal</p>
                                    </div>
                                    <div className="p-2 border-l border-outline-variant/10">
                                        <p className="text-lg font-bold text-primary">{calculatedNutrition.protein}g</p>
                                        <p className="text-[10px] uppercase tracking-wider text-outline-variant">P</p>
                                    </div>
                                    <div className="p-2 border-l border-outline-variant/10">
                                        <p className="text-lg font-bold text-secondary">{calculatedNutrition.carbs}g</p>
                                        <p className="text-[10px] uppercase tracking-wider text-outline-variant">C</p>
                                    </div>
                                    <div className="p-2 border-l border-outline-variant/10">
                                        <p className="text-lg font-bold text-tertiary">{calculatedNutrition.fat}g</p>
                                        <p className="text-[10px] uppercase tracking-wider text-outline-variant">F</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" onClick={handleCloseModal} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddSingleMeal}
                                className="flex-1"
                                disabled={!selectedFood || !weight || parseFloat(weight) <= 0}
                            >
                                Add Food
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={showResetConfirm}
                    onClose={() => setShowResetConfirm(false)}
                    title="Reset Today's Log?"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p className="text-on-surface-variant">
                            This will clear all meals logged today. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setShowResetConfirm(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleReset} className="flex-1 !bg-error hover:!bg-red-600">
                                Reset
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
