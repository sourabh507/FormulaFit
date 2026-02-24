import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error('AI ERROR: GROQ_API_KEY is missing from environment variables.');
        return NextResponse.json(
            { error: 'Groq API key is not configured. Please add GROQ_API_KEY to your .env.local file and RESTART your dev server.' },
            { status: 500 }
        );
    }
    const groq = new Groq({ apiKey });

    try {
        const { messages, context } = await req.json();

        // Use Groq Chat Completion
        const systemMessage = {
            role: 'system',
            content: `You are "FormulaFit AI", a smart assistant for the FormulaFit fitness app. Your goal is to provide accurate, helpful, and motivating health and fitness advice.\n\nUser Context:\n- Profile: ${JSON.stringify(context.profile || 'Not provided')}\n- Today's Meals: ${JSON.stringify(context.todayLog?.meals || 'No meals logged yet')}\n- Daily Targets: Calories: ${context.targets?.calories}, Protein: ${context.targets?.protein}g, Carbs: ${context.targets?.carbs}g, Fats: ${context.targets?.fat}g\n\nGuidelines:\n1. Always consider the user's current profile and daily progress when giving advice.\n2. If the user asks about what to eat, suggest Indian-friendly options based on their remaining calories/macros.\n3. Be concise and professional.\n4. If the user asks for a workout tip, base it on their goal: ${context.profile?.goal}.\n5. Always include a disclaimer that you are an AI and not a medical professional.`
        };

        const chatResponse = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                systemMessage,
                ...messages.map((m: any) => ({
                    role: m.role === 'assistant' ? 'assistant' : 'user',
                    content: m.content
                }))
            ],
            max_tokens: 1000,
        });

        const text = chatResponse.choices[0].message?.content || '';
        return NextResponse.json({ message: text });
    } catch (error: any) {
        console.error('Groq API Error details:', error);
        return NextResponse.json(
            { error: 'Failed to get a response from the AI. ' + (error.message || '') },
            { status: 500 }
        );
    }
}
