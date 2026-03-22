import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ClipboardList, TrendingUp, Users } from 'lucide-react';

const FloatingCard = ({ icon: Icon, title, desc, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay, type: 'spring' }}
    className={`absolute bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl shadow-black/50 flex items-start gap-4 ${className}`}
  >
    <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl border border-brand-500/20">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{desc}</p>
    </div>
  </motion.div>
);

const LandingHero = () => {
  return (
    <section id="overview" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
      
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/20 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10 w-full mt-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mb-8 flex justify-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(37,99,235,0.2)]"
            >
              Enterprise Grade Workflow
            </motion.span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05]">
            Industrial Operations, <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-blue-500 to-indigo-400 drop-shadow-sm">Automated.</span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            From enquiry capture to final execution. A single source of truth structured for heavy manufacturing and fabrication.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Start Managing Smarter
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all backdrop-blur-sm">
              View Explainer Demo
            </button>
          </div>
        </motion.div>

        {/* Floating UI Elements indicating the system */}
        <div className="relative w-full max-w-5xl h-[400px] mt-24 hidden md:block perspective-1000">
          <FloatingCard 
            icon={Users} title="New Leads" desc="IndiaMart synced" delay={0.4}
            className="left-[5%] top-10 -rotate-6 hover:rotate-0 hover:z-30 transition-transform duration-500" 
          />
          <FloatingCard 
            icon={FileText} title="Quotation Gen" desc="Multi-currency" delay={0.6}
            className="right-[10%] top-4 rotate-6 z-10 hover:rotate-0 hover:z-30 transition-transform duration-500" 
          />
          <FloatingCard 
            icon={ClipboardList} title="QAP Approvals" desc="Director signed" delay={0.8}
            className="left-[30%] top-48 -rotate-2 z-20 hover:rotate-0 hover:z-30 transition-transform duration-500" 
          />
          <FloatingCard 
            icon={TrendingUp} title="Live Dashboard" desc="₹1.2Cr Pipeline" delay={1.0}
            className="right-[25%] top-56 rotate-3 z-10 hover:rotate-0 hover:z-30 transition-transform duration-500" 
          />
        </div>

      </div>
    </section>
  );
};

export default LandingHero;
