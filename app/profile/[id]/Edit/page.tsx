"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { FaSave, FaArrowLeft, FaCrown } from "react-icons/fa";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [isCEO, setIsCEO] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    institution: "",
    role: "sharer",
    collaboration_status: "open",
    avatar_url: ""
  });

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login"); return; }

    const { data: me } = await supabase
      .from("users")
      .select("*")
      .eq("email", session.user.email)
      .single();
    
    setIsCEO(me?.role === "ceo" || me?.email === "emanumukite@gmail.com");

    const { data: targetUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (targetUser) {
      setUser(targetUser);
      setForm({
        full_name: targetUser.full_name || "",
        username: targetUser.username || "",
        bio: targetUser.bio || "",
        institution: targetUser.institution || "",
        role: targetUser.role || "sharer",
        collaboration_status: targetUser.collaboration_status || "open",
        avatar_url: targetUser.avatar_url || ""
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update(form)
      .eq("id", userId);

    setSaving(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("User updated!");
      router.push(`/profile/${userId}`);
    }
  };

  if (loading) return <div className="container mx-auto px-6 py-20 text-center dark:text-white">Loading...</div>;
  if (!isCEO) return <div className="container mx-auto px-6 py-20 text-center text-red-500">Access Denied - CEO Only</div>;
  if (!user) return <div className="container mx-auto px-6 py-20 text-center dark:text-white">User not found</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6 max-w-2xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-900 dark:text-white mb-6">
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FaCrown className="text-yellow-500 text-2xl" />
            <h1 className="text-3xl font-bold dark:text-white">Edit User (CEO)</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Name</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Username</label>
              <input type="text" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} rows={3} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Institution</label>
              <input type="text" value={form.institution} onChange={(e) => setForm({...form, institution: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Role</label>
              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="sharer">Idea Sharer</option>
                <option value="scholar">Scholar</option>
                <option value="employer">Employer</option>
                <option value="ceo">CEO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Collaboration Status</label>
              <select value={form.collaboration_status} onChange={(e) => setForm({...form, collaboration_status: e.target.value})} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="open">Open to Collaborate</option>
                <option value="busy">Busy</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition">
              <FaSave /> {saving ? "Saving..." : "Save User"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}