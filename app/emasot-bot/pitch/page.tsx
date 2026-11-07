"use client";
import { useState } from "react";
import Link from "next/link";
import { FaSearchPlus, FaCopy, FaArrowLeft, FaSpinner, FaCheckCircle, FaMagic } from "react-icons/fa";

export default function PitchPage() {
  const [abstract, setAbstract] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!abstract.trim()) return alert("Please enter an abstract.");
    setLoading(true); setResult(""); setCopied(false);
    try {
      const res = await fetch("/api/generate-pitch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ abstract }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/emasot-bot" className="inline-flex items-center gap-2 text-blue-900 dark:text-white mb-6 hover:text-amber-500"><FaArrowLeft /> Back to Tools</Link>
        <div className="text-center mb-12"><h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Elevator Pitch Generator</h1><p className="text-gray-600 dark:text-gray-400">Paste your abstract and get a 30-second spoken pitch for interviews.</p></div>
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2"><FaSearchPlus /> Your Abstract</h2>
            <textarea value={abstract} onChange={e => setAbstract(e.target.value)} rows={15} className="w-full p-4 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 resize-none mb-4" placeholder="Paste your research abstract here..." />
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50">{loading ? <FaSpinner className="animate-spin" /> : <FaMagic />} {loading ? "Pitching..." : "Generate Pitch"}</button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-blue-900 dark:text-white">Your 30-Second Pitch</h2>{result && <FaCheckCircle className="text-green-500 text-xl" />}</div>
            {loading ? (<div className="flex flex-col items-center justify-center h-64 text-gray-500 flex-1"><FaSpinner className="animate-spin text-4xl mb-4 text-amber-500" /><p>Writing your pitch...</p></div>) : result ? (<><textarea value={result} onChange={e => setResult(e.target.value)} className="w-full flex-1 p-4 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm mb-4 resize-none" /><button onClick={handleCopy} className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-400 transition"><FaCopy /> {copied ? "Copied!" : "Copy Pitch"}</button></>) : (<div className="flex flex-col items-center justify-center h-64 text-gray-400 flex-1"><FaSearchPlus className="text-4xl mb-4" /><p>Your pitch will appear here</p></div>)}
          </div>
        </div>
      </div>
    </main>
  );
}