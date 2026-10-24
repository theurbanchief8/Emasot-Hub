"use client";
import Link from "next/link";
import { FaMagic, FaBook, FaAlignLeft, FaChalkboardTeacher, FaUserShield, FaSearchPlus, FaRobot, FaArrowRight } from "react-icons/fa";

export default function EmasotBotPage() {
  const tools = [
    {
      icon: <FaMagic className="text-3xl" />,
      title: "AI Article Writer",
      description: "Turn your research into blogs, news, LinkedIn posts, and Twitter threads.",
      href: "/emasot-bot/writer",
      available: true,
    },
    {
      icon: <FaBook className="text-3xl" />,
      title: "Citation Generator",
      description: "Get APA, MLA, Chicago, or Harvard citations from a URL, DOI, or title.",
      href: "/emasot-bot/citation",
      available: false,
    },
    {
      icon: <FaAlignLeft className="text-3xl" />,
      title: "Structure Aligner",
      description: "Upload a sample format and your research. AI aligns your structure to match.",
      href: "/emasot-bot/align",
      available: false,
    },
    {
      icon: <FaChalkboardTeacher className="text-3xl" />,
      title: "Presentation Deck Builder",
      description: "Turn your abstract into a slide-by-slide outline for your defense.",
      href: "/emasot-bot/presentation",
      available: false,
    },
    {
      icon: <FaUserShield className="text-3xl" />,
      title: "Peer Reviewer & Editor",
      description: "AI critiques your logic, checks grammar, and suggests corrections.",
      href: "/emasot-bot/reviewer",
      available: false,
    },
    {
      icon: <FaSearchPlus className="text-3xl" />,
      title: "Elevator Pitch Generator",
      description: "Paste your abstract and get a 30-second spoken pitch for interviews.",
      href: "/emasot-bot/pitch",
      available: false,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-amber-500 text-black px-6 py-3 rounded-full mb-6 font-bold">
            <FaRobot className="text-2xl" />
            <span>Tools</span>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 dark:text-amber-500 mb-4">
            Your Research Toolkit
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Six practical tools to write, structure, cite, and pitch your research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, idx) => (
            <div key={idx}>
              {tool.available ? (
                <Link href={tool.href}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6 h-full hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-transparent hover:border-amber-500">
                    <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center mb-4">
                      {tool.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-2">{tool.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tool.description}</p>
                    <div className="flex items-center gap-2 text-amber-500 font-semibold">
                      Open <FaArrowRight />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6 h-full opacity-60 cursor-not-allowed border-2 border-transparent">
                  <div className="w-16 h-16 rounded-2xl bg-gray-400 dark:bg-gray-600 text-white flex items-center justify-center mb-4 opacity-50">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tool.description}</p>
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

