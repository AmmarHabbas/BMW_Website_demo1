import React, { useState } from 'react';
import { X, BatteryCharging, Gauge, Ruler, Cog } from 'lucide-react';
import { ModelSpec } from '../types/bmw';

interface TechnicalSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelSpec | null;
  onBookDrive: (model: ModelSpec) => void;
}

export const TechnicalSpecsModal: React.FC<TechnicalSpecsModalProps> = ({
  isOpen,
  onClose,
  model,
  onBookDrive,
}) => {
  const [activeTab, setActiveTab] = useState<'powertrain' | 'charging' | 'dimensions' | 'highlights'>(
    'powertrain'
  );
  const [interactiveSoc, setInteractiveSoc] = useState(20);

  if (!isOpen || !model) return null;

  // Charging curve logic (fastest power in 10-50% range, tapering towards 80%)
  const maxKw = model.charging ? model.charging.maxDcKw : 0;
  const currentChargingKw =
    maxKw > 0
      ? Math.round(maxKw * (interactiveSoc < 50 ? 1 : 1 - ((interactiveSoc - 50) / 40) * 0.45))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#121214] border border-white/15 rounded-xl shadow-2xl p-6 sm:p-8 my-8 text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Series & Name */}
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0066B1] uppercase">
            <span>{model.series}</span>
            <span>·</span>
            <span>{model.category}</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
            {model.name}
          </h2>
          <p className="text-xs text-white/60 mt-1">{model.tagline}</p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 mb-6">
          {[
            { id: 'powertrain', label: 'Powertrain & Performance', icon: Gauge },
            { id: 'charging', label: 'Battery & Charging Curve', icon: BatteryCharging },
            { id: 'dimensions', label: 'Dimensions & Weight', icon: Ruler },
            { id: 'highlights', label: 'Signature Equipment', icon: Cog },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'powertrain' | 'charging' | 'dimensions' | 'highlights')
                }
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'powertrain' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                <div className="text-[10px] font-mono uppercase text-white/40">Total System Power</div>
                <div className="font-display font-bold text-2xl text-white mt-1">
                  {model.powerHp} <span className="text-xs font-normal text-white/50">hp</span>
                </div>
                <div className="text-[11px] font-mono text-white/50 mt-0.5">{model.powerKw} kW</div>
              </div>

              <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                <div className="text-[10px] font-mono uppercase text-white/40">Peak System Torque</div>
                <div className="font-display font-bold text-2xl text-white mt-1">
                  {model.torqueNm} <span className="text-xs font-normal text-white/50">Nm</span>
                </div>
                <div className="text-[11px] font-mono text-white/50 mt-0.5">Instant launch torque</div>
              </div>

              <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                <div className="text-[10px] font-mono uppercase text-white/40">0–100 km/h (0–62 mph)</div>
                <div className="font-display font-bold text-2xl text-white mt-1">
                  {model.acceleration0to100} <span className="text-xs font-normal text-white/50">s</span>
                </div>
                <div className="text-[11px] font-mono text-white/50 mt-0.5">Official factory test</div>
              </div>

              <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                <div className="text-[10px] font-mono uppercase text-white/40">Top Track Velocity</div>
                <div className="font-display font-bold text-2xl text-white mt-1">
                  {model.topSpeedKmH} <span className="text-xs font-normal text-white/50">km/h</span>
                </div>
                <div className="text-[11px] font-mono text-white/50 mt-0.5">Electronically governed</div>
              </div>

              <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                <div className="text-[10px] font-mono uppercase text-white/40">Drivetrain Configuration</div>
                <div className="font-bold text-sm text-white mt-1">
                  {model.drivetrain}
                </div>
                <div className="text-[11px] font-mono text-white/50 mt-0.5">Intelligent torque bias</div>
              </div>

              <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                <div className="text-[10px] font-mono uppercase text-white/40">Efficiency / WLTP</div>
                <div className="font-bold text-sm text-white mt-1">
                  {model.consumption || 'Optimized WLTP'}
                </div>
                <div className="text-[11px] font-mono text-white/50 mt-0.5">Combined official cycle</div>
              </div>
            </div>

            <div className="bg-[#080808] p-4 rounded-lg border border-white/10 text-xs text-white/70">
              <span className="text-[#0066B1] font-mono font-semibold">Transmission Note: </span>
              {model.transmission}
            </div>
          </div>
        )}

        {activeTab === 'charging' && (
          <div className="space-y-6">
            {model.charging && model.charging.maxDcKw > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                    <div className="text-[10px] font-mono uppercase text-white/40">Max DC Fast Charge</div>
                    <div className="font-display font-bold text-2xl text-[#0066B1] mt-1">
                      {model.charging.maxDcKw} kW
                    </div>
                  </div>
                  <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                    <div className="text-[10px] font-mono uppercase text-white/40">10% to 80% Duration</div>
                    <div className="font-display font-bold text-2xl text-white mt-1">
                      {model.charging.time10to80Min} min
                    </div>
                  </div>
                  <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
                    <div className="text-[10px] font-mono uppercase text-white/40">AC Home Charging</div>
                    <div className="font-display font-bold text-2xl text-white mt-1">
                      {model.charging.acKw} kW
                    </div>
                  </div>
                </div>

                {/* Interactive Curve Tester */}
                <div className="bg-[#080808] p-5 rounded-lg border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-white/60">
                      Interactive DC Charging Curve Simulator
                    </span>
                    <span className="text-xs font-mono text-[#0066B1] font-bold">
                      Current SoC: {interactiveSoc}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={interactiveSoc}
                    onChange={(e) => setInteractiveSoc(Number(e.target.value))}
                    className="w-full accent-[#0066B1] h-2 bg-white/10 rounded-lg cursor-pointer"
                  />

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                    <span className="text-xs text-white/70">Real-Time Charging Acceptance Rate:</span>
                    <span className="font-display font-bold text-lg text-white tabular-nums">
                      {currentChargingKw} kW
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#080808] p-6 rounded-lg border border-white/10 text-center text-white/70 text-sm">
                This model is driven by a high-performance TwinPower Turbo internal combustion engine or plug-in hybrid with AC wallbox capability.
              </div>
            )}
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40">Overall Length</div>
              <div className="font-display font-bold text-xl text-white mt-1">
                {model.dimensions.lengthMm.toLocaleString()} mm
              </div>
            </div>
            <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40">Width (with mirrors)</div>
              <div className="font-display font-bold text-xl text-white mt-1">
                {model.dimensions.widthMm.toLocaleString()} mm
              </div>
            </div>
            <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40">Vehicle Height</div>
              <div className="font-display font-bold text-xl text-white mt-1">
                {model.dimensions.heightMm.toLocaleString()} mm
              </div>
            </div>
            <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40">Wheelbase</div>
              <div className="font-display font-bold text-xl text-white mt-1">
                {model.dimensions.wheelbaseMm.toLocaleString()} mm
              </div>
            </div>
            <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40">Luggage / Cargo Capacity</div>
              <div className="font-display font-bold text-xl text-white mt-1">
                {model.dimensions.trunkCapacityL} L
              </div>
            </div>
            <div className="bg-[#080808] p-4 rounded-lg border border-white/10">
              <div className="text-[10px] font-mono uppercase text-white/40">Unladen Curb Weight (EU)</div>
              <div className="font-display font-bold text-xl text-white mt-1">
                {model.dimensions.curbWeightKg.toLocaleString()} kg
              </div>
            </div>
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="space-y-3">
            {model.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-[#080808] p-3.5 rounded-lg border border-white/10 text-xs text-white"
              >
                <div className="w-6 h-6 rounded-full bg-[#0066B1]/20 flex items-center justify-center text-[#0066B1] font-mono text-[11px] shrink-0">
                  0{idx + 1}
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="text-xs text-white/50 font-mono">
            Starting from <strong className="text-white">€{model.startingPriceEur.toLocaleString('en-US')}</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white border border-white/10 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookDrive(model);
              }}
              className="px-5 py-2 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all shadow-md"
            >
              Book Test Drive with This Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
