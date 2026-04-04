"use client";

import Link from "next/link";
import { FaUpload, FaSearch, FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-900">
          Emasot<span className="text-amber-500">Hub</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="/explore" className="flex items-center gap-2 text-gray-700 hover:text-amber-500">
            <FaSearch /> Explore
          </Link>
          <Link href="/upload" className="flex items-center gap-2 text-gray-700 hover:text-amber-500">
            <FaUpload /> Publish
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-amber-500">
            <FaUser /> Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
