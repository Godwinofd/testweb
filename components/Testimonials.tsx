
import React from 'react';

interface Review {
  name: string;
  text: string;
  city: string;
}

const Testimonials: React.FC = () => {
  const reviews: Review[] = [
    { name: "MARC L.", city: "LYON", text: "Économies réelles de 30% sur ma facture de gaz. Travail soigné et équipe ponctuelle." },
    { name: "SOPHIE B.", city: "NANTES", text: "Isolation par l'extérieur impeccable. Ma maison a retrouvé une seconde jeunesse." },
    { name: "JEAN-PIERRE D.", city: "BORDEAUX", text: "Excellent suivi pour les aides MaPrimeRénov. Je n'ai rien eu à gérer, top !" },
    { name: "AMÉLIE V.", city: "TOULOUSE", text: "Ravalement parfait. Les finitions sont exemplaires, on voit que c'est du sérieux." },
    { name: "THOMAS G.", city: "LYON", text: "Équipe très professionnelle. Le chantier a été rendu propre tous les soirs." },
    { name: "CATHERINE P.", city: "MARSEILLE", text: "Gain de confort immédiat. On ne sent plus les courants d'air près des murs." },
    { name: "ROBERT F.", city: "LILLE", text: "Devis clair et respecté. Pas de mauvaises surprises, je recommande vivement." },
    { name: "NATHALIE M.", city: "PARIS", text: "Très bon rapport qualité/prix. L'ITE a vraiment changé notre quotidien." },
    { name: "LUCAS S.", city: "STRASBOURG", text: "Expertise technique au rendez-vous. De très bons conseils pour la couleur." },
    { name: "SYLVIE K.", city: "NICE", text: "Une équipe à l'écoute et réactive. Le résultat dépasse nos espérances." },
    { name: "FRANÇOIS H.", city: "RENNES", text: "Traitement de toiture efficace. Plus aucune trace de mousse après 6 mois." },
    { name: "ISABELLE J.", city: "MONTPELLIER", text: "Menuiseries de qualité. L'isolation phonique est impressionnante." },
    { name: "DAVID W.", city: "GRENOBLE", text: "Sérieux et rigueur. C'est rare de trouver des artisans aussi méticuleux." },
    { name: "CHANTAL R.", city: "TOURS", text: "Aides d'État obtenues sans encombre grâce à leur dossier technique." },
    { name: "PATRICK L.", city: "ANNECY", text: "Efficacité redoutable. Ma maison est transformée esthétiquement." }
  ];

  // Duplicate for seamless infinite loop
  const doubleReviews = [...reviews, ...reviews];

  return (
    <section className="py-12 md:py-16 bg-[#fcfdfe] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-6 md:mb-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#54b380]/10 text-[#54b380] font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">
          NOS CLIENTS SONT NOS MEILLEURS AMBASSADEURS
        </div>
      </div>

      <div className="w-full relative flex overflow-hidden select-none">
        <div className="flex w-fit animate-testimonial-scroll hover:pause whitespace-nowrap py-6 md:py-10">
          {doubleReviews.map((rev, i) => (
            <div 
              key={i} 
              className="inline-flex flex-col w-[280px] sm:w-[350px] md:w-[450px] mx-3 sm:mx-4 bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-50 relative shrink-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_40px_80px_-15px_rgba(84,179,128,0.1)]"
            >
              {/* Stars */}
              <div className="flex text-[#FBBC05] space-x-0.5 sm:space-x-1 mb-4 sm:mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-4 h-4 sm:w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote text */}
              <p className="text-slate-900 font-extrabold text-base sm:text-lg md:text-xl leading-[1.3] mb-6 sm:mb-8 whitespace-normal tracking-tight italic">
                "{rev.text}"
              </p>

              {/* Divider line */}
              <div className="w-full h-[1px] bg-slate-100 mb-4 sm:mb-6"></div>

              {/* Bottom Row */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-black text-slate-950 text-sm sm:text-base tracking-tight">{rev.name}</span>
                  <span className="text-slate-400 font-bold uppercase text-[8px] sm:text-[9px] tracking-[0.2em] mt-0.5 sm:mt-1">CLIENT VÉRIFIÉ</span>
                </div>
                
                {/* Location Badge */}
                <div className="bg-[#e8f5ed] px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#54b380]/10">
                  <span className="text-[#54b380] font-black text-[8px] sm:text-[10px] tracking-widest uppercase leading-none">
                    {rev.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes testimonial-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-testimonial-scroll {
          animation: testimonial-scroll 35s linear infinite;
        }
        @media (min-width: 768px) {
          .animate-testimonial-scroll {
            animation: testimonial-scroll 45s linear infinite;
          }
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
