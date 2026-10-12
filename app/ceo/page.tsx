"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaUsers, FaChartLine, FaFileAlt, FaBell, FaThumbtack, FaTrash, FaDownload, FaEye, FaEdit, FaRedo, FaSave, FaTimes } from "react-icons/fa";

export default function CEODashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, totalResearch: 0, totalDownloads: 0, activeUsers: 0 });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [isCEO, setIsCEO] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    const { data } = await supabase.from("users").select("*").eq("email", session.user.email).single();
    setUser(data);

    if (data?.role === "ceo" || data?.email === "emanumukite@gmail.com") {
      setIsCEO(true);
      loadStats();
      loadAnnouncements();
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const { count: users } = await supabase.from("users").select("*", { count: "exact", head: true });
    const { count: posts } = await supabase.from("posts").select("*", { count: "exact", head: true });
    const { count: research } = await supabase.from("research_projects").select("*", { count: "exact", head: true });
    setStats({ totalUsers: users || 0, totalPosts: posts || 0, totalResearch: research || 0, totalDownloads: 0, activeUsers: Math.floor((users || 0) * 0.7) });
  };

  const loadAnnouncements = async () => {
    const { data, error } = await supabase
      .from("ceo_announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Load error:", error);
    setAnnouncements(data || []);
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert("Please fill title and content");
      return;
    }
    setPosting(true);

    // 1. Create the announcement
    const { data: ann, error: annError } = await supabase
      .from("ceo_announcements")
      .insert([{
        user_id: user.id,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        pinned: false,
        views: 0
      }])
      .select()
      .single();

    if (annError) {
      alert("Error: " + annError.message);
      setPosting(false);
      return;
    }

    // 2. Auto-post to feed
    const { error: postError } = await supabase.from("posts").insert([{
      user_id: user.id,
      content: `📢 ANNOUNCEMENT: ${newAnnouncement.title}\n\n${newAnnouncement.content}\n\n— Emmanuel, CEO`,
      post_type: "announcement",
      likes_count: 0,
      comments_count: 0,
      shares_count: 0
    }]);

    if (postError) {
      console.error("Post error:", postError);
      alert("Announcement created but couldn't post to feed: " + postError.message);
    } else {
      alert("Announcement published to your feed!");
    }

    setNewAnnouncement({ title: "", content: "" });
    await loadAnnouncements();
    await loadStats();
    setPosting(false);
  };

  const startEdit = (ann: any) => {
    setEditingId(ann.id);
    setEditForm({ title: ann.title, content: ann.content });
  };

  const saveEdit = async () => {
    if (!editingId) return;

    // 1. Update announcement
    const { error } = await supabase
      .from("ceo_announcements")
      .update({ title: editForm.title, content: editForm.content })
      .eq("id", editingId);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    // 2. Also update the corresponding feed post
    const postContent = `📢 ANNOUNCEMENT: ${editForm.title}\n\n${editForm.content}\n\n— Emmanuel, CEO`;
    await supabase
      .from("posts")
      .update({ content: postContent })
      .eq("user_id", user.id)
      .eq("post_type", "announcement")
      .ilike("content", `%${announcements.find(a => a.id === editingId)?.title || ""}%`);

    setEditingId(null);
    loadAnnouncements();
    alert("Announcement updated!");
  };

  const repostAnnouncement = async (ann: any) => {
    if (!confirm("Repost this announcement to the feed again?")) return;

    await supabase.from("posts").insert([{
      user_id: user.id,
      content: `📢 ANNOUNCEMENT (Reposted): ${ann.title}\n\n${ann.content}\n\n— Emmanuel, CEO`,
      post_type: "announcement",
      likes_count: 0,
      comments_count: 0,
      shares_count: 0
    }]);

    await supabase
      .from("ceo_announcements")
      .update({ created_at: new Date().toISOString() })
      .eq("id", ann.id);

    loadAnnouncements();
    alert("Announcement reposted to feed!");
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("ceo_announcements").delete().eq("id", id);
    loadAnnouncements();
  };

  if (loading) return <div className="container mx-auto px-6 py-20 text-center dark:text-white">Loading...</div>;
  if (!isCEO) return <div className="container mx-auto px-6 py-20 text-center text-red-500">Access Denied. CEO Only.</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-8">CEO Dashboard</h1>

        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <FaUsers className="text-4xl text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-900 dark:text-white">{stats.totalUsers}</p>
            <p className="text-gray-600 dark:text-gray-400">Total Users</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <FaChartLine className="text-4xl text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-900 dark:text-white">{stats.totalPosts}</p>
            <p className="text-gray-600 dark:text-gray-400">Total Posts</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <FaFileAlt className="text-4xl text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-900 dark:text-white">{stats.totalResearch}</p>
            <p className="text-gray-600 dark:text-gray-400">Research Papers</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <FaDownload className="text-4xl text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-900 dark:text-white">{stats.totalDownloads}</p>
            <p className="text-gray-600 dark:text-gray-400">Downloads</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <FaBell className="text-4xl text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-900 dark:text-white">{stats.activeUsers}</p>
            <p className="text-gray-600 dark:text-gray-400">Active Users</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Create Announcement</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            This will appear in the announcements list AND auto-post to your feed.
          </p>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 border rounded-lg mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
          />
          <textarea
            placeholder="Content"
            rows={4}
            className="w-full p-3 border rounded-lg mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
          />
          <button
            onClick={createAnnouncement}
            disabled={posting}
            className="bg-gradient-to-r from-blue-900 to-amber-500 text-white px-6 py-3 rounded-lg hover:shadow-lg disabled:opacity-50"
          >
            {posting ? "Publishing..." : "Publish Announcement"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Announcements</h2>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements yet. Create your first one above.</p>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="border-b dark:border-gray-700 py-4">
                {editingId === ann.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                      rows={4}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <FaSave /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold dark:text-white">{ann.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{ann.content}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FaEye /> {ann.views || 0} views</span>
                        <span>{new Date(ann.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(ann)} className="text-blue-500 hover:text-blue-600 p-2" title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => repostAnnouncement(ann)} className="text-green-500 hover:text-green-600 p-2" title="Repost to feed">
                        <FaRedo />
                      </button>
                      <button onClick={() => deleteAnnouncement(ann.id)} className="text-red-500 hover:text-red-600 p-2" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
