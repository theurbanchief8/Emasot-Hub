import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { sampleText, researchText } = await request.json();
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `Align my research to match the sample format. SAMPLE: ${sampleText.substring(0, 3000)}. RESEARCH: ${researchText.substring(0, 5000)}`;
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You are an expert academic editor." }, { role: "user", content: prompt }],
      model: "openai/gpt-oss-120b", temperature: 0.3,
    });
    return NextResponse.json({ alignedText: completion.choices[0]?.message?.content || "" });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}