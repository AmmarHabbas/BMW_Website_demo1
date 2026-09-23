import React, { useState } from 'react';
import { Zap, Recycle, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { batteryImg, visionImg } from '../data/fleetData';

export const InnovationHeritage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gen6' | 'circular' | 'autonomy'>('gen6');
  const [chargingPercent, setChargingPercent] = useState(10); // 10% to 80%

  // Simulated charging time calculation based on Gen-6 800V tech vs Gen-5
  const gen6Minutes = Math.round(((chargingPercent - 10) / 70) * 21);
  const gen5Minutes = Math.round(((chargingPercent - 10) / 70) * 34);

  return (
    <section id="innovations" className="py-20 bg-[#080808] border-b border-white/8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono text-[#0066B1] uppercase tracking-widest mb-1.5">
              Pioneering Forwardism
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Future Technologies & Circularity.
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-md">
            The road to sustainable luxury: Sixth-generation BMW eDrive cylindrical battery chemistry, the BMW iFACTORY circular production ecosystem, and Level 2+ automated driving.
          </p>
        </div>

        {/* Feature Tabs Bar */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          {[
            { id: 'gen6', label: '01. BMW eDrive Gen-6 Battery', icon: Zap },
            { id: 'circular', label: '02. Circular Economy & iFACTORY', icon: Recycle },
            { id: 'autonomy', label: '03. Driving Assistant Professional', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'gen6' | 'circular' | 'autonomy')}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-md transition-all ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066B1]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Content Bento */}
        {activeTab === 'gen6' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Bento */}
            <div className="lg:col-span-7 bg-[#121214] border border-white/10 rounded-xl overflow-hidden relative group">
              <div className="h-80 sm:h-96 relative">
                <img
                  src={batteryImg}
                  alt="BMW Gen-6 Cylindrical Battery Cell Architecture"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/80">
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-white/10">
                    800V High-Voltage Architecture
                  </span>
                  <span className="text-[#0066B1]">Neue Klasse Platform</span>
                </div>
              </div>

              {/* Interactive Charging Curve Simulator */}
              <div className="p-6 border-t border-white/10 bg-[#0d0d10]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase text-white/60">
                    Interactive Fast-Charge Simulator (10% to 80%)
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0066B1]">
                    Target: {chargingPercent}% SoC
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={chargingPercent}
                  onChange={(e) => setChargingPercent(Number(e.target.value))}
                  className="w-full accent-[#0066B1] h-2 bg-white/10 rounded-lg cursor-pointer mb-4"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#121214] p-3 rounded border border-[#0066B1]/30">
                    <div className="text-[11px] font-mono text-[#0066B1] uppercase font-semibold">
                      Gen-6 Cylindrical (800V)
                    </div>
                    <div className="text-xl font-bold font-display text-white mt-1 tabular-nums">
                      ~{gen6Minutes} min
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">Up to 300 km added in 10 min</div>
                  </div>

                  <div className="bg-[#121214] p-3 rounded border border-white/10">
                    <div className="text-[11px] font-mono text-white/40 uppercase">
                      Previous Gen-5 (400V)
                    </div>
                    <div className="text-xl font-bold font-display text-white/60 mt-1 tabular-nums">
                      ~{gen5Minutes} min
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">Conventional prismatic pack</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono text-[#0066B1] uppercase tracking-wider">
                Sixth-Generation BMW eDrive
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                30% Greater Range. <br />
                30% Faster Charging.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                With the Neue Klasse, BMW introduces newly developed round cylindrical battery cells with 46 mm diameter. The cell energy density is enhanced by more than 20%, while charging speed surges thanks to an 800-volt electrical architecture.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0066B1]/20 flex items-center justify-center text-[#0066B1] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Cell-to-Pack Integration</div>
                    <div className="text-xs text-white/60">Battery housing integrates directly into vehicle body structure, shaving weight and maximizing cabin room.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0066B1]/20 flex items-center justify-center text-[#0066B1] shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">60% Reduced Carbon Footprint</div>
                    <div className="text-xs text-white/60">Manufactured using 100% renewable electricity and certified secondary cobalt, nickel, and lithium.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'circular' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 bg-[#121214] border border-white/10 rounded-xl overflow-hidden relative group">
              <div className="h-80 sm:h-96 relative">
                <img
                  src={visionImg}
                  alt="BMW Vision Neue Klasse Monolithic Circular Exterior"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/80">
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-white/10">
                    BMW iFACTORY Principles
                  </span>
                  <span className="text-white/60">Lean. Green. Digital.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono text-[#0066B1] uppercase tracking-wider">
                Circular Design Philosophy
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Re:Think, Re:Duce, Re:Use, Re:Cycle.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                The BMW Group is systematically increasing the proportion of secondary materials from 30% today to up to 50% across future production series.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#121214] p-4 rounded-lg border border-white/10">
                  <div className="font-display font-extrabold text-3xl text-white">100%</div>
                  <div className="text-xs text-white/60 mt-1">Green Electricity across all worldwide plants (Dingolfing, Leipzig, Munich)</div>
                </div>
                <div className="bg-[#121214] p-4 rounded-lg border border-white/10">
                  <div className="font-display font-extrabold text-3xl text-[#0066B1]">50%</div>
                  <div className="text-xs text-white/60 mt-1">Target secondary raw material ratio in Neue Klasse series</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'autonomy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 bg-[#121214] border border-white/10 rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#0066B1]" />
                <div>
                  <h4 className="font-display font-bold text-xl text-white">
                    Highway Assistant (Level 2+) with Eye Confirmation
                  </h4>
                  <div className="text-xs font-mono text-white/50">
                    Hands-free cruising at speeds up to 130 km/h (85 mph)
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-white/70 leading-relaxed border-t border-white/10 pt-4">
                <p>
                  World-first innovation: The vehicle suggests a lane change, and the driver simply looks in the corresponding exterior side mirror to approve the maneuver. The system executes steering, acceleration, and indicator functions automatically.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center pt-2">
                  <div className="bg-black/50 p-3 rounded border border-white/10">
                    <div className="font-bold text-white text-base">130 km/h</div>
                    <div className="text-[10px] text-white/50 uppercase">Max Hands-Free</div>
                  </div>
                  <div className="bg-black/50 p-3 rounded border border-white/10">
                    <div className="font-bold text-white text-base">Eye-Lock</div>
                    <div className="text-[10px] text-white/50 uppercase">Active Lane Change</div>
                  </div>
                  <div className="bg-black/50 p-3 rounded border border-white/10">
                    <div className="font-bold text-white text-base">200m</div>
                    <div className="text-[10px] text-white/50 uppercase">Reverse Assist</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono text-[#0066B1] uppercase tracking-wider">
                Intelligent Co-Pilot
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Effortless Long-Distance Piloting.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Combining high-resolution LiDAR, radar arrays, and surround-view optical cameras. Seamlessly integrated into the BMW Curved Display and Augmented Reality Head-Up Display.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
