"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHome, FaUpload, FaSearch, FaUser, FaStore, FaShoppingCart, FaSignInAlt, FaEnvelope, FaTwitter, FaVideo, FaImage, FaNewspaper } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loggedIn = localStorage.getItem("user_logged_in");
    setIsLoggedIn(!!loggedIn);
    
    // Get unread messages count
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    const unread = messages.filter((m: any) => !m.read && m.to === localStorage.getItem("user_email")).length;
    setUnreadMessages(unread);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent hover:scale-105 transition">
            Emasot<span className="text-amber-500">Hub</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition">
              <FaHome /> Home
            </Link>
            <Link href="/explore" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition">
              <FaSearch /> Explore
            </Link>
            <Link href="/feed" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition">
              <FaTwitter /> Feed
            </Link>
            <Link href="/buyer" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition">
              <FaShoppingCart /> Research
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/messages" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition relative">
                  <FaEnvelope />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                  Messages
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition">
                  <FaUser /> Profile
                </Link>
                <Link href="/upload" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition">
                  <FaUpload /> Post
                </Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition">
                <FaSignInAlt /> Join Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
