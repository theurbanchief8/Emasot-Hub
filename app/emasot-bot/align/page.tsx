"use client";
import { useState } from "react";
import Link from "next/link";
import { FaAlignLeft, FaCopy, FaArrowLeft, FaSpinner, FaCheckCircle, FaMagic, FaFileUpload } from "react-icons/fa";

export default function StructureAlignerPage() {
  const [sampleText, setSampleText] = useState("");
  const [researchText, setResearchText] = useState("");
  const [sampleFileName, setSampleFileName] = useState("");
  const [researchFileName, setResearchFileName] = useState("");
  const [alignedText, setAlignedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingSample, setUploadingSample] = useState(false);
  const [uploadingResearch, setUploadingResearch] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "sample" | "research") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "sample") setUploadingSample(true); else setUploadingResearch(true);
    try {
      const formData = new FormData(); formData.append("file", file);
      const response = await fetch("/api/extract-pdf", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to extract text");
      if (type === "sample") { setSampleText(data.text); setSampleFileName(file.name); } 
      else { setResearchText(data.text); setResearchFileName(file.name); }
    } catch (error: any) { alert("Error reading file: " + error.message); } 
    finally { if (type === "sample") setUploadingSample(false); else setUploadingResearch(false); }
  };

  const handleGenerate = async () => {
    if (!sampleText || !researchText) return alert("Please upload both a sample format and your research.");
    setLoading(true); setAlignedText(""); setCopied(false);
    try {
      const response = await fetch("/api/align-structure", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sampleText, researchText }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to align");
      setAlignedText(data.alignedText);
    } catch (error: any) { alert(error.message || "Something went wrong"); } finally { setLoading(false); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(alignedText); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/emasot-bot" className="inline-flex items-center gap-2 text-blue-900 dark:text-white mb-6 hover:text-amber-500"><FaArrowLeft /> Back to Tools</Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Structure Aligner</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload your university's sample format and your research. AI will perfectly align your document to match.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2"><FaAlignLeft /> Documents</h2>
            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Upload Sample Format</label>
                <div className="p-4 border-2 border-dashed border-blue-300 dark:border-gray-600 rounded-xl bg-blue-50 dark:bg-gray-700/50 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition text-center" onClick={() => document.getElementById("sample-input")?.click()}>
                  <FaFileUpload className="text-3xl text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-blue-900 dark:text-white">{sampleFileName || (uploadingSample ? "Reading..." : "Click to upload sample")}</p>
                  <input id="sample-input" type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => handleFileUpload(e, "sample")} className="hidden" disabled={uploadingSample} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Upload Your Research</label>
                <div className="p-4 border-2 border-dashed border-amber-300 dark:border-gray-600 rounded-xl bg-amber-50 dark:bg-gray-700/50 cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-700 transition text-center" onClick={() => document.getElementById("research-input")?.click()}>
                  <FaFileUpload className="text-3xl text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-blue-900 dark:text-white">{researchFileName || (uploadingResearch ? "Reading..." : "Click to upload research")}</p>
                  <input id="research-input" type="file" accept=".pdf,.docx,.doc,.txt" onChange={(e) => handleFileUpload(e, "research")} className="hidden" disabled={uploadingResearch} />
                </div>
              </div>
            </div>
            <button onClick={handleGenerate} disabled={loading || uploadingSample || uploadingResearch || !sampleText || !researchText} className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50 mt-6">{loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}{loading ? "Aligning..." : "Align Structure"}</button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-blue-900 dark:text-white">Aligned Research</h2>{alignedText && <FaCheckCircle className="text-green-500 text-xl" />}</div>
            {loading ? (<div className="flex flex-col items-center justify-center h-64 text-gray-500 flex-1"><FaSpinner className="animate-spin text-4xl mb-4 text-amber-500" /><p>Aligning your structure...</p></div>) : alignedText ? (<><textarea value={alignedText} onChange={(e) => setAlignedText(e.target.value)} className="w-full flex-1 p-4 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm mb-4 resize-none" /><button onClick={handleCopy} className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 transition"><FaCopy /> {copied ? "Copied!" : "Copy Aligned Text"}</button></>) : (<div className="flex flex-col items-center justify-center h-64 text-gray-400 flex-1"><FaAlignLeft className="text-4xl mb-4" /><p>Your aligned research will appear here</p></div>)}
          </div>
        </div>
      </div>
    </main>
  );
}