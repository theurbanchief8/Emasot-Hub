import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FaFilePdf, FaChartLine, FaWallet } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Your Research<br />
              <span className="text-amber-400">Never Dies Here</span>
            </h1>
            
            <p className="text-white text-xl mb-8">
              Publish your final projects. Get cited. Earn from downloads.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/upload" className="bg-amber-400 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition inline-block">
                Upload Your Project
              </Link>
              <Link href="/explore" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-900 transition inline-block">
                Explore Research
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <FaFilePdf className="text-5xl text-amber-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-blue-900">0+</h3>
              <p>Projects Published</p>
            </div>
            <div>
              <FaChartLine className="text-5xl text-amber-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-blue-900">0+</h3>
              <p>Downloads</p>
            </div>
            <div>
              <FaWallet className="text-5xl text-amber-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-blue-900">0 KES</h3>
              <p>Earned by Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">How Emasot Hub Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">1. Upload</h3>
              <p className="text-gray-600">Share your PDF + 2-min video abstract</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">2. Get Discovered</h3>
              <p className="text-gray-600">Students & lecturers find your work</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">3. Earn</h3>
              <p className="text-gray-600">70% of every download goes to you</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
