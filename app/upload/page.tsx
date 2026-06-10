"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [aiScore, setAiScore] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    category: "",
    price: "",
    youtubeLink: "",
    authorName: ""
  });

  // Simple AI content detection (checks for common AI patterns)
  const checkAIContent = (text: string) => {
    const aiPatterns = [
      "as an AI", "large language model", "I don't have personal", 
      "based on my training", "as of my last update", "I cannot",
      "it's important to note", "furthermore", "moreover",
      "in conclusion", "to summarize", "additionally"
    ];
    
    let score = 0;
    aiPatterns.forEach(pattern => {
      if (text.toLowerCase().includes(pattern)) {
        score += 10;
      }
    });
    
    // Check for overly formal/professional writing (potential AI)
    const words = text.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    if (avgWordLength > 7) score += 15;
    
    return Math.min(score, 100);
  };

  const analyzeText = (text: string) => {
    const score = checkAIContent(text);
    setAiScore(score);
    
    // Auto-adjust price based on AI score
    if (score > 70) {
      setFormData(prev => ({ ...prev, price: "0" }));
    } else if (score > 40) {
      setFormData(prev => ({ ...prev, price: "20" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Calculate suggested price based on AI score
    let suggestedPrice = formData.price === "Free" ? 0 : parseInt(formData.price);
    if (aiScore > 70 && suggestedPrice > 0) {
      if (!confirm("This content appears to have high AI generation (score: " + aiScore + "%). Free publishing is recommended. Continue anyway?")) {
        setUploading(false);
        return;
      }
    }

    const currentUser = localStorage.getItem("user_name") || formData.authorName;
    const userEmail = localStorage.getItem("user_email");
    
    const newProject = {
      id: Date.now(),
      ...formData,
      price: formData.price === "Free" ? 0 : parseInt(formData.price),
      aiScore: aiScore,
      downloads: 0,
      earnings: 0,
      author_name: currentUser,
      author_email: userEmail,
      createdAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    existing.push(newProject);
    localStorage.setItem("seller_projects", JSON.stringify(existing));
    
    setUploading(false);
    router.push("/seller/dashboard");
  };

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Publish Your Research</h1>
        <p className="text-center text-gray-600 mb-8">Share your knowledge and earn from your work</p>
        
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Project Title *</label>
              <input type="text" required className="w-full p-3 border rounded-lg" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Author Name *</label>
              <input type="text" required className="w-full p-3 border rounded-lg" value={formData.authorName} onChange={(e) => setFormData({...formData, authorName: e.target.value})} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Category *</label>
              <select required className="w-full p-3 border rounded-lg" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">Select category</option>
                <option>Environment</option><option>Technology</option><option>Economics</option>
                <option>Health</option><option>Engineering</option><option>Social Sciences</option>
                <option>Agriculture</option><option>Business</option><option>Education</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Abstract *</label>
              <textarea required rows={5} className="w-full p-3 border rounded-lg" value={formData.abstract} 
                onChange={(e) => {
                  setFormData({...formData, abstract: e.target.value});
                  analyzeText(e.target.value);
                }} 
                placeholder="Write your abstract here... (AI detection will analyze authenticity)" />
              {aiScore !== null && (
                <div className="mt-2 p-2 rounded text-sm" style={{ backgroundColor: aiScore > 70 ? '#fee2e2' : aiScore > 40 ? '#fed7aa' : '#dcfce7' }}>
                  <strong>AI Content Score: {aiScore}%</strong>
                  {aiScore > 70 && <p>?? High AI content detected. Free publishing recommended.</p>}
                  {aiScore < 30 && <p>? Excellent! Original content detected.</p>}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">YouTube Link (Optional)</label>
              <input type="text" className="w-full p-3 border rounded-lg" value={formData.youtubeLink} onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Price *</label>
              <select required className="w-full p-3 border rounded-lg" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}>
                <option value="">Select price</option>
                <option>Free</option><option>20</option><option>50</option><option>100</option><option>200</option><option>500</option>
              </select>
              {aiScore > 70 && <p className="text-xs text-red-500 mt-1">?? High AI content detected. Consider making this free.</p>}
            </div>

            <button type="submit" disabled={uploading} className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition">
              {uploading ? "Publishing..." : "Publish Research"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
