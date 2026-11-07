import { DoctorAnalysis } from "../types/doctor";

export async function analyzeDocument(text: string): Promise<DoctorAnalysis> {
  const response = await fetch("/api/document-doctor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to analyze document");
  }

  return response.json();
}