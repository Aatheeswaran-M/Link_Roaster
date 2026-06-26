import { useState, useEffect } from 'react';
import { Loader2, Flame, Search, Code, Cpu, Zap } from 'lucide-react';

const roastSkills = [
  { text: "Initializing Roasting Engines...", icon: <Zap className="w-6 h-6 text-yellow-500" /> },
  { text: "Extracting Website HTML...", icon: <Code className="w-6 h-6 text-blue-500" /> },
  { text: "Judging Color Palette...", icon: <Search className="w-6 h-6 text-green-500" /> },
  { text: "Finding Vulnerabilities...", icon: <Cpu className="w-6 h-6 text-purple-500" /> },
  { text: "Drafting Brutal Verdict...", icon: <Flame className="w-6 h-6 text-orange-500" /> },
];

const RoastProgress = () => {
  const [progress, setProgress] = useState(0);
  const [skillIndex, setSkillIndex] = useState(0);

  useEffect(() => {
    const duration = 10000; 
    const interval = 100;
    const step = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; 
        return prev + step;
      });
    }, interval);

    const skillTimer = setInterval(() => {
      setSkillIndex((prev) => (prev + 1) % roastSkills.length);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(skillTimer);
    };
  }, []);

  return (
    <div className="h-full min-h-[384px] w-full glass-panel rounded-xl border border-blue-300 bg-white/70 backdrop-blur-md relative overflow-hidden flex flex-col justify-center items-center p-8 text-center shadow-xl transition-all duration-300 transform scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-indigo-50/50 to-purple-50/50 opacity-80 pointer-events-none"></div>
      
      <div className="relative z-10 w-full flex flex-col items-center h-full justify-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-40 animate-pulse scale-150"></div>
          <div className="bg-white p-4 rounded-full shadow-lg relative z-10 border border-blue-100">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </div>

        <div className="h-16 flex items-center justify-center mb-8 w-full">
          <div 
            key={skillIndex} 
            className="flex flex-col items-center gap-3 text-gray-800 font-bold text-lg animate-fade-in-up"
          >
            {roastSkills[skillIndex].icon}
            <span>{roastSkills[skillIndex].text}</span>
          </div>
        </div>
        
        <div className="w-full max-w-[280px] bg-gray-200/80 rounded-full h-3 mb-2 overflow-hidden shadow-inner border border-gray-300/30">
          <div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-200 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-full">
               <div className="w-full h-full bg-white/40 skew-x-12 -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
        <p className="text-sm font-extrabold text-blue-600 w-full max-w-[280px] text-right tracking-wider">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
};

export default RoastProgress;
