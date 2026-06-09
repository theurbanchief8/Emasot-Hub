"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaHome, FaUpload, FaSearch, FaUser, FaStore, FaShoppingCart, 
  FaSignInAlt, FaEnvelope, FaTwitter, FaTrophy, FaBriefcase, 
  FaGlobe, FaBars, FaTimes
} from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("user_logged_in");
    setIsLoggedIn(!!loggedIn);
    
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    const unread = messages.filter((m: any) => !m.read && m.to === localStorage.getItem("user_email")).length;
    setUnreadMessages(unread);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/explore", label: "Explore", icon: <FaSearch /> },
    { href: "/feed", label: "Feed", icon: <FaTwitter /> },
    { href: "/research-market", label: "Market", icon: <FaShoppingCart /> },
    { href: "/challenges", label: "Challenges", icon: <FaBriefcase /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
            <FaGlobe className="text-amber-500 text-lg" />
            Emasot<span className="text-amber-500">Hub</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition">
                {link.icon} {link.label}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <>
                <Link href="/messages" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition relative">
                  <FaEnvelope />
                  {unreadMessages > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadMessages}</span>}
                  Messages
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition"><FaUser /> Profile</Link>
                <Link href="/upload" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition"><FaUpload /> Post</Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition"><FaSignInAlt /> Join Free</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 text-gray-700 hover:text-amber-500 transition py-2 px-2 rounded-lg hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                {link.icon} {link.label}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <>
                <Link href="/messages" className="flex items-center gap-3 text-gray-700 hover:text-amber-500 transition py-2 px-2 rounded-lg hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  <FaEnvelope /> Messages {unreadMessages > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadMessages}</span>}
                </Link>
                <Link href="/profile" className="flex items-center gap-3 text-gray-700 hover:text-amber-500 transition py-2 px-2 rounded-lg hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  <FaUser /> Profile
                </Link>
                <Link href="/upload" className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                  <FaUpload /> Publish Research
                </Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-3 bg-blue-900 text-white px-4 py-2 rounded-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                <FaSignInAlt /> Join Free
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
