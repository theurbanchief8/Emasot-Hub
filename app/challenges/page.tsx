"use client";
import { useState } from "react";
import { FaBriefcase, FaTrophy, FaClock, FaMoneyBillWave, FaUsers, FaArrowRight } from "react-icons/fa";

export default function Challenges() {
  const [challenges] = useState([
    {
      id: 1,
      title: "AI-Powered Agriculture Solution",
      company: "Safaricom",
      prize: "KES 500,000",
      deadline: "Aug 30, 2026",
      participants: 47,
      description: "Develop an AI solution to help small-scale farmers predict crop yields and optimize irrigation.",
      category: "AI & Agriculture"
    },
    {
      id: 2,
      title: "Renewable Energy Innovation",
      company: "KenGen",
      prize: "KES 1,000,000",
      deadline: "Sep 15, 2026",
      participants: 32,
      description: "Create affordable renewable energy solutions for rural communities in Kenya.",
      category: "Energy"
    },
    {
      id: 3,
      title: "Fintech for Financial Inclusion",
      company: "Equity Bank",
      prize: "KES 750,000",
      deadline: "Oct 1, 2026",
      participants: 89,
      description: "Build a mobile platform to help unbanked Kenyans access financial services.",
      category: "Fintech"
    },
    {
      id: 4,
      title: "Healthcare Data Analytics",
      company: "Amref",
      prize: "KES 300,000",
      deadline: "Sep 5, 2026",
      participants: 23,
      description: "Analyze healthcare data to predict disease outbreaks in urban areas.",
      category: "Health"
    }
  ]);

  return (
    <main>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-900 to-amber-500 bg-clip-text text-transparent mb-4">Corporate Challenges</h1>
          <p className="text-xl text-gray-600">Solve real-world problems, win prizes, and get hired by top companies</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-blue-900 to-amber-500 p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">{challenge.category}</span>
                  <span className="text-xs opacity-80"><FaUsers className="inline mr-1" /> {challenge.participants} participants</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700"><FaBriefcase /> {challenge.company}</div>
                  <div className="flex items-center gap-2 text-green-600"><FaMoneyBillWave /> {challenge.prize}</div>
                  <div className="flex items-center gap-2 text-orange-600"><FaClock /> {challenge.deadline}</div>
                  <div className="flex items-center gap-2 text-purple-600"><FaTrophy /> Open Challenge</div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-900 to-amber-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition group-hover:scale-105">
                  Submit Solution <FaArrowRight className="inline ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-amber-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Are you a company?</h2>
          <p className="text-lg mb-6">Post a challenge and discover Kenya's brightest research talent</p>
          <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:shadow-lg transition">Partner With Us</button>
        </div>
      </div>

    </main>
  );
}


