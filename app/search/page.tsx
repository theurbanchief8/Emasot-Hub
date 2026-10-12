"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { FaSearch, FaUserCircle, FaUserPlus, FaUserMinus, FaCrown } from "react-icons/fa";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();
      setCurrentUser(data);
      if (data) {
        const { data: follows } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", data.id);
        setFollowedUsers(follows?.map((f: any) => f.following_id) || []);
      }
    }
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("*")
      .or(`full_name.ilike.%${value}%,username.ilike.%${value}%,institution.ilike.%${value}%`)
      .limit(20);
    setResults(data || []);
    setLoading(false);
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) return;
    if (followedUsers.includes(userId)) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUser.id)
        .eq("following_id", userId);
      setFollowedUsers(followedUsers.filter(id => id !== userId));
    } else {
      await supabase
        .from("follows")
        .insert([{ follower_id: currentUser.id, following_id: userId }]);
      setFollowedUsers([...followedUsers, userId]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 dark:text-white mb-8">
          Search EmasotHub
        </h1>

        <div className="relative mb-8">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search researchers, institutions, usernames..."
            className="w-full p-4 pl-12 border rounded-2xl shadow-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white text-lg"
            autoFocus
          />
        </div>

        {loading && (
          <p className="text-center text-gray-500">Searching...</p>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-center text-gray-500">No users found for "{query}"</p>
        )}

        {!loading && !query && (
          <div className="text-center text-gray-500">
            <p>Start typing to search for researchers on EmasotHub</p>
          </div>
        )}

        <div className="space-y-3">
          {results.map((user) => (
            <div key={user.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex items-center gap-4">
              <Link href={`/profile/${user.id}`} className="flex-shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <FaUserCircle size={56} className="text-amber-500" />
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${user.id}`} className="flex items-center gap-2">
                  <p className="font-bold dark:text-white truncate">{user.full_name || user.username}</p>
                  {user.role === "ceo" && <FaCrown className="text-yellow-500 text-sm" />}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                {user.institution && <p className="text-xs text-gray-400 truncate">{user.institution}</p>}
              </div>
              {currentUser && currentUser.id !== user.id && (
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 flex-shrink-0 ${
                    followedUsers.includes(user.id)
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      : "bg-gradient-to-r from-blue-900 to-amber-500 text-white"
                  }`}
                >
                  {followedUsers.includes(user.id) ? <FaUserMinus /> : <FaUserPlus />}
                  <span className="hidden sm:inline">{followedUsers.includes(user.id) ? "Unfollow" : "Follow"}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
