"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaEnvelope, FaFilePdf, FaDownload, FaEdit, FaSignOutAlt, 
  FaHeart, FaCheckCircle, FaUsers, FaVideo, FaChartLine, 
  FaTags, FaUserFriends, FaEye, FaCalendarAlt, FaMapMarkerAlt,
  FaTwitter, FaLinkedin, FaGithub, FaGlobe, FaTrophy, FaAward,
  FaRegClock, FaBookOpen, FaComments, FaShareAlt, FaThumbsUp
} from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [collaborationStatus, setCollaborationStatus] = useState("open");
  const [activeTab, setActiveTab] = useState("research");
  const [followers, setFollowers] = useState(0);
  const [profileViews, setProfileViews] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user_logged_in");
    if (!isLoggedIn) { router.push("/login"); return; }

    const email = localStorage.getItem("user_email");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find((u: any) => u.email === email);
    setUser(currentUser);
    setEditForm(currentUser || {});
    setCollaborationStatus(currentUser?.collaborationStatus || "open");

    const allProjects = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    const myProjects = allProjects.filter((p: any) => p.author_name === currentUser?.name);
    setProjects(myProjects);

    const allPosts = JSON.parse(localStorage.getItem("feed_posts") || "[]");
    const myPosts = allPosts.filter((p: any) => p.author === currentUser?.name);
    setPosts(myPosts);

    // Mock stats
    setFollowers(Math.floor(Math.random() * 500) + 50);
    setProfileViews(Math.floor(Math.random() * 2000) + 500);
  }, [router]);

  const handleSaveEdit = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = users.map((u: any) => u.email === user.email ? { ...u, ...editForm, collaborationStatus } : u);
    localStorage.setItem("users", JSON.stringify(updated));
    setUser({ ...user, ...editForm, collaborationStatus });
    localStorage.setItem("user_name", editForm.name);
    setIsEditing(false);
    alert("Profile updated!");
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.push({ 
      id: Date.now(), 
      from: localStorage.getItem("user_email"), 
      to: user.email, 
      content: messageText, 
      subject: "New Message", 
      read: false, 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem("messages", JSON.stringify(messages));
    setMessageText("");
    alert("Message sent!");
  };

  if (!user) return null;

  const skills = ["Research", "Data Analysis", "Academic Writing", "Public Speaking", "Problem Solving"];
  const achievements = [
    { icon: "??", title: "Top Researcher", desc: "Top 10% in Kenya" },
    { icon: "??", title: "Prolific Author", desc: "5+ publications" },
    { icon: "??", title: "Innovation Star", desc: "Featured research" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-900 to-amber-500">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
        
        {/* Edit Cover Button */}
        <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm transition">
          <FaEdit className="inline mr-2" /> Edit Cover
        </button>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl -mt-20 relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-900 to-amber-500 rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                {user.name?.[0] || "U"}
              </div>
              <button className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:scale-110 transition">
                <FaEdit className="text-blue-900 dark:text-white text-sm" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
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
                      <button onClick={() => { localStorage.clear(); router.push("/"); }} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2">
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition">Save Changes</button>
                      <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition">Cancel</button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Row - Updated for dark mode */}
              <div className="flex flex-wrap gap-6 mt-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaUserFriends className="text-amber-500" />
                  <span className="font-semibold dark:text-white">{followers}</span> followers
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaEye className="text-amber-500" />
                  <span className="font-semibold dark:text-white">{profileViews}</span> profile views
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaBookOpen className="text-amber-500" />
                  <span className="font-semibold dark:text-white">{projects.length}</span> publications
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FaHeart className="text-amber-500" />
                  <span className="font-semibold dark:text-white">{posts.reduce((sum, p) => sum + (p.likes || 0), 0)}</span> total likes
                </div>
              </div>

              {/* Bio and Collaboration Status */}
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
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{user.bio || "No bio added yet. Click Edit Profile to add your research interests."}</p>
                ) : (
                  <div className="space-y-3 mt-3">
                    <textarea value={editForm.bio || ""} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} placeholder="Tell others about your research interests..." />
                    <div className="grid md:grid-cols-2 gap-3">
                      <input type="text" value={editForm.name || ""} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Full Name" />
                      <input type="text" value={editForm.institution || ""} onChange={(e) => setEditForm({...editForm, institution: e.target.value})} className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Institution" />
                      <select value={collaborationStatus} onChange={(e) => setCollaborationStatus(e.target.value)} className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="open">Open to Collaborate</option>
                        <option value="busy">Busy - Not Accepting</option>
                      </select>
                      <input type="text" placeholder="Research Interests (comma separated)" className="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
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

        {/* Main Content Tabs */}
        <div className="mt-8">
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => setActiveTab("research")} className={`px-6 py-3 font-semibold transition ${activeTab === "research" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              ?? Research
            </button>
            <button onClick={() => setActiveTab("posts")} className={`px-6 py-3 font-semibold transition ${activeTab === "posts" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              ?? Activity Feed
            </button>
            <button onClick={() => setActiveTab("achievements")} className={`px-6 py-3 font-semibold transition ${activeTab === "achievements" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              ?? Achievements
            </button>
          </div>

          <div className="mt-6">
            {/* Research Tab */}
            {activeTab === "research" && (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center col-span-2">
                    <FaFilePdf className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No research published yet.</p>
                    <button onClick={() => router.push("/upload")} className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition">
                      Publish Your First Research
                    </button>
                  </div>
                ) : (
                  projects.map((project: any) => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition group">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-blue-900 dark:text-white group-hover:text-amber-500 transition">{project.title}</h3>
                        <span className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1"><FaCheckCircle /> Solved</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{project.category}</p>
                      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1"><FaDownload /> {project.downloads || 0} downloads</span>
                        <span className="flex items-center gap-1">?? KES {project.earnings || 0}</span>
                        {project.aiScore && <span className="flex items-center gap-1">?? {project.aiScore}% AI</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                    <FaComments className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
                    <button onClick={() => router.push("/feed")} className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition">
                      Start Sharing Ideas
                    </button>
                  </div>
                ) : (
                  posts.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                      <p className="text-gray-800 dark:text-gray-200 mb-3">{post.content}</p>
                      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><FaHeart /> {post.likes} likes</span>
                        <span className="flex items-center gap-1"><FaComment /> {post.comments?.length || 0} comments</span>
                        <span className="flex items-center gap-1"><FaRegClock /> {new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="grid md:grid-cols-3 gap-6">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 text-center hover:scale-105 transition shadow-lg">
                    <div className="text-5xl mb-3">{achievement.icon}</div>
                    <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4 flex items-center gap-2">
            <FaEnvelope className="text-amber-500" /> Contact Researcher
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <textarea 
              rows={4} 
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-amber-500 transition dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              placeholder="Message about collaboration, investment, or job opportunity..." 
              value={messageText} 
              onChange={(e) => setMessageText(e.target.value)} 
            />
            <div className="space-y-3">
              <button onClick={sendMessage} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                <FaEnvelope /> Send Message
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your message will be sent directly to {user.name}'s inbox
              </p>
            </div>
          </div>
        </div>

        {/* Stats Visualization - Updated for dark mode with better contrast */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-xl p-4 text-center text-white">
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-sm opacity-80">Publications</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-xl p-4 text-center text-white">
            <p className="text-2xl font-bold">{followers}</p>
            <p className="text-sm opacity-80">Followers</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl p-4 text-center text-white">
            <p className="text-2xl font-bold">{profileViews}</p>
            <p className="text-sm opacity-80">Profile Views</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl p-4 text-center text-white">
            <p className="text-2xl font-bold">{Math.floor(projects.reduce((sum, p) => sum + (p.downloads || 0), 0) / 10) || 0}%</p>
            <p className="text-sm opacity-80">Impact Score</p>
          </div>
        </div>
      </div>
    </main>
  );
}

