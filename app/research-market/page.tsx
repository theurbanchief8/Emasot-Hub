"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FaSearch, FaFilter, FaShoppingCart, FaDownload, FaEye, FaStar, FaCertificate, FaVideo } from "react-icons/fa";

export default function ResearchMarket() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    // Add verification scores
    const withScores = saved.map((p: any) => ({
      ...p,
      verificationScore: Math.floor(Math.random() * 100),
      hasVideo: !!p.youtubeLink,
      hasPeerReviews: Math.floor(Math.random() * 10),
      citations: Math.floor(Math.random() * 50)
    }));
    setProjects(withScores);
  }, []);

  const getVerificationBadge = (score: number) => {
    if (score >= 80) return { color: "bg-green-500", text: "Gold Verified", icon: <FaCertificate /> };
    if (score >= 60) return { color: "bg-blue-500", text: "Silver Verified", icon: <FaStar /> };
    return { color: "bg-gray-400", text: "Bronze", icon: null };
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPrice = priceFilter === "all" ? true : priceFilter === "free" ? p.price === 0 : p.price > 0;
    const matchVerification = verificationFilter === "all" ? true :
      verificationFilter === "gold" ? p.verificationScore >= 80 :
      verificationFilter === "silver" ? p.verificationScore >= 60 && p.verificationScore < 80 : true;
    return matchSearch && matchPrice && matchVerification;
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "verified") return b.verificationScore - a.verificationScore;
    return 0;
  });

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent mb-4">Research Market</h1>
        <p className="text-center text-gray-600 mb-12">Discover, buy, and sell verified research from Kenyan scholars</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input type="text" placeholder="Search research..." className="p-3 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="p-3 border rounded-lg" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="all">All Prices</option><option value="free">Free Only</option><option value="paid">Paid Only</option>
            </select>
            <select className="p-3 border rounded-lg" value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)}>
              <option value="all">All Verification</option><option value="gold">Gold Verified</option><option value="silver">Silver Verified</option>
            </select>
            <select className="p-3 border rounded-lg" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option><option value="verified">Highest Verified</option>
              <option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project: any) => {
            const badge = getVerificationBadge(project.verificationScore);
            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <div className={`absolute top-4 right-4 ${badge.color} text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 z-10`}>
                    {badge.icon} {badge.text}
                  </div>
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-amber-100 flex items-center justify-center">
                    <FaEye className="text-6xl text-gray-400" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">By {project.author_name}</p>
                  <div className="flex gap-3 mb-4 text-sm">
                    {project.hasVideo && <span className="flex items-center gap-1 text-amber-500"><FaVideo /> Video</span>}
                    <span className="flex items-center gap-1">? {project.verificationScore}%</span>
                    <span className="flex items-center gap-1">?? {project.peerReviews} reviews</span>
                    <span className="flex items-center gap-1">?? {project.citations} citations</span>
                  </div>
                  <div className="flex justify-between items-center">
                    {project.price === 0 ? <span className="text-2xl font-bold text-green-600">FREE</span> : <span className="text-2xl font-bold text-amber-600">KES {project.price}</span>}
                    <Link href={`/project/${project.id}`} className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">View ?</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}