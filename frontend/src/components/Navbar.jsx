import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Flame, LogOut, Home, Clock, Info, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[#E0E0E0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <div className="bg-[#0A66C2] p-1.5 rounded text-white">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-[#0A66C2]">LinkRoaster</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-[#666666] hover:text-[#000000] flex flex-col items-center justify-center text-xs font-medium">
              <Home className="w-5 h-5 mb-0.5" />
              Feed
            </Link>
            <Link to="/about" className="text-[#666666] hover:text-[#000000] flex flex-col items-center justify-center text-xs font-medium">
              <Info className="w-5 h-5 mb-0.5" />
              About
            </Link>
            
            {user ? (
              <>
                <Link to="/history" className="text-[#666666] hover:text-[#000000] flex flex-col items-center justify-center text-xs font-medium">
                  <Clock className="w-5 h-5 mb-0.5" />
                  My History
                </Link>
                <div className="border-l border-[#E0E0E0] h-8 mx-2"></div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-[#666666] hover:text-red-600 flex flex-col items-center justify-center text-xs font-medium transition-colors"
                  >
                    <LogOut className="w-5 h-5 mb-0.5" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-l border-[#E0E0E0] h-8 mx-2"></div>
                <Link to="/login" className="text-[#0A66C2] hover:bg-blue-50 px-4 py-1.5 rounded-full font-semibold border border-[#0A66C2] transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="bg-[#0A66C2] hover:bg-[#004182] text-white px-4 py-1.5 rounded-full font-semibold transition-colors">
                  Join now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E0E0E0] bg-white absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link to="/" onClick={closeMenu} className="text-[#666666] hover:text-[#000000] hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
              <Home className="w-5 h-5" /> Feed
            </Link>
            <Link to="/about" onClick={closeMenu} className="text-[#666666] hover:text-[#000000] hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
              <Info className="w-5 h-5" /> About
            </Link>
            {user ? (
              <>
                <Link to="/history" onClick={closeMenu} className="text-[#666666] hover:text-[#000000] hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5" /> My History
                </Link>
                <div className="border-t border-[#E0E0E0] my-2"></div>
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Signed in as {user.name}</p>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:bg-red-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-[#E0E0E0] my-2"></div>
                <div className="flex flex-col gap-2 px-3 py-2">
                  <Link to="/login" onClick={closeMenu} className="w-full text-center text-[#0A66C2] hover:bg-blue-50 px-4 py-2 rounded-full font-semibold border border-[#0A66C2] transition-colors">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="w-full text-center bg-[#0A66C2] hover:bg-[#004182] text-white px-4 py-2 rounded-full font-semibold transition-colors">
                    Join now
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
