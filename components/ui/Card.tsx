'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'gradient' | 'glass';
    hover?: boolean;
}

export function Card({
    children,
    className = '',
    variant = 'default',
    hover = false,
    ...props
}: CardProps) {
    const baseStyles = 'rounded-2xl p-6 transition-all duration-300';

    const variants = {
        default: 'bg-slate-800/80 border border-slate-700/50',
        gradient: 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/30',
        glass: 'bg-slate-800/40 backdrop-blur-xl border border-slate-700/30',
    };

    const hoverStyles = hover
        ? 'hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 hover:-translate-y-1'
        : '';

    return (
        <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`} {...props}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-xl font-bold text-white ${className}`}>{children}</h3>
    );
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
    return <p className={`text-slate-400 text-sm mt-1 ${className}`}>{children}</p>;
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return <div className={className}>{children}</div>;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`mt-4 pt-4 border-t border-slate-700/50 ${className}`}>
            {children}
        </div>
    );
}
