import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import foodsData from '@/data/foods.json';

export async function POST(req: NextRequest) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        console.error('AI ERROR: GOOGLE_GEMINI_API_KEY is missing.');
        return NextResponse.json(
            { error: 'Gemini API key is not configured.' },
            { status: 500 }
        );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const { text } = await req.json();

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            foodName: { type: SchemaType.STRING },
                            weight: { type: SchemaType.NUMBER },
                        },
                        required: ["foodName", "weight"],
                    },
                },
            }
        });

        const prompt = `
      Extract food items and their weights in grams from this text: "${text}".
      
      Available food database for matching:
      ${JSON.stringify(foodsData.foods.map(f => f.name))}
      
      Rules:
      1. Match the food name EXACTLY to one in the database if possible.
      2. If "1 bowl" or "katori" is mentioned, use 150g.
      3. If "1 roti" is mentioned, use 35g.
      4. If no weight is found, return 100g.
      5. Only return items mentioned in the text.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text();
        const data = JSON.parse(jsonText);

        return NextResponse.json({ items: data });
    } catch (error: any) {
        console.error('Parse Food Error:', error);
        return NextResponse.json(
            { error: 'Failed to parse food description. ' + (error.message || '') },
            { status: 500 }
        );
    }
}
