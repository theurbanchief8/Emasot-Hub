import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const pdf = require("pdf-parse");
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      extractedText = buffer.toString("utf-8");
    }

    return NextResponse.json({ 
      text: extractedText,
      title: file.name.replace(/\.[^/.]+$/, ""), 
      fullAbstract: extractedText, 
      keyDetails: "" 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}