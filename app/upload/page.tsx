"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function UploadPage() {
  const [youtubeLink, setYoutubeLink] = useState("");

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Publish Your Research</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <form>
            {/* PDF Upload - Required */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                PDF File <span className="text-red-500">*</span>
              </label>
              <input type="file" accept=".pdf" required className="w-full p-4 border rounded-lg" />
            </div>

            {/* Project Title - Required */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input type="text" placeholder="e.g., Climate Change Perspectives in Kenya" required className="w-full p-4 border rounded-lg" />
            </div>

            {/* Abstract - Required */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea placeholder="Brief summary of your research (200-300 words)" rows={5} required className="w-full p-4 border rounded-lg"></textarea>
            </div>

            {/* YouTube Link - Optional */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                YouTube Link <span className="text-gray-400 text-sm">(Optional - recommended for more visibility)</span>
              </label>
              <input 
                type="text" 
                placeholder="https://youtube.com/..." 
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full p-4 border rounded-lg" 
              />
              <p className="text-xs text-gray-400 mt-1">Add a 2-min video explaining your research to get more downloads</p>
            </div>

            {/* Price - Required */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <select required className="w-full p-4 border rounded-lg">
                <option value="">Select price</option>
                <option>Free</option>
                <option>50 KES</option>
                <option>100 KES</option>
                <option>200 KES</option>
                <option>500 KES</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-amber-500 text-white font-bold py-4 rounded-lg hover:bg-amber-600 transition">
              Submit for Review
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              <span className="text-red-500">*</span> Required fields
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
