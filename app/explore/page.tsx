"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";

export default function ExplorePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">Loading research...</div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Explore Research</h1>
        
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No research published yet. Be the first!</p>
            <Link href="/upload" className="text-amber-500 mt-4 inline-block">Publish your research →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-2">By {project.author_name}</p>
                <p className="text-gray-500 text-sm mb-3">{project.category}</p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{project.abstract}</p>
                <div className="flex justify-between items-center">
                  {project.price === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    <span className="text-amber-600 font-bold">KES {project.price}</span>
                  )}
                  <Link href={`/project/${project.id}`} className="text-blue-600 hover:underline">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
