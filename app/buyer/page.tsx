"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FaSearch, FaShoppingCart, FaDownload } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  author_name: string;
  category: string;
  price: number;
  abstract: string;
  createdAt: string;
  author?: string;
}

export default function BuyerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [cart, setCart] = useState<Project[]>([]);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    setProjects(savedProjects);
    
    const savedCart = JSON.parse(localStorage.getItem("buyer_cart") || "[]");
    setCart(savedCart);
  }, []);

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (project.author_name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter === "all" ? true :
                         priceFilter === "free" ? project.price === 0 :
                         priceFilter === "paid" ? project.price > 0 : true;
    return matchesSearch && matchesPrice;
  });

  const addToCart = (project: Project) => {
    if (project.price === 0) {
      alert(`Downloading "${project.title}" for free!`);
    } else {
      const updatedCart = [...cart, project];
      setCart(updatedCart);
      localStorage.setItem("buyer_cart", JSON.stringify(updatedCart));
      alert(`Added "${project.title}" to cart. Total: KES ${updatedCart.reduce((sum, p) => sum + p.price, 0)}`);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Buyer Portal</h1>
        
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search research..." 
              className="w-full p-3 pl-10 border rounded-lg" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProjects.map((project: Project) => (
            <div key={project.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-2">By {project.author_name || "Student Researcher"}</p>
              <p className="text-gray-500 text-sm mb-3">{project.category}</p>
              {project.price === 0 ? (
                <span className="text-green-600 font-bold">FREE</span>
              ) : (
                <span className="text-amber-600 font-bold">KES {project.price}</span>
              )}
              <div className="flex gap-2 mt-4">
                <Link href={`/project/${project.id}`} className="flex-1 text-center bg-blue-900 text-white px-3 py-2 rounded-lg text-sm">
                  View Details
                </Link>
                <button
                  onClick={() => addToCart(project)}
                  className="bg-amber-500 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
                >
                  {project.price === 0 ? <FaDownload /> : <FaShoppingCart />}
                  {project.price === 0 ? " Free" : ` KES ${project.price}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
