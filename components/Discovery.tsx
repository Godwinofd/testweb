
import React from 'react';

interface DiscoveryProps {
  onCtaClick: () => void;
}

const Discovery: React.FC<DiscoveryProps> = ({ onCtaClick }) => {
  const items = [
    { 
      id: "01",
      title: "SCORE ÉNERGÉTIQUE", 
      description: "Analyse personnalisée de vos déperditions thermiques calculée par notre IA propriétaire.",
      icon: "📊"
    },
    { 
      id: "02",
      title: "CALCUL DU ROI", 
      description: "Estimation précise des économies générées sur vos futures factures de chauffage.",
      icon: "💰"
    },
    { 
      id: "03",
      title: "AIDES DE L'ÉTAT", 
      description: "Test d'éligibilité direct pour MaPrimeRénov' et les primes Certificats d'Économie d'Énergie.",
      icon: "🇫🇷"
    },
    { 
      id: "04",
      title: "AUDIT OFFERT", 
      description: "Diagnostic technique gratuit à domicile pour valider la faisabilité de votre projet.",
      badge: "TOP",
      highlight: true,
      icon: "📋"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#54b380]/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#54b380]/5 border border-[#54b380]/10 text-[#54b380] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#54b380] animate-pulse"></span>
          <span>RAPPORT COMPLET</span>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-950 mb-4 sm:mb-6 uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          VOTRE <span className="text-[#54b380]">ANALYSE</span>
        </h2>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-500 font-bold text-base sm:text-lg md:text-xl mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Ce que vous allez recevoir immédiatement après le formulaire.
        </p>

        {/* Optimized Vertical Items List */}
        <div className="space-y-4 sm:space-y-6 mb-16 sm:mb-20 text-left">
          {items.map((item, i) => (
            <div 
              key={i} 
              className={`group relative flex items-center space-x-4 sm:space-x-6 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 hover:scale-[1.01] ${
                item.highlight 
                  ? 'bg-gradient-to-br from-[#54b380]/10 to-[#54b380]/5 border-[#54b380]/30 shadow-2xl shadow-[#54b380]/10' 
                  : 'bg-white border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:border-[#54b380]/20'
              }`}
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              {/* Number/Icon Container */}
              <div className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden ${
                item.highlight ? 'bg-[#1e8a60] text-white rotate-3' : 'bg-slate-950 text-white group-hover:bg-[#1e8a60] group-hover:-rotate-3'
              }`}>
                <span className="font-black text-base sm:text-xl relative z-10">{item.id}</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Text Content */}
              <div className="flex-grow">
                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                  <h3 className="text-lg sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="bg-[#54b380] text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[#54b380]/20">
                      {item.badge}
                    </span>
                  )}
                  <span className="ml-auto text-xl sm:text-2xl opacity-20 group-hover:opacity-100 transition-opacity hidden sm:block">
                    {item.icon}
                  </span>
                </div>
                <p className="text-slate-500 font-medium text-xs sm:text-base leading-relaxed pr-2 sm:pr-4">
                  {item.description}
                </p>
              </div>

              {/* Decorative side bar */}
              <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all duration-500 ${
                item.highlight ? 'bg-[#54b380]' : 'bg-slate-200 group-hover:bg-[#54b380]'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Optimized CTA Button */}
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
          <button 
            onClick={onCtaClick}
            className="group relative flex items-center bg-slate-950 hover:bg-slate-900 text-white pl-6 sm:pl-10 pr-2 sm:pr-3 py-3.5 sm:py-5 rounded-full transition-all shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:scale-[1.05] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span className="text-sm sm:text-xl font-black uppercase tracking-[0.1em] mr-6 sm:mr-10">
              Testez votre éligibilité gratuitement !
            </span>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#54b380] rounded-full flex items-center justify-center transition-transform group-hover:rotate-[-45deg] group-hover:shadow-[0_0_20px_rgba(84,179,128,0.4)]">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          
          <p className="mt-6 sm:mt-8 text-slate-400 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.2em] flex items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-[#54b380]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Réception par email en moins de 30 secondes
          </p>
        </div>
      </div>
    </section>
  );
};

export default Discovery;
