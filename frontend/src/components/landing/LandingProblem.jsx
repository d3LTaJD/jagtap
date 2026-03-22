import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageSquare, Mail, FileSpreadsheet, FileText, Phone } from 'lucide-react';

const FloatingHazard = ({ icon: Icon, color, delay, xOffset, yOffset, rotateInit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: rotateInit - 20 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotateInit }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      animate={{
        y: [0, yOffset, 0],
        x: [0, xOffset, 0],
      }}
      className={`absolute flex items-center justify-center p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md bg-slate-900/50 border border-slate-800 ${color}`}
      style={{
        transition: 'y 4s ease-in-out infinite, x 6s ease-in-out infinite'
      }}
    >
      <Icon className="w-8 h-8 drop-shadow-md" />
    </motion.div>
  );
};

const LandingProblem = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  return (
    <section ref={containerRef} className="relative min-h-[80vh] flex flex-col items-center justify-center bg-slate-950 overflow-hidden py-32 z-10">
      
      {/* Dark mode grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>

      {/* Floating scattered icons (Chaos) */}
      <div className="absolute inset-0 z-10 w-full h-full max-w-6xl mx-auto pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <FloatingHazard icon={MessageSquare} color="text-green-400" delay={0.1} xOffset={20} yOffset={-30} rotateInit={-15} />
          <div className="absolute top-[20%] left-[15%]"><FloatingHazard icon={FileSpreadsheet} color="text-emerald-400" delay={0.2} xOffset={-20} yOffset={40} rotateInit={12} /></div>
          <div className="absolute top-[30%] right-[10%]"><FloatingHazard icon={Mail} color="text-blue-400" delay={0.3} xOffset={30} yOffset={-20} rotateInit={-8} /></div>
          <div className="absolute bottom-[20%] left-[25%]"><FloatingHazard icon={Phone} color="text-amber-400" delay={0.4} xOffset={-15} yOffset={25} rotateInit={20} /></div>
          <div className="absolute bottom-[30%] right-[20%]"><FloatingHazard icon={FileText} color="text-slate-300" delay={0.5} xOffset={25} yOffset={-15} rotateInit={-25} /></div>
        </div>
      </div>

      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-20 text-center max-w-3xl px-6"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Operations <span className="text-slate-500 line-through decoration-red-500/60 decoration-4">scattered</span> shouldn't be scattered.
        </h2>
        <p className="mt-8 text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
          Disconnected Excel sheets, undocumented WhatsApp approvals, and forgotten emails lead to missed opportunities and production delays.
        </p>
      </motion.div>

    </section>
  );
};

export default LandingProblem;
