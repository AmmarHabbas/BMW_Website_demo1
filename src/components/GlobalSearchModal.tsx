import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Car, Zap, FileText, MapPin } from 'lucide-react';
import { FLEET_MODELS, OFFICIAL_DEALERSHIPS, ACOUSTIC_MODES } from '../data/fleetData';
import { ModelSpec } from '../types/bmw';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (model: ModelSpec) => void;
  onSelectAcoustics: () => void;
  onSelectInnovations: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
  onSelectAcoustics,
  onSelectInnovations,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // toggle search
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingModels = FLEET_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(trimmed) ||
      m.series.toLowerCase().includes(trimmed) ||
      m.category.toLowerCase().includes(trimmed) ||
      m.tagline.toLowerCase().includes(trimmed)
  );

  const matchingDealerships = OFFICIAL_DEALERSHIPS.filter(
    (d) =>
      d.name.toLowerCase().includes(trimmed) ||
      d.city.toLowerCase().includes(trimmed) ||
      d.country.toLowerCase().includes(trimmed)
  );

  const matchingAcoustics = ACOUSTIC_MODES.filter(
    (a) =>
      a.name.toLowerCase().includes(trimmed) ||
      a.subtitle.toLowerCase().includes(trimmed)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#121214] border border-white/15 rounded-xl shadow-2xl p-6 text-white max-h-[80vh] flex flex-col">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-white/10 pb-4">
          <Search className="w-5 h-5 text-white/40 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search BMW models (i7, M3, M5, X5), technologies, acoustics, or flagships..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
              ESC
            </span>
          )}
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto mt-4 space-y-6 flex-1 pr-1">
          {/* Models */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#0066B1]" />
              <span>Flagship Vehicles ({matchingModels.length})</span>
            </div>
            <div className="space-y-1.5">
              {matchingModels.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onClose();
                    onSelectModel(m);
                  }}
                  className="w-full p-2.5 rounded-lg border border-white/5 hover:border-white/20 bg-[#080808]/60 hover:bg-white/5 flex items-center justify-between text-left transition-all group"
                >
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#0066B1] transition-colors">
                      {m.name}
                    </div>
                    <div className="text-[11px] text-white/50">{m.tagline}</div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-white/70">
                    <div>{m.powerHp} hp</div>
                    <div className="text-[#0066B1]">€{m.startingPriceEur.toLocaleString('en-US')}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Acoustics */}
          {matchingAcoustics.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#E7222E]" />
                <span>Acoustic Engine Simulations</span>
              </div>
              <div className="space-y-1.5">
                {matchingAcoustics.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onClose();
                      onSelectAcoustics();
                    }}
                    className="w-full p-2.5 rounded-lg border border-white/5 hover:border-white/20 bg-[#080808]/60 hover:bg-white/5 flex items-center justify-between text-left transition-all"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{a.name}</div>
                      <div className="text-[11px] text-white/50">{a.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#0066B1] border border-white/10 px-2 py-0.5 rounded">
                      Play Sound
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dealerships */}
          {matchingDealerships.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/60" />
                <span>Global Flagship Centers</span>
              </div>
              <div className="space-y-1.5">
                {matchingDealerships.slice(0, 3).map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-lg border border-white/5 bg-[#080808]/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="text-white font-medium">{d.name}</div>
                      <div className="text-[11px] text-white/50">{d.address}</div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-[#0066B1]">
                      {d.city}, {d.country}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
