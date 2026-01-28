
import React from 'react';

const Partners: React.FC = () => {
  const logos = [
    "https://res.cloudinary.com/dddvmez6s/image/upload/v1769175995/LogoCEE550-Photoroom_rdrcz7.png",
    "https://res.cloudinary.com/dddvmez6s/image/upload/v1769117425/slazzer-preview-tt90x_iou0uq.png",
    "https://res.cloudinary.com/dddvmez6s/image/upload/v1769117425/slazzer-preview-1lotp_b9ojim.png"
  ];

  return (
    <section className="py-12 md:py-20 bg-white border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-10">
          <span className="text-[10px] font-black text-[#54b380] uppercase tracking-[0.3em] mb-4">NOS CERTIFICATIONS & PARTENAIRES</span>
          <div className="h-0.5 w-12 bg-[#54b380]/20"></div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 transition-all duration-700">
          {logos.map((logo, i) => (
            <div key={i} className="group flex items-center justify-center p-2 shrink-0">
              <img 
                src={logo} 
                alt="Logo Partenaire CEE Qualibat" 
                className="h-14 sm:h-20 md:h-24 lg:h-32 w-auto object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-md opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
