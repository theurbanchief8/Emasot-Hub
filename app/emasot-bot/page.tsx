"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { FaMagic, FaCopy, FaSave, FaSpinner, FaArrowLeft, FaFilePdf, FaUpload, FaCheckCircle, FaTimes, FaRobot } from "react-icons/fa";

export default function AIWriterPage() {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [format, setFormat] = useState("blog");
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [postedToFeed, setPostedToFeed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
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

  // PDF Upload Handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("PDF must be less than 10MB");
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

      if (!response.ok) throw new Error(data.error || "Failed to extract PDF");

      setAbstract(data.text);

      // Try to auto-fill title from first line
      const firstLine = data.text.split("\n")[0]?.trim();
      if (firstLine && firstLine.length < 200 && firstLine.length > 5) {
        setTitle(firstLine);
      }
    } catch (error: any) {
      alert("Failed to read PDF: " + error.message);
      setPdfFileName("");
    } finally {
      setUploading(false);
    }
  };

  // Generate Article
  const handleGenerate = async () => {
    if (!title.trim() || !abstract.trim()) {
      alert("Please enter both title and abstract (or upload a PDF)");
      return;
    }
    setLoading(true);
    setArticle("");
    setCopied(false);
    setSaved(false);
    setPostedToFeed(false);
    setShowPreview(false);

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          format,
          authorName: user?.full_name,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate");
      setArticle(data.article);
      setShowPreview(true);
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

  // Save as post (draft)
  const handleSave = async () => {
    if (!user) {
      alert("Please login to save articles");
      return;
    }

    const { error } = await supabase.from("posts").insert([{
      user_id: user.id,
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
      setTimeout(() => setSaved(false), 2000);
    }
  };

  // Post to Feed (public)
  const handlePostToFeed = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!confirm("Publish this article to your feed? Everyone will see it.")) return;

    const { error } = await supabase.from("posts").insert([{
      user_id: user.id,
      content: article,
      post_type: "article",
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
    }]);

    if (error) {
      alert("Failed to post: " + error.message);
    } else {
      setPostedToFeed(true);
      alert("Article posted to your feed!");
    }
  };

  // AI Suggestion
  const getAISuggestion = () => {
    if (!user) return "Login to get personalized suggestions";
    if (format === "blog") return `Hi ${user.full_name?.split(" ")[0] || "there"}, this blog post is great for your profile. Consider posting it to your feed to get more visibility.`;
    if (format === "linkedin") return `This LinkedIn post will help you get discovered by employers. Post it to your profile!`;
    if (format === "twitter") return `A Twitter thread like this drives engagement. Share it on the feed!`;
    return `Your ${format} content is ready. Post it to your feed to start conversations.`;
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
            Upload your research, let AI write the article, then post it to your profile.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-4">Your Research</h2>

            {/* PDF Upload */}
            <div className="mb-6 p-4 border-2 border-dashed border-amber-500 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <div className="text-center">
                <FaFilePdf className="text-4xl text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-900 dark:text-white mb-1">
                  {pdfFileName || "Upload Full Research PDF"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {uploading ? "Extracting text..." : "PDF up to 10MB — AI will read it"}
                </p>
                <label className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-600 transition">
                  <FaUpload />
                  {uploading ? "Reading..." : "Choose PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Research Title</label>
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
                  Abstract / Summary {pdfFileName && <span className="text-green-500 text-xs">(auto-filled from PDF)</span>}
                </label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  rows={6}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  placeholder="Paste your research abstract here OR upload a PDF above..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Output Format</label>
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

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900 dark:text-white">Generated Article</h2>
              {article && <FaCheckCircle className="text-green-500 text-xl" />}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaSpinner className="animate-spin text-4xl mb-4 text-amber-500" />
                <p>AI is writing your article...</p>
              </div>
            ) : article ? (
              <>
                {/* AI Suggestion */}
                <div className="bg-gradient-to-r from-blue-50 to-amber-50 dark:from-gray-700 dark:to-gray-700 rounded-xl p-4 mb-4 border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <FaRobot className="text-amber-500 text-xl mt-1" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900 dark:text-white mb-1">Emasot Bot suggests:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{getAISuggestion()}</p>
                    </div>
                  </div>
                </div>

                <textarea
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  rows={12}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm mb-4"
                />

                <div className="grid grid-cols-3 gap-2 mb-3">
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
                    <FaSave /> {saved ? "Saved!" : "Save Draft"}
                  </button>
                  <button
                    onClick={handlePostToFeed}
                    disabled={postedToFeed}
                    className="bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                  >
                    <FaCheckCircle /> {postedToFeed ? "Posted!" : "Post to Feed"}
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Your article is ready.</strong> Copy it, save as draft, or post directly to your feed to get visibility.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FaMagic className="text-4xl mb-4" />
                <p>Your generated article will appear here</p>
                <p className="text-xs mt-2">Upload a PDF or paste an abstract to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}