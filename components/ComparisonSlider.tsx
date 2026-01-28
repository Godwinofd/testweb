import React, { useState, useRef, useEffect, useCallback } from 'react';

const ComparisonSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const project = {
    title: "ITE & Ravalement - Maison",
    description: "Correction des ponts thermiques et modernisation esthétique complète de la façade.",
    before: "https://res.cloudinary.com/dddvmez6s/image/upload/v1769175496/Image_23-01-2026_at_13.37_bfcp24.jpg",
    after: "https://res.cloudinary.com/dddvmez6s/image/upload/v1769175496/Image_23-01-2026_at_13.38_o45yhz.jpg"
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = (x / rect.width) * 100;
    // Use requestAnimationFrame-like logic implicitly via state update frequency 
    // but clamped for stability
    setSliderPos(Math.min(Math.max(position, 0), 100));
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        // Prevent scrolling while comparing images on mobile
        if (e.cancelable) e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, handleMove]);

  // Initial "peek" animation to show users it's interactive
  useEffect(() => {
    const timer = setTimeout(() => {
      setSliderPos(40);
      setTimeout(() => setSliderPos(50), 600);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-[#fcfdfe] flex flex-col items-center overflow-hidden">
      <div className="max-w-5xl w-full px-6">
        <div className="text-center mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#54b380]/10 text-[#54b380] font-black text-[10px] uppercase tracking-[0.2em] mb-4">
            <span>TRANSFORMATION RÉELLE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none">
            AVANT <span className="text-slate-300">/</span> <span className="text-[#54b380]">APRÈS</span>
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative group max-w-4xl mx-auto">
          <div 
            ref={containerRef}
            className={`relative aspect-[4/3] md:aspect-[16/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] cursor-ew-resize select-none border-4 border-white transition-all duration-500 ${
              isDragging ? 'shadow-[0_60px_100px_-20px_rgba(84,179,128,0.2)] scale-[1.01]' : 'hover:shadow-[0_50px_90px_-20px_rgba(0,0,0,0.2)]'
            }`}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            {/* After Image (Full Background) */}
            <div className="absolute inset-0">
              <img 
                src={project.after} 
                alt="Après" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* After Label - Glassmorphism */}
              <div className={`absolute bottom-6 right-6 md:bottom-10 md:right-10 px-4 py-2 md:px-6 md:py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-black text-[9px] md:text-xs uppercase tracking-[0.2em] shadow-xl z-20 transition-opacity duration-300 ${isDragging ? 'opacity-40' : 'opacity-100'}`}>
                RÉSULTAT
              </div>
            </div>

            {/* Before Image (Clipped) */}
            <div 
              className="absolute inset-0 z-10 overflow-hidden" 
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={project.before} 
                alt="Avant" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ width: `${100 / (sliderPos / 100)}%` }} // Keeps image from squishing
              />
              {/* Before Label - Glassmorphism */}
              <div className={`absolute bottom-6 left-6 md:bottom-10 md:left-10 px-4 py-2 md:px-6 md:py-3 rounded-full bg-slate-950/20 backdrop-blur-md border border-white/20 text-white font-black text-[9px] md:text-xs uppercase tracking-[0.2em] shadow-xl transition-opacity duration-300 ${isDragging ? 'opacity-40' : 'opacity-100'}`}>
                ORIGINE
              </div>
            </div>

            {/* Handle Line & Interactive Button */}
            <div 
              className="absolute inset-y-0 z-30 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Vertical White Line */}
              <div className="absolute inset-y-0 -left-0.5 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)]"></div>
              
              {/* Floating Handle Button */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
                {/* Large Invisible Hit Area for better UX */}
                <div className="absolute -inset-10 pointer-events-auto cursor-ew-resize"></div>
                
                {/* Visual Circle */}
                <div className={`relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-[#54b380] shadow-[0_10px_30px_rgba(0,0,0,0.3)] ring-4 ring-white/20 transition-all duration-300 ${
                  isDragging ? 'scale-125 bg-[#54b380] text-white' : 'group-hover:scale-110'
                }`}>
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" className={isDragging ? 'opacity-20' : 'opacity-40'} />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hint Overlay */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-700 ${
              isDragging ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}>
               <div className="bg-slate-900/40 backdrop-blur-lg border border-white/20 text-white px-6 py-2 rounded-full text-[9px] font-black tracking-[0.3em] uppercase animate-pulse">
                 Comparer
               </div>
            </div>
          </div>
        </div>

        {/* Improved Feature Grid Below */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Isolation", val: "+35%", desc: "Efficacité thermique" },
            { label: "Esthétique", val: "Moderne", desc: "Valeur immobilière" },
            { label: "Confort", val: "Optimal", desc: "Température stable" },
            { label: "Garantie", val: "10 Ans", desc: "Sérénité totale" }
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-[#54b380]/20 hover:shadow-md transition-all duration-300"
            >
              <span className="text-[9px] md:text-[10px] font-black text-[#54b380] uppercase tracking-widest mb-1">{item.label}</span>
              <span className="text-xl md:text-3xl font-black text-slate-950 tracking-tighter mb-1">{item.val}</span>
              <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSlider;