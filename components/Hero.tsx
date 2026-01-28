
import React from 'react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative pt-4 pb-2 md:pt-10 md:pb-4 lg:pt-12 lg:pb-0 overflow-hidden bg-[#fcfdfe]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150%] -z-10 bg-[radial-gradient(circle_at_50%_20%,_rgba(84,179,128,0.25)_0%,_transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-5 text-center">
        <div className="mb-4 md:mb-6 lg:mb-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 leading-[1.1] tracking-tighter uppercase">
            Réduisez de <span className="text-[#54b380]">50%</span> vos factures énergetique <br className="hidden sm:block" />
            avec l’isolation thermique par l’éxtérieur
            <span className="block text-[#54b380] mt-3 md:mt-4 filter drop-shadow-[0_4px_12px_rgba(84,179,128,0.15)] text-xl sm:text-2xl md:text-4xl lg:text-5xl">
              béneficiez de €10,000 d’aides en testant votre éligibilité !
            </span>
          </h1>
        </div>

        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed font-bold px-2 md:px-4">
            <p className="text-slate-900 opacity-90">
              Le test est gratuit et sans engagement !
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes width-grow {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-width-grow {
          animation: width-grow 1s ease-out forwards;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
