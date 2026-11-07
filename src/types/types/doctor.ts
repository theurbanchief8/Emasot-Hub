export interface Correction {
  original: string;
  corrected: string;
  reason: string;
}

export interface DoctorAnalysis {
  score: string;
  reason: string;
  corrections: Correction[];
  originalText: string;
}