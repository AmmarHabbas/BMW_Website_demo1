import React, { useState } from 'react';
import { X, Download, ExternalLink, FileCode, CheckCircle, Smartphone, Monitor } from 'lucide-react';
import JSZip from 'jszip';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();

      // Fetch the standalone assets from /standalone/
      const [htmlRes, cssRes, jsRes, readmeRes] = await Promise.all([
        fetch('/standalone/index.html').then((r) => r.text()),
        fetch('/standalone/style.css').then((r) => r.text()),
        fetch('/standalone/script.js').then((r) => r.text()),
        fetch('/standalone/README.md').then((r) => r.text()),
      ]);

      zip.file('index.html', htmlRes);
      zip.file('style.css', cssRes);
      zip.file('script.js', jsRes);
      zip.file('README.md', readmeRes);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'BMW-Flagship-Pure-Standalone.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to bundle standalone zip', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-lg">
      <div className="relative w-full max-w-5xl bg-[#121214] border border-white/15 rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0066B1] uppercase">
              <FileCode className="w-3.5 h-3.5" />
              <span>Zero-Dependency Standalone Edition</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white mt-0.5">
              Pure HTML5 / CSS3 / Vanilla JS Package
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Viewport toggle for in-app preview */}
            <div className="hidden sm:flex items-center bg-[#080808] border border-white/10 p-1 rounded-md">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'desktop' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Desktop Viewport"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'mobile' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Mobile Viewport"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live In-App Preview iFrame */}
        <div className="flex-1 min-h-[380px] sm:min-h-[480px] bg-black rounded-lg border border-white/10 overflow-hidden relative flex justify-center">
          <iframe
            src="/standalone/index.html"
            title="BMW Standalone Pure Edition"
            className={`h-full border-0 transition-all duration-300 ${
              viewportMode === 'mobile' ? 'w-[375px] shadow-2xl border-x border-white/20' : 'w-full'
            }`}
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/60">
            <span>Includes </span>
            <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded">index.html</code>,{' '}
            <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded">style.css</code>,{' '}
            <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded">script.js</code>, and{' '}
            <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded">README.md</code>.
            Runs immediately with zero build step.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="/standalone/index.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors w-full sm:w-auto"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all shadow-md w-full sm:w-auto whitespace-nowrap"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Package Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#0066B1]" />
                  <span>{isDownloading ? 'Generating ZIP...' : 'Download Standalone (.ZIP)'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
