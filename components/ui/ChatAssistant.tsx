'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent } from '@/components/ui';
import { ChatMessage } from '@/lib/types';
import { getUserProfile, getTodayLog, getCalorieResults, getMacroResults } from '@/lib/localStorage';
import { MessageCircle, X, Send, Sparkles, Loader2, MinusCircle } from 'lucide-react';

export function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            if (messages.length === 0) {
                setMessages([
                    {
                        role: 'assistant',
                        content: "Hi! I'm your FormulaFit AI assistant. How can I help you today? You can ask me about your diet, workouts, or for specific food suggestions!",
                        timestamp: Date.now(),
                    },
                ]);
            }
        }
    }, [isOpen, messages]);

    const handleSendMessage = async (e?: React.FormEvent, content?: string) => {
        e?.preventDefault();
        const messageContent = content || inputValue;
        if (!messageContent.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: messageContent,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Get context
        const profile = getUserProfile();
        const todayLog = getTodayLog();
        const targets = {
            calories: getCalorieResults()?.targetCalories,
            ...getMacroResults(),
        };

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    context: { profile, todayLog, targets },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: data.message,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Sorry, I encountered an error: ${error.message}`,
                    timestamp: Date.now(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        "Analyze my diet today",
        "Suggested dinner (high protein)",
        "Workout tip for today",
        "How to lose weight effectively?"
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card variant="glass" className="w-[350px] sm:w-[400px] h-[500px] mb-4 flex flex-col overflow-hidden shadow-2xl border-emerald-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold leading-none">FormulaFit AI</h3>
                                <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Online Assistant</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-emerald-500 text-white rounded-tr-none'
                                        : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700/50 flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                                    <span className="text-xs text-slate-400">AI is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Suggested Buttons (Only when no message sent yet or just started) */}
                    {messages.length <= 1 && !isLoading && (
                        <div className="px-4 pb-2 flex flex-wrap gap-2">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(undefined, s)}
                                    className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-xs text-slate-300 transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask anything about health..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            />
                            <Button type="submit" size="sm" disabled={isLoading || !inputValue.trim()} className="rounded-xl px-3">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen
                    ? 'bg-slate-800 text-white rotate-0'
                    : 'bg-gradient-to-br from-emerald-400 to-cyan-500 text-white hover:scale-110 active:scale-95'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
            </button>
        </div>
    );
}
