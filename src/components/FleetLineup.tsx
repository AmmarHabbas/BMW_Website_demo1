import React, { useState } from 'react';
import { FLEET_MODELS } from '../data/fleetData';
import { ModelSpec } from '../types/bmw';
import { ArrowUpRight, Gauge, Zap, Check, Scale, X } from 'lucide-react';

interface FleetLineupProps {
  onSelectModelFor360: (model: ModelSpec) => void;
  onOpenSpecsModal: (model: ModelSpec) => void;
  onBookTestDrive: (model: ModelSpec) => void;
}

type FilterCategory = 'all' | 'BMW M' | 'BMW i' | 'BMW X' | 'Sedans & Coupes';

export const FleetLineup: React.FC<FleetLineupProps> = ({
  onSelectModelFor360,
  onOpenSpecsModal,
  onBookTestDrive,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [comparedModels, setComparedModels] = useState<ModelSpec[]>([]);

  const filteredModels =
    activeFilter === 'all'
      ? FLEET_MODELS
      : FLEET_MODELS.filter((m) => m.category === activeFilter);

  const toggleCompare = (model: ModelSpec) => {
    if (comparedModels.some((m) => m.id === model.id)) {
      setComparedModels(comparedModels.filter((m) => m.id !== model.id));
    } else {
      if (comparedModels.length >= 2) {
        setComparedModels([comparedModels[1], model]);
      } else {
        setComparedModels([...comparedModels, model]);
      }
    }
  };

  return (
    <section id="fleet" className="py-20 bg-[#080808] border-b border-white/8 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-[#0066B1] uppercase tracking-widest mb-1.5">
              The Flagship Fleet
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Electrified Luxury & Pure Motorsport.
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-md">
            From zero-emission high-luxury sedans to Nürburgring-honed M supercars. Select a vehicle to inspect deep technical specifications or schedule an official test drive.
          </p>
        </div>

        {/* Filter Segmented Control Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {[
            { id: 'all', label: 'All Models' },
            { id: 'BMW M', label: 'BMW M High Performance' },
            { id: 'BMW i', label: 'BMW i 100% Electric' },
            { id: 'BMW X', label: 'BMW X Series (SAV)' },
            { id: 'Sedans & Coupes', label: 'Sedans & Coupes' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as FilterCategory)}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-[#121214] text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredModels.map((model) => {
            const isComparing = comparedModels.some((m) => m.id === model.id);
            return (
              <div
                key={model.id}
                className="group bg-[#121214] border border-white/10 hover:border-white/25 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              >
                {/* Visual Area */}
                <div className="relative h-52 bg-[#18191d] overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/30" />

                  {/* Top corner category & drivetrain */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-white/80 drop-shadow">
                      {model.series}
                    </span>
                    <span className="text-[#0066B1] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                      {model.category}
                    </span>
                  </div>

                  {/* Starting Price Overlay */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs text-white/50 block text-[10px] uppercase font-mono">
                      Starting MSRP
                    </span>
                    <span className="font-display font-bold text-white text-base">
                      €{model.startingPriceEur.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Clean unboxed metadata (zero pill discipline) */}
                  <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                    <span>{model.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{model.drivetrain.split(' ')[0]}</span>
                    {model.rangeKm && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{model.rangeKm} km WLTP</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl text-white tracking-tight mb-1 group-hover:text-[#0066B1] transition-colors">
                    {model.name}
                  </h3>

                  <p className="text-xs text-white/60 line-clamp-2 mb-4 flex-1">
                    {model.tagline}
                  </p>

                  {/* Key specs strip */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-white/10 mb-4 text-center">
                    <div>
                      <div className="font-mono font-bold text-sm text-white tabular-nums">
                        {model.powerHp} <span className="text-[10px] text-white/50 font-normal">hp</span>
                      </div>
                      <div className="text-[10px] uppercase font-mono text-white/40">Power</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white tabular-nums">
                        {model.acceleration0to100}s
                      </div>
                      <div className="text-[10px] uppercase font-mono text-white/40">0–100</div>
                    </div>
                    <div>
                      <div className="font-mono font-bold text-sm text-white tabular-nums">
                        {model.topSpeedKmH} <span className="text-[10px] text-white/50 font-normal">km/h</span>
                      </div>
                      <div className="text-[10px] uppercase font-mono text-white/40">V-Max</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mt-auto">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectModelFor360(model)}
                        className="px-3 py-2 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
                      >
                        Configure 360°
                      </button>
                      <button
                        onClick={() => onOpenSpecsModal(model)}
                        className="px-3 py-2 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
                      >
                        View Specs
                      </button>
                    </div>

                    <button
                      onClick={() => onBookTestDrive(model)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all shadow-sm"
                    >
                      <span>Book Test Drive</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleCompare(model)}
                      className={`w-full text-center py-1 text-[11px] font-mono transition-colors flex items-center justify-center gap-1.5 ${
                        isComparing
                          ? 'text-[#0066B1] font-semibold'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      <Scale className="w-3 h-3" />
                      <span>{isComparing ? 'Remove from Compare' : 'Add to Compare'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Comparison Tray when models are selected */}
        {comparedModels.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full px-4">
            <div className="bg-[#121214]/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#0066B1]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white">
                    Compare Flagships ({comparedModels.length}/2)
                  </span>
                </div>
                <button
                  onClick={() => setComparedModels([])}
                  className="text-white/50 hover:text-white text-xs flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {comparedModels.map((m) => (
                  <div key={m.id} className="bg-black/50 p-3 rounded-lg border border-white/10">
                    <div className="font-display font-bold text-sm text-white">{m.name}</div>
                    <div className="text-[11px] font-mono text-[#0066B1] mt-0.5">
                      €{m.startingPriceEur.toLocaleString('en-US')}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] font-mono text-white/70 border-t border-white/10 pt-1.5">
                      <div>{m.powerHp} hp</div>
                      <div>{m.acceleration0to100}s</div>
                      <div>{m.topSpeedKmH} km/h</div>
                    </div>
                  </div>
                ))}
                {comparedModels.length === 1 && (
                  <div className="border border-dashed border-white/15 rounded-lg flex items-center justify-center text-xs text-white/40 p-3">
                    Select a 2nd car to compare head-to-head
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
