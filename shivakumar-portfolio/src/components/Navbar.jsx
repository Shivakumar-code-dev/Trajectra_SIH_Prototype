import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Terminal, ShieldCheck, ExternalLink } from 'lucide-react';
import { toggleAudio, isAudioEnabled, playCyberClick } from '../utils/audio';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const nextState = !audioOn;
    setAudioOn(nextState);
    toggleAudio(nextState);
    if (nextState) playCyberClick();
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Internship', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#060813]/90 backdrop-blur-md border-b border-cyan-500/30 py-3 shadow-[0_4px_30px_rgba(0,240,255,0.15)]' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a 
          href="#" 
          onClick={playCyberClick}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-orbitron font-bold group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-extrabold text-lg tracking-wider text-white group-hover:text-cyan-400 transition-colors">
              SHIVAKUMAR<span className="text-cyan-400">.GAMA</span>
            </span>
            <span className="text-[10px] font-mono-code text-cyan-400/70 tracking-widest uppercase">
              CS Engineer & Developer
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={playCyberClick}
              className="text-sm font-mono-code text-slate-300 hover:text-cyan-400 transition-all hover:text-shadow-[0_0_8px_rgba(0,240,255,0.8)] relative group py-1"
            >
              <span className="text-cyan-500/60 text-xs mr-1">&gt;</span>
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Actions (Status badge & Sound toggle) */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono-code">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AVAILABLE FOR HIRE</span>
          </div>

          <button
            onClick={handleSoundToggle}
            className={`p-2.5 rounded-lg border transition-all ${
              audioOn 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]' 
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={audioOn ? 'Audio FX Enabled' : 'Enable Audio FX'}
          >
            {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-cyan-400"
          >
            {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              playCyberClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070a18]/95 backdrop-blur-xl border-b border-cyan-500/40 px-4 py-6 space-y-4 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                playCyberClick();
                setMobileMenuOpen(false);
              }}
              className="block text-base font-mono-code text-slate-200 hover:text-cyan-400 py-2 border-b border-slate-800/60"
            >
              <span className="text-cyan-400 mr-2">#</span>
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono-code text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: OPEN TO WORK
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
