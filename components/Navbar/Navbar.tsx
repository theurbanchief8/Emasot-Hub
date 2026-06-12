"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaHome, FaSearch, FaUser, FaSignInAlt, FaUpload, FaEnvelope, 
  FaTwitter, FaTrophy, FaBriefcase, FaShoppingCart, FaGlobe, 
  FaMoon, FaSun, FaBell
} from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("user_logged_in");
    setIsLoggedIn(!!loggedIn);
    
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
    
    const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(savedNotifications);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <nav className="bg-white/95 dark:bg-gray-900 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
            <FaGlobe className="text-amber-500 text-xl" />
            Emasot<span className="text-amber-500">Hub</span>
          </Link>
          
          {/* Navigation Links - Wrapped for mobile */}
          <div className="hidden md:flex space-x-4 lg:space-x-6">
            <Link href="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaHome /> Home</Link>
            <Link href="/explore" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaSearch /> Explore</Link>
            <Link href="/feed" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaTwitter /> Feed</Link>
            <Link href="/research-market" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaShoppingCart /> Market</Link>
            <Link href="/challenges" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaBriefcase /> Challenges</Link>
            <Link href="/leaderboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaTrophy /> Leaderboard</Link>
            
            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition relative">
                <FaBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold">Notifications</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">No notifications yet</p>
                    ) : (
                      notifications.map((notif: any) => (
                        <div key={notif.id} className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notif.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {isLoggedIn ? (
              <>
                <Link href="/messages" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaEnvelope /> Messages</Link>
                <Link href="/profile" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition whitespace-nowrap"><FaUser /> Profile</Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-amber-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition whitespace-nowrap"><FaSignInAlt /> Join Free</Link>
            )}
          </div>
          
          {/* Mobile Menu Button - Add this for better mobile experience */}
          <button className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FaSearch size={20} />
          </button>
        </div>
        
        {/* Mobile Navigation Links - Horizontal scroll on mobile */}
        <div className="flex md:hidden overflow-x-auto gap-4 mt-3 pb-2">
          <Link href="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Home</Link>
          <Link href="/explore" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Explore</Link>
          <Link href="/feed" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Feed</Link>
          <Link href="/research-market" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Market</Link>
          <Link href="/challenges" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Challenges</Link>
          <Link href="/leaderboard" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Leaderboard</Link>
          {isLoggedIn ? (
            <>
              <Link href="/messages" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Messages</Link>
              <Link href="/profile" className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-500 whitespace-nowrap">Profile</Link>
            </>
          ) : (
            <Link href="/login" className="text-sm bg-gradient-to-r from-blue-900 to-amber-500 text-white px-3 py-1 rounded-full whitespace-nowrap">Join Free</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
