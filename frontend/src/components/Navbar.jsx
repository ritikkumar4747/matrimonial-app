import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/matches", label: "Matches", icon: "💕" },
    { path: "/matches/mutual", label: "Mutual", icon: "💑" },
    { path: "/received", label: "Received", icon: "💌" },
    { path: "/sent", label: "Sent", icon: "📤" },
    { path: "/gallery", label: "Gallery", icon: "📸" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-200/60 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group"
          >
            <div className="text-3xl transform group-hover:scale-110 transition-transform">💕</div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-gray-900 leading-tight">
                Matri<span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">monial</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                Rabb Ne Bana Di Jodi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-pink-600 font-semibold text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  Register Free
                </Link>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-sm transition-all ${
                      isActive(link.path)
                        ? "bg-pink-50 text-pink-600 shadow-sm"
                        : "text-gray-700 hover:text-pink-600 hover:bg-white/50"
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span className="hidden lg:inline">{link.label}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${
                    isActive(link.path)
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
