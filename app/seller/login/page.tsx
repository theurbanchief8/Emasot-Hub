"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FaStore, FaEnvelope, FaLock, FaUser, FaPhone, FaArrowRight } from "react-icons/fa";

export default function SellerLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    course: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just simulate login and redirect
    if (isLogin) {
      // Store seller info in localStorage (temp - will use Supabase Auth later)
      localStorage.setItem("seller_logged_in", "true");
      localStorage.setItem("seller_email", formData.email);
      router.push("/seller/dashboard");
    } else {
      // Register new seller
      const sellers = JSON.parse(localStorage.getItem("sellers") || "[]");
      const newSeller = {
        id: Date.now(),
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        course: formData.course,
        joined: new Date().toISOString()
      };
      sellers.push(newSeller);
      localStorage.setItem("sellers", JSON.stringify(sellers));
      localStorage.setItem("seller_logged_in", "true");
      localStorage.setItem("seller_email", formData.email);
      router.push("/seller/dashboard");
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <FaStore className="text-5xl text-amber-500 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-blue-900">
              {isLogin ? "Seller Login" : "Create Seller Account"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? "Access your dashboard" : "Start earning from your research"}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-amber-500" /> Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-amber-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="seller@example.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <FaLock className="text-amber-500" /> Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-amber-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                      <FaUser className="text-amber-500" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-amber-500"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                      <FaPhone className="text-amber-500" /> M-Pesa Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-amber-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="0712345678"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">Course/Department</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border rounded-lg focus:outline-none focus:border-amber-500"
                      value={formData.course}
                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                      placeholder="Computer Science, Economics, etc."
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition flex items-center justify-center gap-2"
              >
                {isLogin ? "Login to Dashboard" : "Create Account"} <FaArrowRight />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 hover:text-amber-700"
              >
                {isLogin ? "Don't have an account? Sign up here" : "Already have an account? Login here"}
              </button>
            </div>

            {/* Seller Benefits */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-bold text-blue-900 mb-2">? Seller Benefits:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>?? Publish unlimited research projects</li>
                <li>?? Earn 70% of every download</li>
                <li>?? Track earnings & analytics</li>
                <li>?? Get featured on leaderboard</li>
                <li>?? Withdraw directly to M-Pesa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
