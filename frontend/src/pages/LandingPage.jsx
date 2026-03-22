import React, { useEffect } from 'react';

import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingProblem from '../components/landing/LandingProblem';
import LandingTransformation from '../components/landing/LandingTransformation';
import LandingSystemPower from '../components/landing/LandingSystemPower';
import LandingFinalState from '../components/landing/LandingFinalState';

const LandingPage = () => {
  // Reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 text-slate-300 min-h-screen font-sans selection:bg-brand-500 selection:text-white">
      <LandingNavbar />
      
      <main>
        <LandingHero />
        <LandingProblem />
        <LandingTransformation />
        <LandingSystemPower />
        <LandingFinalState />
      </main>
    </div>
  );
};

export default LandingPage;
