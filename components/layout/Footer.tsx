'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-800/50 bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Disclaimer */}
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-200/80 text-center">
                        <strong>⚠️ Disclaimer:</strong> This tool provides estimates for educational purposes only.
                        Consult a healthcare professional or registered dietitian before starting any diet or exercise program.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo & Copyright */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-sm text-slate-400">
                            © {new Date().getFullYear()} FormulaFit. All rights reserved.
                        </span>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center space-x-6 text-sm text-slate-400">
                        <Link href="/calculator" className="hover:text-emerald-400 transition-colors">
                            Calculator
                        </Link>
                        <Link href="/workout" className="hover:text-emerald-400 transition-colors">
                            Workouts
                        </Link>
                        <Link href="/food-guide" className="hover:text-emerald-400 transition-colors">
                            Food Guide
                        </Link>
                        <Link href="/tracker" className="hover:text-emerald-400 transition-colors">
                            Tracker
                        </Link>
                    </div>
                </div>

                {/* Storage notice */}
                <p className="mt-6 text-xs text-slate-500 text-center">
                    🔒 All your data is stored locally in your browser. No account required. No data is sent to any server.
                </p>
            </div>
        </footer>
    );
}
