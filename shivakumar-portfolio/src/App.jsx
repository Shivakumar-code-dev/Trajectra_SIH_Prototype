import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import CanvasBackground from './components/CanvasBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import CertificatesSection from './components/CertificatesSection';
import EducationSection from './components/EducationSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ResumeSyncModal from './components/ResumeSyncModal';

export default function App() {
  return (
    <PortfolioProvider>
      <div className="relative min-h-screen bg-black text-slate-100 selection:bg-cyan-500 selection:text-black">
        
        {/* Interactive Canvas Holographic Particles */}
        <CanvasBackground />

        {/* Global Scanline Glitch Overlay (Subtle) */}
        <div className="fixed inset-0 scanline-overlay z-40" />

        {/* Navbar */}
        <Navbar />

        {/* Main Sections */}
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <CertificatesSection />
          <EducationSection />
          <AchievementsSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Corner Resume Auto-Sync Modal Uploader */}
        <ResumeSyncModal />

      </div>
    </PortfolioProvider>
  );
}
