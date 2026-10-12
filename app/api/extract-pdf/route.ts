import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);

    // Limit text to first 3000 chars for the AI
    const text = data.text.slice(0, 3000);

    return NextResponse.json({
      text,
      pages: data.numpages,
      info: data.info,
    });
  } catch (error: any) {
    console.error("PDF error:", error);
    return NextResponse.json({ error: error.message || "Failed to extract PDF" }, { status: 500 });
  }
}