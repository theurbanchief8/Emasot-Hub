"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
    
    if (isLogin) {
      localStorage.setItem("seller_logged_in", "true");
      localStorage.setItem("seller_email", formData.email);
      router.push("/seller/dashboard");
    } else {
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
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <FaStore className="text-5xl text-amber-500 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white">
            {isLogin ? "Seller Login" : "Create Seller Account"}
          </h1>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
              <input type="email" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Password</label>
              <input type="password" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Full Name</label>
                  <input type="text" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">M-Pesa Number</label>
                  <input type="tel" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </>
            )}
            <button type="submit" className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-amber-600 dark:text-amber-400">
              {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
