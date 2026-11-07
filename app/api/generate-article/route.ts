import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const { title, abstract, format, authorName, fullAbstract, keyDetails } = await request.json();
    if (!abstract || !title) return NextResponse.json({ error: "Title and abstract required" }, { status: 400 });
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const instruction = format === "blog" ? "Write an engaging blog post." : format === "news" ? "Write a news article." : format === "linkedin" ? "Write a LinkedIn post." : format === "twitter" ? "Write a Twitter thread." : "Write an academic summary.";
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: instruction + "\nTitle: " + title + "\nAbstract: " + abstract + "\nAuthor: " + authorName }],
      model: "openai/gpt-oss-120b", temperature: 0.5,
    });
    return NextResponse.json({ article: completion.choices[0]?.message?.content || "" });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}