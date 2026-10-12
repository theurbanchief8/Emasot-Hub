"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    category: "",
    price: "",
    youtubeLink: ""
  });

  const checkAIContent = (text: string) => {
    const aiPatterns = [
      "as an ai", "large language model", "i don't have personal",
      "based on my training", "as of my last update", "i cannot",
      "it's important to note", "furthermore", "moreover",
      "in conclusion", "to summarize", "additionally"
    ];
    let score = 0;
    aiPatterns.forEach(pattern => {
      if (text.toLowerCase().includes(pattern)) score += 10;
    });
    const words = text.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    if (avgWordLength > 7) score += 15;
    return Math.min(score, 100);
  };

  const analyzeText = (text: string) => {
    const score = checkAIContent(text);
    setAiScore(score);
    if (score > 70) setFormData(prev => ({ ...prev, price: "Free" }));
    else if (score > 40) setFormData(prev => ({ ...prev, price: "20" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Please login to publish research");
      router.push("/login");
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("id, full_name")
      .eq("email", session.user.email)
      .single();

    if (!userData) {
      alert("User not found");
      setUploading(false);
      return;
    }

    const newProject = {
      user_id: userData.id,
      title: formData.title,
      abstract: formData.abstract,
      category: formData.category,
      price: formData.price === "Free" ? 0 : parseInt(formData.price),
      youtube_link: formData.youtubeLink || null,
      ai_score: aiScore,
      downloads_count: 0,
      earnings: 0,
      verification_score: 0,
      peer_reviews_count: 0,
      citations_count: 0
    };

    const { error } = await supabase
      .from("research_projects")
      .insert([newProject]);

    if (error) {
      console.error(error);
      alert("Failed to publish: " + error.message);
    } else {
      alert("Research published successfully!");
      router.push("/profile");
    }
    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 dark:text-white mb-4">Publish Your Research</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Share your knowledge and earn from your work</p>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Project Title *</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Category *</label>
              <select
                required
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select category</option>
                <option>Environment</option>
                <option>Technology</option>
                <option>Economics</option>
                <option>Health</option>
                <option>Engineering</option>
                <option>Social Sciences</option>
                <option>Agriculture</option>
                <option>Business</option>
                <option>Education</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Abstract *</label>
              <textarea
                required
                rows={5}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.abstract}
                onChange={(e) => {
                  setFormData({...formData, abstract: e.target.value});
                  analyzeText(e.target.value);
                }}
                placeholder="Write your abstract here..."
              />
              {aiScore !== null && (
                <div
                  className="mt-2 p-2 rounded text-sm"
                  style={{
                    backgroundColor:
                      aiScore > 70 ? "#fee2e2" : aiScore > 40 ? "#fed7aa" : "#dcfce7",
                    color: "#1f2937"
                  }}
                >
                  <strong>AI Content Score: {aiScore}%</strong>
                  {aiScore > 70 && <p>High AI content detected. Free publishing recommended.</p>}
                  {aiScore < 30 && <p>Excellent! Original content detected.</p>}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">YouTube Link (Optional)</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.youtubeLink}
                onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Price *</label>
              <select
                required
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              >
                <option value="">Select price</option>
                <option>Free</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
                <option>200</option>
                <option>500</option>
              </select>
              {aiScore !== null && aiScore > 70 && (
                <p className="text-xs text-red-500 mt-1">
                  High AI content detected. Consider making this free.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-blue-900 to-amber-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {uploading ? "Publishing..." : "Publish Research"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}