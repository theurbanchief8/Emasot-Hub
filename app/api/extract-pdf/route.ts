import { NextResponse } from "next/server";

function extractAbstractSection(fullText: string): string {
  const text = fullText.replace(/\r/g, "");

  const patterns = [
    /ABSTRACT\s*\n+([\s\S]*?)(?=\n(?:CHAPTER|Table of Contents|LIST OF|DECLARATION|ACKNOWLEDG|DEDICATION|\d+\.\d+|KEY WORDS|Keywords|$))/i,
    /ABSTRACT\s*[:\-]?\s*([\s\S]*?)(?=\n\s*\n\s*\n|CHAPTER|INTRODUCTION|$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 80) {
      return match[1].trim();
    }
  }

  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const startIdx = lines.findIndex(
    (l) =>
      !/^(DECLARATION|DEDICATION|ACKNOWLEDGEMENT|TABLE OF CONTENTS|LIST OF|THE INFLUENCE|EMMANUEL|PIONEER|OCTOBER|\d{4}|BA-IR|\d+\.\d+)/i.test(l) &&
      l.length > 100
  );

  if (startIdx >= 0) {
    return lines.slice(startIdx, startIdx + 15).join(" ");
  }

  return fullText.slice(0, 2500);
}

function shortenToThreeSentences(text: string, maxWords: number = 40): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  const take = Math.min(3, sentences.length);
  let result = sentences.slice(0, take).join(" ").trim();

  const words = result.split(/\s+/);
  if (words.length > maxWords) {
    result = words.slice(0, maxWords).join(" ") + "...";
  }

  return result;
}

function extractKeyDetails(fullText: string): string {
  const text = fullText.replace(/\r/g, "");
  const details: string[] = [];

  const yearMatch = text.match(/\b(19|20)\d{2}\s*[-–—to]\s*(19|20)\d{2}\b/);
  if (yearMatch) details.push("Period covered: " + yearMatch[0]);

  if (!yearMatch) {
    const singleYear = text.match(/\b(20[0-2]\d)\b/);
    if (singleYear) details.push("Year: " + singleYear[0]);
  }

  const methods = text.match(
    /\b(qualitative|quantitative|mixed methods|case study|survey|interviews?|document analysis|descriptive|analytical)\b/gi
  );
  if (methods && methods.length > 0) {
    const unique = [...new Set(methods.map((m) => m.toLowerCase()))];
    details.push("Method: " + unique.join(", "));
  }

  const places = text.match(
    /\b(Kenya|Nairobi|Mombasa|Kisumu|Africa|East Africa|China|USA|United States|UK)\b/gi
  );
  if (places && places.length > 0) {
    const unique = [...new Set(places.map((p) => p.toLowerCase()))];
    details.push(
      "Context: " +
        unique.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")
    );
  }

  return details.join(" | ");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();
    let rawText = "";

    if (fileName.endsWith(".pdf")) {
      const pdfModule: any = await import("pdf-parse");
      const pdf = pdfModule.default || pdfModule;
      const data = await pdf(buffer);
      rawText = data.text;
    } else if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
      rawText = buffer.toString("utf-8");
    } else if (fileName.endsWith(".docx")) {
      const mammothModule: any = await import("mammoth");
      const mammoth = mammothModule.default || mammothModule;
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, TXT, or MD." },
        { status: 400 }
      );
    }

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "No text could be extracted. File may be image-only." },
        { status: 400 }
      );
    }

    const lines = rawText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    const titleGuess =
      lines.find(
        (l) =>
          l.length > 15 &&
          l.length < 200 &&
          !/^(DECLARATION|DEDICATION|ACKNOWLEDG|TABLE OF CONTENTS|LIST OF|PIONEER|OCTOBER|\d{4}|BA-IR)/i.test(
            l
          ) &&
          !/^\d/.test(l)
      ) || "";

    const fullAbstract = extractAbstractSection(rawText);
    const shortAbstract = shortenToThreeSentences(fullAbstract, 40);
    const keyDetails = extractKeyDetails(rawText);

    return NextResponse.json({
      text: shortAbstract,
      fullAbstract: fullAbstract.slice(0, 3000),
      keyDetails: keyDetails,
      title: titleGuess,
      length: rawText.length,
    });
  } catch (error: any) {
    console.error("Extract error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract file" },
      { status: 500 }
    );
  }
}