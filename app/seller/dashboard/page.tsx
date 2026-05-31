"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { FaFilePdf, FaDownload, FaWallet, FaChartLine, FaPlus, FaEye, FaTrash, FaSignOutAlt } from "react-icons/fa";

export default function SellerDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [sellerName, setSellerName] = useState("");

  useEffect(() => {
    // Check if seller is logged in
    const isLoggedIn = localStorage.getItem("seller_logged_in");
    if (!isLoggedIn) {
      router.push("/seller/login");
      return;
    }

    // Get seller info
    const email = localStorage.getItem("seller_email");
    const sellers = JSON.parse(localStorage.getItem("sellers") || "[]");
    const seller = sellers.find((s: any) => s.email === email);
    if (seller) {
      setSellerName(seller.name);
    }

    // Load projects
    const savedProjects = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    setProjects(savedProjects);
    
    const totalEarnings = savedProjects.reduce((sum: number, p: any) => sum + (p.earnings || 0), 0);
    const totalDownloads = savedProjects.reduce((sum: number, p: any) => sum + (p.downloads || 0), 0);
    setEarnings(totalEarnings);
    setDownloads(totalDownloads);
  }, [router]);

  const deleteProject = (id: number) => {
    const updated = projects.filter((p: any) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("seller_projects", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("seller_logged_in");
    localStorage.removeItem("seller_email");
    router.push("/seller/login");
  };

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome back, {sellerName || "Researcher"}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <FaFilePdf className="text-3xl text-amber-500 mb-2" />
            <p className="text-gray-600 text-sm">Total Projects</p>
            <p className="text-3xl font-bold text-blue-900">{projects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <FaDownload className="text-3xl text-amber-500 mb-2" />
            <p className="text-gray-600 text-sm">Total Downloads</p>
            <p className="text-3xl font-bold text-blue-900">{downloads}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <FaWallet className="text-3xl text-amber-500 mb-2" />
            <p className="text-gray-600 text-sm">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600">KES {earnings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <FaChartLine className="text-3xl text-amber-500 mb-2" />
            <p className="text-gray-600 text-sm">Available Balance</p>
            <p className="text-3xl font-bold text-green-600">KES {Math.floor(earnings * 0.7).toLocaleString()}</p>
            <p className="text-xs text-gray-400">After 30% platform fee</p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Your Research Projects</h2>
            <Link href="/upload" className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-600">
              <FaPlus /> Add New Project
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FaFilePdf className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects yet. Click "Add New Project" to publish your research.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm">Title</th>
                    <th className="p-3 text-left text-sm">Price</th>
                    <th className="p-3 text-left text-sm">Downloads</th>
                    <th className="p-3 text-left text-sm">Earnings</th>
                    <th className="p-3 text-left text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project: any) => (
                    <tr key={project.id} className="border-t">
                      <td className="p-3">{project.title}</td>
                      <td className="p-3">
                        {project.price === 0 ? (
                          <span className="text-green-600 font-semibold">Free</span>
                        ) : (
                          <span className="text-amber-600">KES {project.price}</span>
                        )}
                      </td>
                      <td className="p-3">{project.downloads || 0}</td>
                      <td className="p-3 text-green-600">KES {project.earnings || 0}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Link href={`/project/${project.id}`} className="text-blue-600 hover:text-blue-800">
                            <FaEye />
                          </Link>
                          <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:text-red-700">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Withdrawal Section */}
        <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Request Payout</h3>
          <p className="text-gray-600 mb-4">
            Available: <strong className="text-green-600 text-lg">KES {Math.floor(earnings * 0.7).toLocaleString()}</strong>
          </p>
          <button 
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            disabled={(earnings * 0.7) < 500}
          >
            Withdraw to M-Pesa
          </button>
          <p className="text-xs text-gray-500 mt-3">Min withdrawal: KES 500 | 2-3 business days</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
