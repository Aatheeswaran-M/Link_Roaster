import { useState, useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Tag, Globe, Loader2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RoastCard = ({ roast, onDelete, isDeleting }) => {
  const { API_URL, user } = useContext(AuthContext);
  const [translatedRoast, setTranslatedRoast] = useState(null);
  const [targetLang, setTargetLang] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  const currentRoast = translatedRoast || roast;

  const handleTranslate = async () => {
    setIsTranslating(true);
    setTranslateError('');
    try {
      const payload = {
        summary: roast.summary,
        interesting: roast.interesting,
        questionable: roast.questionable,
        verdict: roast.verdict
      };
      const response = await axios.post(`${API_URL}/api/translate`, {
        targetLanguage: targetLang,
        roastContent: payload
      });
      setTranslatedRoast({ ...roast, ...response.data });
    } catch (err) {
      console.error('Translation failed', err);
      setTranslateError('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };
  const formattedDate = formatDistanceToNow(new Date(roast.createdAt), { addSuffix: true });
  const displayUrl = roast.url.length > 50 ? roast.url.substring(0, 50) + '...' : roast.url;
  const authorName = roast.user?.name || 'Anonymous';
  
  const roastUserId = typeof roast.user === 'object' ? roast.user?._id : roast.user;
  const currentUserId = user ? (user._id || user.id) : null;
  const isOwner = currentUserId && roastUserId && currentUserId === roastUserId;

  return (
    <div className="glass-panel rounded-xl border border-gray-200 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden relative group">
      {/* Decorative gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Header Info (Author & Date) */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white/50 backdrop-blur-sm relative z-10">
        <div>
          <p className="text-sm font-semibold text-[#000000]">{authorName}</p>
          <p className="text-xs text-[#666666]">Roasted {formattedDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F3F2EF] px-2 py-1 rounded text-xs font-medium text-[#666666]">
            <Tag className="w-3 h-3" />
            {currentRoast.category || 'General'}
          </div>
          <div className="flex items-center gap-2">
            {showTranslate ? (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full shadow-sm">
                <Globe className="w-4 h-4 text-indigo-600" />
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  disabled={isTranslating}
                  className="bg-transparent text-sm text-indigo-900 font-bold outline-none cursor-pointer disabled:opacity-50 appearance-none"
                >
                  <option value="English">EN</option>
                  <option value="Spanish">ES</option>
                  <option value="French">FR</option>
                  <option value="German">DE</option>
                  <option value="Tamil">TA</option>
                  <option value="Hindi">HI</option>
                  <option value="Japanese">JA</option>
                </select>
                <button 
                  onClick={handleTranslate} 
                  disabled={isTranslating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full text-xs font-bold disabled:opacity-50 transition-colors flex items-center shadow-sm"
                  title="Translate Card"
                >
                  {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Go'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTranslate(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                title="Translate this roast"
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">Translate</span>
              </button>
            )}
            {isOwner && onDelete && (
              <button 
                onClick={() => onDelete(roast._id)} 
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors ml-1 flex items-center"
                title="Delete Roast"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
      {translateError && (
        <div className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-medium border-b border-red-100">
          {translateError}
        </div>
      )}

      {/* Image Area */}
      {roast.ogImage && (
        <div className="h-40 w-full bg-[#F3F2EF] border-b border-[#E0E0E0] overflow-hidden">
          <img 
            src={roast.ogImage} 
            alt={roast.title || 'Link preview'} 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col relative z-10">
        {/* Title and URL */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-[#000000] mb-1 line-clamp-2 leading-tight">
            {currentRoast.title || 'Untitled Page'}
          </h2>
          <a 
            href={currentRoast.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-[#0A66C2] hover:underline"
          >
            <span className="truncate max-w-[250px]">{displayUrl}</span>
            <ExternalLink className="w-3 h-3 ml-1 shrink-0" />
          </a>
        </div>

        {/* Text Sections */}
        {isExpanded && (
          <div className={`mt-4 space-y-4 flex-1 text-sm text-[#434649] transition-opacity duration-300 ${isTranslating ? 'opacity-50' : 'opacity-100'}`}>
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50 hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sm">
              <p className="font-semibold text-indigo-900 mb-1.5 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                AI Summary
              </p>
              <p className="leading-relaxed text-base text-gray-800">{currentRoast.summary}</p>
            </div>

            <div>
              <p className="font-semibold text-[#0A66C2] mb-1 text-xs uppercase tracking-wide">Interesting</p>
              <p className="leading-relaxed">{currentRoast.interesting}</p>
            </div>

            <div>
              <p className="font-semibold text-red-600 mb-1 text-xs uppercase tracking-wide">Questionable</p>
              <p className="leading-relaxed">{currentRoast.questionable}</p>
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-xs font-semibold text-[#0A66C2] flex items-center hover:underline focus:outline-none w-max"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
          ) : (
            <>Read More <ChevronDown className="w-3 h-3 ml-1" /></>
          )}
        </button>

        {/* Verdict (Footer) */}
        <div className="mt-5 pt-4 border-t border-gray-200 bg-gray-50/50 backdrop-blur-sm -mx-4 -mb-4 p-4">
          <p className="font-bold text-[#000000] text-sm uppercase tracking-wide mb-1">Verdict</p>
          <p className="text-base font-medium italic text-[#000000]">
            "{currentRoast.verdict}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoastCard;
