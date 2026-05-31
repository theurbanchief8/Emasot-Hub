import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Emasot<span className="text-amber-400">Hub</span>
            </h3>
            <p className="text-sm text-gray-300">
              Kenya's platform for student research publishing and discovery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-amber-400">Home</Link></li>
              <li><Link href="/explore" className="text-gray-300 hover:text-amber-400">Explore Research</Link></li>
              <li><Link href="/buyer" className="text-gray-300 hover:text-amber-400">Buyer Portal</Link></li>
              <li><Link href="/seller/login" className="text-gray-300 hover:text-amber-400">Seller Login</Link></li>
            </ul>
          </div>

          {/* For Researchers */}
          <div>
            <h4 className="font-bold mb-4">For Researchers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/upload" className="text-gray-300 hover:text-amber-400">Publish Research</Link></li>
              <li><Link href="/seller/dashboard" className="text-gray-300 hover:text-amber-400">Seller Dashboard</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-amber-400">Earnings Guide</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FaEnvelope /> support@emasothub.com</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <FaFacebook className="text-gray-300 hover:text-amber-400 cursor-pointer" />
              <FaTwitter className="text-gray-300 hover:text-amber-400 cursor-pointer" />
              <FaInstagram className="text-gray-300 hover:text-amber-400 cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Emasot Research Hub</p>
        </div>
      </div>
    </footer>
  );
}
