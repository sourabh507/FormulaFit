import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'No API Key in .env.local' });

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent("Say 'Diagnostic Success'");
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            status: 'Diagnostic Success',
            response: text,
            model: 'gemini-2.0-flash'
        });
    } catch (e: any) {
        return NextResponse.json({
            status: 'Diagnostic Failed',
            error: e.message,
            stack: e.stack,
            hint: 'This error comes directly from the Gemini SDK attempt.'
        });
    }
}
