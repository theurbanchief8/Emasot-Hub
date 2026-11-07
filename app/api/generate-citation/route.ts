import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { title, author, url, doi, format } = await request.json();
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `Create a citation in ${format} format. Title: ${title}, Author: ${author}, URL: ${url}, DOI: ${doi}. Return ONLY the formatted citation.`;
    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You are an expert academic librarian." }, { role: "user", content: prompt }],
      model: "openai/gpt-oss-120b", temperature: 0.1,
    });
    return NextResponse.json({ citation: completion.choices[0]?.message?.content || "" });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}