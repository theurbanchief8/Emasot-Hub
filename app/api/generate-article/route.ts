import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { abstract, title, format, authorName, fullAbstract, keyDetails } = body;

    if (!abstract || !title) {
      return NextResponse.json(
        { error: "Title and abstract are required" },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    const author = authorName || "the researcher";

    const formatPrompts: Record<string, string> = {
      blog: "Write an engaging blog post of 400-600 words. Use clear paragraphs separated by blank lines. End with a call to action or reflection.",
      news: "Write a news article of 300-500 words. First line is the headline (no markdown). Then the lead paragraph (who, what, when, where, why), then supporting details.",
      linkedin: "Write a professional LinkedIn post of 150-250 words. Start with a hook, share key insights, end with a question for engagement. Use short paragraphs.",
      twitter: "Write a Twitter thread of 6-8 tweets. Number them 1/, 2/, 3/ etc. Each under 280 characters. Hook in tweet 1, insights in middle, takeaway at end.",
      academic: "Write an academic summary of 200-300 words. Formal tone, third person, no contractions.",
    };

    const instruction = formatPrompts[format] || formatPrompts.blog;

    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const userContent =
      instruction +
      "\n\n" +
      "Research Title: " +
      title +
      "\n\n" +
      "Short Abstract: " +
      abstract +
      "\n\n" +
      (fullAbstract ? "Full Abstract for context: " + fullAbstract + "\n\n" : "") +
      (keyDetails ? "Key Details: " + keyDetails + "\n\n" : "") +
      "Author (must be referenced by this exact name): " +
      author +
      "\n\n" +
      "Write the " +
      format +
      " now. Use the author's real name. Do NOT invent any other names, people, universities, or locations.";

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a research communication expert helping scholars share their work with the public. " +
            "CRITICAL RULES: " +
            "1. NEVER invent names. Do NOT invent an author, doctor, professor, or university. Use the real author name provided: '" +
            author +
            "'. If you reference the researcher, say '" +
            author +
            "'. " +
            "2. NEVER invent locations, cities, or campuses unless they appear in the research content provided. " +
            "3. NEVER use markdown symbols - no #, ##, **, *, backticks, or bullet points. Write plain prose only. " +
            "4. Write in flowing paragraphs separated by a single blank line. " +
            "5. Do NOT start with the title as a heading. Start directly with the content. " +
            "6. Timeline rule: A research might have been completed in " +
            currentYear +
            " but cover an earlier period (e.g., 2013-2025). Report the covered period accurately. Never call the research 'outdated' or 'old'. " +
            "7. Use the key details (period, method, context) exactly as provided. Do not add facts not in the research. " +
            "8. Write in third person: e.g., '" +
            author +
            " examined...' or '" +
            author +
            "'s study found...' " +
            "9. No emojis. No exclamation marks. No filler phrases like 'In conclusion' or 'It is important to note'. " +
            "10. Be specific to this research's actual topic, method, and findings. Do not write generic content.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.5,
      max_tokens: 2000,
    });

    let article = completion.choices[0]?.message?.content || "";

    article = article
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/`{1,3}/g, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return NextResponse.json({ article });
  } catch (error: any) {
    console.error("Groq error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate article" },
      { status: 500 }
    );
  }
}