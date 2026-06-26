import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Loader2 className="w-10 h-10 text-[#0A66C2] animate-spin mb-4" />
      <p className="text-[#666666] font-medium animate-pulse">
        Analyzing and structuring content...
      </p>
    </div>
  );
};

export default LoadingSpinner;
