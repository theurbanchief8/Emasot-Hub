"use client";
import Link from "next/link";
import { FaHome, FaSearch, FaUser, FaSignInAlt, FaUpload, FaEnvelope, FaTwitter, FaTrophy, FaBriefcase, FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent">
            Emasot<span className="text-amber-500">Hub</span>
          </Link>
          <div className="hidden lg:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-amber-500">Home</Link>
            <Link href="/explore" className="text-gray-700 hover:text-amber-500">Explore</Link>
            <Link href="/feed" className="text-gray-700 hover:text-amber-500">Feed</Link>
            <Link href="/research-market" className="text-gray-700 hover:text-amber-500">Market</Link>
            <Link href="/challenges" className="text-gray-700 hover:text-amber-500">Challenges</Link>
            <Link href="/leaderboard" className="text-gray-700 hover:text-amber-500">Leaderboard</Link>
            <Link href="/login" className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800">Join Free</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
