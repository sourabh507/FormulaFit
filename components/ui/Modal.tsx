'use client';

import React, { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}: ModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsVisible(false);
        }
    };

    if (!isVisible && !isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
            onTransitionEnd={handleTransitionEnd}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                className={`
          relative w-full ${sizes[size]}
          bg-slate-800/95 backdrop-blur-xl
          border border-slate-700/50 rounded-2xl
          shadow-2xl shadow-black/50
          transform transition-all duration-300
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
