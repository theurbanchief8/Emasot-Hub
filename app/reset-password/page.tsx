"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setSuccess("Password updated! Redirecting...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-amber-500 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-900 dark:text-white mb-8">Reset Password</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
        <form onSubmit={handleReset} className="space-y-4">
          <input type="password" placeholder="New Password" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
          <input type="password" placeholder="Confirm Password" required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={6} />
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-900 to-amber-500 text-white py-3 rounded-lg font-semibold">{loading ? "Updating..." : "Update Password"}</button>
        </form>
      </div>
    </div>
  );
}