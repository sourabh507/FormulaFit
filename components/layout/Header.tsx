'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Dashboard', icon: 'grid_view' },
    { href: '/workout', label: 'Workouts', icon: 'fitness_center' },
    { href: '/food-guide', label: 'Nutrition', icon: 'restaurant' },
    { href: '/calculator', label: 'Calculator', icon: 'calculate' },
    { href: '/tracker', label: 'Tracker', icon: 'monitor_heart' },
    { href: '/results', label: 'Results', icon: 'monitoring' },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="bg-background/80 backdrop-blur-xl sticky top-0 w-full z-50">
            <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-8">
                    <Link href="/">
                        <span className="text-xl font-black italic tracking-tighter text-primary">FormulaFit</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (pathname !== '/' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`font-headline font-bold tracking-tight py-1 transition-colors duration-300 ${isActive
                                            ? 'text-primary border-b-2 border-primary'
                                            : 'text-on-surface/60 hover:text-primary'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button className="active:scale-95 transition-transform text-on-surface/60 hover:text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>notifications</span>
                    </button>
                    <button className="active:scale-95 transition-transform text-on-surface/60 hover:text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>account_circle</span>
                    </button>
                </div>
            </div>
            <div className="bg-gradient-to-b from-surface-container-low to-transparent h-[1px]"></div>
        </header>
    );
}
