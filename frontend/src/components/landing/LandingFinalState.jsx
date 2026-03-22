import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingFinalState = () => {
  return (
    <section className="bg-slate-950 py-32 px-6 relative overflow-hidden border-t border-white/5">
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(37,99,235,0.15)_0%,transparent_60%)]"></div>
        {/* Abstract beam */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1/2 bg-gradient-to-t from-brand-600/20 to-transparent blur-[80px] pointer-events-none"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <span className="px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-widest shadow-[inset_0_1px_rgba(255,255,255,0.1)] backdrop-blur-md">
          The Final Result
        </span>
        
        <h2 className="mt-8 text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05]">
          From chaos to <br /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 drop-shadow-sm">complete control.</span>
        </h2>
        
        <p className="mt-8 text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Ditch the spreadsheets and endless email chains. Bring your entire engineering, sales, and manufacturing documentation into one structured workflow.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/login"
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-base font-bold transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] flex items-center justify-center gap-3 group"
          >
            Go to Platform
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="mailto:info@jagtapengineering.com" 
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/5 hover:bg-white/10 text-white text-base font-bold transition-all border border-white/10 backdrop-blur-sm"
          >
            Contact Sales
          </a>
        </div>
      </motion.div>

      {/* Footer minimal */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-slate-600 text-xs font-medium tracking-wide">
          © {new Date().getFullYear()} Jagtap Engineering. All rights reserved.
        </p>
      </div>

    </section>
  );
};

export default LandingFinalState;
