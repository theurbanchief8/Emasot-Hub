"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaSearch, FaRobot, FaShoppingCart, FaUser } from "react-icons/fa";

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-amber-500" : "text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        <Link href="/" className={`flex flex-col items-center gap-1 p-2 ${isActive("/")}`}>
          <FaHome size={20} />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/explore" className={`flex flex-col items-center gap-1 p-2 ${isActive("/explore")}`}>
          <FaSearch size={20} />
          <span className="text-xs">Explore</span>
        </Link>
        <Link href="/emasot-bot" className={`flex flex-col items-center gap-1 p-2 ${isActive("/emasot-bot")}`}>
          <FaRobot size={20} />
          <span className="text-xs">Tools</span>
        </Link>
        <Link href="/research-market" className={`flex flex-col items-center gap-1 p-2 ${isActive("/research-market")}`}>
          <FaShoppingCart size={20} />
          <span className="text-xs">Market</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 p-2 ${isActive("/profile")}`}>
          <FaUser size={20} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
}