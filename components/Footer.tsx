import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1221] text-slate-400 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
          
          {/* Left Side: Brand & Description */}
          <div className="flex flex-col space-y-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-xl shadow-lg w-14 h-14 flex items-center justify-center flex-shrink-0">
                <img 
                  src="https://res.cloudinary.com/dddvmez6s/image/upload/v1769171783/logo_bm_action_renovation_habitat-1-1030x298_1_xzsibu.png" 
                  alt="BM Action" 
                  className="w-full h-auto object-contain mix-blend-multiply"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight leading-none">
                  ACTION RÉNOVATION
                </h3>
                <span className="text-[#54b380] text-sm font-black uppercase tracking-[0.2em] mt-1">
                  HABITAT
                </span>
              </div>
            </div>
            
            <p className="max-w-md text-slate-400 leading-relaxed font-medium">
              Spécialiste de l'enveloppe extérieure et de l'efficacité énergétique. 
              Nous protégeons et isolons votre patrimoine avec les meilleures technologies IA et RGE.
            </p>
          </div>

          {/* Right Side: Contact Expertise */}
          <div className="flex flex-col lg:items-end">
            <div className="flex flex-col space-y-6">
              <h4 className="text-white text-sm font-black uppercase tracking-[0.2em] mb-2 lg:text-right">
                CONTACT EXPERTISE
              </h4>
              
              <div className="flex items-center space-x-4 lg:justify-end group cursor-pointer">
                <span className="text-slate-300 font-black group-hover:text-white transition-colors">Service National - France</span>
                <span className="text-xl">📍</span>
              </div>

              {/* Phone Number Entry */}
              <a href="tel:0189712345" className="flex items-center space-x-4 lg:justify-end group cursor-pointer">
                <div className="flex flex-col items-end">
                  <span className="text-[#54b380] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Ligne Directe</span>
                  <span className="text-white text-xl md:text-2xl font-black group-hover:text-[#54b380] transition-colors">01 89 71 23 45</span>
                </div>
                <div className="bg-[#54b380] p-3 rounded-xl group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(84,179,128,0.2)]">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.82 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
              </a>

              <div className="flex items-center space-x-4 lg:justify-end group cursor-pointer">
                <span className="text-slate-300 font-black group-hover:text-white transition-colors">Diagnostic Gratuit</span>
                <div className="bg-slate-800/50 p-2 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                   <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <a href="mailto:contact@action-renovation.fr" className="flex items-center space-x-4 lg:justify-end group cursor-pointer">
                <span className="text-slate-300 font-black group-hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">contact@action-renovation.fr</span>
                <div className="bg-slate-800/50 p-2 rounded-lg group-hover:bg-slate-700/50 transition-colors">
                  <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500">
            © {new Date().getFullYear()} ACTION RÉNOVATION HABITAT. TOUS DROITS RÉSERVÉS. CERTIFIÉ RGE.
          </div>
          
          <div className="flex items-center space-x-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">CONFIDENTIALITÉ</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">MENTIONS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;