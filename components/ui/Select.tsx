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
                    className="block text-sm font-medium text-slate-300 mb-2"
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
            w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
            bg-slate-800/80 border border-slate-700/50
            text-white
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
            hover:border-slate-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : ''}
            ${className}
          `}
                    {...props}
                >
                    <option value="" className="bg-slate-800">Select an option</option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-slate-800"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-2 text-sm text-slate-500">{helperText}</p>
            )}
        </div>
    );
}
