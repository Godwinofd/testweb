import React, { useState, useRef, useEffect } from 'react';
import Hero from './components/Hero';
import Quiz from './components/Quiz';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import VideoTestimonial from './components/VideoTestimonial';
import Partners from './components/Partners';
import Footer from './components/Footer';
import GoogleTrust from './components/GoogleTrust';
import Discovery from './components/Discovery';
import ComparisonSlider from './components/ComparisonSlider';
import { QuizData } from './types';

const initialQuizData: QuizData = {
  projectType: '',
  occupancyStatus: '',
  surfaceArea: '',
  houseAge: '',
  heatingType: '',
  professionalSituation: '',
  timeline: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  postcode: ''
};

const App: React.FC = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);
  
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isQuizActive) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
      document.documentElement.style.overflow = 'unset';
    }
  }, [isQuizActive]);

  const scrollToQuiz = () => {
    quizRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartQuiz = () => {
    setIsQuizActive(true);
  };

  const handleExitQuiz = () => {
    setIsQuizActive(false);
    setQuizStep(0);
    setQuizData(initialQuizData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quizProps = {
    step: quizStep,
    setStep: setQuizStep,
    data: quizData,
    setData: setQuizData,
    onStart: handleStartQuiz,
    onExit: handleExitQuiz,
    isLockedView: isQuizActive
  };

  if (isQuizActive) {
    return (
      <div className="fixed inset-0 z-[999] bg-white flex flex-col overflow-hidden animate-in fade-in duration-500">
        <header className="p-4 md:p-6 grid grid-cols-3 items-center border-b border-slate-100 bg-white sticky top-0 z-[1000]">
          <div />
          <div className="flex justify-center">
            <img 
              src="https://res.cloudinary.com/dddvmez6s/image/upload/v1769171783/logo_bm_action_renovation_habitat-1-1030x298_1_xzsibu.png" 
              alt="Logo" 
              className="h-7 md:h-10 object-contain mix-blend-multiply"
            />
          </div>
          <div className="flex items-center justify-end space-x-2">
            <span className="text-[10px] font-black text-[#54b380] uppercase tracking-[0.2em] hidden md:block">Session Sécurisée</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#54b380] animate-pulse shadow-[0_0_8px_rgba(84,179,128,0.5)]"></div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto py-8 md:py-12 px-4 bg-slate-50/30">
          <div className="max-w-4xl mx-auto">
             <Quiz {...quizProps} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#54b380]/30 bg-[#fcfdfe]">
      <div className="w-full pt-8 pb-4 md:pt-12 md:pb-6 flex justify-center bg-[#fcfdfe]">
        <img 
          src="https://res.cloudinary.com/dddvmez6s/image/upload/v1769171783/logo_bm_action_renovation_habitat-1-1030x298_1_xzsibu.png" 
          alt="Action Rénovation Habitat Logo" 
          className="h-20 md:h-28 lg:h-32 object-contain mix-blend-multiply transition-all duration-500 hover:scale-105"
        />
      </div>
      
      <main className="flex-grow">
        <Hero onCtaClick={scrollToQuiz} />
        
        <div ref={quizRef} className="px-4 mt-6 md:mt-10 lg:mt-12">
          <Quiz {...quizProps} />
        </div>

        <GoogleTrust />
        <Features onColumnClick={scrollToQuiz} />
        <VideoTestimonial />
        <Discovery onCtaClick={scrollToQuiz} />
        <ComparisonSlider />
        <Testimonials />
        <Partners />
      </main>

      <Footer />
    </div>
  );
};

export default App;