"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";
import { FaMagic, FaCopy, FaSave, FaSpinner, FaArrowLeft } from "react-icons/fa";

export default function AIWriterPage() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [format, setFormat] = useState("blog");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim() || !abstract.trim()) {
      alert("Please enter both title and abstract");
      return;
    }
    setLoading(true);
    setArticle("");
    setCopied(false);
    setSaved(false);
    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, abstract, format }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate");
      setArticle(data.article);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Please login to save articles");
      return;
    }
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();
    if (!userData) return;

    const { error } = await supabase.from("posts").insert([{
      user_id: userData.id,
      content: article,
      post_type: "article",
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
    }]);

    if (error) {
      alert("Failed to save: " + error.message);
    } else {
      setSaved(true);
      alert("Article saved to your profile!");
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/emasot-bot" className="inline-flex items-center gap-2 text-blue-900 dark:text-white mb-6 hover:text-amber-500">
          <FaArrowLeft /> Back to Emasot Bot
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">AI Article Writer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Turn your research into engaging content for blogs, news, LinkedIn, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4">Your Research</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Research Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Climate Change Perspectives in Kenya" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Abstract / Summary</label>
                <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={6} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Paste your research abstract here..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Output Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="blog">Blog Post</option>
                  <option value="news">News Article</option>
                  <option value="linkedin">LinkedIn Post</option>
                  <option value="twitter">Twitter Thread</option>
                  <option value="academic">Academic Summary</option>
                </select>
              </div>
              <button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-to-r from-blue-900 to-amber-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                {loading ? "Generating..." : "Generate Article"}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4">Generated Article</h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaSpinner className="animate-spin text-4xl mb-4 text-amber-500" />
                <p>AI is writing your article...</p>
              </div>
            ) : article ? (
              <>
                <textarea value={article} onChange={(e) => setArticle(e.target.value)} rows={12} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm mb-4" />
                <div className="flex gap-3">
                  <button onClick={handleCopy} className="flex-1 bg-blue-900 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <FaCopy /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={handleSave} className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <FaSave /> {saved ? "Saved!" : "Save to Profile"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FaMagic className="text-4xl mb-4" />
                <p>Your generated article will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}