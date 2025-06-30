
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl md:text-2xl font-bold text-gray-800">Baba Boutique</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 text-base md:text-lg font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/sarees" className="hover:text-indigo-600 transition">Sarees</Link>
          <Link to="/salwar-kurti" className="hover:text-indigo-600 transition">Salwar Kurti</Link>
          <Link to="/nighty" className="hover:text-indigo-600 transition">Night Dress</Link>
          <Link to="/pickle" className="hover:text-indigo-600 transition">Pickle</Link>
          <Link to="/organic-masalas" className="hover:text-indigo-600 transition">Organic Masalas</Link>
          {!localStorage.getItem("adminToken") ? (
            <Link to="/admin-login" className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition">
              Admin Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-700 focus:outline-none text-2xl"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-3 border-t border-gray-200">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-indigo-600 transition"
          >
            Home
          </Link>
          <Link 
            to="/sarees" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-indigo-600 transition"
          >
            Sarees
          </Link>
          <Link 
            to="/salwar-kurti" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-indigo-600 transition"
          >
            Salwar Kurti
          </Link>
          <Link 
            to="/nighty" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-indigo-600 transition"
          >
            Nighty
          </Link>
          <Link 
            to="/pickle" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-indigo-600 transition"
          >
            Pickle
          </Link>
          <Link 
            to="/organic-masalas" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 hover:text-indigo-600 transition"
          >
            Organic Masalas
          </Link>
          <div className="pt-2">
            {!localStorage.getItem("adminToken") ? (
              <Link
                to="/admin-login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-block text-sm px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Admin Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="inline-block text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;





