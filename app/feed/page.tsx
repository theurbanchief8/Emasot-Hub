"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { FaHeart, FaComment, FaShare, FaImage, FaVideo, FaFileAlt, FaHashtag, FaUserPlus, FaBookmark, FaCrown } from "react-icons/fa";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<any>({});
  const [showingCommentFor, setShowingCommentFor] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadPosts();
    loadSavedPosts();
  }, []);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from("users").select("*").eq("email", session.user.email).single();
      setCurrentUser(data);
      if (data?.interests) setUserInterests(data.interests.map((i: string) => i.toLowerCase()));
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (data) {
      const userIds = [...new Set(data.map((p: any) => p.user_id))];
      const { data: users } = await supabase
        .from("users")
        .select("id, full_name, username, avatar_url, role")
        .in("id", userIds);
      
      const enriched = data.map((post: any) => ({
        ...post,
        user: users?.find((u: any) => u.id === post.user_id)
      }));
      setPosts(enriched);
    }
    setLoading(false);
  };

  const loadSavedPosts = () => {
    const saved = JSON.parse(localStorage.getItem("saved_posts") || "[]");
    setSavedPosts(saved);
  };

  const handlePost = async () => {
    if (!newPost.trim() || !currentUser) return;

    const { error } = await supabase.from("posts").insert([{
      user_id: currentUser.id,
      content: newPost,
      post_type: postType,
      media_url: mediaUrl || null,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0
    }]);

    if (error) {
      alert("Failed to post: " + error.message);
      return;
    }

    setNewPost("");
    setMediaUrl("");
    loadPosts();
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    await supabase.from("posts").update({ likes_count: (post.likes_count || 0) + 1 }).eq("id", postId);
    loadPosts();
  };

  const handleComment = async (postId: string) => {
    if (!commentText[postId]?.trim() || !currentUser) return;

    await supabase.from("comments").insert([{
      post_id: postId,
      user_id: currentUser.id,
      content: commentText[postId]
    }]);

    const post = posts.find(p => p.id === postId);
    await supabase.from("posts").update({ comments_count: (post?.comments_count || 0) + 1 }).eq("id", postId);

    setCommentText({ ...commentText, [postId]: "" });
    setShowingCommentFor(null);
    loadPosts();
  };

  const toggleSavePost = (postId: string) => {
    let updated;
    if (savedPosts.includes(postId)) {
      updated = savedPosts.filter(id => id !== postId);
    } else {
      updated = [...savedPosts, postId];
    }
    setSavedPosts(updated);
    localStorage.setItem("saved_posts", JSON.stringify(updated));
  };

  const getTrendingHashtags = () => {
    const allText = posts.map(p => p.content).join(" ");
    const hashtags = allText.match(/#\w+/g) || [];
    const counts: any = {};
    hashtags.forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; });
    return Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-6">Research Feed</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <textarea
                placeholder="Share your research ideas, questions, or discoveries... #innovation #research"
                className="w-full p-4 border rounded-xl resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <button className={`p-2 rounded ${postType === "text" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700"}`} onClick={() => setPostType("text")}><FaFileAlt /></button>
                  <button className={`p-2 rounded ${postType === "image" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700"}`} onClick={() => setPostType("image")}><FaImage /></button>
                  <button className={`p-2 rounded ${postType === "video" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700"}`} onClick={() => setPostType("video")}><FaVideo /></button>
                </div>
                <button onClick={handlePost} className="bg-gradient-to-r from-blue-900 to-amber-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition">Post</button>
              </div>
              {postType !== "text" && (
                <input
                  type="text"
                  placeholder="Media URL"
                  className="w-full mt-3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              )}
            </div>

            {loading ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
                <p className="text-gray-500">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <Link href={`/profile/${post.user_id}`} className="flex items-center gap-3">
                      {post.user?.avatar_url ? (
                        <img src={post.user.avatar_url} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {post.user?.full_name?.[0] || "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-bold dark:text-white flex items-center gap-2">
                          {post.user?.full_name || "Anonymous"}
                          {post.user?.role === "ceo" && <FaCrown className="text-yellow-500 text-sm" />}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{post.user?.username || "user"} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                    <button onClick={() => toggleSavePost(post.id)} className="text-gray-400 hover:text-amber-500 transition">
                      <FaBookmark className={savedPosts.includes(post.id) ? "text-amber-500" : ""} />
                    </button>
                  </div>

                  {post.post_type === "announcement" && (
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-3 py-1 rounded-full inline-block mb-3">
                      ANNOUNCEMENT
                    </div>
                  )}

                  <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {post.media_url && (
                    post.post_type === "image" ?
                      <img src={post.media_url} className="mb-4 rounded-xl max-h-96 object-cover" alt="post" /> :
                      post.post_type === "video" ?
                        <video src={post.media_url} controls className="mb-4 rounded-xl" /> :
                        null
                  )}

                  <div className="flex gap-6 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition">
                      <FaHeart /> {post.likes_count || 0}
                    </button>
                    <button onClick={() => setShowingCommentFor(showingCommentFor === post.id ? null : post.id)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition">
                      <FaComment /> {post.comments_count || 0}
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition">
                      <FaShare /> {post.shares_count || 0}
                    </button>
                  </div>

                  {showingCommentFor === post.id && (
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                          value={commentText[post.id] || ""}
                          onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
                        />
                        <button onClick={() => handleComment(post.id)} className="bg-amber-500 text-white px-4 py-2 rounded">Post</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 sticky top-24">
              <h3 className="font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2">
                <FaHashtag /> Trending Topics
              </h3>
              {getTrendingHashtags().map(([tag, count]: any) => (
                <div key={tag} className="mb-3">
                  <p className="font-semibold text-blue-800 dark:text-blue-300">{tag}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{count} posts</p>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <h3 className="font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUserPlus /> For You
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your interests: {userInterests.join(", ") || "None yet. Update your profile!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}