"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBook, FaCopy, FaArrowLeft, FaSpinner, FaCheckCircle, FaMagic } from "react-icons/fa";

export default function CitationGeneratorPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [doi, setDoi] = useState("");
  const [format, setFormat] = useState("apa");
  const [citation, setCitation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title && !url && !doi) return alert("Please provide at least a Title, URL, or DOI.");
    setLoading(true); setCitation(""); setCopied(false);
    try {
      const response = await fetch("/api/generate-citation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, url, doi, format }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate");
      setCitation(data.citation);
    } catch (error: any) { alert(error.message || "Something went wrong"); } finally { setLoading(false); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(citation); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/emasot-bot" className="inline-flex items-center gap-2 text-blue-900 dark:text-white mb-6 hover:text-amber-500"><FaArrowLeft /> Back to Tools</Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Citation Generator</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter your research details and get perfect APA, MLA, Chicago, or Harvard citations instantly.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2"><FaBook /> Source Details</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Required)</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" placeholder="e.g., The Impact of Climate Change in Kenya" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author(s)</label><input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" placeholder="e.g., Emmanuel Soita" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" placeholder="https://..." /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DOI</label><input type="text" value={doi} onChange={(e) => setDoi(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" placeholder="10.1000/xyz123" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Citation Style</label><select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900"><option value="apa">APA 7th Edition</option><option value="mla">MLA 9th Edition</option><option value="chicago">Chicago 17th Edition</option><option value="harvard">Harvard Style</option></select></div>
              <button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50 mt-4">{loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}{loading ? "Generating..." : "Generate Citation"}</button>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-blue-900 dark:text-white">Formatted Citation</h2>{citation && <FaCheckCircle className="text-green-500 text-xl" />}</div>
            {loading ? (<div className="flex flex-col items-center justify-center h-64 text-gray-500"><FaSpinner className="animate-spin text-4xl mb-4 text-amber-500" /><p>Formatting your citation...</p></div>) : citation ? (<><div className="bg-slate-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 font-serif text-lg text-gray-800 dark:text-gray-200 leading-relaxed shadow-inner break-words overflow-hidden flex-1">{citation}</div><button onClick={handleCopy} className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 transition"><FaCopy /> {copied ? "Copied to Clipboard!" : "Copy Citation"}</button></>) : (<div className="flex flex-col items-center justify-center h-64 text-gray-400"><FaBook className="text-4xl mb-4" /><p>Your citation will appear here</p></div>)}
          </div>
        </div>
      </div>
    </main>
  );
}