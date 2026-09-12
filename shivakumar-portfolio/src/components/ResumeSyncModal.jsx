import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractTextFromPdf, parseResumeText } from '../utils/resumeParser';
import { RefreshCw, Upload, FileText, Edit3, CheckCircle2, X, Sparkles, Download, RotateCcw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCyberClick } from '../utils/audio';

export default function ResumeSyncModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [parsing, setParsing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const {
    personalInfo,
    skillsData,
    featuredProjects,
    internshipProjects,
    certificationsData,
    educationData,
    achievementsData,
    resumePdfDataUrl,
    updateFullPortfolio,
    setResumePdf,
    resetToDefault
  } = usePortfolio();

  const [jsonText, setJsonText] = useState('');

  const handleOpenModal = () => {
    playCyberClick();
    const fullState = {
      personalInfo,
      skillsData,
      featuredProjects,
      internshipProjects,
      certificationsData,
      educationData,
      achievementsData
    };
    setJsonText(JSON.stringify(fullState, null, 2));
    setIsOpen(true);
  };

  // Handle PDF or TXT or JSON file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    setParsing(true);
    setStatusMsg('READING AND PARSING UPDATED RESUME...');
    playCyberClick();

    try {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await file.text();
        const parsedJson = JSON.parse(text);
        updateFullPortfolio(parsedJson);
        setStatusMsg('PORTFOLIO DATA UPDATED SUCCESSFULLY FROM JSON!');
      } else {
        // Handle PDF or TXT
        let rawText = '';
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          try {
            rawText = await extractTextFromPdf(file);
            // Save as PDF for download
            const reader = new FileReader();
            reader.onload = (e) => setResumePdf(e.target.result);
            reader.readAsDataURL(file);
          } catch (e) {
            rawText = await file.text();
          }
        } else {
          rawText = await file.text();
        }

        const currentState = {
          personalInfo,
          skillsData,
          featuredProjects,
          internshipProjects,
          certificationsData,
          educationData,
          achievementsData
        };

        const updated = parseResumeText(rawText, currentState);
        updateFullPortfolio(updated);
        setStatusMsg('RESUME PARSED & PORTFOLIO CONTENT UPDATED LIVE!');
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00f0ff', '#ff007f', '#10b981']
      });

    } catch (err) {
      console.error(err);
      setStatusMsg('ERROR PARSING RESUME. PLEASE USE JSON OR COMPATIBLE PDF.');
    } finally {
      setParsing(false);
    }
  };

  const handleSaveJsonEditor = () => {
    try {
      const parsed = JSON.parse(jsonText);
      updateFullPortfolio(parsed);
      playCyberClick();
      setStatusMsg('JSON EDITS SAVED & APPLIED TO PORTFOLIO!');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {
      alert('Invalid JSON format. Please check syntax.');
    }
  };

  return (
    <>
      {/* Floating Corner Button (Fixed Bottom-Right) */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-indigo-600 text-black font-orbitron font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(255,0,127,0.8)] hover:scale-105 transition-all cursor-pointer border border-white/40"
      >
        <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '3s' }} />
        <span>UPDATE RESUME</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl rounded-2xl glass-modal overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_60px_rgba(0,240,255,0.4)] border border-cyan-500/50">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#060814]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
                  <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h3 className="text-lg font-orbitron font-bold text-white flex items-center gap-2">
                    AUTOMATIC RESUME SYNC & PARSER
                  </h3>
                  <p className="text-xs font-mono-code text-cyan-400">
                    Upload your updated resume PDF/TXT/JSON to refresh the portfolio instantly
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playCyberClick();
                  setIsOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-[#080b1a]">
              <button
                onClick={() => {
                  playCyberClick();
                  setActiveTab('upload');
                }}
                className={`px-4 py-2 rounded-lg font-mono-code text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'upload'
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>UPLOAD NEW RESUME</span>
              </button>

              <button
                onClick={() => {
                  playCyberClick();
                  setActiveTab('editor');
                }}
                className={`px-4 py-2 rounded-lg font-mono-code text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'editor'
                    ? 'bg-fuchsia-500 text-white font-bold shadow-[0_0_12px_rgba(255,0,127,0.4)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>LIVE JSON EDITOR</span>
              </button>

              <button
                onClick={() => {
                  playCyberClick();
                  if (window.confirm('Reset all portfolio details back to default initial resume data?')) {
                    resetToDefault();
                    setStatusMsg('RESET TO INITIAL DEFAULT RESUME DATA!');
                  }
                }}
                className="ml-auto px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 font-mono-code text-xs flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET DEFAULT</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#060814]">
              
              {statusMsg && (
                <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-code text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {statusMsg}
                  </span>
                  <button onClick={() => setStatusMsg('')} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activeTab === 'upload' ? (
                <div className="space-y-6">
                  {/* Upload Dropzone */}
                  <div className="p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-slate-950/80 hover:border-cyan-400 transition-all text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                      <Upload className="w-8 h-8 animate-bounce" />
                    </div>

                    <div>
                      <h4 className="font-orbitron font-bold text-white text-lg">
                        DROP UPDATED RESUME FILE HERE
                      </h4>
                      <p className="text-xs font-mono-code text-slate-400 mt-1 max-w-md mx-auto">
                        Supports <strong className="text-cyan-300">PDF, TXT, or JSON</strong> formats. The system will automatically extract your info and update your portfolio live!
                      </p>
                    </div>

                    <label className="inline-block cursor-pointer">
                      <span className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-orbitron font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.5)] inline-flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        SELECT RESUME FILE
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.txt,.json,application/pdf,application/json,text/plain"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    {parsing && (
                      <div className="text-xs font-mono-code text-cyan-400 animate-pulse flex items-center justify-center gap-2 pt-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        PARSING RESUME CONTENT AND REBUILDING LIVE PORTFOLIO...
                      </div>
                    )}
                  </div>

                  {/* PDF Download Attachment Status */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono-code text-slate-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>VISITOR DOWNLOADABLE RESUME PDF:</span>
                      <span className="text-cyan-300">
                        {resumePdfDataUrl ? 'CUSTOM RESUME PDF ATTACHED' : 'DEFAULT SYSTEM RESUME'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* JSON EDITOR TAB */
                <div className="space-y-4">
                  <div className="text-xs font-mono-code text-slate-400 flex items-center justify-between">
                    <span>EDIT PORTFOLIO STATE DIRECTLY IN JSON:</span>
                    <button
                      onClick={handleSaveJsonEditor}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-orbitron font-bold text-xs"
                    >
                      APPLY JSON CHANGES
                    </button>
                  </div>

                  <textarea
                    rows={16}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono-code text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-[#060814] flex items-center justify-between text-xs font-mono-code text-slate-400">
              <span>CYBER RESUME PARSER V2.0</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded bg-slate-900 text-slate-300 hover:text-white"
              >
                CLOSE
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
