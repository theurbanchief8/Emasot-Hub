"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHome, FaSearch, FaUser, FaSignInAlt, FaUpload, FaEnvelope, FaTwitter, FaTrophy, FaBriefcase, FaShoppingCart, FaBook, FaGlobe } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("user_logged_in");
    setIsLoggedIn(!!loggedIn);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
            <FaGlobe className="text-amber-500 text-2xl" />
            Emasot<span className="text-amber-500">Hub</span>
          </Link>
          <div className="hidden lg:flex space-x-6">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaHome /> Home</Link>
            <Link href="/explore" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaSearch /> Explore</Link>
            <Link href="/feed" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaTwitter /> Feed</Link>
            <Link href="/research-market" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaShoppingCart /> Market</Link>
            <Link href="/challenges" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaBriefcase /> Challenges</Link>
            <Link href="/leaderboard" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaTrophy /> Leaderboard</Link>
            {isLoggedIn ? (
              <>
                <Link href="/messages" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaEnvelope /> Messages</Link>
                <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaUser /> Profile</Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-amber-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition"><FaSignInAlt /> Join Free</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
