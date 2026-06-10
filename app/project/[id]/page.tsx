"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaDownload, FaShoppingCart, FaYoutube, FaUser } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  author_name: string;
  category: string;
  price: number;
  abstract: string;
  youtubeLink?: string;
  createdAt: string;
}

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    const found = projects.find((p: Project) => p.id === parseInt(params.id as string));
    setProject(found || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">Loading...</div>
        <Footer />
      </main>
    );
  }

  if (!project) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Project not found</h1>
          <Link href="/explore" className="text-amber-500 mt-4 inline-block">Browse other research →</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{project.category}</span>
              {project.price === 0 ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">FREE</span>
              ) : (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">KES {project.price}</span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-blue-900 mb-4">{project.title}</h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span className="flex items-center gap-1"><FaUser /> Author: {project.author_name}</span>
              <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3">Abstract</h2>
              <p className="text-gray-700 leading-relaxed">{project.abstract}</p>
            </div>

            {project.youtubeLink && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <FaYoutube className="text-red-600" /> Video Abstract
                </h2>
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">YouTube video: {project.youtubeLink}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Access This Research</h2>
            
            {project.price === 0 ? (
              <button className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
                <FaDownload /> Download for Free
              </button>
            ) : (
              <div>
                <p className="text-center text-gray-700 mb-4">
                  Price: <strong className="text-2xl text-amber-600">KES {project.price}</strong>
                </p>
                <button className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition flex items-center justify-center gap-2">
                  <FaShoppingCart /> Pay with M-Pesa
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  70% of your payment goes directly to the student researcher
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}