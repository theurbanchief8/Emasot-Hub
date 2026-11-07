export function applyCorrections(text: string, corrections: any[]) {
  // 1. Split the raw text into HTML paragraphs
  let fullHtml = text.split(/\n\n|\n/).map(p => {
    if (p.trim() === "") return ""; 
    return `<p class="mb-4 text-base">${p}</p>`;
  }).join("");

  // 2. Apply the corrections
  corrections.forEach((fix) => {
    if (fix.original && fix.corrected) {
      const replacement = `<span class="bg-red-300 text-red-900 px-1 rounded line-through" title="Removed">${fix.original}</span> <span class="bg-green-300 text-green-900 px-1 rounded font-bold" title="${fix.reason}">${fix.corrected}</span>`;
      
      // Using split/join guarantees 100% replacement
      fullHtml = fullHtml.split(fix.original).join(replacement);
    }
  });

  return fullHtml;
}