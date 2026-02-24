import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        console.error('AI ERROR: GOOGLE_GEMINI_API_KEY is missing from environment variables.');
        return NextResponse.json(
            { error: 'Gemini API key is not configured. Please add GOOGLE_GEMINI_API_KEY to your .env.local file and RESTART your dev server.' },
            { status: 500 }
        );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const { messages, context } = await req.json();

        // Using gemini-2.0-flash as identified by diagnostic report.
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: `
                You are "FormulaFit AI", a smart assistant for the FormulaFit fitness app.
                Your goal is to provide accurate, helpful, and motivating health and fitness advice.
                
                User Context:
                - Profile: ${JSON.stringify(context.profile || 'Not provided')}
                - Today's Meals: ${JSON.stringify(context.todayLog?.meals || 'No meals logged yet')}
                - Daily Targets: Calories: ${context.targets?.calories}, Protein: ${context.targets?.protein}g, Carbs: ${context.targets?.carbs}g, Fats: ${context.targets?.fat}g
                
                Guidelines:
                1. Always consider the user's current profile and daily progress when giving advice.
                2. If the user asks about what to eat, suggest Indian-friendly options based on their remaining calories/macros.
                3. Be concise and professional.
                4. If the user asks for a workout tip, base it on their goal: ${context.profile?.goal}.
                5. Always include a disclaimer that you are an AI and not a medical professional.
            `
        });

        // Convert messages to Gemini format
        const prompt = messages[messages.length - 1].content;
        let history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));

        // Gemini requires the first message in history to be from the 'user'.
        // If our history starts with a 'model' message (like our welcome message), we should remove it.
        const firstUserIndex = history.findIndex((m: any) => m.role === 'user');
        if (firstUserIndex !== -1) {
            history = history.slice(firstUserIndex);
        } else {
            history = [];
        }

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ message: text });
    } catch (error: any) {
        console.error('Gemini API Error details:', error);

        // Handle specific API errors
        if (error.message?.includes('API_KEY_INVALID')) {
            return NextResponse.json(
                { error: 'The API key provided is invalid. Please check your Google AI Studio dashboard.' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to get a response from the AI. ' + (error.message || '') },
            { status: 500 }
        );
    }
}
