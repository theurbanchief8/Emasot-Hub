import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FaFilePdf, FaChartLine, FaWallet, FaStore, FaShoppingCart, FaArrowRight, FaUsers, FaAward, FaTwitter, FaVideo, FaGraduationCap, FaBriefcase } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-amber-500 text-black font-bold px-6 py-3 rounded-full text-sm mb-8 shadow-lg animate-bounce">
              ???? Empowering Kenyan Research
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Your Research<br />
              <span className="text-amber-400 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Never Dies Here</span>
            </h1>
            
            <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
              Publish your work, connect with scholars, get discovered by employers, and earn from your knowledge.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/login" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition inline-flex items-center gap-2 shadow-lg">
                Join EmasotHub Free
              </Link>
              <Link href="/explore" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-900 transition">
                Explore Research
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl text-amber-500 mb-4">??</div>
              <p className="text-3xl font-bold text-blue-900">100+</p>
              <p className="text-gray-600">Research Papers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl text-amber-500 mb-4">??</div>
              <p className="text-3xl font-bold text-blue-900">500+</p>
              <p className="text-gray-600">Active Researchers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl text-amber-500 mb-4">??</div>
              <p className="text-3xl font-bold text-blue-900">5,000+</p>
              <p className="text-gray-600">Downloads</p>
            </div>
            <div className="text-center">
              <div className="text-5xl text-amber-500 mb-4">??</div>
              <p className="text-3xl font-bold text-blue-900">KES 150K+</p>
              <p className="text-gray-600">Earned by Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">What Makes EmasotHub Unique?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition">??</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Publish & Earn</h3>
              <p className="text-gray-600">Upload your research, set your price, and earn 70% of every download.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition">??</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Social Feed</h3>
              <p className="text-gray-600">Share ideas, post updates, and connect with fellow researchers like Twitter.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition">??</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Employer Access</h3>
              <p className="text-gray-600">Employers discover talent directly through published research.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-amber-400 to-amber-500">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Ready to Change the Future of Research?</h2>
          <p className="text-xl text-blue-900 mb-8">Join thousands of Kenyan researchers already on EmasotHub</p>
          <Link href="/login" className="inline-block bg-blue-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition shadow-lg">
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
