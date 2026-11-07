import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "Critique this text. Provide 1. Critique 2. Polished Version." }, { role: "user", content: text }],
      model: "openai/gpt-oss-120b", temperature: 0.3,
    });
    return NextResponse.json({ result: completion.choices[0]?.message?.content || "" });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}