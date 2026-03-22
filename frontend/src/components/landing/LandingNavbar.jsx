import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/20' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-black tracking-tight text-lg text-white">
            Jagtap <span className="text-slate-300 font-medium">Workflows</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Overview', 'Modules', 'Dashboard', 'Features'].map(link => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="text-sm font-semibold transition-colors text-slate-300 hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login"
            className="text-sm font-bold transition-colors text-slate-200 hover:text-white"
          >
            Sign In
          </Link>
          <Link 
            to="/login"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 border border-transparent"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;
