import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Send, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import confetti from 'canvas-confetti';
import { playCyberClick } from '../utils/audio';

export default function ContactSection() {
  const { personalInfo } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    playCyberClick();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personalInfo.phone);
    setCopiedPhone(true);
    playCyberClick();
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playCyberClick();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#ff007f', '#8b5cf6']
    });
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 relative bg-black/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONNECT WITH ME</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            GET IN <span className="text-cyan-400">TOUCH</span>
          </h2>
          <p className="text-slate-300 font-mono-code text-sm">
            Seeking entry-level Software Developer / Backend Developer opportunities.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Cards (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <div className="cyber-box p-6 rounded-2xl flex items-center justify-between border border-cyan-500/30 hover:border-cyan-400">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono-code text-slate-400 uppercase">EMAIL ADDRESS</div>
                  <a href={`mailto:${personalInfo.email}`} className="text-sm font-mono-code font-bold text-white hover:text-cyan-400 transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Card - Clean display of 9845981632 */}
            <div className="cyber-box p-6 rounded-2xl flex items-center justify-between border border-cyan-500/30 hover:border-cyan-400">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono-code text-slate-400 uppercase">PHONE NUMBER</div>
                  <a href={`tel:${personalInfo.phone}`} className="text-sm font-mono-code font-bold text-white hover:text-cyan-400 transition-colors">
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyPhone}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all"
                title="Copy Phone"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Location Card */}
            <div className="cyber-box p-6 rounded-2xl flex items-center gap-4 border border-cyan-500/30">
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-mono-code text-slate-400 uppercase">LOCATION</div>
                <div className="text-sm font-mono-code font-bold text-white">
                  {personalInfo.location}
                </div>
              </div>
            </div>

            {/* Social Links Box */}
            <div className="cyber-box p-6 rounded-2xl space-y-4 border border-slate-800">
              <div className="text-xs font-mono-code text-slate-400 uppercase">PROFILES & REPOSITORIES</div>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playCyberClick}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-200 hover:text-cyan-400 font-mono-code text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-cyan-400" />
                    GitHub
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playCyberClick}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-200 hover:text-cyan-400 font-mono-code text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4 text-cyan-400" />
                    LinkedIn
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Interactive Contact Form (Right 7 Cols) */}
          <div className="lg:col-span-7 cyber-box p-6 sm:p-8 rounded-2xl border border-cyan-500/30">
            <h3 className="text-xl font-orbitron font-bold text-white mb-2">
              SEND DIRECT MESSAGE
            </h3>
            <p className="text-xs font-mono-code text-slate-400 mb-6">
              Fill out this form to reach out for projects, hiring, or collaborations.
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-3 animate-fadeIn">
                <Check className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-orbitron font-bold text-white text-lg">MESSAGE DISPATCHED SUCCESSFULLY!</h4>
                <p className="text-xs font-mono-code text-emerald-300">
                  Thank you for reaching out. Shivakumar will respond to your email shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Recruiter / Hiring Manager"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 font-mono-code text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-code text-slate-300 mb-1">YOUR EMAIL</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="recruiter@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 font-mono-code text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">SUBJECT</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Job Opportunity / Software Developer Role"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 font-mono-code text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">MESSAGE</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 font-mono-code text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-orbitron font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
