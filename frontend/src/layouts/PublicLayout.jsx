import Navbar from "../components/Navbar";


export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}
