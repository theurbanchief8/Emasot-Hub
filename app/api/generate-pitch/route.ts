import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { abstract } = await request.json();
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "Write a 30-second elevator pitch." }, { role: "user", content: abstract }],
      model: "openai/gpt-oss-120b", temperature: 0.6,
    });
    return NextResponse.json({ result: completion.choices[0]?.message?.content || "" });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}