import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenStandalone: () => void;
  onOpenTestDrive: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStandalone,
  onOpenTestDrive,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] border-t border-white/10 pt-16 pb-12 text-white/60">
      {/* BMW M Stripe */}
      <div className="h-[2px] w-full bmw-m-stripe mb-12" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Wordmark */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/60 bg-black grid grid-cols-2 grid-rows-2 overflow-hidden">
                <div className="bg-[#0066B1]" />
                <div className="bg-white" />
                <div className="bg-white" />
                <div className="bg-[#0066B1]" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                BMW <span className="text-[#0066B1] font-light">Global</span>
              </span>
            </div>
            <p className="text-xs text-white/50 max-w-sm leading-relaxed">
              Bayerische Motoren Werke AG. Delivering sheer driving pleasure through visionary forwardism, cutting-edge eDrive electrification, and pure BMW M motorsport engineering.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenStandalone}
                className="text-xs text-[#0066B1] hover:underline font-mono"
              >
                Standalone Pure HTML/JS Edition Available →
              </button>
            </div>
          </div>

          {/* Col 2: Flagship Models */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-white">
              Flagship Fleet
            </div>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#fleet" className="hover:text-white transition-colors">BMW i7 Sedan</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">BMW iX SAV</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">BMW M3 Competition</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">BMW M5 HYBRID</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">BMW XM Label Red</a></li>
              <li><a href="#fleet" className="hover:text-white transition-colors">BMW 4 Gran Coupé</a></li>
            </ul>
          </div>

          {/* Col 3: Innovation & Technology */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-white">
              Technology
            </div>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#innovations" className="hover:text-white transition-colors">BMW eDrive Gen-6</a></li>
              <li><a href="#innovations" className="hover:text-white transition-colors">Circular Economy</a></li>
              <li><a href="#innovations" className="hover:text-white transition-colors">Highway Assistant</a></li>
              <li><a href="#acoustics" className="hover:text-white transition-colors">Hans Zimmer IconicSounds</a></li>
              <li><a href="#studio" className="hover:text-white transition-colors">360° Studio Configurator</a></li>
            </ul>
          </div>

          {/* Col 4: Experience */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-white">
              Flagship Experience
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={onOpenTestDrive} className="hover:text-white transition-colors text-left">
                  Book Flagship Test Drive
                </button>
              </li>
              <li><a href="#studio" className="hover:text-white transition-colors">Custom Configuration</a></li>
              <li><a href="#acoustics" className="hover:text-white transition-colors">Acoustic Cockpit</a></li>
              <li>
                <a
                  href="/standalone/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Offline Browser Mode
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 BMW AG. All rights reserved.</span>
            <span>The Ultimate Driving Machine®</span>
            <a href="#" className="hover:text-white transition-colors">Legal Notice</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">WLTP Energy Consumption Data</a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors font-mono text-[11px]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
