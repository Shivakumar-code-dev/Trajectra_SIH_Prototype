import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle2, Trash2, ExternalLink, ShieldCheck, Download, Award, RefreshCw } from 'lucide-react';
import { getCertificateFile, saveCertificateFile, deleteCertificateFile } from '../utils/certStorage';
import { playCyberClick } from '../utils/audio';

export default function CertificateModal({ cert, onClose, onCertUpdated }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!cert) return;
    setLoading(true);
    getCertificateFile(cert.id).then((fileData) => {
      setUploadedFile(fileData);
      setLoading(false);
    });
  }, [cert]);

  if (!cert) return null;

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const saved = await saveCertificateFile(cert.id, file);
      setUploadedFile(saved);
      if (onCertUpdated) onCertUpdated(cert.id, saved);
      playCyberClick();
    } catch (err) {
      alert('Failed to save file locally. Please try a smaller image or PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this uploaded certificate?')) {
      await deleteCertificateFile(cert.id);
      setUploadedFile(null);
      if (onCertUpdated) onCertUpdated(cert.id, null);
      playCyberClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl rounded-2xl glass-modal overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,240,255,0.3)] border border-cyan-500/40"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#060814]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-orbitron font-bold text-white">
                {cert.title}
              </h3>
              <p className="text-xs font-mono-code text-cyan-400/80">
                {cert.organization} • {cert.year}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#070a18]">
          
          {loading ? (
            <div className="py-12 text-center text-cyan-400 font-mono-code text-sm animate-pulse flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>LOADING CERTIFICATE DATA...</span>
            </div>
          ) : uploadedFile ? (
            /* UPLOADED FILE VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  AUTHENTIC CERTIFICATE DOCUMENT ATTACHED
                </span>
                <span className="text-slate-400">Uploaded: {new Date(uploadedFile.uploadedAt).toLocaleDateString()}</span>
              </div>

              {/* Document Render Area */}
              <div className="rounded-xl border border-slate-800 bg-black/60 overflow-hidden min-h-[350px] flex items-center justify-center relative">
                {uploadedFile.fileType.includes('pdf') ? (
                  <iframe
                    src={uploadedFile.dataUrl}
                    className="w-full h-[450px] border-none"
                    title={cert.title}
                  />
                ) : (
                  <img
                    src={uploadedFile.dataUrl}
                    alt={cert.title}
                    className="max-h-[480px] w-auto object-contain p-2 rounded-lg"
                  />
                )}
              </div>

              {/* Document Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <a
                  href={uploadedFile.dataUrl}
                  download={`${cert.title.replace(/\s+/g, '_')}_Certificate`}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold text-xs flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD DOCUMENT</span>
                </a>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-orbitron font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>DELETE / REPLACE</span>
                </button>
              </div>
            </div>
          ) : (
            /* NO UPLOADED FILE - SHOW UPLOAD DROPZONE + GENERATED PREVIEW */
            <div className="space-y-6">
              
              {/* Certificate Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`p-6 rounded-xl border-2 border-dashed transition-all text-center space-y-3 cursor-pointer ${
                  dragOver
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                    : 'border-cyan-500/30 bg-slate-950/60 hover:border-cyan-400'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>

                <div>
                  <h4 className="font-orbitron font-bold text-white text-sm">
                    UPLOAD CERTIFICATE FILE
                  </h4>
                  <p className="text-xs font-mono-code text-slate-400 mt-1">
                    Drag & Drop your certificate document (PDF, PNG, JPG) or click to browse
                  </p>
                </div>

                <label className="inline-block cursor-pointer">
                  <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-orbitron font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.4)] inline-flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    SELECT CERTIFICATE FILE
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>

                {uploading && (
                  <div className="text-xs font-mono-code text-cyan-400 animate-pulse pt-2">
                    SAVING CERTIFICATE TO SECURE LOCAL STORAGE...
                  </div>
                )}
              </div>

              {/* Dynamic Visual Credential Badge Preview */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-950 via-[#0d1226] to-slate-950 border border-cyan-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span className="font-orbitron font-bold text-xs text-white">DIGITAL CREDENTIAL PREVIEW</span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400">ID: {cert.id.toUpperCase()}</span>
                </div>

                <div className="text-center space-y-3 py-4">
                  <p className="text-xs font-mono-code text-cyan-400 tracking-widest uppercase">
                    THIS CERTIFIES THAT
                  </p>
                  <h2 className="text-xl font-orbitron font-black text-white tracking-wider">
                    SHIVAKUMAR CHANNAMALLAPPA GAMA
                  </h2>
                  <p className="text-xs font-mono-code text-slate-300">
                    HAS SUCCESSFULLY COMPLETED THE TRAINING / SIMULATION IN
                  </p>
                  <h3 className="text-lg font-orbitron font-bold text-fuchsia-300">
                    {cert.title}
                  </h3>
                  <div className="pt-2 text-xs font-mono-code text-slate-400">
                    ISSUED BY: <strong className="text-cyan-300">{cert.organization}</strong> • YEAR: <strong className="text-amber-300">{cert.year}</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#060814] flex items-center justify-between text-xs font-mono-code text-slate-400">
          <span>CERTIFICATE MANAGER</span>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="px-3 py-1 rounded bg-slate-900 text-slate-300 hover:text-white"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
}
