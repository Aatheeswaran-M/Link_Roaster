import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, LogIn, UserPlus, User } from 'lucide-react';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show if they haven't explicitly chosen guest mode and aren't logged in
    const isGuest = localStorage.getItem('guestMode') === 'true';
    const token = localStorage.getItem('token');
    
    if (!token && !isGuest) {
      setIsOpen(true);
    }
  }, []);

  const handleGuest = () => {
    localStorage.setItem('guestMode', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
            <Flame className="w-8 h-8 text-[#0A66C2]" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to Link Roaster</h2>
          <p className="text-gray-500 mb-8">How would you like to get started?</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-4 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Log In to Account
            </button>
            
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-3.5 px-4 bg-white border-2 border-gray-200 hover:border-[#0A66C2] hover:bg-blue-50 text-gray-700 hover:text-[#0A66C2] rounded-xl font-bold transition-all flex items-center justify-center gap-3"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up for Free
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-400 uppercase tracking-widest font-semibold">Or</span>
              </div>
            </div>
            
            <button 
              onClick={handleGuest}
              className="w-full py-3.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-3"
            >
              <User className="w-5 h-5" />
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
