import Link from "next/link";

export default function Home() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(135deg, #1e3a5f, #1a2a4a)",
      color: "white",
      textAlign: "center",
      padding: "20px"
    }}>
      <div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>EmasotHub</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Kenya's Research Platform</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/explore" style={{ background: "#f5a623", color: "white", padding: "12px 24px", borderRadius: "8px", textDecoration: "none" }}>
            Explore Research
          </Link>
          <Link href="/login" style={{ background: "white", color: "#1e3a5f", padding: "12px 24px", borderRadius: "8px", textDecoration: "none" }}>
            Join Free
          </Link>
        </div>
      </div>
    </div>
  );
}
