import Navbar from "../components/Navbar";


export default function PublicLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden">
      <Navbar />
      

      <div className="relative z-10 pt-24">
        {children}
      </div>
    </div>
  );
}
