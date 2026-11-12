'use client';

import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: SelectOption[];
    error?: string;
    helperText?: string;
    onChange?: (value: string) => void;
}

export function Select({
    label,
    options,
    error,
    helperText,
    className = '',
    id,
    onChange,
    value,
    ...props
}: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    value={value}
                    onChange={handleChange}
                    className={`
            w-full px-4 py-3 rounded-xl appearance-none cursor-pointer font-medium
            bg-surface-container-lowest border border-outline-variant/20
            text-on-surface
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            hover:border-outline-variant
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error/50 focus:ring-error/50 focus:border-error/50' : ''}
            ${className}
          `}
                    {...props}
                >
                    <option value="" className="bg-surface-container-lowest text-on-surface-variant">Select an option</option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-surface-container-lowest text-on-surface"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="material-symbols-outlined text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>expand_more</span>
                </div>
            </div>
            {error && (
                <p className="mt-2 text-xs font-bold text-error uppercase tracking-wider">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-2 text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider">{helperText}</p>
            )}
        </div>
    );
}
