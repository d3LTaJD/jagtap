import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const FeatureList = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="mt-1 p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-slate-100 font-bold">{title}</h4>
      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const LandingSystemPower = () => {
  return (
    <section className="bg-slate-950 py-32 overflow-hidden relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <span className="text-brand-400 font-bold uppercase tracking-widest text-xs shadow-[0_0_10px_rgba(37,99,235,0.2)]">Total Visibility</span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
            Built for heavy <br className="hidden md:block"/> operations.
          </h2>
          <p className="mt-6 text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
            Move away from guesswork. Get real-time views into your sales pipeline, ongoing negotiations, and manufacturing approvals.
          </p>
          
          <div className="mt-12 space-y-8">
            <FeatureList 
              icon={LayoutDashboard} 
              title="Real-Time Dashboards" 
              desc="Instantly track active enquiries, pending quotations, and won value across your entire team." 
            />
            <FeatureList 
              icon={ShieldCheck} 
              title="Role-Based Security" 
              desc="Directors, Sales Engineers, and QC teams see exactly what they need to, when they need to." 
            />
            <FeatureList 
              icon={Zap} 
              title="Automated Escalations" 
              desc="Missed follow-ups automatically escalate after 48 hours to ensure zero opportunities slip through." 
            />
          </div>
        </motion.div>

        {/* Right: Mock UI visual in Dark Mode */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative perspective-1000"
        >
          {/* Abstract floating Dashboard window */}
          <div className="relative z-20 bg-slate-900 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-slate-800 p-6 overflow-hidden transform rotate-y-3">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            
            {/* Dark mode mock charts */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="h-28 bg-brand-900/40 border border-brand-500/20 rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/20 blur-xl rounded-full"></div>
                <div className="text-xs font-bold text-brand-300 mb-1 z-10">Active Pipeline</div>
                <div className="h-8 w-24 bg-brand-500/40 rounded shadow-[0_0_10px_rgba(37,99,235,0.2)] z-10"></div>
              </div>
              <div className="h-28 bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full"></div>
                <div className="text-xs font-bold text-emerald-400 mb-1 z-10">Won Revenue</div>
                <div className="h-8 w-32 bg-emerald-500/40 rounded shadow-[0_0_10px_rgba(16,185,129,0.2)] z-10"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-14 w-full bg-slate-800/60 rounded-xl flex items-center px-4 gap-4 border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-md" />
                <div className="h-3 w-48 bg-slate-600 rounded"></div>
              </div>
              <div className="h-14 w-full bg-slate-800/60 rounded-xl flex items-center px-4 gap-4 border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-md" />
                <div className="h-3 w-32 bg-slate-600 rounded"></div>
              </div>
              <div className="h-14 w-full bg-slate-800/60 rounded-xl flex items-center px-4 gap-4 border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-slate-500" />
                <div className="h-3 w-56 bg-slate-600 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Decorative background blurs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-brand-600/20 to-indigo-600/20 blur-[100px] mix-blend-screen -z-10 pointer-events-none"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default LandingSystemPower;
