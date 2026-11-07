import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) return NextResponse.json({ error: "Text is required." }, { status: 400 });

    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      You are a strict academic editor. Analyze the text below.
      Return a JSON object with this EXACT structure. Do not use markdown.
      {
        "score": "18%",
        "reason": "3 sentences explaining the score.",
        "corrections": [
          { "original": "exact phrase", "corrected": "improved phrase", "reason": "humanized tone" }
        ]
      }
      Find at least 15 corrections to make it sound more human.
      TEXT:
      ${text.substring(0, 15000)}
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an AI that strictly outputs valid JSON." },
        { role: "user", content: prompt }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      max_tokens: 4000,
    });

    let raw = completion.choices[0]?.message?.content || "{}";
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(raw);

    return NextResponse.json({ 
      score: parsed.score || "0%",
      reason: parsed.reason || "No reason provided.",
      corrections: parsed.corrections || [],
      originalText: text
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}