import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Clock, Trash2, Loader2 } from 'lucide-react';
import RoastCard from '../components/RoastCard';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const History = () => {
  const [roasts, setRoasts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { API_URL, user, loading } = useContext(AuthContext);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyRoasts();
    }
  }, [user]);

  const fetchMyRoasts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/roasts/me`);
      setRoasts(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this roast?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/api/roast/${id}`);
      setRoasts((prevRoasts) => prevRoasts.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting roast:', err);
      alert('Failed to delete roast. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your ENTIRE history? This action cannot be undone.")) return;
    setIsClearing(true);
    try {
      await axios.delete(`${API_URL}/api/roasts/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRoasts([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      alert('Failed to clear history. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8">
      <div className="mb-8 flex justify-between items-end border-b border-[#E0E0E0] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#000000] flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#0A66C2]" />
            My History
          </h1>
          <p className="text-[#666666] mt-2">A record of all the links you've roasted.</p>
        </div>
        {roasts.length > 0 && !isFetching && (
          <button 
            onClick={handleClearHistory} 
            disabled={isClearing}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isClearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear All
          </button>
        )}
      </div>

      {isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-white rounded-lg border border-[#E0E0E0]"></div>
          ))}
        </div>
      ) : roasts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roasts.map((roast) => (
            <RoastCard 
              key={roast._id} 
              roast={roast} 
              onDelete={handleDelete}
              isDeleting={deletingId === roast._id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-lg border border-[#E0E0E0] border-dashed">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No history found</h3>
          <p className="text-gray-500">You haven't roasted any links yet.</p>
        </div>
      )}
    </div>
  );
};

export default History;
