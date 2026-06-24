import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4">EmasotHub</h1>
        <p className="text-xl mb-8">Kenya's Research Platform</p>
        <div className="flex gap-4 justify-center">
          <Link href="/explore" className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition">
            Explore Research
          </Link>
          <Link href="/login" className="bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Join Free
          </Link>
        </div>
      </div>
    </div>
  );
}
