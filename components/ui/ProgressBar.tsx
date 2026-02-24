'use client';

import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    label?: string;
    showValue?: boolean;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function ProgressBar({
    value,
    max,
    label,
    showValue = true,
    variant = 'default',
    size = 'md',
    className = '',
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const isOver = value > max;

    const sizeStyles = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    const variantStyles = {
        default: 'from-emerald-500 to-cyan-500',
        success: 'from-green-500 to-emerald-500',
        warning: 'from-yellow-500 to-orange-500',
        danger: 'from-red-500 to-rose-500',
    };

    // Automatically change variant if over limit
    const actualVariant = isOver ? 'danger' : variant;

    return (
        <div className={`w-full ${className}`}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <span className="text-sm font-medium text-slate-300">{label}</span>
                    )}
                    {showValue && (
                        <span className={`text-sm font-medium ${isOver ? 'text-red-400' : 'text-slate-400'}`}>
                            {value.toLocaleString()} / {max.toLocaleString()}
                            {isOver && (
                                <span className="ml-1 text-xs">(+{(value - max).toLocaleString()} over)</span>
                            )}
                        </span>
                    )}
                </div>
            )}
            <div className={`w-full bg-slate-700/50 rounded-full overflow-hidden ${sizeStyles[size]}`}>
                <div
                    className={`h-full bg-gradient-to-r ${variantStyles[actualVariant]} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}

interface CircularProgressProps {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    className?: string;
}

export function CircularProgress({
    value,
    max,
    size = 120,
    strokeWidth = 8,
    label,
    className = '',
}: CircularProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-slate-700/50"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500 ease-out"
                />
                {/* Gradient definition */}
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(percentage)}%</span>
                {label && (
                    <span className="text-xs text-slate-400 mt-1">{label}</span>
                )}
            </div>
        </div>
    );
}
