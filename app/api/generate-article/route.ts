import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { abstract, title, format, authorName } = body;

    if (!abstract || !title) {
      return NextResponse.json(
        { error: "Title and abstract are required" },
        { status: 400 }
      );
    }

    // Format instructions
    const formatPrompts: Record<string, string> = {
      blog: "Write an engaging blog post (400-600 words) with headings and a call to action. Make it accessible to a general audience.",
      news: "Write a news article (300-500 words) in inverted pyramid style. Include a headline, lead paragraph, and supporting details.",
      linkedin: "Write a professional LinkedIn post (150-250 words) with a hook, key insights, and a question for engagement. Use line breaks for readability.",
      twitter: "Write a Twitter thread (5-8 tweets). Start with a compelling hook. Each tweet should be under 280 characters. Number them.",
      academic: "Write an academic summary (200-300 words) in formal tone. Include key findings and implications. No citations needed.",
    };

    const instruction = formatPrompts[format] || formatPrompts.blog;
    const authorLine = authorName ? `The researcher's name is ${authorName}. Write as if you are them.` : "";

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a research communication expert. Your job is to turn academic research into engaging content. Always write in a human, natural tone. Do NOT use phrases like "as an AI" or "it's important to note". Write as if you are the researcher sharing their own work. ${authorLine}`,
        },
        {
          role: "user",
          content: `${instruction}\n\nResearch Title: ${title}\n\nAbstract: ${abstract}\n\nWrite the ${format} now:`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const article = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ article });
  } catch (error: any) {
    console.error("Groq error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate article" },
      { status: 500 }
    );
  }
}