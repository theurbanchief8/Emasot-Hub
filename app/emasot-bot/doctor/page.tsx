"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { FaFileMedical, FaArrowLeft, FaSpinner, FaUpload, FaRobot, FaCheckCircle, FaDownload, FaEdit, FaSave } from "react-icons/fa";

export default function DocumentDoctorPage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [editableHtml, setEditableHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFileName(file.name);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/extract-pdf", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to extract text");
      
      setText(data.text); 
      setAnalysis(null); 
      setEditableHtml("");
    } catch (error: any) {
      alert("Error reading file: " + error.message);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return alert("Please upload a document or paste text.");
    setLoading(true); setAnalysis(null); setEditableHtml("");

    try {
      const res = await fetch("/api/document-doctor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setAnalysis(data);
      
      // Apply corrections
      let fullHtml = data.originalText.split(/\n\n|\n/).map((p: string) => {
        if (p.trim() === "") return ""; 
        return `<p class="mb-4 text-base">${p}</p>`;
      }).join("");

      if (data.corrections && data.corrections.length > 0) {
        data.corrections.forEach((fix: any) => {
          if (fix.original && fix.corrected) {
            const replacement = `<span class="bg-red-300 text-red-900 px-1 rounded line-through" title="Removed">${fix.original}</span> <span class="bg-green-300 text-green-900 px-1 rounded font-bold" title="${fix.reason}">${fix.corrected}</span>`;
            fullHtml = fullHtml.split(fix.original).join(replacement);
          }
        });
      }
      
      setEditableHtml(fullHtml);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setTimeout(() => editorRef.current?.focus(), 100);
  };

  const handleSaveEdits = () => {
    if (editorRef.current) setEditableHtml(editorRef.current.innerHTML);
    setIsEditing(false);
  };

  const triggerDownload = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Corrected Document</title></head>
      <body style="font-family: Calibri, sans-serif; font-size: 12pt; line-height: 1.5;">
        ${editableHtml}
      </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Corrected_${fileName || "Document"}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <Link href="/emasot-bot" className="inline-flex items-center gap-2 text-blue-900 dark:text-white mb-6 hover:text-amber-500 transition-colors">
          <FaArrowLeft /> Back to Tools
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">AI Document Doctor</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload your full document for a Grammarly-style humanizer, grammar fix, and AI detection.</p>
        </div>

        {!analysis && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <div className="p-10 border-2 border-dashed border-amber-500 rounded-xl bg-amber-50 dark:bg-amber-900/10 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/20 transition text-center mb-6" onClick={() => document.getElementById("doc-input")?.click()}>
              <FaFileMedical className="text-6xl text-amber-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-blue-900 dark:text-white mb-2">{fileName || (uploading ? "Reading document..." : "Upload PDF or Word Document")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Drag & drop or click to browse (Max 10MB)</p>
              <span className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold"><FaUpload /> Choose File</span>
              <input id="doc-input" type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </div>
            
            <div className="text-center text-gray-400 my-4 font-bold">- OR PASTE TEXT -</div>
            
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="w-full p-4 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white h-48 resize-none mb-6 focus:ring-2 focus:ring-blue-900" 
              placeholder="Your full text will appear here automatically..." 
            />
            
            <button onClick={handleAnalyze} disabled={loading || uploading || !text} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50 text-lg">
              {loading ? <FaSpinner className="animate-spin" /> : <FaRobot />} {loading ? "Analyzing Full Document..." : "Run Document Doctor"}
            </button>
          </div>
        )}

        {analysis && (
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
                <h2 className="text-lg font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2"><FaCheckCircle className="text-amber-500" /> Diagnostic Report</h2>
                <div className="bg-slate-50 dark:bg-gray-900 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-6">
                  <strong>Score: {analysis.score}</strong><br /><br />{analysis.reason}
                </div>
                <button onClick={() => { setAnalysis(null); setText(""); setFileName(""); setIsEditing(false); setEditableHtml(""); }} className="w-full mb-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm">
                  Check Another Document
                </button>
                <button onClick={triggerDownload} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition">
                  <FaDownload /> Download .doc
                </button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-white">{isEditing ? "Editing Document" : "Corrected Document"}</h2>
                  
                  <div className="flex items-center gap-4">
                    {!isEditing && (
                      <div className="hidden md:flex gap-4 text-xs font-semibold mr-4 items-center">
                        <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-green-300 border border-green-500 rounded-sm"></span> Added/Fixed</span>
                        <span className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-red-300 border border-red-500 rounded-sm"></span> Removed</span>
                      </div>
                    )}
                    {isEditing ? (
                      <button onClick={handleSaveEdits} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition shadow-md"><FaSave /> Save Edits</button>
                    ) : (
                      <button onClick={handleStartEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition shadow-md"><FaEdit /> Edit Document</button>
                    )}
                  </div>
                </div>
                
                <div 
                  ref={editorRef}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  dangerouslySetInnerHTML={{ __html: editableHtml }}
                  className={`prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed overflow-y-auto flex-1 outline-none p-6 rounded-xl transition-all ${
                    isEditing ? "border-2 border-amber-500 bg-amber-50/30 dark:bg-gray-900/50 ring-4 ring-amber-500/20" : "border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50"
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}