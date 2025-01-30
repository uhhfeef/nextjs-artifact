import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {role: 'system', content: 'You are a helpful assistant. if user asks for code, give response inside <code></code>. Only send the code and no fluff'},
        ...messages
      ],
    });

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
