import { useState, useContext } from 'react';
import { Link, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const RoastForm = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const { user } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), language);
      setUrl('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-4 transition-all focus-within:shadow-md focus-within:border-blue-300"
      >
        <div className="flex-1 flex items-center w-full px-2 border-b md:border-b-0 md:border-r border-[#E0E0E0] pb-3 md:pb-0 md:pr-4">
          <Link className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste any URL to roast..."
            className="w-full bg-transparent text-[#000000] placeholder-gray-500 focus:outline-none text-base"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full md:w-auto flex items-center gap-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#0A66C2] focus:border-[#0A66C2] block w-full md:w-36 p-2.5 outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Tamil">Tamil</option>
            <option value="Hindi">Hindi</option>
            <option value="Japanese">Japanese</option>
          </select>
        
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            'Analyzing...'
          ) : (
            <>
              Roast It <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
        </div>
      </form>
    </div>
  );
};

export default  RoastForm;
