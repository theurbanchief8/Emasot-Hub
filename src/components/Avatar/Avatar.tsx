"use client";
import React from "react";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Avatar({ name, src, size = "md" }: AvatarProps) {
  // Get the first letter of the name, fallback to "U" for User
  const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

  // Map letters to Tailwind background colors based on your list
  const colorMap: Record<string, string> = {
    A: "bg-amber-500", B: "bg-blue-500", C: "bg-cyan-500", D: "bg-blue-700", 
    E: "bg-emerald-500", F: "bg-fuchsia-500", G: "bg-yellow-500", H: "bg-amber-600", 
    I: "bg-indigo-500", J: "bg-emerald-600", K: "bg-yellow-600", L: "bg-purple-300", 
    M: "bg-fuchsia-600", N: "bg-blue-900", O: "bg-orange-500", P: "bg-pink-500", 
    Q: "bg-pink-300", R: "bg-red-500", S: "bg-sky-400", T: "bg-teal-500", 
    U: "bg-indigo-700", V: "bg-violet-500", W: "bg-gray-200 text-gray-800", 
    X: "bg-yellow-300", Y: "bg-yellow-400", Z: "bg-green-700"
  };

  // Default to gray if it's a number or symbol
  const bgColor = colorMap[firstLetter] || "bg-gray-500";

  // Sizing map
  const sizeMap = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-24 h-24 text-3xl",
    xl: "w-32 h-32 text-5xl",
  };

  // If the user has a profile picture, show it
  if (src) {
    return (
      <img 
        src={src} 
        alt={name} 
        className={`${sizeMap[size]} rounded-xl object-cover shadow-sm`} 
      />
    );
  }

  // Otherwise, show the colored letter
  return (
    <div 
      className={`${sizeMap[size]} ${bgColor} rounded-xl flex items-center justify-center font-bold text-white shadow-sm`}
    >
      {firstLetter}
    </div>
  );
}