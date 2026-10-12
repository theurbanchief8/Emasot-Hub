"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { 
  FaEnvelope, FaFilePdf, FaDownload, FaEdit, FaSignOutAlt, 
  FaHeart, FaCheckCircle, FaUsers, FaVideo, FaChartLine, 
  FaTags, FaUserFriends, FaEye, FaBookOpen, FaComments,
  FaRegClock, FaCamera, FaSave, FaTwitter, FaLinkedin, 
  FaGithub, FaGlobe
} from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [collaborationStatus, setCollaborationStatus] = useState("open");
  const [activeTab, setActiveTab] = useState("research");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();
      
      if (error) {
        console.error("User error:", error);
        router.push("/login");
        return;
      }

      setUser(userData);
      setEditForm(userData || {});
      setCollaborationStatus(userData?.collaboration_status || "open");

      // Get projects
      const { data: projectsData } = await supabase
        .from("research_projects")
        .select("*")
        .eq("user_id", userData.id);
      setProjects(projectsData || []);

      // Get posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });
      setPosts(postsData || []);

      // Get followers
      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userData.id);
      setFollowers(followersCount || 0);

      // Get following
      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userData.id);
      setFollowing(followingCount || 0);

      setProfileViews(Math.floor(Math.random() * 2000) + 500);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUser({ ...user, avatar_url: publicUrl });
      alert("Profile picture updated!");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: editForm.full_name,
          username: editForm.username,
          bio: editForm.bio,
          institution: editForm.institution,
          collaboration_status: collaborationStatus,
          interests: Array.isArray(editForm.interests) ? editForm.interests : typeof editForm.interests === "string" ? editForm.interests.split(",").map((i: string) => i.trim()).filter(Boolean) : []
        })
        .eq("id", user.id);

      if (error) throw error;

      setUser({ ...user, ...editForm, collaboration_status: collaborationStatus });
      setIsEditing(false);
      alert("Profile updated!");
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: sender } = await supabase
      .from("users")
      .select("id, full_name")
      .eq("email", session.user.email)
      .single();

    await supabase.from("notifications").insert([{
      user_id: user.id,
      sender_id: sender?.id,
      type: "message",
      message: messageText,
      read: false,
      link: `/messages`
    }]);

    setMessageText("");
    alert("Message sent!");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="text-2xl dark:text-white">Loading profile...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-900 to-amber-500">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl -mt-20 relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar with Upload */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-900 to-amber-500 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-lg overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.full_name?.[0] || user.username?.[0] || "U"
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:scale-110 transition"
              >
                <FaCamera className="text-blue-900 dark:text-white text-sm" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center text-white text-sm">
                  Uploading...
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {user.full_name || user.username || "User"}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                      {user.role || "Researcher"}
                    </span>
                    at {user.institution || "University"}
                  </p>
                </div>
                <div className="flex gap-3">
                  {!isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2">
                        <FaEdit /> Edit Profile
                      </button>
                      <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2">
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleSaveEdit} disabled={saving} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center gap-2">
                        <FaSave /> {saving ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 mt-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaUserFriends className="text-amber-500" />
                  <span className="font-semibold dark:text-white">{followers}</span> followers
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaUserFriends className="text-amber-500" />
                  <span className="font-semibold dark:text-white">{following}</span> following
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaBookOpen className="text-amber-500" />
                  <span className="font-semibold dark:text-white">{projects.length}</span> publications
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${collaborationStatus === "open" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"}`}>
                    <FaUsers /> {collaborationStatus === "open" ? "Open to Collaborate" : "Currently Busy"}
                  </span>
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <FaCheckCircle /> {projects.length} Problems Solved
                  </span>
                </div>
                
                {!isEditing ? (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {user.bio || "No bio added yet. Click Edit Profile to add your research interests."}
                  </p>
                ) : (
                  <div className="space-y-3 mt-3">
                    <input type="text" value={editForm.full_name || ""} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Full Name" />
                    <input type="text" value={editForm.username || ""} onChange={(e) => setEditForm({...editForm, username: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Username" />
                    <textarea value={editForm.bio || ""} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} placeholder="Bio..." />
                    <input type="text" value={editForm.institution || ""} onChange={(e) => setEditForm({...editForm, institution: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Institution" />
                    <select value={collaborationStatus} onChange={(e) => setCollaborationStatus(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="open">Open to Collaborate</option>
                      <option value="busy">Busy - Not Accepting</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"><FaTwitter size={20} /></button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-blue-700 transition"><FaLinkedin size={20} /></button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"><FaGithub size={20} /></button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-green-600 transition"><FaGlobe size={20} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => setActiveTab("research")} className={`px-6 py-3 font-semibold transition ${activeTab === "research" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-500 dark:text-gray-400"}`}>📄 Research</button>
            <button onClick={() => setActiveTab("posts")} className={`px-6 py-3 font-semibold transition ${activeTab === "posts" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-500 dark:text-gray-400"}`}>💬 Activity</button>
          </div>

          <div className="mt-6">
            {activeTab === "research" && (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center col-span-2">
                    <FaFilePdf className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No research published yet.</p>
                    <button onClick={() => router.push("/upload")} className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg">Publish Research</button>
                  </div>
                ) : (
                  projects.map((project: any) => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-blue-900 dark:text-white">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{project.category}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-2">
                        <span>📥 {project.downloads_count || 0} downloads</span>
                        <span>💰 KES {project.earnings || 0}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                    <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
                  </div>
                ) : (
                  posts.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>❤️ {post.likes_count} likes</span>
                        <span>💬 {post.comments_count} comments</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2">
            <FaEnvelope className="text-amber-500" /> Contact
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <textarea rows={4} className="w-full p-4 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Send a message..." value={messageText} onChange={(e) => setMessageText(e.target.value)} />
            <button onClick={sendMessage} className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold h-fit">
              <FaEnvelope className="inline mr-2" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}