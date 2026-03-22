import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, MessageSquare, Calculator, CheckSquare, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  { id: 1, title: 'Enquiry', desc: 'Capture every opportunity centrally.', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 2, title: 'Follow-up', desc: 'Never miss a critical conversation.', icon: MessageSquare, color: 'text-violet-600 bg-violet-50 border-violet-200' },
  { id: 3, title: 'Quotation', desc: 'Generate faster, respond smarter.', icon: Calculator, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 4, title: 'QAP', desc: 'Ensure quality and track approvals.', icon: CheckSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 5, title: 'Dashboard', desc: 'See everything, instantly.', icon: BarChart3, color: 'text-brand-600 bg-brand-50 border-brand-200' },
];

const LandingTransformation = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  return (
    <section ref={containerRef} className="bg-slate-900 min-h-[250vh] relative pt-32 pb-64">
      {/* Sticky container that pins the visualization while scrolling */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background glow representing structure */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]"
          style={{
            scale: useTransform(scrollYProgress, [0, 1], [0.5, 1.5]),
            opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1])
          }}
        />

        <div className="z-10 text-center mb-16 px-6">
          <motion.h2 
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }}
          >
            The Structural Pipeline
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto"
            style={{ opacity: useTransform(scrollYProgress, [0.05, 0.15], [0, 1]) }}
          >
            Watch your scattered data align into a single, unbreakable automated flow.
          </motion.p>
        </div>

        {/* 3D scrolling pipeline visualization */}
        <div className="relative w-full max-w-5xl mx-auto px-6 h-96 [perspective:1000px] flex items-center justify-center">
          
          {/* Connector Line behind cards */}
          <motion.div 
            className="absolute left-[10%] right-[10%] h-1 bg-slate-800 rounded-full top-1/2 -translate-y-1/2 z-0"
            style={{ 
              opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]) 
            }}
          >
            <motion.div 
              className="h-full bg-brand-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              style={{
                width: useTransform(scrollYProgress, [0.15, 0.9], ['0%', '100%'])
              }}
            />
          </motion.div>

          <div className="flex items-center justify-between w-full relative z-10 gap-4 overflow-x-auto md:overflow-visible pb-10 md:pb-0 px-4 scrollbar-hide">
            {steps.map((step, index) => {
              // Calculate scroll range for this specific step to "activate"
              const start = 0.15 + (index * 0.15);
              const active = start + 0.05;

              const opacity = useTransform(scrollYProgress, [start - 0.1, start], [0, 1]);
              const y = useTransform(scrollYProgress, [start - 0.1, start], [50, 0]);
              const scale = useTransform(scrollYProgress, [start, active, active + 0.1], [0.9, 1.1, 1]);
              
              const isPassed = useTransform(scrollYProgress, v => v >= active);

              return (
                <motion.div 
                  key={step.id}
                  style={{ opacity, y, scale }}
                  className="flex flex-col items-center flex-shrink-0 w-32 md:w-40"
                >
                  <motion.div 
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border-2 bg-slate-800 border-slate-700 shadow-2xl transition-colors duration-500 relative`}
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                      style={{ 
                        borderColor: isPassed ? 'rgba(37,99,235,0.8)' : 'rgba(51,65,85,1)',
                        backgroundColor: isPassed ? 'rgba(37,99,235,0.1)' : 'transparent',
                        transition: 'all 0.3s ease-out'
                      }}
                    />
                    <step.icon className={`w-8 h-8 md:w-10 md:h-10 z-10 transition-colors duration-300`} 
                      style={{ color: isPassed ? '#60A5FA' : '#94A3B8' }} 
                    />
                  </motion.div>
                  
                  <div className="mt-6 text-center">
                    <h4 className="text-white font-bold text-sm md:text-base">{step.title}</h4>
                    <p className="text-slate-400 text-[10px] md:text-xs mt-1 leading-tight hidden md:block">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default LandingTransformation;
