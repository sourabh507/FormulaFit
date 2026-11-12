import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatAssistant } from '@/components/ui/ChatAssistant';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'FormulaFit - Your Personal Fitness Companion',
    description: 'Calculate calories, plan workouts, and track your nutrition journey. No signup required - all data stored locally.',
    keywords: ['fitness', 'calories', 'macros', 'workout', 'nutrition', 'health'],
    authors: [{ name: 'FormulaFit' }],
    viewport: 'width=device-width, initial-scale=1',
    themeColor: '#131416',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
            </head>
            <body className={`${inter.className} min-h-screen flex flex-col bg-background text-on-background antialiased selection:bg-primary selection:text-on-primary`}>
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
                <ChatAssistant />
            </body>
        </html>
    );
}
