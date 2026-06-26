import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Flame, AlertCircle, Zap, Shield, Globe, Loader2, Search } from 'lucide-react';
import RoastForm from '../components/RoastForm';
import RoastCard from '../components/RoastCard';
import LoadingSpinner from '../components/LoadingSpinner';
import RoastProgress from '../components/RoastProgress';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [roasts, setRoasts] = useState([]);
  const [latestRoast, setLatestRoast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitial, setIsFetchingInitial] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { API_URL, user } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRoasts(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [user, searchQuery]);

  const fetchRoasts = async (query = '') => {
    if (!user) {
      // Load guest roasts from localStorage
      try {
        const savedGuestRoasts = JSON.parse(localStorage.getItem('guestRoasts') || '[]');
        if (query) {
          const lowerQuery = query.toLowerCase();
          setRoasts(savedGuestRoasts.filter(r => 
            r.url.toLowerCase().includes(lowerQuery) || 
            r.title?.toLowerCase().includes(lowerQuery) || 
            r.summary?.toLowerCase().includes(lowerQuery)
          ));
        } else {
          setRoasts(savedGuestRoasts);
        }
      } catch (e) {
        setRoasts([]);
      }
      setIsFetchingInitial(false);
      return;
    }
    
    setIsFetchingInitial(true);
    try {
      const response = await axios.get(`${API_URL}/api/roasts/me`, { params: { search: query } });
      setRoasts(response.data);
    } catch (err) {
      console.error('Failed to fetch roasts:', err);
    } finally {
      setIsFetchingInitial(false);
    }
  };

  const handleRoast = async (url, language) => {    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/roast`, { url, language });
      
      const newRoast = { ...response.data };
      if (user) {
        newRoast.user = { _id: user._id || user.id, name: user.name };
      } else {
        // Save to localStorage for guests
        try {
          const currentGuestRoasts = JSON.parse(localStorage.getItem('guestRoasts') || '[]');
          localStorage.setItem('guestRoasts', JSON.stringify([newRoast, ...currentGuestRoasts]));
        } catch (e) {
          console.error('Could not save to localStorage', e);
        }
      }
      setLatestRoast(newRoast);
      setRoasts((prevRoasts) => [newRoast, ...prevRoasts]);
    } catch (err) {
      console.error('Error creating roast:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Couldn't reach the server. Is it running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this roast?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/api/roast/${id}`);
      setRoasts((prevRoasts) => prevRoasts.filter(r => r._id !== id));
      if (!user) {
        // Also remove from guest localStorage
        try {
          const currentGuestRoasts = JSON.parse(localStorage.getItem('guestRoasts') || '[]');
          localStorage.setItem('guestRoasts', JSON.stringify(currentGuestRoasts.filter(r => r._id !== id)));
        } catch (e) {}
      }
      if (latestRoast && latestRoast._id === id) {
        setLatestRoast(null);
      }
    } catch (err) {
      console.error('Error deleting roast:', err);
      alert('Failed to delete roast. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3F2EF]">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="relative container mx-auto px-4 max-w-7xl py-12 md:py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0A66C2] text-sm font-semibold tracking-wide animate-float-delayed shadow-sm">
            ✨ AI-Powered Website Analysis
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#0A66C2] to-indigo-600 mb-6 tracking-tight animate-glow pb-2">
            Discover the internet's <br className="hidden md:block" />
            <span className="text-[#0A66C2]">brutal truths</span>
          </h1>
          <p className="text-[#666666] max-w-2xl mx-auto text-xl md:text-2xl leading-relaxed mb-12">
            Drop a URL to generate a professional, AI-powered roast and uncover the hidden flaws of any website.
          </p>
          
          {/* Glassmorphism wrapper for RoastForm */}
          <div className="max-w-3xl mx-auto glass-panel p-3 md:p-5 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-200">
             <RoastForm onSubmit={handleRoast} isLoading={isLoading} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 relative z-10 animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Latest Roast Prominent Display */}
        {latestRoast && (
          <div className="max-w-4xl mx-auto mt-16 animate-fade-in-up relative z-10">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              Your Roast is Served
              <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </h2>
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-[#E0E0E0] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {latestRoast.ogImage && (
                  <div className="md:w-1/3 shrink-0 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50 flex items-center justify-center p-2">
                    <img src={latestRoast.ogImage} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-xl" />
                  </div>
                )}
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{latestRoast.title || 'Untitled Page'}</h3>
                    <a href={latestRoast.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate block max-w-md">
                      {latestRoast.url}
                    </a>
                  </div>
                  
                  <div className="space-y-4 text-gray-700">
                     <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors">
                       <p className="font-bold text-blue-900 mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                         </span>
                         AI Summary
                       </p>
                       <p className="leading-relaxed text-sm md:text-base">{latestRoast.summary}</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4">
                       <div className="flex-1 bg-green-50/50 p-4 rounded-xl border border-green-100 hover:bg-green-50 transition-colors">
                         <p className="font-bold text-green-900 mb-2 uppercase text-xs tracking-wider">Interesting</p>
                         <p className="text-sm">{latestRoast.interesting}</p>
                       </div>
                       <div className="flex-1 bg-red-50/50 p-4 rounded-xl border border-red-100 hover:bg-red-50 transition-colors">
                         <p className="font-bold text-red-900 mb-2 uppercase text-xs tracking-wider">Questionable</p>
                         <p className="text-sm">{latestRoast.questionable}</p>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 text-center bg-gray-50/50 -mx-8 md:-mx-10 -mb-8 md:-mb-10 p-8 md:p-10">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Final Verdict</p>
                <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 italic leading-tight">
                  "{latestRoast.verdict}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feed Section */}
        <div className="mt-8 relative z-10">
          <div className="flex items-center justify-between mb-8 border-b border-[#E0E0E0] pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {user ? (
                <>
                  <Flame className="w-6 h-6 text-[#0A66C2]" />
                  Your Recent Roasts
                </>
              ) : (
                <>
                  <Flame className="w-6 h-6 text-gray-600" />
                  Your Roasts (Session Only)
                </>
              )}
            </h2>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-64 mt-4 md:mt-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search roasts..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {isFetchingInitial ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 glass-panel rounded-2xl border border-gray-200"></div>
              ))}
            </div>
          ) : roasts.length > 0 || isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading && (
                <RoastProgress />
              )}
              {roasts.filter(r => !latestRoast || r._id !== latestRoast._id).map((roast, index) => (
                <div key={roast._id} className="animate-float" style={{ animationDelay: `${index * 0.2}s`, animationDuration: '8s' }}>
                  <RoastCard 
                    roast={roast} 
                    onDelete={handleDelete}
                    isDeleting={deletingId === roast._id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-panel rounded-2xl border border-gray-200 border-dashed">
              <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No roasts yet</h3>
              <p className="text-gray-500">Sign in to be the first to drop a link and feel the burn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

