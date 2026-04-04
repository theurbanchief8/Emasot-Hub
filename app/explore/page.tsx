import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";

export default function ExplorePage() {
  const sampleProjects = [
    { id: 1, title: "Climate Change Perspectives in Kenya", author: "Emmanuel Otieno", price: "Free" },
    { id: 2, title: "Mobile Money Adoption in Rural Areas", author: "Jane Wanjiku", price: "50 KES" },
    { id: 3, title: "AI in Agriculture: A Kenyan Case Study", author: "Peter Mwangi", price: "100 KES" },
  ];

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Explore Research</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {sampleProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-2">By {project.author}</p>
              <p className="text-amber-500 font-bold mb-4">{project.price}</p>
              <Link href={`/project/${project.id}`} className="text-blue-600 hover:underline">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
