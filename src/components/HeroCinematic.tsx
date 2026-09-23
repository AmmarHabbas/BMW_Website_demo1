import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, Gauge, Zap, Activity, Sliders, Volume2 } from 'lucide-react';
import { i7HeroImg, mTrackHeroImg } from '../data/fleetData';

interface HeroCinematicProps {
  onExploreStudio: () => void;
  onExploreFleet: () => void;
  onExploreSound: () => void;
  onBookTestDrive: () => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({
  onExploreStudio,
  onExploreFleet,
  onExploreSound,
  onBookTestDrive,
}) => {
  const [heroMode, setHeroMode] = useState<'electric' | 'motorsport'>('electric');
  const [isSimulatingLaunch, setIsSimulatingLaunch] = useState(false);
  const [telemetrySpeed, setTelemetrySpeed] = useState(0);
  const [frontRearTorque, setFrontRearTorque] = useState(50); // 50% front, 50% rear

  // Launch control simulation
  const triggerLaunchSimulation = () => {
    if (isSimulatingLaunch) return;
    setIsSimulatingLaunch(true);
    setTelemetrySpeed(0);

    const startTime = performance.now();
    const duration = heroMode === 'electric' ? 4700 : 3500; // 4.7s or 3.5s to 100

    const step = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Non-linear acceleration curve
      const currentSpeed = Math.round(100 * Math.pow(progress, 0.7));
      setTelemetrySpeed(currentSpeed);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setIsSimulatingLaunch(false);
          setTelemetrySpeed(0);
        }, 1200);
      }
    };
    requestAnimationFrame(step);
  };

  const isElectric = heroMode === 'electric';

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-end bg-[#080808] overflow-hidden border-b border-white/8">
      {/* Background Image Layer with smooth transition */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroMode}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img
              src={isElectric ? i7HeroImg : mTrackHeroImg}
              alt={isElectric ? 'BMW i7 Electric Luxury' : 'BMW M Motorsport Racetrack'}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Cinematic Gradient Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/40 to-transparent" />
            <div
              className={`absolute inset-0 opacity-20 mix-blend-screen pointer-events-none transition-colors duration-700 ${
                isElectric
                  ? 'bg-radial from-[#0066B1]/40 via-transparent to-transparent'
                  : 'bg-radial from-[#E7222E]/40 via-transparent to-transparent'
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Mode Toggle in Hero Bar */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center p-1 bg-[#121214]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
          <button
            onClick={() => setHeroMode('electric')}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              isElectric
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isElectric ? 'text-[#0066B1]' : ''}`} />
            <span>BMW i · Forwardism & Electric Luxury</span>
          </button>
          <button
            onClick={() => setHeroMode('motorsport')}
            className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              !isElectric
                ? 'bg-[#E7222E] text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-white" />
            <span>BMW M · Born on the Track</span>
          </button>
        </div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-14 w-full">
        <div className="max-w-3xl">
          {/* Subtitle / Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0066B1] uppercase mb-3">
            <span>{isElectric ? 'Flagship Electric Mobility' : 'BMW M High Performance'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-white/60">
              {isElectric ? 'BMW i7 xDrive60 & Vision Neue Klasse' : 'BMW M3 & M5 Competition'}
            </span>
          </div>

          {/* Display Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-white text-balance mb-5">
            {isElectric ? (
              <>
                FORWARDISM. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50">
                  ELECTRIC LUXURY REDEFINED.
                </span>
              </>
            ) : (
              <>
                BORN ON THE TRACK. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#E7222E]">
                  ENGINEERED FOR THE ROAD.
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
            {isElectric
              ? 'Experience the new zenith of executive luxury with 625 km WLTP range, 31.3" 8K BMW Theatre Screen, and visionary BMW eDrive propulsion.'
              : 'Up to 727 horsepower M HYBRID technology, switchable M xDrive 2WD drift capability, and unmistakable motorsport acoustics.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreStudio}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all duration-150 shadow-lg shadow-white/5 hover:translate-y-[-1px]"
            >
              <span>Launch 360° Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreSound}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-[#121214]/80 hover:bg-white/10 border border-white/15 rounded-md transition-colors"
            >
              <Volume2 className="w-4 h-4 text-[#0066B1]" />
              <span>Acoustic Experience</span>
            </button>

            <button
              onClick={onExploreFleet}
              className="px-5 py-3 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              View Full Fleet Lineup
            </button>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 items-end">
          {/* Telemetry 1: 0-100 acceleration with live launch simulation button */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                0–100 km/h Launch
              </span>
              <button
                onClick={triggerLaunchSimulation}
                disabled={isSimulatingLaunch}
                className="text-[10px] font-mono text-[#0066B1] hover:text-white transition-colors underline decoration-[#0066B1]"
              >
                {isSimulatingLaunch ? 'Testing...' : 'Test Launch'}
              </button>
            </div>
            <div className="font-display font-bold text-3xl sm:text-4xl text-white tabular-nums flex items-baseline gap-1">
              {isSimulatingLaunch ? (
                <>
                  <span className="text-[#0066B1]">{telemetrySpeed}</span>
                  <span className="text-sm font-sans font-normal text-white/50">km/h</span>
                </>
              ) : (
                <>
                  <span>{isElectric ? '4.7' : '3.5'}</span>
                  <span className="text-sm font-sans font-normal text-white/50">sec</span>
                </>
              )}
            </div>
            <span className="text-xs text-white/50">
              {isElectric ? 'Dual eDrive Boost' : 'M Launch Control'}
            </span>
          </div>

          {/* Telemetry 2: Range or Top Speed */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-1">
              {isElectric ? 'Pure Electric Range' : 'V-Max Track Speed'}
            </span>
            <div className="font-display font-bold text-3xl sm:text-4xl text-white tabular-nums flex items-baseline gap-1">
              <span>{isElectric ? '625' : '305'}</span>
              <span className="text-sm font-sans font-normal text-white/50">
                {isElectric ? 'km' : 'km/h'}
              </span>
            </div>
            <span className="text-xs text-white/50">
              {isElectric ? 'WLTP Official Combined' : 'M Driver’s Package'}
            </span>
          </div>

          {/* Telemetry 3: Peak Output */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-1">
              Peak System Output
            </span>
            <div className="font-display font-bold text-3xl sm:text-4xl text-white tabular-nums flex items-baseline gap-1">
              <span>{isElectric ? '544' : '727'}</span>
              <span className="text-sm font-sans font-normal text-white/50">hp</span>
            </div>
            <span className="text-xs text-white/50">
              {isElectric ? '400 kW · 745 Nm' : '535 kW · 1,000 Nm'}
            </span>
          </div>

          {/* Telemetry 4: Torque split / xDrive */}
          <div className="flex flex-col col-span-2 sm:col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                xDrive Torque Distribution
              </span>
              <span className="text-xs font-mono text-white/60 tabular-nums">
                {frontRearTorque}% Front · {100 - frontRearTorque}% Rear
              </span>
            </div>
            {/* Interactive distribution slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={frontRearTorque}
                onChange={(e) => setFrontRearTorque(Number(e.target.value))}
                className="w-full accent-[#0066B1] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                title="Adjust torque split simulation"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
              <span>Front Axle</span>
              <span>Variable Electronic Bias</span>
              <span>Rear Axle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
