import React, { useRef, useEffect } from 'react';

const VideoTestimonial: React.FC = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoPlayerRef.current;
    if (!videoElement) return;

    // Use Intersection Observer for robust autoplay when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch((error) => {
              // Standard browser restriction handling
              console.warn("Autoplay was prevented by the browser. Interaction may be required.", error);
            });
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.3 } // Start playing when 30% visible
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#54b380]/10 text-[#54b380] font-black text-[9px] uppercase tracking-[0.2em] mb-4">
            <span>EXPÉRIENCE CLIENT</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none">
            BM ACTION <span className="text-[#54b380]">AVIS</span>
          </h2>
        </div>

        <div className="relative group max-w-sm mx-auto" ref={videoRef}>
          {/* Decorative background blur */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#54b380]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-slate-900/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

          {/* Video Player Container - Narrower width and taller height for portrait video */}
          <div className="relative aspect-[9/16] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-4 border-white bg-black transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_60px_120px_-20px_rgba(84,179,128,0.2)]">
            <video 
              ref={videoPlayerRef}
              className="w-full h-full object-contain"
              muted
              loop
              playsInline
              controls
              poster="https://res.cloudinary.com/dzjqki9gi/image/upload/v1767820347/Screenshot_2026-01-07_at_20.42.58_sirtjh.png"
            >
              <source src="https://res.cloudinary.com/dddvmez6s/video/upload/v1769107348/Avis_clients_sfknnc.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            
            {/* Branding Watermark */}
            <div className="absolute bottom-10 right-1/2 translate-x-1/2 pointer-events-none opacity-40">
               <img 
                 src="https://res.cloudinary.com/dddvmez6s/image/upload/v1769171783/logo_bm_action_renovation_habitat-1-1030x298_1_xzsibu.png" 
                 alt="" 
                 className="h-6 object-contain invert grayscale brightness-200"
               />
            </div>
          </div>
        </div>

        {/* Benefit Columns Section (Reduced Size) */}
        <div className="mt-12 max-w-3xl mx-auto border-t border-slate-50 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 relative">
            
            {/* Column 1: Label RGE */}
            <div className="flex items-center space-x-4 px-4 md:px-8 justify-center md:justify-start">
              <div className="flex-shrink-0 w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center shadow-lg shadow-slate-950/10">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h4 className="text-base md:text-lg font-black text-slate-950 uppercase tracking-tighter leading-none mb-0.5">
                  LABEL RGE QUALIBAT
                </h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  TRAVAUX ÉLIGIBLES AUX AIDES D'ÉTAT
                </p>
              </div>
            </div>

            {/* Desktop Vertical Divider */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-slate-100"></div>

            {/* Column 2: Economies Immédiates */}
            <div className="flex items-center space-x-4 px-4 md:px-8 justify-center md:justify-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#54b380] rounded-xl flex items-center justify-center shadow-lg shadow-[#54b380]/10">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white font-black text-sm leading-none">$</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="text-base md:text-lg font-black text-slate-950 uppercase tracking-tighter leading-none mb-0.5">
                  ÉCONOMIES IMMÉDIATES
                </h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  RÉDUCTION DES FACTURES GARANTIE
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonial;