"use client";
import { useState, useEffect } from "react";
import { FaHeart, FaComment, FaShare, FaImage, FaVideo, FaFileAlt, FaHashtag, FaUserPlus, FaBookmark } from "react-icons/fa";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [userInterests, setUserInterests] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showingCommentFor, setShowingCommentFor] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    loadPosts();
    loadUserInterests();
    loadSavedPosts();
  }, []);

  const loadPosts = () => {
    const savedPosts = JSON.parse(localStorage.getItem("feed_posts") || "[]");
    setPosts(savedPosts);
  };

  const loadSavedPosts = () => {
    const saved = JSON.parse(localStorage.getItem("saved_posts") || "[]");
    setSavedPosts(saved);
  };

  const loadUserInterests = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u) => u.email === localStorage.getItem("user_email"));
    const interests = currentUser?.interests?.split(",").map((i) => i.trim().toLowerCase()) || [];
    setUserInterests(interests);
  };

  const toggleSavePost = (postId) => {
    let updated;
    if (savedPosts.includes(postId)) {
      updated = savedPosts.filter(id => id !== postId);
    } else {
      updated = [...savedPosts, postId];
    }
    setSavedPosts(updated);
    localStorage.setItem("saved_posts", JSON.stringify(updated));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    
    const currentUser = localStorage.getItem("user_name") || "Anonymous";
    const userType = localStorage.getItem("user_type") || "sharer";
    
    const post = {
      id: Date.now(),
      content: newPost,
      author: currentUser,
      userType: userType,
      type: postType,
      media: mediaUrl || null,
      likes: 0,
      comments: [],
      shares: 0,
      timestamp: new Date().toISOString(),
      likedBy: []
    };
    
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem("feed_posts", JSON.stringify(updated));
    setNewPost("");
    setMediaUrl("");
  };

  const handleLike = (postId) => {
    const currentUser = localStorage.getItem("user_email");
    const updated = posts.map(post => {
      if (post.id === postId) {
        if (post.likedBy?.includes(currentUser || "")) {
          return { ...post, likes: post.likes - 1, likedBy: post.likedBy.filter((u) => u !== currentUser) };
        } else {
          return { ...post, likes: post.likes + 1, likedBy: [...(post.likedBy || []), currentUser || ""] };
        }
      }
      return post;
    });
    setPosts(updated);
    localStorage.setItem("feed_posts", JSON.stringify(updated));
  };

  const handleComment = (postId) => {
    if (!commentText[postId]?.trim()) return;
    
    const updated = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: localStorage.getItem("user_name") || "Anonymous",
          text: commentText[postId],
          timestamp: new Date().toISOString()
        };
        return { ...post, comments: [...(post.comments || []), newComment] };
      }
      return post;
    });
    setPosts(updated);
    localStorage.setItem("feed_posts", JSON.stringify(updated));
    setCommentText({ ...commentText, [postId]: "" });
    setShowingCommentFor(null);
  };

  const getTrendingHashtags = () => {
    const allText = posts.map(p => p.content).join(" ");
    const hashtags = allText.match(/#\w+/g) || [];
    const counts = {};
    hashtags.forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  };

  return (
    <main>
      <div className="container mx-auto px-6 py-20">
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
              {postType !== "text" && <input type="text" placeholder="Media URL" className="w-full mt-3 p-2 border rounded dark:bg-gray-700 dark:border-gray-600" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />}
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author[0]}
                      </div>
                      <div>
                        <p className="font-bold dark:text-white">{post.author}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{post.userType} • {new Date(post.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleSavePost(post.id)} className="text-gray-400 hover:text-amber-500 transition">
                      <FaBookmark className={savedPosts.includes(post.id) ? "text-amber-500" : ""} />
                    </button>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 mb-4">{post.content}</p>
                  {post.media && (
                    post.type === "image" ? 
                      <img src={post.media} className="mb-4 rounded-xl max-h-96 object-cover" alt="post" /> : 
                      post.type === "video" ? 
                        <video src={post.media} controls className="mb-4 rounded-xl" /> : 
                        null
                  )}
                  <div className="flex gap-6 pt-4 border-t dark:border-gray-700">
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition">
                      <FaHeart className={post.likedBy?.includes(localStorage.getItem("user_email") || "") ? "text-red-500" : ""} /> {post.likes}
                    </button>
                    <button onClick={() => setShowingCommentFor(showingCommentFor === post.id ? null : post.id)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition">
                      <FaComment /> {post.comments?.length || 0}
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition">
                      <FaShare /> {post.shares || 0}
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
                      {post.comments?.map((comment) => (
                        <div key={comment.id} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <p className="font-semibold text-sm dark:text-white">{comment.author}</p>
                          <p className="text-sm dark:text-gray-300">{comment.text}</p>
                        </div>
                      ))}
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
              {getTrendingHashtags().map(([tag, count]) => (
                <div key={tag} className="mb-3 cursor-pointer hover:text-amber-500">
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
                <p className="text-xs text-gray-400 mt-2">
                  Tip: Add interests in your profile for personalized feed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}