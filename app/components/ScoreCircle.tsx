import React from 'react';

// Tambahkan tanda tanya (?) pada label dan subtext agar menjadi opsional
const ScoreCircle = ({ score = 0, label, subtext }: { score: number, label?: string, subtext?: string }) => {
  const radius = 42; 
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  
  const validScore = Math.min(Math.max(Number(score) || 0, 0), 100);
  const progress = validScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const strokeColor = validScore > 75 ? "url(#gradGreen)" : validScore > 50 ? "url(#gradYellow)" : "url(#gradRed)";

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Tampilkan label hanya jika label dikirimkan */}
      {label && <p className="text-xs font-semibold text-gray-300 mb-4">{label}</p>}
      
      <div className="relative w-[90px] h-[90px]">
        <svg height="100%" width="100%" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle cx="50" cy="50" r={normalizedRadius} stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} fill="transparent" />
          
          <defs>
            <linearGradient id="gradGreen" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="gradYellow" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="gradRed" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="gradPurple" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          <circle
            cx="50" cy="50" r={normalizedRadius}
            stroke={label === "ATS Score" ? "url(#gradPurple)" : strokeColor}
            strokeWidth={stroke} fill="transparent" strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-lg text-white">
            {validScore}<span className="text-[10px] text-gray-400 font-normal ml-0.5">/100</span>
          </span>
        </div>
      </div>
      
      {/* Tampilkan subtext hanya jika subtext dikirimkan */}
      {subtext && <p className="text-[10px] text-gray-400 mt-4 text-center max-w-[110px] leading-tight">{subtext}</p>}
    </div>
  );
};

export default ScoreCircle;