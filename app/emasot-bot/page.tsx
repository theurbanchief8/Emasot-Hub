"use client";
import Link from "next/link";
import { FaMagic, FaBook, FaLanguage, FaComments, FaFileAlt, FaLightbulb, FaRobot, FaArrowRight } from "react-icons/fa";

export default function EmasotBotPage() {
  const tools = [
    { icon: <FaMagic className="text-3xl" />, title: "AI Article Writer", description: "Turn your research into blogs, news, LinkedIn posts, and Twitter threads.", href: "/emasot-bot/writer", available: true, color: "from-blue-900 to-amber-500" },
    { icon: <FaFileAlt className="text-3xl" />, title: "Research Summarizer", description: "Paste any research and get a clear 1-paragraph summary.", href: "/emasot-bot/summarizer", available: false, color: "from-purple-500 to-pink-500" },
    { icon: <FaBook className="text-3xl" />, title: "Citation Generator", description: "Enter a URL or DOI and get APA/MLA citations instantly.", href: "/emasot-bot/citation", available: false, color: "from-green-500 to-teal-500" },
    { icon: <FaLightbulb className="text-3xl" />, title: "Title Suggestor", description: "Get 5 catchy titles for your research from your abstract.", href: "/emasot-bot/titles", available: false, color: "from-yellow-500 to-orange-500" },
    { icon: <FaComments className="text-3xl" />, title: "AI Chat Assistant", description: "Ask anything about research, writing, or EmasotHub.", href: "/emasot-bot/chat", available: false, color: "from-indigo-500 to-blue-500" },
    { icon: <FaLanguage className="text-3xl" />, title: "Translation", description: "Translate research between English and Swahili.", href: "/emasot-bot/translate", available: false, color: "from-red-500 to-rose-500" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-900 to-amber-500 text-white px-6 py-3 rounded-full mb-6">
            <FaRobot className="text-2xl" />
            <span className="font-bold">Emasot Bot</span>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 dark:text-white mb-4">Your AI Research Assistant</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A growing suite of AI tools to help you write, summarize, cite, and share your research.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, idx) => (
            <div key={idx}>
              {tool.available ? (
                <Link href={tool.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-amber-500">
                    <div className={"w-16 h-16 rounded-2xl bg-gradient-to-br " + tool.color + " text-white flex items-center justify-center mb-4"}>{tool.icon}</div>
                    <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-2">{tool.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tool.description}</p>
                    <div className="flex items-center gap-2 text-amber-500 font-semibold">Open <FaArrowRight /></div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full opacity-60 cursor-not-allowed">
                  <div className={"w-16 h-16 rounded-2xl bg-gradient-to-br " + tool.color + " text-white flex items-center justify-center mb-4 opacity-50"}>{tool.icon}</div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tool.description}</p>
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">Coming Soon</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
