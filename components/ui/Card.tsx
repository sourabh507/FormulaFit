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
        default: 'bg-surface-container-low border border-outline-variant/10',
        gradient: 'bg-surface-container-high border border-outline-variant/15',
        glass: 'bg-surface-container-highest border border-outline-variant/20 backdrop-blur-xl',
    };

    const hoverStyles = hover
        ? 'hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1'
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
        <h3 className={`text-xl font-black font-headline text-on-surface ${className}`}>{children}</h3>
    );
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
    return <p className={`text-on-surface-variant font-label text-sm uppercase tracking-wider mt-1 font-bold ${className}`}>{children}</p>;
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
        <div className={`mt-4 pt-4 border-t border-outline-variant/10 ${className}`}>
            {children}
        </div>
    );
}
