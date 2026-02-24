'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

const features = [
    {
        icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
        title: 'Calorie Calculator',
        description: 'Calculate your daily calorie needs using the scientifically-backed Mifflin-St Jeor formula.',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
        title: 'Workout Plans',
        description: 'Get personalized workout routines based on your experience level and available equipment.',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h6m-6-8h6',
        title: 'Workout Tracker',
        description: 'Log your exercises, track sets and reps, and monitor your workout history over time.',
        color: 'from-pink-500 to-rose-500',
    },
    {
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        title: 'Protein Guide',
        description: 'Discover protein-rich foods categorized by vegetarian, non-vegetarian, and vegan options.',
        color: 'from-violet-500 to-purple-500',
    },
    {
        icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
        title: 'Calorie Tracker',
        description: 'Log your meals and track your daily calorie and macro intake with ease.',
        color: 'from-orange-500 to-red-500',
    },
];

const stats = [
    { value: '100%', label: 'Privacy' },
    { value: '0', label: 'Signup Needed' },
    { value: '∞', label: 'Free Forever' },
];

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-bg relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 animate-fade-in">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                            No signup required • 100% Free
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up">
                            Your Personal{' '}
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                                Fitness Companion
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Calculate your calories, plan your workouts, and track your nutrition journey —
                            all stored locally in your browser. Your data, your privacy.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link href="/calculator">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Get Started
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            </Link>
                            <Link href="/food-guide">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Explore Food Guide
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex items-center justify-center gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                                    <div className="text-sm text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 md:h-24" viewBox="0 0 1440 74" fill="none" preserveAspectRatio="none">
                        <path d="M0 24C240 74 480 74 720 49C960 24 1200 24 1440 49V74H0V24Z" fill="#020617" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-slate-950 py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Powerful tools to help you achieve your fitness goals, all in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                    </svg>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400">{feature.description}</p>

                                {/* Hover glow */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-slate-950 py-20 border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-slate-400">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Enter Your Details', desc: 'Input your age, weight, height, and fitness goals' },
                            { step: '02', title: 'Get Your Plan', desc: 'Receive personalized calorie targets and workout recommendations' },
                            { step: '03', title: 'Track Progress', desc: 'Log your meals and monitor your daily nutrition' },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-6">
                                    <span className="text-2xl font-bold text-gradient">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <div className="mt-16 text-center">
                        <Link href="/calculator">
                            <Button size="lg">
                                Start Your Journey
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
