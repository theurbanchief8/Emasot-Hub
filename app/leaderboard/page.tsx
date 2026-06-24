"use client";
import { useState, useEffect } from "react";
import { FaTrophy, FaStar, FaDownload, FaEye, FaCertificate, FaChartLine } from "react-icons/fa";

export default function Leaderboard() {
  const [researchers, setResearchers] = useState([]);
  const [activeTab, setActiveTab] = useState("earnings");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const projects = JSON.parse(localStorage.getItem("seller_projects") || "[]");
    
    const stats = users.map((user: any) => {
      const userProjects = projects.filter((p: any) => p.author_name === user.name);
      return {
        name: user.name,
        institution: user.institution,
        earnings: userProjects.reduce((sum: number, p: any) => sum + (p.earnings || 0), 0),
        downloads: userProjects.reduce((sum: number, p: any) => sum + (p.downloads || 0), 0),
        projects: userProjects.length,
        citations: Math.floor(Math.random() * 100),
        impactScore: Math.floor(Math.random() * 100)
      };
    }).sort((a: any, b: any) => b[activeTab] - a[activeTab]).slice(0, 20);
    
    setResearchers(stats);
  }, [activeTab]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <FaTrophy className="text-yellow-500 text-2xl" />;
    if (index === 1) return <FaTrophy className="text-gray-400 text-2xl" />;
    if (index === 2) return <FaTrophy className="text-orange-600 text-2xl" />;
    return <span className="text-gray-500 dark:text-gray-400 font-bold">{index + 1}</span>;
  };

  return (
    <main>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent mb-4">Research Leaderboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Top researchers changing the world through innovation</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveTab("earnings")} className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "earnings" ? "bg-blue-900 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
            💰 Top Earners
          </button>
          <button onClick={() => setActiveTab("downloads")} className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "downloads" ? "bg-blue-900 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
            📥 Most Downloaded
          </button>
          <button onClick={() => setActiveTab("impactScore")} className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "impactScore" ? "bg-blue-900 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
            📊 Impact Score
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-900 to-amber-500 text-white">
                <tr>
                  <th className="p-4 text-left">Rank</th>
                  <th className="p-4 text-left">Researcher</th>
                  <th className="p-4 text-left">Institution</th>
                  <th className="p-4 text-left">Projects</th>
                  <th className="p-4 text-left">Downloads</th>
                  <th className="p-4 text-left">Earnings</th>
                  <th className="p-4 text-left">Impact</th>
                </tr>
              </thead>
              <tbody>
                {researchers.map((researcher: any, index: number) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-4 text-center">{getRankIcon(index)}</td>
                    <td className="p-4 font-semibold dark:text-white">{researcher.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{researcher.institution}</td>
                    <td className="p-4 dark:text-gray-300">{researcher.projects}</td>
                    <td className="p-4 dark:text-gray-300">{researcher.downloads.toLocaleString()}</td>
                    <td className="p-4 text-green-600 dark:text-green-400 font-semibold">KES {researcher.earnings.toLocaleString()}</td>
                    <td className="p-4"><div className="flex items-center gap-2"><FaChartLine className="text-amber-500" /> <span className="dark:text-gray-300">{researcher.impactScore}</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-6 text-center">🏆 Achievement Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🏅</div>
              <p className="font-semibold dark:text-white">Top Researcher</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Top 10 overall</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📚</div>
              <p className="font-semibold dark:text-white">Prolific Author</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">10+ publications</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">💡</div>
              <p className="font-semibold dark:text-white">Innovation Star</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">High impact score</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🤝</div>
              <p className="font-semibold dark:text-white">Collaborator</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Top collaborator</p>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

