'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/calculator', label: 'Calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { href: '/results', label: 'Results', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { href: '/workout', label: 'Workout', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { href: '/workout-tracker', label: 'Tracker', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h6m-6-8h6' },
    { href: '/food-guide', label: 'Food Guide', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { href: '/tracker', label: 'Calorie Tracker', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 w-full">
            {/* Blur backdrop */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            FormulaFit
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }
                  `}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile menu button */}
                    <MobileMenu pathname={pathname} />
                </div>
            </div>
        </header>
    );
}

function MobileMenu({ pathname }: { pathname: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile menu dropdown */}
            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 p-4">
                    <nav className="flex flex-col space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }
                  `}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </div>
    );
}
