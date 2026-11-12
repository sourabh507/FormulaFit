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
                    className="block text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant mb-2"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-4 py-3 rounded-xl
          bg-surface-container-lowest border border-outline-variant/20
          text-on-surface placeholder-on-surface-variant/50 font-medium
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          hover:border-outline-variant
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-error/50 focus:ring-error/50 focus:border-error/50' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-2 text-xs font-bold text-error uppercase tracking-wider">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-2 text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider">{helperText}</p>
            )}
        </div>
    );
}
