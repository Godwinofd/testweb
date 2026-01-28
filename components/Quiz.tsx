import React, { useState, useEffect, useRef } from 'react';
import { QuizData } from '../types';

interface QuizProps {
  step: number;
  setStep: (step: number) => void;
  data: QuizData;
  setData: (data: QuizData | ((prev: QuizData) => QuizData)) => void;
  onStart?: () => void;
  onExit: () => void;
  isLockedView?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ step, setStep, data, setData, onStart, onExit, isLockedView = false }) => {
  const [loading, setLoading] = useState(false);
  const [currentTestimonialIdx, setCurrentTestimonialIdx] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [submissionTimestamp, setSubmissionTimestamp] = useState<number>(Date.now());
  const [error, setError] = useState<string>('');

  const testimonials = [
    {
      name: "Marc Lebrun",
      text: "Économies réelles de 30% sur ma facture de gaz. Travail soigné et équipe ponctuelle. Je recommande vivement Action Rénovation.",
      date: "Il y a 2 jours",
      address: "Lille (59)",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "Jean-Pierre Durand",
      text: "Excellent suivi pour les aides MaPrimeRénov. Je n'ai rien eu à gérer, le dossier a été validé en un temps record.",
      date: "Il y a 5 jours",
      address: "Bordeaux (33)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (step === 0 && onStart && !isLockedView) {
      onStart();
    }
    setStep(step + 1);
  };
  const handlePrev = () => setStep(Math.max(0, step - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const timestamp = Date.now();
      const startTime = submissionTimestamp;
      const secret = process.env.NEXT_PUBLIC_REQUEST_SIGNING_SECRET || '';

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        postcode: data.postcode,
        occupancyStatus: data.occupancyStatus,
        heatingType: data.heatingType,
        professionalSituation: data.professionalSituation,
        projectType: data.projectType,
        surfaceArea: data.surfaceArea,
        houseAge: data.houseAge,
        timeline: data.timeline,
        startTime: startTime
      };

      const payloadString = JSON.stringify({ ...payload, timestamp });

      // Proper HMAC-SHA256 matching backend
      const encoder = new TextEncoder();
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payloadString));
      const signature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const response = await fetch('/api/ghl-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...payload,
          website_url: '',
          timestamp,
          signature
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      // Success
      setLoading(false);
      setStep(99);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const selectOption = (field: keyof QuizData, value: string, autoNext: boolean = false) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Disqualification logic
    const isDisqualifying = (
      (field === 'occupancyStatus' && ['Bailleur', 'Appartement', 'Locataire'].includes(value)) ||
      (field === 'professionalSituation' && value === 'Autre')
    );

    if (isDisqualifying) {
      setTimeout(() => {
        setIsDisqualified(true);
      }, 350);
      return;
    }

    if (autoNext) {
      setTimeout(() => {
        handleNext();
      }, 350);
    }
  };

  const isStepComplete = () => {
    if (step === 0) return data.occupancyStatus !== '';
    if (step === 1) return data.heatingType !== '';
    if (step === 2) return data.professionalSituation !== '';
    if (step === 3) return data.firstName !== '' && data.lastName !== '' && data.email !== '' && data.phone !== '' && data.postcode !== '';
    return false;
  };

  const OptionCard = ({ label, value, field, autoNext = true, highlight }: { label: string, value: string, field: keyof QuizData, autoNext?: boolean, highlight?: string }) => (
    <button
      type="button"
      onClick={() => selectOption(field, value, autoNext)}
      className={`group flex items-center p-4 rounded-xl sm:rounded-2xl border-2 transition-all text-left shadow-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${data[field] === value
        ? 'border-[#54b380] bg-[#54b380]/5 ring-2 ring-[#54b380]/10'
        : 'border-slate-100 bg-white hover:border-slate-300'
        }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${data[field] === value ? 'border-[#54b380] bg-[#54b380]' : 'border-slate-200'
        }`}>
        {data[field] === value && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-black text-slate-950 text-sm sm:text-base uppercase tracking-tight leading-tight">{label}</span>
        {highlight && <span className={`text-[10px] font-bold mt-1 ${highlight.includes('non') ? 'text-rose-500' : 'text-[#54b380]'}`}>{highlight}</span>}
      </div>
    </button>
  );

  if (isDisqualified) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-8 sm:p-12 text-center animate-in zoom-in duration-500 border border-slate-100">
        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-slate-400">
          <svg className="w-7 h-7 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 sm:mb-6 uppercase tracking-tight">NON ÉLIGIBLE ACTUELLEMENT</h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-8 sm:mb-10">
          D'après vos réponses, votre profil ne correspond pas aux critères d'éligibilité pour les aides d'État (MaPrimeRénov) sur ce projet spécifique. <br /><br />
          Cependant, nous vous remercions de votre intérêt pour Action Rénovation Habitat.
        </p>
        <button onClick={() => { setIsDisqualified(false); onExit(); }} className="w-full bg-slate-950 text-white py-4 sm:py-5 rounded-full font-medium uppercase tracking-widest text-xs hover:scale-105 transition-transform">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-10 md:p-14 text-center animate-pulse border border-slate-100">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-[5px] sm:border-6 border-slate-100 border-t-[#54b380] rounded-full animate-spin mx-auto mb-6 sm:mb-8"></div>
        <h3 className="text-lg sm:text-xl font-black text-slate-950 mb-3 uppercase tracking-tight">Analyse technique...</h3>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-[9px] sm:text-[10px]">Calcul de vos aides en temps réel</p>
      </div>
    );
  }

  if (step === 99) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-8 sm:p-10 text-center animate-in zoom-in duration-500">
        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#54b380] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-white">
          <svg className="w-7 h-7 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-4 sm:mb-6 uppercase tracking-tight">DOSSIER EN COURS D'ÉTUDE</h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-8 sm:mb-10">
          Votre dossier est en cours d’étude. Nous vous contacterons dans les 24 à 48 prochaines heures afin de le finaliser ensemble. Merci de répondre à l’appel de notre conseiller pour la suite du traitement de votre dossier.
        </p>
        <button onClick={onExit} className="w-full bg-slate-950 text-white py-4 sm:py-5 rounded-full font-medium uppercase tracking-widest text-xs hover:scale-105 transition-transform">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const totalSteps = 3;

  return (
    <div className={`max-w-[580px] mx-auto transition-all duration-500 ${isLockedView ? 'pb-10' : 'pb-0'}`}>
      {step > 0 && (
        <div className="mb-3.5 sm:mb-5 px-2 animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-1 sm:mb-1.5">
            <span className="text-[#54b380] font-black text-[8px] sm:text-[9px] uppercase tracking-[0.2em]">Test d'éligibilité</span>
            <span className="text-[#54b380] font-black text-[9px] sm:text-xs">{Math.round((step / (totalSteps + 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1 sm:h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#54b380] h-full transition-all duration-1000 ease-out" style={{ width: `${(step / (totalSteps + 1)) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] p-5 sm:px-8 sm:py-10 border border-slate-50 relative min-h-[440px] sm:min-h-[480px] flex flex-col justify-center">
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 text-center mb-6 uppercase tracking-tight leading-none">Vous êtes :</h2>
            <div className="space-y-3">
              <OptionCard field="occupancyStatus" label="Propriétaire occupant d'une maison" highlight="(éligible)" value="Occupant" />
              <OptionCard field="occupancyStatus" label="Bailleur" highlight="(non éligible)" value="Bailleur" />
              <OptionCard field="occupancyStatus" label="Propriétaire d’un appartement" highlight="(non éligible)" value="Appartement" />
              <OptionCard field="occupancyStatus" label="Locataire" highlight="(non éligible)" value="Locataire" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 text-center mb-6 uppercase tracking-tight leading-none">Quel est votre mode de chauffage actuel ?</h2>
            <div className="space-y-3">
              <OptionCard field="heatingType" label="Gaz" value="Gaz" />
              <OptionCard field="heatingType" label="Fioul" value="Fioul" />
              <OptionCard field="heatingType" label="Électricité" value="Elec" />
              <OptionCard field="heatingType" label="Autre" value="Autre" />
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={handlePrev} className="text-slate-400 font-bold uppercase text-[9px] tracking-widest border-b border-transparent hover:border-slate-300 transition-colors">Retour</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 text-center mb-6 uppercase tracking-tight leading-none">Quelle est votre situation professionnelle ?</h2>
            <div className="space-y-3">
              <OptionCard field="professionalSituation" label="CDI" highlight="(éligible)" value="CDI" />
              <OptionCard field="professionalSituation" label="Retraité de moins de 65 ans" highlight="(éligible)" value="Retraite" />
              <OptionCard field="professionalSituation" label="Indépendant de plus de 3 ans" highlight="(éligible)" value="Independant" />
              <OptionCard field="professionalSituation" label="Autre situation" highlight="(non éligible)" value="Autre" />
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={handlePrev} className="text-slate-400 font-bold uppercase text-[9px] tracking-widest border-b border-transparent hover:border-slate-300 transition-colors">Retour</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-8 duration-500 w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 text-center mb-6 uppercase tracking-tight leading-none">DERNIÈRE ÉTAPE</h2>
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-0.5">
                  <label className="text-slate-700 font-bold text-[9px] uppercase tracking-widest ml-1">Prénom *</label>
                  <input required type="text" placeholder="écrivez votre prénom" className="w-full px-5 py-3.5 border-2 border-slate-950 rounded-2xl focus:border-[#54b380] outline-none transition-all font-medium text-slate-800 bg-white text-sm" value={data.firstName} onChange={(e) => setData(prev => ({ ...prev, firstName: e.target.value }))} />
                </div>
                <div className="space-y-0.5">
                  <label className="text-slate-700 font-bold text-[9px] uppercase tracking-widest ml-1">Nom de famille *</label>
                  <input required type="text" placeholder="Écrivez votre nom de famille" className="w-full px-5 py-3.5 border-2 border-slate-950 rounded-2xl focus:border-[#54b380] outline-none transition-all font-medium text-slate-800 bg-white text-sm" value={data.lastName} onChange={(e) => setData(prev => ({ ...prev, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-0.5">
                <label className="text-slate-700 font-bold text-[9px] uppercase tracking-widest ml-1">Code postal *</label>
                <input required type="text" placeholder="Entrez votre code postal" className="w-full px-5 py-3.5 border-2 border-slate-950 rounded-2xl focus:border-[#54b380] outline-none transition-all font-medium text-slate-800 bg-white text-sm" value={data.postcode} onChange={(e) => setData(prev => ({ ...prev, postcode: e.target.value }))} />
              </div>
              <div className="space-y-0.5">
                <label className="text-slate-700 font-bold text-[9px] uppercase tracking-widest ml-1">E-mail *</label>
                <input required type="email" placeholder="Entrez votre email" className="w-full px-5 py-3.5 border-2 border-slate-950 rounded-2xl focus:border-[#54b380] outline-none transition-all font-medium text-slate-800 bg-white text-sm" value={data.email} onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="space-y-0.5">
                <label className="text-slate-700 font-bold text-[9px] uppercase tracking-widest ml-1">Numéro de téléphone *</label>
                <input required type="tel" placeholder="Entrez votre numéro" className="w-full px-5 py-3.5 border-2 border-slate-950 rounded-2xl focus:border-[#54b380] outline-none transition-all font-medium text-slate-800 bg-white text-sm" value={data.phone} onChange={(e) => setData(prev => ({ ...prev, phone: e.target.value }))} />
              </div>

              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                aria-hidden="true"
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-7">
              <button
                type="submit"
                disabled={!isStepComplete()}
                className="relative w-full group overflow-hidden bg-[#54b380] text-white py-5 rounded-full font-black text-sm shadow-xl shadow-[#54b380]/30 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
              >
                <span className="relative flex items-center justify-center space-x-3 uppercase tracking-tight">
                  <span>Voir mes aides</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>

            <button type="button" onClick={handlePrev} className="mt-4 text-slate-400 font-medium uppercase text-[9px] tracking-widest flex items-center mx-auto hover:text-slate-600 transition-colors">Retour</button>
          </form>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { label: "100% SANS ENGAGEMENT", icon: "M5 13l4 4L19 7" },
            { label: "100% GRATUIT", icon: "M5 13l4 4L19 7" },
            { label: "100% SÉCURISÉ", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }
          ].map((badge, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#54b380]/5 rounded-full border border-[#54b380]/10 shadow-sm transition-all hover:bg-[#54b380]/10">
              <svg className="w-2.5 h-2.5 text-[#54b380]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5">
                <path d={badge.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-[#54b380]">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Form Social Proof Testimonial Section - Positioned at the very bottom as requested */}
        <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in duration-700 delay-300">
          <div className="relative min-h-[140px] sm:min-h-[120px] w-full">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 flex flex-col items-center ${idx === currentTestimonialIdx ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                  }`}
              >
                {/* Header: Photo, Name, Verified */}
                <div className="flex items-center space-x-4 mb-3 w-full max-w-[90%] justify-center">
                  <div className="relative">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <svg className="w-4 h-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-slate-900 tracking-tight">{t.name}</span>
                      <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#f1f3f4] rounded-md">
                        <svg className="w-3 h-3 text-[#5f6368]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5h2v5h-2zm0-7v-2h2v2h-2z" />
                        </svg>
                        <span className="text-[8px] font-black text-[#5f6368] uppercase tracking-wider">Vérifié Google</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-[#FBBC05] space-x-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{t.date}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{t.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Review Text */}
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium italic text-center max-w-[85%] leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;