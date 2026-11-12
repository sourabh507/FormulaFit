'use client';

import React, { useState } from 'react';
import { Card, CardContent, Input } from '@/components/ui';
import { FoodItem } from '@/lib/types';
import foodsData from '@/data/foods.json';

type FoodCategory = 'all' | 'vegetarian' | 'non-vegetarian' | 'vegan';

const categoryLabels: Record<FoodCategory, string> = {
    all: 'All Foods',
    vegetarian: '🥛 Vegetarian',
    'non-vegetarian': '🍗 Non-Vegetarian',
    vegan: '🌱 Vegan',
};

export default function FoodGuidePage() {
    const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const foods = foodsData.foods as FoodItem[];

    const filteredFoods = foods.filter(food => {
        const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
        const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort by protein per 100g
    const sortedFoods = [...filteredFoods].sort((a, b) => b.proteinPer100g - a.proteinPer100g);

    return (
        <div className="min-h-screen bg-background py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
                        Indian Food{' '}
                        <span className="bg-kinetic-gradient bg-clip-text text-transparent">Nutrition Guide</span>
                    </h1>
                    <p className="text-on-surface-variant max-w-lg mx-auto">
                        Explore the nutritional profile of common Indian foods. All values are per 100g of the food item.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {(Object.keys(categoryLabels) as FoodCategory[]).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`
                  px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${activeCategory === category
                                        ? 'bg-primary/20 border-2 border-primary text-primary'
                                        : 'bg-surface-container-low/50 border-2 border-outline-variant/30/50 text-on-surface-variant hover:border-outline-variant/50'
                                    }
                `}
                            >
                                {categoryLabels[category]}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="max-w-md mx-auto">
                        <Input
                            placeholder="Search e.g. Roti, Paneer, Dosa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-center"
                        />
                    </div>
                </div>

                {/* Results count */}
                <p className="text-center text-outline-variant text-sm mb-6">
                    Showing {sortedFoods.length} items
                </p>

                {/* Food Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedFoods.map((food, index) => (
                        <Card
                            key={index}
                            variant="glass"
                            hover
                            className="animate-fade-in"
                            style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                        >
                            <CardContent className="py-5">
                                {/* Food Name & Category */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-on-surface">{food.name}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${food.category === 'vegetarian'
                                            ? 'bg-green-500/20 text-green-400'
                                            : food.category === 'vegan'
                                                ? 'bg-primary/20 text-primary'
                                                : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {food.category}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-on-surface">{food.caloriesPer100g}</p>
                                        <p className="text-[10px] text-outline-variant uppercase">kcal / 100g</p>
                                    </div>
                                </div>

                                {/* Nutrition Grid */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                        <p className="text-[10px] text-outline-variant uppercase mb-0.5">Protein</p>
                                        <p className="text-lg font-bold text-primary">{food.proteinPer100g}g</p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20">
                                        <p className="text-[10px] text-outline-variant uppercase mb-0.5">Carbs</p>
                                        <p className="text-lg font-bold text-secondary">{food.carbsPer100g}g</p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-tertiary/10 border border-tertiary/20">
                                        <p className="text-[10px] text-outline-variant uppercase mb-0.5">Fats</p>
                                        <p className="text-lg font-bold text-tertiary">{food.fatPer100g}g</p>
                                    </div>
                                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                        <p className="text-[10px] text-outline-variant uppercase mb-0.5">Fiber</p>
                                        <p className="text-lg font-bold text-primary">{food.fiberPer100g}g</p>
                                    </div>
                                </div>

                                {/* Serving Note */}
                                <div className="p-3 rounded-xl bg-surface-container-low/50">
                                    <p className="text-xs text-on-surface-variant">
                                        💡 {food.servingNote}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {sortedFoods.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-outline-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-on-surface-variant">No foods found matching your search.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                            className="mt-4 text-primary hover:text-emerald-300 text-sm font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Tips Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card variant="gradient">
                        <CardContent className="py-5">
                            <h3 className="text-lg font-bold text-on-surface mb-3">🇮🇳 Indian Diet Tips</h3>
                            <ul className="space-y-2 text-sm text-on-surface-variant">
                                <li>• Combine Cereals & Pulses (eg. Rice & Dal) for complete protein</li>
                                <li>• Include Fiber through salads, whole grains, and leafy vegetables</li>
                                <li>• Watch out for "hidden fats" in tadka and deep-fried snacks like Samosas</li>
                                <li>• Use Curd/Paneer as excellent vegetarian protein sources</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card variant="gradient">
                        <CardContent className="py-5">
                            <h3 className="text-lg font-bold text-on-surface mb-3">🍛 Healthy Meal Ideas</h3>
                            <ul className="space-y-2 text-sm text-on-surface-variant">
                                <li>• <strong>Breakfast:</strong> Vegetable Poha or Sprouts salad</li>
                                <li>• <strong>Lunch:</strong> 2 Roti + Dal + Vegetable Sabzi + Curd</li>
                                <li>• <strong>Evening:</strong> Roasted Chana or Handful of Almonds</li>
                                <li>• <strong>Dinner:</strong> Grilled Paneer/Chicken with Brown Rice</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
