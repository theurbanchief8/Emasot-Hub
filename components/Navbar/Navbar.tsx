"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaGlobe, FaMoon, FaSun, FaBell } from "react-icons/fa";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
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
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-900 dark:text-white flex items-center gap-2">
            <FaGlobe className="text-amber-500" />
            Emasot<span className="text-amber-500">Hub</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Home</Link>
            <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Explore</Link>
            <Link href="/feed" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Feed</Link>
            <Link href="/research-market" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Market</Link>
            <Link href="/challenges" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Challenges</Link>
            <Link href="/leaderboard" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Leaderboard</Link>
            <Link href="/messages" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Messages</Link>
            <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 text-sm">Profile</Link>
            
            <button onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300 hover:text-amber-500">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-700 dark:text-gray-300 hover:text-amber-500 relative">
              <FaBell />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
