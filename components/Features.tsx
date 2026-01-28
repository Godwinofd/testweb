
import React from 'react';

interface FeaturesProps {
  onColumnClick?: () => void;
}

const Features: React.FC<FeaturesProps> = ({ onColumnClick }) => {
  const items = [
    {
      title: "ISOLATION EXTÉRIEURE",
      badge: "ITE PERFORMANCE",
      desc: "L'enveloppe thermique la plus efficace : supprimez les ponts thermiques sans perdre de surface habitable intérieure.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-slate-400">
          <rect x="5" y="5" width="14" height="14" rx="2" />
        </svg>
      )
    },
    {
      title: "RAVALEMENT TECHNIQUE",
      badge: "PROTECTION FAÇADE",
      desc: "Nettoyage, traitement anti-mousse et peinture imperméabilisante pour des murs sains et une esthétique neuve.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-slate-400">
          <path d="M7 7h10M7 12h10M7 17h6" strokeLinecap="round" />
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        </svg>
      )
    },
    {
      title: "TOITURE & GOUTTIÈRES",
      badge: "HORS D'EAU",
      desc: "Vérification de l'étanchéité, nettoyage haute pression et pose de protection hydrofuge sur vos tuiles.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-slate-400">
          <path d="M3 12l9-9 9 9M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "MENUISERIES ALU/PVC",
      badge: "EXTÉRIEURS",
      desc: "Remplacement de fenêtres, portes et portails pour une sécurité accrue et une isolation phonique parfaite.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-slate-400">
          <path d="M3 21h18M3 10h18M5 21V10m14 11V10M9 21V10m6 21V10M4 10l8-7 8 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#54b380]/10 text-[#54b380] font-black text-[10px] uppercase tracking-[0.2em] mb-6 sm:mb-8">
          ● EXPERTISE EXTÉRIEURE
        </div>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-950 mb-6 sm:mb-8 uppercase tracking-tighter leading-none">
          SOLUTIONS <span className="text-[#54b380]">100% EXTÉRIEURES</span>
        </h2>

        {/* Subtitle Quote */}
        <p className="max-w-3xl mx-auto text-slate-500 font-medium italic text-base sm:text-lg md:text-xl leading-relaxed mb-12 sm:mb-20 px-2 sm:px-4">
          "Une façade saine et isolée est le premier rempart contre l'inconfort. Nous sécurisons votre enveloppe extérieure pour des décennies."
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, i) => (
            <div 
              key={i} 
              onClick={onColumnClick}
              className="group relative flex flex-col items-center bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 border border-slate-100 transition-colors group-hover:bg-[#54b380]/5 group-hover:border-[#54b380]/10">
                {item.icon}
              </div>

              {/* Card Title */}
              <h3 className="text-lg sm:text-xl font-black text-slate-950 mb-3 sm:mb-4 uppercase tracking-tight leading-none px-2 sm:px-4">
                {item.title}
              </h3>

              {/* Status Badge */}
              <div className="inline-block px-3 py-1 rounded-lg bg-[#54b380]/10 text-[#54b380] font-black text-[9px] sm:text-[10px] uppercase tracking-widest mb-4 sm:mb-6">
                {item.badge}
              </div>

              {/* Description */}
              <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed px-1 sm:px-2">
                {item.desc}
              </p>
              
              {/* Hover highlight effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#54b380]/20 rounded-[2rem] sm:rounded-[3rem] transition-all pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
