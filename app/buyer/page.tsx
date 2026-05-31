"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FaSearch, FaShoppingCart, FaDownload, FaFilter } from "react-icons/fa";

export default function BuyerPage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    setProjects(savedProjects);
    
    // Load cart
    const savedCart = JSON.parse(localStorage.getItem("buyer_cart") || "[]");
    setCart(savedCart);
  }, []);

  const categories = ["all", ...new Set(projects.map((p: any) => p.category))];

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.author_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter === "all" ? true :
                         priceFilter === "free" ? project.price === 0 :
                         priceFilter === "paid" ? project.price > 0 : true;
    const matchesCategory = categoryFilter === "all" ? true : project.category === categoryFilter;
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const addToCart = (project: any) => {
    if (project.price === 0) {
      // Free download
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
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Buyer Portal</h1>
        <p className="text-center text-gray-600 mb-12">Discover and download research from Kenyan students</p>

        {/* Search and Filters */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  className="w-full p-3 pl-10 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="p-3 border rounded-lg bg-white"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="free">Free Only</option>
              <option value="paid">Paid Only</option>
            </select>

            <select
              className="p-3 border rounded-lg bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">Found {filteredProjects.length} research papers</p>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-500">No research found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {project.category || "Uncategorized"}
                  </span>
                  {project.price === 0 ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">FREE</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">KES {project.price}</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-2">By {project.author_name || "Student Researcher"}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.abstract}</p>
                
                <div className="flex gap-2 mt-4">
                  <Link href={`/project/${project.id}`} className="flex-1 text-center bg-blue-900 text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition text-sm">
                    View Details
                  </Link>
                  <button
                    onClick={() => addToCart(project)}
                    className="bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition flex items-center gap-1 text-sm"
                  >
                    {project.price === 0 ? <FaDownload /> : <FaShoppingCart />}
                    {project.price === 0 ? " Free" : ` KES ${project.price}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl p-4 cursor-pointer hover:scale-105 transition border border-amber-200">
            <div className="relative">
              <FaShoppingCart className="text-2xl text-blue-900" />
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              KES {cart.reduce((sum, p) => sum + p.price, 0)}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
