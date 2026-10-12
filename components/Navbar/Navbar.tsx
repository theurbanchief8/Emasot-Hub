"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaHome, FaSearch, FaUser, FaSignInAlt, FaUpload, FaEnvelope, 
  FaTwitter, FaTrophy, FaBriefcase, FaShoppingCart, FaGlobe, 
  FaMoon, FaSun, FaBell, FaCrown, FaUserCircle, FaBars, FaTimes
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCEO, setIsCEO] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    checkUser();
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single();
        if (data) {
          setUser(data);
          setIsCEO(data.role === "ceo" || data.email === "emanumukite@gmail.com");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setNotifications(data || []);
    } catch (error) {
      console.error("Notifications error:", error);
    }
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-white/95 dark:bg-gray-900 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="https://i.ibb.co/XZyZL35r/Whats-App-Image-2026-10-12-at-01-25-06.jpg" alt="EmasotHub" className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover" />
            <span className="text-lg md:text-2xl font-bold text-blue-900 dark:text-white">
              <span className="hidden sm:inline">Emasot</span><span className="text-amber-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Home</Link>
            <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Explore</Link>
            <Link href="/search" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Search</Link>
            <Link href="/feed" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Feed</Link>
            <Link href="/emasot-bot" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Tools</Link>
            <Link href="/research-market" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Market</Link>
            <Link href="/challenges" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Challenges</Link>
            <Link href="/leaderboard" className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition">Leaderboard</Link>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition p-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-700 dark:text-gray-300 hover:text-amber-500 transition p-2 relative"
                aria-label="Notifications"
              >
                <FaBell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold dark:text-white">Notifications</p>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-3 border-b border-gray-100 dark:border-gray-700 ${!n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}>
                        <p className="text-sm dark:text-gray-200">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-500 transition p-1"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle size={28} className="text-amber-500" />
                  )}
                  <span className="hidden lg:inline text-sm font-medium">{user.full_name || user.username}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold dark:text-white">{user.full_name || "User"}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                    <div className="py-2">
                      <Link href={`/profile/${user.id}`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setShowProfileMenu(false)}>
                        <FaUser /> My Profile
                      </Link>
                      <Link href="/upload" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setShowProfileMenu(false)}>
                        <FaUpload /> Publish
                      </Link>
                      <Link href="/messages" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setShowProfileMenu(false)}>
                        <FaEnvelope /> Messages
                      </Link>
                      {isCEO && (
                        <Link href="/ceo" className="flex items-center gap-3 px-4 py-3 text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setShowProfileMenu(false)}>
                          <FaCrown /> CEO Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                        <FaSignInAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-gradient-to-r from-blue-900 to-amber-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition">
                Join Free
              </Link>
            )}
          </div>

          {/* Mobile: Icons + Hamburger */}
          <div className="flex md:hidden items-center gap-1">
            {/* Dark mode - BIG tap target */}
            <button
              onClick={toggleDarkMode}
              className="p-3 text-gray-700 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800 rounded-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {/* Notifications - BIG tap target */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 text-gray-700 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800 rounded-lg relative"
              aria-label="Notifications"
            >
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-3 text-gray-700 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800 rounded-lg"
              aria-label="Menu"
            >
              {showMobileMenu ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {showMobileMenu && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle size={40} className="text-amber-500" />
                  )}
                  <div>
                    <p className="font-semibold dark:text-white">{user.full_name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <Link href={`/profile/${user.id}`} className="block py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMobileMenu(false)}>My Profile</Link>
                <Link href="/upload" className="block py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMobileMenu(false)}>Publish Research</Link>
                <Link href="/messages" className="block py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMobileMenu(false)}>Messages</Link>
                <Link href="/feed" className="block py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMobileMenu(false)}>Feed</Link>
                <Link href="/challenges" className="block py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMobileMenu(false)}>Challenges</Link>
                <Link href="/leaderboard" className="block py-3 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMobileMenu(false)}>Leaderboard</Link>
                {isCEO && (
                  <Link href="/ceo" className="block py-3 px-3 text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={() => setShowMobileMenu(false)}>👑 CEO Dashboard</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left py-3 px-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/" className="block py-3 px-3 text-gray-700 dark:text-gray-300 rounded-lg" onClick={() => setShowMobileMenu(false)}>Home</Link>
                <Link href="/explore" className="block py-3 px-3 text-gray-700 dark:text-gray-300 rounded-lg" onClick={() => setShowMobileMenu(false)}>Explore</Link>
                <Link href="/feed" className="block py-3 px-3 text-gray-700 dark:text-gray-300 rounded-lg" onClick={() => setShowMobileMenu(false)}>Feed</Link>
                <Link href="/research-market" className="block py-3 px-3 text-gray-700 dark:text-gray-300 rounded-lg" onClick={() => setShowMobileMenu(false)}>Market</Link>
                <Link href="/challenges" className="block py-3 px-3 text-gray-700 dark:text-gray-300 rounded-lg" onClick={() => setShowMobileMenu(false)}>Challenges</Link>
                <Link href="/leaderboard" className="block py-3 px-3 text-gray-700 dark:text-gray-300 rounded-lg" onClick={() => setShowMobileMenu(false)}>Leaderboard</Link>
                <Link href="/login" className="block py-3 px-3 bg-gradient-to-r from-blue-900 to-amber-500 text-white rounded-lg text-center font-semibold" onClick={() => setShowMobileMenu(false)}>
                  Join Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}