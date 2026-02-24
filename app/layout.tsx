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
    themeColor: '#0f172a',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} min-h-screen flex flex-col bg-slate-950 text-white antialiased`}>
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
