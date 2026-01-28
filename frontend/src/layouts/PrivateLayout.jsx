import Navbar from "../components/Navbar";

export default function PrivateLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-24 px-6">
        {children}
      </div>
    </div>
  );
}
