import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Flame, Zap, Gauge, Play, Square, Activity } from 'lucide-react';
import { ACOUSTIC_MODES } from '../data/fleetData';

export const AcousticSimulator: React.FC = () => {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [driveSetting, setDriveSetting] = useState<'comfort' | 'sport' | 'sport-plus'>('sport-plus');
  const [isThrottleActive, setIsThrottleActive] = useState(false);
  const [rpm, setRpm] = useState(850);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const activeMode = ACOUSTIC_MODES[activeModeIndex];

  // Initialize Web Audio
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Start Sound
  const startRev = () => {
    initAudio();
    setIsThrottleActive(true);
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;

    // Build Synth Pipeline
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1Ref.current = osc1;
    osc2Ref.current = osc2;
    gainRef.current = gain;
    filterRef.current = filter;

    const isEv = activeMode.id === 'hans-zimmer-ev';
    const isV8 = activeMode.id === 'v8-m-twinpower';

    if (isEv) {
      // Hans Zimmer IconicSounds Electric
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(110, now);
      osc2.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(580, now + 1.8);
      osc2.frequency.exponentialRampToValueAtTime(1160, now + 1.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
    } else if (isV8) {
      // TwinPower Turbo V8 Throaty Roar
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(65, now);
      osc2.frequency.setValueAtTime(130, now);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 2.0);
      osc2.frequency.exponentialRampToValueAtTime(640, now + 2.0);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(2.5, now);
    } else {
      // S58 High-Revving Inline-6 Screamer
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(95, now);
      osc2.frequency.setValueAtTime(190, now);
      osc1.frequency.exponentialRampToValueAtTime(420, now + 1.7);
      osc2.frequency.exponentialRampToValueAtTime(840, now + 1.7);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
    }

    const targetVolume = isMuted ? 0 : driveSetting === 'sport-plus' ? 0.35 : 0.22;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(targetVolume, now + 0.15);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
  };

  // Stop Sound with overrun burble
  const stopRev = () => {
    setIsThrottleActive(false);
    const ctx = audioCtxRef.current;
    if (!ctx || !gainRef.current) return;

    const now = ctx.currentTime;
    gainRef.current.gain.linearRampToValueAtTime(0.001, now + 0.5);

    setTimeout(() => {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
      }
    }, 550);
  };

  // RPM Needle Simulation Loop
  useEffect(() => {
    let animId: number;
    const updateRpm = () => {
      const isEv = activeMode.id === 'hans-zimmer-ev';
      const idleRpm = isEv ? 0 : 850;
      const redline = activeMode.revLimit;

      setRpm((prev) => {
        if (isThrottleActive) {
          const delta = (redline * 0.95 - prev) * 0.12;
          return Math.min(redline, Math.round(prev + delta));
        } else {
          const delta = (prev - idleRpm) * 0.14;
          return Math.max(idleRpm, Math.round(prev - delta));
        }
      });

      animId = requestAnimationFrame(updateRpm);
    };

    animId = requestAnimationFrame(updateRpm);
    return () => cancelAnimationFrame(animId);
  }, [isThrottleActive, activeMode]);

  // Animated Waveform Canvas
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      ctx.lineWidth = 2;
      ctx.strokeStyle = activeMode.accentColor;
      ctx.beginPath();

      const amplitude = isThrottleActive ? 35 : 6;
      const frequency = (rpm / 1000) * 0.05 + 0.02;

      for (let x = 0; x < w; x++) {
        const y = cy + Math.sin(x * frequency + phase) * amplitude * Math.cos(x * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isThrottleActive ? 0.25 : 0.05;
      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isThrottleActive, rpm, activeMode]);

  return (
    <section id="acoustics" className="py-20 bg-[#080808] border-b border-white/8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-[#0066B1] uppercase tracking-widest mb-1.5">
              Acoustic & Engine Sound Simulator
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              The Symphony of Power.
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-md">
            Compare Academy Award winner Hans Zimmer's visionary BMW IconicSounds Electric against the guttural roar of a motorsport-bred BMW M TwinPower Turbo V8.
          </p>
        </div>

        {/* Acoustic Simulator Box */}
        <div className="bg-[#121214] border border-white/10 rounded-xl p-6 lg:p-10 relative overflow-hidden">
          {/* Top Mode Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              {ACOUSTIC_MODES.map((mode, idx) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    stopRev();
                    setActiveModeIndex(idx);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                    activeModeIndex === idx
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>

            {/* Drive Dynamics Mode */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white/40 mr-1">Drive Setting:</span>
              {(['comfort', 'sport', 'sport-plus'] as const).map((setting) => (
                <button
                  key={setting}
                  onClick={() => setDriveSetting(setting)}
                  className={`px-3 py-1 rounded capitalize transition-colors ${
                    driveSetting === setting
                      ? 'bg-[#0066B1] text-white font-medium'
                      : 'bg-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  {setting.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Center Simulator Cockpit */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Engine & Sound Description */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#0066B1]">
                {activeMode.category}
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                {activeMode.name}
              </h3>
              <p className="text-xs font-mono text-white/60">
                {activeMode.subtitle}
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                {activeMode.description}
              </p>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="text-white/40">Frequency Range</div>
                  <div className="text-white font-semibold mt-0.5">{activeMode.frequencies}</div>
                </div>
                <div>
                  <div className="text-white/40">Redline Cutoff</div>
                  <div className="text-white font-semibold mt-0.5">
                    {activeMode.revLimit.toLocaleString()} {activeMode.unit.split(' ')[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Live RPM Needle Gauge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#080808]/80 border border-white/10 rounded-xl relative">
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-2">
                Live Dynamic Telemetry
              </div>

              {/* Digital RPM readout */}
              <div className="font-display font-extrabold text-5xl sm:text-6xl text-white tabular-nums tracking-tight">
                {rpm.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-white/50 mt-1 uppercase">
                {activeMode.unit}
              </div>

              {/* Progress gauge bar */}
              <div className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
                <div
                  className="h-full transition-all duration-75 rounded-full"
                  style={{
                    width: `${Math.min(100, (rpm / activeMode.revLimit) * 100)}%`,
                    backgroundColor: activeMode.accentColor,
                  }}
                />
              </div>

              {/* Audio Waveform Canvas */}
              <div className="w-full h-16 mt-4">
                <canvas
                  ref={waveCanvasRef}
                  width={300}
                  height={64}
                  className="w-full h-full block"
                />
              </div>
            </div>

            {/* Right: Throttle Pedal Trigger */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center">
              <button
                onMouseDown={startRev}
                onMouseUp={stopRev}
                onMouseLeave={stopRev}
                onTouchStart={(e) => {
                  e.preventDefault();
                  startRev();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopRev();
                }}
                className={`w-full max-w-sm py-12 rounded-xl border-2 transition-all duration-100 flex flex-col items-center justify-center select-none shadow-2xl cursor-pointer ${
                  isThrottleActive
                    ? 'border-[#E7222E] bg-gradient-to-t from-[#E7222E]/30 to-[#121214] scale-98 shadow-[0_0_30px_rgba(231,34,46,0.35)]'
                    : 'border-white/15 bg-gradient-to-t from-white/5 to-[#16171b] hover:border-white/30'
                }`}
              >
                <Gauge className={`w-8 h-8 mb-3 ${isThrottleActive ? 'text-[#E7222E]' : 'text-white/60'}`} />
                <span className="font-display font-extrabold text-lg tracking-wider text-white uppercase">
                  {isThrottleActive ? 'THROTTLE ENGAGED' : 'HOLD TO REV THROTTLE'}
                </span>
                <span className="text-xs font-mono text-white/50 mt-1">
                  Press & Hold Mouse or Touch
                </span>
              </button>

              <p className="text-[11px] text-white/40 text-center mt-4">
                Audio synthesized natively via HTML5 Web Audio API · Zero external mp3 dependencies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
