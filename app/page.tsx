'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="pt-8 md:pt-16 pb-32 px-6 max-w-7xl mx-auto">
            {/* Hero Section: Kinetic Pulse */}
            <section className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <span className="text-primary font-label text-sm uppercase tracking-widest font-bold mb-2 block animate-pulse">System Status: Optimal</span>
                        <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter leading-none italic">PERFORMANCE<br /><span className="text-outline-variant opacity-40">DASHBOARD</span></h1>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <span className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-1">Daily Goal Progress</span>
                        <div className="flex gap-1 justify-start md:justify-end">
                            <div className="h-1 w-8 bg-primary rounded-full"></div>
                            <div className="h-1 w-8 bg-primary rounded-full"></div>
                            <div className="h-1 w-8 bg-primary rounded-full"></div>
                            <div className="h-1 w-8 bg-outline-variant/30 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Bento Grid of Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Large Stats Card */}
                    <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden group border border-outline-variant/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                        <div>
                            <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-4 block">Current Heart Rate</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-8xl font-black font-headline tracking-tighter text-glow">142</span>
                                <span className="text-primary text-2xl font-bold italic">BPM</span>
                            </div>
                        </div>
                        <div className="mt-auto z-10 relative">
                            <div className="h-16 w-full flex items-end gap-1 overflow-hidden">
                                {/* Visualizing a pulse chart */}
                                <div className="flex-1 bg-primary/20 h-4 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/30 h-8 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/40 h-6 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/60 h-12 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary h-14 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/80 h-10 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/50 h-7 rounded-t-sm"></div>
                                <div className="flex-1 bg-primary/30 h-4 rounded-t-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Metric */}
                    <div className="bg-surface-container-high rounded-xl p-6 flex flex-col justify-between border border-outline-variant/15 hover:border-secondary/50 transition-colors cursor-default">
                        <span className="material-symbols-outlined text-secondary text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                        <div>
                            <span className="text-4xl font-black font-headline">1,840</span>
                            <span className="text-on-surface-variant text-xs uppercase block font-bold tracking-widest">Kcal Burned</span>
                        </div>
                    </div>

                    {/* Tertiary Metric */}
                    <div className="bg-surface-container-high rounded-xl p-6 flex flex-col justify-between border border-outline-variant/15 hover:border-tertiary/50 transition-colors cursor-default">
                        <span className="material-symbols-outlined text-tertiary text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        <div>
                            <span className="text-4xl font-black font-headline">94<span className="text-lg">%</span></span>
                            <span className="text-on-surface-variant text-xs uppercase block font-bold tracking-widest">Recovery Score</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Workouts & Planning (Left 2 Columns) */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black font-headline tracking-tight uppercase italic">Upcoming Sessions</h2>
                            <Link href="/workout" className="text-primary text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-2 hover:translate-x-1 transition-transform">
                                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {/* Workout Item 1 */}
                            <div className="group bg-surface-container-low hover:bg-surface-container-high transition-colors p-6 rounded-xl flex items-center justify-between border border-outline-variant/10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary border border-outline-variant/20 shadow-lg shadow-black/20">
                                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-on-surface">Hypertrophy Phase: Legs</h3>
                                        <p className="text-on-surface-variant text-sm flex items-center gap-2 mt-1 font-label">
                                            <span className="material-symbols-outlined text-xs">schedule</span> 60 mins • High Intensity
                                        </p>
                                    </div>
                                </div>
                                <button className="bg-surface-container-highest text-primary font-bold px-4 py-2 rounded-lg text-sm hover:bg-primary hover:text-on-primary transition-all tracking-wider hidden sm:block">
                                    START
                                </button>
                            </div>

                            {/* Workout Item 2 */}
                            <div className="group bg-surface-container-low hover:bg-surface-container-high transition-colors p-6 rounded-xl flex items-center justify-between opacity-60 border border-outline-variant/10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary border border-outline-variant/20">
                                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>directions_run</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-on-surface">Threshold Intervals</h3>
                                        <p className="text-on-surface-variant text-sm flex items-center gap-2 mt-1 font-label">
                                            <span className="material-symbols-outlined text-xs">event</span> Tomorrow • 06:30 AM
                                        </p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant/30 hidden sm:block">lock</span>
                            </div>
                        </div>
                    </section>

                    {/* Quick Links: Generators */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Link href="/calculator" className="relative h-48 rounded-xl overflow-hidden group cursor-pointer border border-outline-variant/20 block shadow-xl shadow-black/40">
                            <img alt="Healthy food" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrTuEcQrZQFBBbrj7CIDD9JlZnExf3q8P15EJeSSX0_fa0m1q4ru5RwZ7gg7H3NvbV-WwR5BDx6xOHO3h_yif7UuZJ0Vcf-hCM3fsMMiC-gpoUqQpa4UF8mjn7Vd475aCRP2KaKbNy685vU2XoNcFjHCfXPfDWifviAmk02fdj881kt_J1iabw2K4ZjGwZkW0Mch1zAyciC3eN8JchsR3EiH2sQMS-dBmB6GTIk2sXANqhSKqQUKbjSPLMLE_92P3d9s3eV0YJKn6-" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-6 flex flex-col justify-end">
                                <h4 className="text-xl font-black font-headline uppercase leading-none mb-1 text-on-background">Calorie<br />Calculator</h4>
                                <p className="text-xs text-on-surface-variant font-bold tracking-[0.2em] uppercase">Optimize Fueling</p>
                            </div>
                        </Link>

                        <Link href="/workout" className="relative h-48 rounded-xl overflow-hidden group cursor-pointer border border-outline-variant/20 block shadow-xl shadow-black/40">
                            <img alt="Gym equipment" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZhbKMuzpN01I4X2Y9iVaiQ0NDdoie5o0DKB75-vE5cEX4QhepP8BcH4cpwAk5Vw0iGtJYisMHzpeTsLmKUy8kvnkCvRb_uKo8kcbPOPjSINAx1GxrC77sQWQ15lv71_T0M4fxHfmK9U5mipZlYO6BEdMBr5O5wyFNetqilBdKOLHM_LxDDvCUcPK0DIBnbfJqJhgdkXqnXxHRC36Gth3u6AymOlkCuGjLXz1EXZbvHDnJsEcK8R3iVlbI7JoSy3r4TTMBKMKinHF4" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-6 flex flex-col justify-end">
                                <h4 className="text-xl font-black font-headline uppercase leading-none mb-1 text-on-background">Workout<br />Generator</h4>
                                <p className="text-xs text-on-surface-variant font-bold tracking-[0.2em] uppercase">Ai-Powered Plan</p>
                            </div>
                        </Link>
                    </section>
                </div>

                {/* Nutrition Sidebar (Right 1 Column) */}
                <div className="space-y-8">
                    <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 shadow-2xl shadow-black/20">
                        <h2 className="text-xl font-black font-headline tracking-tight uppercase mb-8 italic text-on-background">Nutrition Macro-Log</h2>

                        <div className="space-y-8">
                            {/* Macro Ring Component */}
                            <div className="relative w-40 h-40 mx-auto mb-8">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-outline-variant opacity-20" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                    <circle className="text-primary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="110" strokeWidth="12" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black font-headline text-on-background">75%</span>
                                    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-[0.15em] mt-1">Total Intake</span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(90,240,179,0.5)]"></div>
                                            <span className="text-sm font-bold text-on-background">Protein</span>
                                        </div>
                                        <span className="text-sm text-on-surface-variant font-label font-bold">160g / <span className="font-normal opacity-70">210g</span></span>
                                    </div>
                                    <div className="w-full bg-outline-variant/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[76%] rounded-full shadow-[0_0_10px_rgba(90,240,179,0.8)]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(93,230,255,0.5)]"></div>
                                            <span className="text-sm font-bold text-on-background">Carbs</span>
                                        </div>
                                        <span className="text-sm text-on-surface-variant font-label font-bold">210g / <span className="font-normal opacity-70">300g</span></span>
                                    </div>
                                    <div className="w-full bg-outline-variant/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full w-[70%] rounded-full shadow-[0_0_10px_rgba(93,230,255,0.8)]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(115,240,140,0.5)]"></div>
                                            <span className="text-sm font-bold text-on-background">Fats</span>
                                        </div>
                                        <span className="text-sm text-on-surface-variant font-label font-bold">45g / <span className="font-normal opacity-70">70g</span></span>
                                    </div>
                                    <div className="w-full bg-outline-variant/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-tertiary h-full w-[64%] rounded-full shadow-[0_0_10px_rgba(115,240,140,0.8)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="/tracker" className="block w-full mt-10 bg-kinetic-gradient text-on-primary text-center font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 duration-300">
                            Log Today's Meal
                        </Link>
                    </section>
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-14 h-14 md:w-16 md:h-16 bg-kinetic-gradient text-on-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-90 transition-all z-40">
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </button>
        </main>
    );
}
