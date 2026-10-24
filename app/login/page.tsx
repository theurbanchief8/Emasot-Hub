"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
    institution: "",
    role: "sharer"
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });
        if (error) throw error;
        router.push("/");
      } else {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
        });
        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from("users")
            .upsert({
              id: authData.user.id,
              email: formData.email.trim(),
              username: formData.username.trim() || formData.email.split("@")[0],
              full_name: formData.full_name.trim(),
              institution: formData.institution.trim(),
              role: formData.role,
              collaboration_status: "open",
              interests: []
            }, { onConflict: "id" });

          if (profileError) console.error("Profile error:", profileError);
        }
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage("");
    setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetMessage("Reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-amber-500 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-white">
            {showResetPassword ? "Reset Password" : (isLogin ? "Welcome Back" : "Join EmasotHub")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {showResetPassword ? "Enter your email" : (isLogin ? "Login to your account" : "Create your account")}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4 text-sm">
            {resetMessage}
          </div>
        )}

        {showResetPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-900 to-amber-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
            <button type="button" onClick={() => setShowResetPassword(false)} className="w-full text-blue-600 dark:text-blue-400 text-sm py-2">
              ← Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="johndoe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    placeholder="University of Nairobi"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">I am a</label>
                  <select
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="sharer">Idea Sharer</option>
                    <option value="scholar">Scholar</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-12"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-amber-500 z-10"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "👁️" : "👁️"}
                </button>
              </div>
            </div>

            {isLogin && (
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline py-2"
              >
                Forgot Password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-900 to-amber-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Loading..." : (isLogin ? "Login" : "Create Account")}
            </button>
          </form>
        )}

        {!showResetPassword && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm py-2 px-4"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}