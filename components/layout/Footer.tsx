'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mobileNavItems = [
    { href: '/', label: 'Dashboard', icon: 'grid_view' },
    { href: '/workout', label: 'Workouts', icon: 'fitness_center' },
    { href: '/food-guide', label: 'Nutrition', icon: 'restaurant' },
    { href: '/calculator', label: 'Calculator', icon: 'calculate' },
];

export function Footer() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Footer */}
            <footer className="mt-auto border-t border-outline-variant/10 bg-surface-container-lowest hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Disclaimer */}
                    <div className="mb-6 p-4 rounded-xl bg-error-container/20 border border-error-container/30">
                        <p className="text-sm text-on-surface-variant text-center">
                            <strong className="text-error">⚠️ Disclaimer:</strong> This tool provides estimates for educational purposes only.
                            Consult a healthcare professional or registered dietitian before starting any diet or exercise program.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Logo & Copyright */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-on-surface-variant font-label tracking-widest uppercase">
                                © {new Date().getFullYear()} FormulaFit. All rights reserved.
                            </span>
                        </div>

                        {/* Quick Links */}
                        <div className="flex items-center space-x-6 text-sm flex-wrap justify-center">
                            <Link href="/calculator" className="text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs">
                                Calculator
                            </Link>
                            <Link href="/workout" className="text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs">
                                Workouts
                            </Link>
                            <Link href="/food-guide" className="text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs">
                                Nutrition
                            </Link>
                            <Link href="/tracker" className="text-on-surface-variant hover:text-primary transition-colors font-bold uppercase tracking-wider text-xs">
                                Tracker
                            </Link>
                        </div>
                    </div>

                    {/* Storage notice */}
                    <p className="mt-6 text-xs text-on-surface-variant/50 text-center uppercase tracking-widest font-label">
                        All your data is stored locally in your browser. No account required. No data is sent to any server.
                    </p>
                </div>
            </footer>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-background/90 backdrop-blur-2xl border-t border-outline-variant/15 rounded-t-3xl z-50 md:hidden">
                {mobileNavItems.map((item) => {
                    const isActive = pathname === item.href || (pathname !== '/' && pathname.startsWith(item.href));

                    if (isActive) {
                        return (
                            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center text-primary bg-surface-container-high rounded-xl px-4 py-2 scale-110">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
                            </Link>
                        );
                    }

                    return (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center text-on-surface/40 px-4 py-2 hover:bg-surface-container-low transition-all">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Spacer for mobile to prevent content from hiding behind the completely fixed bottom nav */}
            <div className="h-24 md:hidden"></div>
        </>
    );
}
