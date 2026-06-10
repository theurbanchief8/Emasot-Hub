import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Emasot<span className="text-amber-400">Hub</span></h3>
            <p className="text-sm text-gray-300">Kenya's platform for student research publishing and discovery.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-amber-400">Home</Link></li>
              <li><Link href="/explore" className="text-gray-300 hover:text-amber-400">Explore</Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-amber-400">Join Free</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 EmasotHub - Empowering Kenyan Research</p>
        </div>
      </div>
    </footer>
  );
}
