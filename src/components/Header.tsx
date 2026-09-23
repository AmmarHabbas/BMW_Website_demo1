import React from 'react';
import { Search, Download, ShieldCheck, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenTestDrive: () => void;
  onOpenStandalone: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenTestDrive,
  onOpenStandalone,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-white/8">
      {/* BMW M Tricolor Hairline Accent */}
      <div className="h-[2px] w-full bmw-m-stripe" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with official roundel */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-white/60 bg-black grid grid-cols-2 grid-rows-2 overflow-hidden shadow-[0_0_12px_rgba(0,102,177,0.35)] transition-transform duration-300 group-hover:scale-105">
            <div className="bg-[#0066B1]" />
            <div className="bg-white" />
            <div className="bg-white" />
            <div className="bg-[#0066B1]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
            BMW <span className="text-[#0066B1] font-light">Global</span>
          </span>
        </a>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#hero" className="hover:text-white transition-colors duration-150">
            Overview
          </a>
          <a href="#studio" className="hover:text-white transition-colors duration-150">
            360° Studio
          </a>
          <a href="#fleet" className="hover:text-white transition-colors duration-150">
            Fleet Lineup
          </a>
          <a href="#acoustics" className="hover:text-white transition-colors duration-150">
            Sound Simulator
          </a>
          <a href="#innovations" className="hover:text-white transition-colors duration-150">
            Innovation
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white/75 hover:text-white hover:bg-white/5 border border-white/10 rounded-md transition-colors whitespace-nowrap"
            title="Search Models & Tech (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-white/60">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenStandalone}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white/75 hover:text-white hover:bg-white/5 border border-white/10 rounded-md transition-colors whitespace-nowrap"
            title="Standalone Pure HTML5/JS Edition"
          >
            <Download className="w-3.5 h-3.5 text-[#0066B1]" />
            <span>Standalone Package</span>
          </button>

          <button
            onClick={onOpenTestDrive}
            className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all duration-150 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Book Test Drive
          </button>
        </div>
      </div>
    </header>
  );
};
