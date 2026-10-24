"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import Avatar from "../../components/Avatar/Avatar";
import { FaHeart, FaComment, FaEye, FaRetweet, FaCrown, FaPaperPlane, FaBookmark, FaImage, FaVideo, FaFileAlt, FaHashtag, FaUserPlus, FaTrash, FaShare } from "react-icons/fa";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

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

  const loadSavedPosts = () => {
    const saved = JSON.parse(localStorage.getItem("saved_posts") || "[]");
    setSavedPosts(saved);
  };

  const loadPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select(`
        *,
        original_post:repost_of (
          id, content, user_id
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      const postsWithCounts = await Promise.all(data.map(async (post: any) => {
        const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", post.id);
        return { ...post, comments_count: count || 0 };
      }));

      const userIds = [...new Set(postsWithCounts.map((p: any) => p.user_id))];
      const originalUserIds = postsWithCounts.filter((p: any) => p.original_post).map((p: any) => p.original_post.user_id);
      const allUserIds = [...new Set([...userIds, ...originalUserIds])];

      const { data: users } = await supabase.from("users").select("id, full_name, username, avatar_url, role").in("id", allUserIds);

      const enriched = postsWithCounts.map((post: any) => ({
        ...post,
        user: users?.find((u: any) => u.id === post.user_id),
        original_post: post.original_post ? { ...post.original_post, user: users?.find((u: any) => u.id === post.original_post.user_id) } : null
      }));

      const viewedPosts = JSON.parse(localStorage.getItem("viewed_posts") || "[]");
      const finalPosts = await Promise.all(enriched.map(async (post: any) => {
        if (!viewedPosts.includes(post.id)) {
          const newViews = (post.views || 0) + 1;
          await supabase.from("posts").update({ views: newViews }).eq("id", post.id);
          viewedPosts.push(post.id);
          return { ...post, views: newViews };
        }
        return post;
      }));
      localStorage.setItem("viewed_posts", JSON.stringify(viewedPosts));
      setPosts(finalPosts);
    }
    setLoading(false);
  };

  const handlePost = async () => {
    if (!newPost.trim() || !currentUser) return;
    await supabase.from("posts").insert([{
      user_id: currentUser.id, content: newPost, post_type: postType, media_url: mediaUrl || null, likes_count: 0, comments_count: 0, shares_count: 0
    }]);
    setNewPost(""); setMediaUrl(""); setPostType("text"); loadPosts();
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    await supabase.from("posts").update({ likes_count: (post.likes_count || 0) + 1 }).eq("id", postId);
    loadPosts();
  };

  const handleRepost = async (postId: string) => {
    if (!currentUser) return;
    if (!confirm("Repost this to your feed?")) return;
    await supabase.from("posts").insert([{
      user_id: currentUser.id, content: "Reposted this research.", post_type: "repost", repost_of: postId, likes_count: 0, comments_count: 0, shares_count: 0
    }]);
    loadPosts();
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase.from("comments").select("*").eq("post_id", postId).order("created_at");
    if (data) {
      const userIds = [...new Set(data.map((c: any) => c.user_id))];
      const { data: users } = await supabase.from("users").select("id, full_name, username").in("id", userIds);
      const enriched = data.map((c: any) => ({ ...c, user: users?.find((u: any) => u.id === c.user_id) }));
      setComments((prev) => ({ ...prev, [postId]: enriched }));
    }
  };

  const toggleComments = (postId: string) => {
    if (activeCommentId === postId) setActiveCommentId(null);
    else { setActiveCommentId(postId); loadComments(postId); }
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim() || !currentUser) return;
    const { error } = await supabase.from("comments").insert([{ post_id: postId, user_id: currentUser.id, content: text }]);
    if (error) { alert("Database error: " + error.message); return; }
    const post = posts.find(p => p.id === postId);
    const newCount = (post?.comments_count || 0) + 1;
    await supabase.from("posts").update({ comments_count: newCount }).eq("id", postId);
    setPosts(posts.map(p => p.id === postId ? { ...p, comments_count: newCount } : p));
    setCommentText({ ...commentText, [postId]: "" });
    await loadComments(postId);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await supabase.from("posts").delete().eq("id", postId);
    loadPosts();
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) { alert("Failed to delete: " + error.message); return; }
    const post = posts.find(p => p.id === postId);
    if (post && post.comments_count > 0) {
      const newCount = post.comments_count - 1;
      await supabase.from("posts").update({ comments_count: newCount }).eq("id", postId);
      setPosts(posts.map(p => p.id === postId ? { ...p, comments_count: newCount } : p));
    }
    loadComments(postId);
  };

  const toggleSavePost = (postId: string) => {
    let updated;
    if (savedPosts.includes(postId)) updated = savedPosts.filter(id => id !== postId);
    else updated = [...savedPosts, postId];
    setSavedPosts(updated);
    localStorage.setItem("saved_posts", JSON.stringify(updated));
  };

  const getTrendingHashtags = () => {
    const allText = posts.map(p => p.content).join(" ");
    const hashtags = allText.match(/#\w+/g) || [];
    const counts: any = {};
    hashtags.forEach(tag => { counts[tag] = (counts[tag] || 0) +1; });
    return Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className="mb-2">
        {line.split(/(@\w+)/g).map((part, j) =>
          part.startsWith("@") ? (
            <Link key={j} href={`/search?q=${part.substring(1)}`} className="text-amber-500 hover:underline font-semibold">{part}</Link>
          ) : (part)
        )}
      </p>
    ));
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-amber-500 mb-6">Research Feed</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <textarea placeholder="Share your research ideas, questions, or discoveries... Use @ to mention someone." className="w-full p-4 border rounded-xl resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} value={newPost} onChange={(e) => setNewPost(e.target.value)} />
              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <button className={`p-2 rounded ${postType ==="text" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700"}`} onClick={() => setPostType("text")}><FaFileAlt /></button>
                  <button className={`p-2 rounded ${postType ==="image" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700"}`} onClick={() => setPostType("image")}><FaImage /></button>
                  <button className={`p-2 rounded ${postType ==="video" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-700"}`} onClick={() => setPostType("video")}><FaVideo /></button>
                </div>
                <button onClick={handlePost} className="bg-amber-500 text-black font-bold px-6 py-2 rounded-full hover:bg-amber-400 transition">Post</button>
              </div>
              {postType !== "text" && (
                <input type="text" placeholder="Media URL" className="w-full mt-3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
              )}
            </div>

            {loading ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl"><p className="text-gray-500">Loading posts...</p></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl"><p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share!</p></div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <Link href={`/profile/${post.user_id}`} className="flex items-center gap-3">
                      <Avatar name={post.user?.full_name || "User"} src={post.user?.avatar_url} size="md" />
                      <div>
                        <p className="font-bold dark:text-white flex items-center gap-2">
                          {post.user?.full_name || "Anonymous"}
                          {post.user?.role === "ceo" && <FaCrown className="text-yellow-500 text-sm" />}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{post.user?.username || "user"} • {new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </Link>
                    <div className="flex gap-3">
                      {currentUser?.id === post.user_id && (
                        <button onClick={() => handleDeletePost(post.id)} className="text-gray-400 hover:text-red-500 transition"><FaTrash /></button>
                      )}
                      <button onClick={() => toggleSavePost(post.id)} className="text-gray-400 hover:text-amber-500 transition">
                        <FaBookmark className={savedPosts.includes(post.id) ? "text-amber-500" : ""} />
                      </button>
                    </div>
                  </div>

                  {post.post_type === "repost" && <p className="text-xs text-green-500 font-semibold mb-2 flex items-center gap-1"><FaRetweet /> Reposted</p>}
                  {post.post_type === "announcement" && <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs px-3 py-1 rounded-full inline-block mb-3">ANNOUNCEMENT</div>}

                  <div className="text-gray-800 dark:text-gray-200 mb-4">{formatContent(post.content)}</div>

                  {post.original_post && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-700/50">
                      <p className="font-bold dark:text-white text-sm">@{post.original_post.user?.username || "user"}</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{post.original_post.content}</p>
                    </div>
                  )}

                  {post.media_url && (
                    post.post_type === "image" ? <img src={post.media_url} className="mb-4 rounded-xl max-h-96 object-cover" alt="post" /> :
                    post.post_type === "video" ? <video src={post.media_url} controls className="mb-4 rounded-xl" /> : null
                  )}

                  <div className="flex justify-between text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 hover:text-red-500 transition"><FaHeart /> {post.likes_count || 0}</button>
                    <button onClick={() => toggleComments(post.id)} className="flex items-center gap-2 hover:text-blue-500 transition"><FaComment /> {post.comments_count || 0}</button>
                    <button onClick={() => handleRepost(post.id)} className="flex items-center gap-2 hover:text-green-500 transition"><FaRetweet /> Repost</button>
                    <div className="flex items-center gap-2 text-xs"><FaEye /> {post.views || 0}</div>
                  </div>

                  {activeCommentId === post.id && (
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <div className="space-y-3 mb-4">
                        {comments[post.id]?.length === 0 ? (
                          <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
                        ) : (
                          comments[post.id]?.map((comment: any) => (
                            <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-start">
                              <div>
                                <p className="text-xs font-bold dark:text-white">@{comment.user?.username || "user"}</p>
                                <p className="text-sm dark:text-gray-300">{comment.content}</p>
                              </div>
                              {currentUser?.id === comment.user_id && (
                                <button onClick={() => handleDeleteComment(comment.id, post.id)} className="text-gray-400 hover:text-red-500 ml-2 mt-1"><FaTrash size={14} /></button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Write a comment..." className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={commentText[post.id] || ""} onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})} onKeyPress={(e) => e.key === "Enter" && handleComment(post.id)} />
                        <button onClick={() => handleComment(post.id)} className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition"><FaPaperPlane /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 sticky top-24 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2"><FaHashtag /> Trending Topics</h3>
              {getTrendingHashtags().map(([tag, count]: any) => (
                <div key={tag} className="mb-3">
                  <p className="font-semibold text-blue-800 dark:text-blue-300">{tag}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{count} posts</p>
                </div>
              ))}
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <h3 className="font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2"><FaUserPlus /> For You</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Based on your interests: {userInterests.join(", ") || "None yet. Update your profile!"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}