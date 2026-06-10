"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaEnvelope, FaFilePdf, FaDownload, FaEdit, FaSignOutAlt, FaHeart, FaCheckCircle, FaUsers, FaVideo, FaChartLine, FaTags } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [projects, setProjects] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [collaborationStatus, setCollaborationStatus] = useState("open");

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
    messages.push({ id: Date.now(), from: localStorage.getItem("user_email"), to: user.email, content: messageText, subject: "Message", read: false, timestamp: new Date().toISOString() });
    localStorage.setItem("messages", JSON.stringify(messages));
    setMessageText("");
    alert("Message sent!");
  };

  if (!user) return null;

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center text-3xl font-bold mb-4">{user.name?.[0] || "U"}</div>
              {!isEditing ? (
                <>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-blue-200 mt-1">{user.role} at {user.institution}</p>
                  <div className="flex gap-3 mt-3">
                    <span className="bg-green-500 px-3 py-1 rounded-full text-xs flex items-center gap-1"><FaCheckCircle /> {projects.length} Problems Solved</span>
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${collaborationStatus === "open" ? "bg-green-500" : "bg-yellow-500"}`}><FaUsers /> {collaborationStatus === "open" ? "Open to Collaborate" : "Busy"}</span>
                  </div>
                  <p className="text-sm text-blue-200 mt-4 max-w-2xl">{user.bio}</p>
                </>
              ) : (
                <div className="space-y-3">
                  <input type="text" value={editForm.name || ""} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="p-2 rounded text-black w-full" />
                  <textarea value={editForm.bio || ""} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="p-2 rounded text-black w-full" rows={3} />
                  <select value={collaborationStatus} onChange={(e) => setCollaborationStatus(e.target.value)} className="p-2 rounded text-black w-full">
                    <option value="open">Open to Collaborate</option>
                    <option value="busy">Busy - Not Accepting</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {!isEditing ? <><button onClick={() => setIsEditing(true)} className="bg-amber-500 text-white px-4 py-2 rounded-lg"><FaEdit /> Edit</button><button onClick={() => { localStorage.clear(); router.push("/"); }} className="bg-red-500 text-white px-4 py-2 rounded-lg"><FaSignOutAlt /> Logout</button></> : <><button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded-lg">Save</button><button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button></>}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6"><h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2"><FaTags /> Research Portfolio</h2>{projects.map((p: any) => (<div key={p.id} className="border-b py-3"><h3 className="font-bold">{p.title}</h3><span className="text-xs text-green-600">✓ Problem Solved</span></div>))}</div>
          <div className="bg-white rounded-2xl shadow-lg p-6"><h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2"><FaEnvelope /> Contact Researcher</h2><textarea rows={4} className="w-full p-3 border rounded-lg mb-3" placeholder="Message about collaboration, investment, or job opportunity..." value={messageText} onChange={(e) => setMessageText(e.target.value)} /><button onClick={sendMessage} className="bg-amber-500 text-white w-full py-3 rounded-lg">Send Message</button></div>
        </div>
      </div>
      <Footer />
    </main>
  );
}