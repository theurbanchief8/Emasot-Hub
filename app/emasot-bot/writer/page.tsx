"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";
import {
  FaMagic,
  FaCopy,
  FaSave,
  FaSpinner,
  FaArrowLeft,
  FaFilePdf,
  FaCheckCircle,
  FaUpload,
} from "react-icons/fa";

export default function AIWriterPage() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keyDetails, setKeyDetails] = useState("");
  const [fullAbstract, setFullAbstract] = useState("");
  const [format, setFormat] = useState("blog");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [postedToFeed, setPostedToFeed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [pdfFileName, setPdfFileName] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from("users")
        .select("id, full_name, username, institution, role")
        .eq("email", session.user.email)
        .single();
      setUser(data);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = [".pdf", ".docx", ".doc", ".txt", ".md"];
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");

    if (!validExtensions.includes(ext)) {
      alert("Please upload a PDF, DOCX, DOC, TXT, or MD file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File must be less than 10MB");
      return;
    }

    setUploading(true);
    setPdfFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to extract");

      setAbstract(data.text);
      setFullAbstract(data.fullAbstract || "");
      setKeyDetails(data.keyDetails || "");
      if (data.title) setTitle(data.title);
    } catch (error: any) {
      alert("Failed to read file: " + error.message);
      setPdfFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!title.trim() || !abstract.trim()) {
      alert("Please enter both title and abstract (or upload a file)");
      return;
    }
    setLoading(true);
    setArticle("");
    setCopied(false);
    setSaved(false);
    setPostedToFeed(false);

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          format,
          authorName: user?.full_name,
          fullAbstract,
          keyDetails,
        }),
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
    if (!user) return alert("Please login to save");
    const { error } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        content: article,
        post_type: "article",
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
      },
    ]);
    if (error) return alert("Failed: " + error.message);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePostToFeed = async () => {
    if (!user) return alert("Please login first");
    if (!confirm("Publish this article to your feed?")) return;

    const { error } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        content: article,
        post_type: "article",
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
      },
    ]);
    if (error) return alert("Failed: " + error.message);
    setPostedToFeed(true);
    alert("Article posted to your feed!");
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link
          href="/emasot-bot"
          className="inline-flex items-center gap-2 text-blue-900 dark:text-white mb-6 hover:text-amber-500"
        >
          <FaArrowLeft /> Back to Tools
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">
            AI Article Writer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your research, let AI write the article, then post it to your profile.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4">
              Your Research
            </h2>

            <div
              className="mb-6 p-6 border-2 border-dashed border-amber-500 rounded-xl bg-amber-50 dark:bg-amber-900/20 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition"
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const fakeEvent = { target: { files: [file] } } as any;
                  await handlePdfUpload(fakeEvent);
                }
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="text-center">
                <FaFilePdf className="text-5xl text-amber-500 mx-auto mb-3" />
                <p className="text-base font-semibold text-blue-900 dark:text-white mb-1">
                  {pdfFileName || "Upload Your Research"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {uploading
                    ? "Extracting text..."
                    : "Drag & drop a file here, or click to browse"}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Supports PDF, DOCX, TXT, MD (max 10MB)
                </p>
                <span className="inline-flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg font-semibold">
                  <FaUpload />
                  {uploading ? "Reading..." : "Choose File"}
                </span>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handlePdfUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Research Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Climate Change Perspectives in Kenya"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Short Abstract{" "}
                  {pdfFileName && (
                    <span className="text-green-500 text-xs">(auto-filled, 3 sentences)</span>
                  )}
                </label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  rows={4}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  placeholder="Paste a short abstract or upload a file above..."
                />
              </div>

              {keyDetails && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Key details detected:</strong> {keyDetails}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="blog">Blog Post</option>
                  <option value="news">News Article</option>
                  <option value="linkedin">LinkedIn Post</option>
                  <option value="twitter">Twitter Thread</option>
                  <option value="academic">Academic Summary</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || uploading}
                className="w-full bg-gradient-to-r from-blue-900 to-amber-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                {loading ? "Generating..." : "Generate Article"}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900 dark:text-white">
                Generated Article
              </h2>
              {article && <FaCheckCircle className="text-green-500 text-xl" />}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaSpinner className="animate-spin text-4xl mb-4 text-amber-500" />
                <p>AI is writing your article...</p>
              </div>
            ) : article ? (
              <>
                <textarea
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  rows={14}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm mb-4"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleCopy}
                    className="bg-blue-900 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm"
                  >
                    <FaCopy /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm"
                  >
                    <FaSave /> {saved ? "Saved!" : "Save"}
                  </button>
                  <button
                    onClick={handlePostToFeed}
                    disabled={postedToFeed}
                    className="bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                  >
                    <FaCheckCircle /> {postedToFeed ? "Posted!" : "Post"}
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