"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";
import { FaUserPlus, FaUserMinus, FaCrown, FaEdit, FaTrash } from "react-icons/fa";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { 
    if (userId) loadUserProfile(); 
  }, [userId]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let me = null;
      if (session) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single();
        me = data;
        setCurrentUser(me);
        setIsCEO(me?.role === "ceo");
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (userError || !userData) {
        setError("User not found");
        setLoading(false);
        return;
      }

      setUser(userData);
      setIsCurrentUser(me?.id === userData.id);

      const { data: projectsData } = await supabase
        .from("research_projects")
        .select("*")
        .eq("user_id", userData.id);
      setProjects(projectsData || []);

      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });
      setPosts(postsData || []);

      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userData.id);
      setFollowers(followersCount || 0);

      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userData.id);
      setFollowing(followingCount || 0);

      if (me && me.id !== userData.id) {
        const { data: followData } = await supabase
          .from("follows")
          .select("*")
          .eq("follower_id", me.id)
          .eq("following_id", userData.id);
        setIsFollowing((followData?.length || 0) > 0);
      }
    } catch (err: any) {
      setError("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", currentUser.id).eq("following_id", user.id);
      setFollowers(followers - 1);
      setIsFollowing(false);
    } else {
      await supabase.from("follows").insert([{ follower_id: currentUser.id, following_id: user.id }]);
      setFollowers(followers + 1);
      setIsFollowing(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!isCEO || isCurrentUser) return;
    if (!confirm(`Delete ${user.full_name}?`)) return;
    await supabase.from("users").delete().eq("id", user.id);
    alert("User deleted");
    router.push("/");
  };

  const handleMakeCEO = async () => {
    if (!isCEO) return;
    await supabase.from("users").update({ role: "ceo" }).eq("id", user.id);
    alert(`${user.full_name} is now CEO`);
    loadUserProfile();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="dark:text-white">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold dark:text-white">User not found</h1>
        <Link href="/" className="text-amber-500 mt-4 inline-block">Go Home</Link>
      </div>
    );
  }

  // Determine what to show under the name
  const subtitleParts = [];
  if (user.username) subtitleParts.push(`@${user.username}`);
  if (user.role === "ceo") subtitleParts.push("Founder & CEO of EmasotHub");
  else if (user.institution) subtitleParts.push(user.institution);
  else if (user.role) subtitleParts.push(user.role.charAt(0).toUpperCase() + user.role.slice(1));

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className={`relative h-64 md:h-80 ${user.role === "ceo" ? "bg-gradient-to-r from-yellow-500 to-amber-600" : "bg-gradient-to-r from-blue-900 to-amber-500"}`}>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        {isCEO && !isCurrentUser && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-2xl p-4 -mt-10 relative z-20 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FaCrown className="text-yellow-500" />
              <p className="font-bold text-yellow-700 dark:text-yellow-400">CEO Admin Controls</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleMakeCEO} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-yellow-600">
                <FaCrown size={12} /> Make CEO
              </button>
              <Link href={`/profile/${user.id}/edit`} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-600">
                <FaEdit size={12} /> Edit User
              </Link>
              <button onClick={handleDeleteUser} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-red-600">
                <FaTrash size={12} /> Delete
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl -mt-20 relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-900 to-amber-500 rounded-2xl flex items-center justify-center text-5xl font-bold text-white overflow-hidden shadow-lg">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.full_name?.[0] || user.username?.[0] || "U"
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                      {user.full_name || user.username || "User"}
                    </h1>
                    {user.role === "ceo" && (
                      <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <FaCrown size={12} /> CEO
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {subtitleParts.join(" • ")}
                  </p>
                </div>
                {!isCurrentUser && currentUser && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                      isFollowing 
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" 
                        : "bg-gradient-to-r from-blue-900 to-amber-500 text-white"
                    }`}
                  >
                    {isFollowing ? <FaUserMinus /> : <FaUserPlus />}
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-6 mt-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="dark:text-white">{followers}</strong> followers
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="dark:text-white">{following}</strong> following
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="dark:text-white">{projects.length}</strong> publications
                </span>
              </div>

              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {user.bio || "No bio yet."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Research</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">No research yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p: any) => (
                <div key={p.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-blue-900 dark:text-white">{p.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            posts.slice(0, 5).map((p: any) => (
              <div key={p.id} className="border-b border-gray-200 dark:border-gray-700 py-3">
                <p className="text-gray-800 dark:text-gray-200">{p.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}