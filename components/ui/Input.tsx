'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Input({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-300 mb-2"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-4 py-3 rounded-xl
          bg-slate-800/80 border border-slate-700/50
          text-white placeholder-slate-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
          hover:border-slate-600
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-2 text-sm text-slate-500">{helperText}</p>
            )}
        </div>
    );
}
