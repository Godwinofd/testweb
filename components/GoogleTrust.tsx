
import React from 'react';

const GoogleTrust: React.FC = () => {
  const trustIcons = [
    { emoji: "🏗️" },
    { emoji: "🌡️" },
    { emoji: "🍃" },
    { emoji: "🏢" },
    { emoji: "🤝" },
    { emoji: "🏆" },
    { emoji: "✨" },
    { emoji: "🛡️" },
    { emoji: "🏠" },
    { emoji: "⚡" },
    { emoji: "🏗️" }
  ];

  // Duplicate for seamless marquee
  const doubleIcons = [...trustIcons, ...trustIcons];

  return (
    <div className="py-20 flex flex-col items-center bg-[#fcfdfe] overflow-hidden">
      {/* Google Review Card */}
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] px-10 py-8 flex flex-col items-center animate-in fade-in zoom-in duration-700 relative z-10 mb-12 border border-slate-50/50">
        <div className="flex items-center space-x-3 mb-2">
          {/* Google Logo */}
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          
          {/* Stars */}
          <div className="flex text-[#FBBC05] space-x-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <span className="text-2xl font-black text-slate-900 ml-1">4.9</span>
        </div>
        
        <p className="text-[#64748b] font-medium tracking-tight text-lg">
          <span className="text-slate-950 font-black">782 avis</span> certifiés sur Google
        </p>
      </div>

      {/* Marquee Icon Row - Increased size slightly on mobile (w-16 -> w-[76px]) and text (2xl -> 3xl) */}
      <div className="w-full relative py-2 overflow-hidden select-none">
        <div className="flex w-fit animate-marquee hover:pause whitespace-nowrap">
          {doubleIcons.map((item, idx) => (
            <div 
              key={idx} 
              className="inline-flex mx-3 w-[76px] h-[76px] md:w-24 md:h-24 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-50 items-center justify-center text-3xl md:text-4xl transition-all duration-300 hover:scale-110 hover:shadow-md cursor-default shrink-0"
            >
              {item.emoji}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default GoogleTrust;
