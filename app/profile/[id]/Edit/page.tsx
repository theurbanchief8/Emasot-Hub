"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabaseClient";
import { FaCamera, FaSave, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Avatar from "../../../../components/Avatar/Avatar";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
      if (data) {
        setFullName(data.full_name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setInstitution(data.institution || "");
        setAvatarUrl(data.avatar_url || "");
      }
      setLoading(false);
    };
    fetchUser();
  }, [userId]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Note: Supabase bucket is named 'avatars' (small a)
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      alert("Image uploaded! Don't forget to click Save.");
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("users").update({
      full_name: fullName,
      username: username,
      bio: bio,
      institution: institution,
      avatar_url: avatarUrl
    }).eq("id", userId);

    setSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      router.push(`/profile/${userId}`);
      router.refresh();
    }
  };

  if (loading) return <div className="p-20 text-center dark:text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/profile/${userId}`} className="text-gray-500 hover:text-blue-900 dark:hover:text-amber-500 transition">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white">Edit Profile</h1>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer">
            <Avatar name={fullName || "User"} src={avatarUrl} size="xl" />
            <label className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
              <FaCamera size={24} className="mb-2" />
              <span className="text-xs font-bold">{uploading ? "Uploading..." : "Change"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-3">Click the image to upload a new photo</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Institution / Profession</label>
            <input type="text" value={institution} onChange={e => setInstitution(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" placeholder="e.g. University of Nairobi" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-900" placeholder="Tell us about yourself..." />
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2 mt-4">
            <FaSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}