"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { FaEnvelope, FaLock, FaUser, FaGraduationCap, FaBriefcase, FaArrowRight, FaEye, FaEyeSlash, FaLightbulb, FaChalkboardTeacher, FaUserFriends } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("sharer");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    institution: "",
    role: "sharer",
    bio: "",
    interests: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === formData.email);
      if (user) {
        localStorage.setItem("user_logged_in", "true");
        localStorage.setItem("user_email", formData.email);
        localStorage.setItem("user_name", user.name);
        localStorage.setItem("user_type", user.role);
        router.push("/");
      } else {
        alert("User not found. Please sign up first.");
      }
    } else {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const newUser = {
        id: Date.now(),
        ...formData,
        role: userType,
        joined: new Date().toISOString(),
        followers: [],
        following: [],
        posts: []
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user_logged_in", "true");
      localStorage.setItem("user_email", formData.email);
      localStorage.setItem("user_name", formData.name);
      localStorage.setItem("user_type", userType);
      router.push("/");
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex border-b">
              <button className={`flex-1 py-4 font-bold ${isLogin ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600"}`} onClick={() => setIsLogin(true)}>Login</button>
              <button className={`flex-1 py-4 font-bold ${!isLogin ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600"}`} onClick={() => setIsLogin(false)}>Sign Up</button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Email</label>
                  <input type="email" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="mb-4 relative">
                  <label className="block text-gray-700 font-bold mb-2">Password</label>
                  <input type={showPassword ? "text" : "password"} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 pr-12" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 text-gray-500">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {!isLogin && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                      <input type="text" required className="w-full p-3 border rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">I am a:</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button type="button" className={`p-3 rounded-lg border text-center transition ${userType === "sharer" ? "bg-blue-900 text-white" : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => setUserType("sharer")}>
                          <FaLightbulb className="mx-auto mb-1" /> Idea Sharer
                        </button>
                        <button type="button" className={`p-3 rounded-lg border text-center transition ${userType === "scholar" ? "bg-blue-900 text-white" : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => setUserType("scholar")}>
                          <FaChalkboardTeacher className="mx-auto mb-1" /> Scholar
                        </button>
                        <button type="button" className={`p-3 rounded-lg border text-center transition ${userType === "employer" ? "bg-blue-900 text-white" : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => setUserType("employer")}>
                          <FaBriefcase className="mx-auto mb-1" /> Employer
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">Everyone can share ideas, only employers are marked separately</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Institution/Organization</label>
                      <input type="text" required className="w-full p-3 border rounded-lg" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Bio / Research Interests</label>
                      <textarea rows={3} className="w-full p-3 border rounded-lg" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Tell others about your interests..." />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-bold mb-2">Interests (comma-separated for feed personalization)</label>
                      <input type="text" className="w-full p-3 border rounded-lg" value={formData.interests} onChange={(e) => setFormData({...formData, interests: e.target.value})} placeholder="AI, climate change, economics, education..." />
                    </div>
                  </>
                )}

                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition">
                  {isLogin ? "Login to EmasotHub" : "Join EmasotHub"} <FaArrowRight className="inline ml-2" />
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>? Everyone can share ideas | ?? Publish research | ?? Employers discover talent | ?? Earn from downloads</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
