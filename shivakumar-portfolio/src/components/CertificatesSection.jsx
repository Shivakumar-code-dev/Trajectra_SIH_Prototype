import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, Search, Upload, CheckCircle2, ExternalLink } from 'lucide-react';
import { getCertificateFile } from '../utils/certStorage';
import CertificateModal from './CertificateModal';
import { playCyberClick, playCyberHover } from '../utils/audio';

export default function CertificatesSection() {
  const { certificationsData } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [uploadedMap, setUploadedMap] = useState({});

  useEffect(() => {
    (certificationsData || []).forEach(async (cert) => {
      const fileData = await getCertificateFile(cert.id);
      if (fileData) {
        setUploadedMap((prev) => ({ ...prev, [cert.id]: fileData }));
      }
    });
  }, [certificationsData]);

  const handleCertUpdated = (certId, fileData) => {
    setUploadedMap((prev) => ({
      ...prev,
      [certId]: fileData
    }));
  };

  const filteredCerts = (certificationsData || []).filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <section id="certificates" className="py-24 relative bg-black/90">
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono-code text-xs">
            <Award className="w-3.5 h-3.5" />
            <span>VERIFIED ACCREDITATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-white tracking-wide">
            CERTIFICATIONS & <span className="text-cyan-400">CREDENTIALS</span>
          </h2>
          <p className="text-slate-300 font-mono-code text-sm max-w-2xl mx-auto">
            Click any certificate card below to view or upload the certificate document!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 mx-auto rounded-full" />
        </div>

        <div className="max-w-md mx-auto mb-12 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certs (e.g. Deloitte, Azure, Google, IIT Bombay)..."
              className="w-full bg-slate-950/90 border border-cyan-500/30 rounded-xl pl-10 pr-4 py-2.5 font-mono-code text-xs text-white focus:outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => {
            const hasUpload = !!uploadedMap[cert.id];

            return (
              <div
                key={cert.id}
                onClick={() => {
                  playCyberClick();
                  setSelectedCert(cert);
                }}
                onMouseEnter={playCyberHover}
                className={`cyber-box rounded-xl p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden transition-all duration-300 ${
                  hasUpload 
                    ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'border-cyan-500/20 hover:border-cyan-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-fuchsia-400">
                      {cert.category || 'Certification'}
                    </span>
                    
                    {hasUpload ? (
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        DOCUMENT ATTACHED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800 text-slate-400 flex items-center gap-1 group-hover:text-cyan-400 group-hover:border-cyan-500/40">
                        <Upload className="w-3 h-3" />
                        CLICK TO VIEW / UPLOAD
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-orbitron font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 leading-snug">
                    {cert.title}
                  </h3>

                  <div className="text-xs font-mono-code text-cyan-400 font-semibold mb-3">
                    {cert.organization} • <span className="text-amber-300">{cert.year}</span>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code text-slate-300">
                  <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                    VIEW DETAILS
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

              </div>
            );
          })}
        </div>

        {selectedCert && (
          <CertificateModal
            cert={selectedCert}
            onClose={() => setSelectedCert(null)}
            onCertUpdated={handleCertUpdated}
          />
        )}

      </div>
    </section>
  );
}
