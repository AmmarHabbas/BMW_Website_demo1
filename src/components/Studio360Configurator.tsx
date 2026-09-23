import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  Check,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  Box,
  Layers,
  Car,
  Compass,
  Zap,
  Gauge,
  Eye,
  Heart,
} from 'lucide-react';
import { CAR_COLORS, WHEEL_OPTIONS, BRAKE_CALIPER_OPTIONS, FLEET_MODELS } from '../data/fleetData';
import { CarColor, WheelOption, BrakeCaliperOption, ModelSpec } from '../types/bmw';

interface Studio360ConfiguratorProps {
  activeModel?: ModelSpec;
  onSelectModel?: (model: ModelSpec) => void;
  onOpenSpecsModal?: (model: ModelSpec) => void;
  onReserveConfiguration: (config: {
    model: ModelSpec;
    color: CarColor;
    wheel: WheelOption;
    caliper: BrakeCaliperOption;
  }) => void;
}

export const Studio360Configurator: React.FC<Studio360ConfiguratorProps> = ({
  activeModel: propActiveModel,
  onSelectModel,
  onOpenSpecsModal,
  onReserveConfiguration,
}) => {
  // Model state (controlled or fallback to internal)
  const [internalModel, setInternalModel] = useState<ModelSpec>(FLEET_MODELS[0]);
  const activeModel = propActiveModel || internalModel;

  const handleCarChange = (model: ModelSpec) => {
    setInternalModel(model);
    if (onSelectModel) {
      onSelectModel(model);
    }
    // Reset iframe loading state
    setIs3dLoading(true);
  };

  // View mode: 'sketchfab' (Exact 3D model) or 'canvas' (2D procedural)
  const [viewerMode, setViewerMode] = useState<'sketchfab' | 'canvas'>('sketchfab');
  const [is3dLoading, setIs3dLoading] = useState(true);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Configuration options
  const [activeColor, setActiveColor] = useState<CarColor>(CAR_COLORS[0]);
  const [activeWheel, setActiveWheel] = useState<WheelOption>(WHEEL_OPTIONS[0]);
  const [activeCaliper, setActiveCaliper] = useState<BrakeCaliperOption>(BRAKE_CALIPER_OPTIONS[0]);
  const [studioEnvironment, setStudioEnvironment] = useState<'night' | 'daylight' | 'horizon'>('night');

  // Procedural Canvas 360 state
  const [angle, setAngle] = useState<number>(30);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const studioWrapperRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // When active car changes, reset loading
  useEffect(() => {
    setIs3dLoading(true);
  }, [activeModel.id, isAutoSpin]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!studioWrapperRef.current) return;
    if (!document.fullscreenElement) {
      studioWrapperRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Auto-spin for Canvas mode
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (viewerMode === 'canvas' && isAutoSpin) {
      interval = setInterval(() => {
        setAngle((prev) => (prev + 10) % 360);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [viewerMode, isAutoSpin]);

  // Procedural Canvas Renderer for 2D angle fallback
  const renderCar = useCallback(() => {
    if (viewerMode !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 + 35;
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Studio Lighting Background
    let groundGrad = ctx.createLinearGradient(0, cy + 60, 0, h);
    if (studioEnvironment === 'night') {
      groundGrad.addColorStop(0, 'rgba(18, 18, 22, 0.9)');
      groundGrad.addColorStop(1, 'rgba(8, 8, 10, 0.95)');
    } else if (studioEnvironment === 'daylight') {
      groundGrad.addColorStop(0, 'rgba(38, 42, 48, 0.9)');
      groundGrad.addColorStop(1, 'rgba(20, 22, 26, 0.95)');
    } else {
      groundGrad.addColorStop(0, 'rgba(28, 20, 32, 0.9)');
      groundGrad.addColorStop(1, 'rgba(10, 8, 16, 0.95)');
    }
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, cy + 60, w, h - (cy + 60));

    // Studio Spotlight Glow
    const spotGrad = ctx.createRadialGradient(cx, cy - 20, 30, cx, cy - 20, 420);
    if (studioEnvironment === 'night') {
      spotGrad.addColorStop(0, 'rgba(0, 102, 177, 0.22)');
      spotGrad.addColorStop(0.6, 'rgba(0, 42, 84, 0.05)');
      spotGrad.addColorStop(1, 'transparent');
    } else if (studioEnvironment === 'daylight') {
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      spotGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.03)');
      spotGrad.addColorStop(1, 'transparent');
    } else {
      spotGrad.addColorStop(0, 'rgba(231, 34, 46, 0.2)');
      spotGrad.addColorStop(0.6, 'rgba(0, 102, 177, 0.05)');
      spotGrad.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, w, h);

    // Floor Shadow underneath car
    ctx.beginPath();
    ctx.ellipse(cx, cy + 90, 270, 52, 0, 0, Math.PI * 2);
    const floorShadow = ctx.createRadialGradient(cx, cy + 90, 10, cx, cy + 90, 270);
    floorShadow.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    floorShadow.addColorStop(0.4, 'rgba(0, 0, 0, 0.45)');
    floorShadow.addColorStop(1, 'transparent');
    ctx.fillStyle = floorShadow;
    ctx.fill();

    // Car Chassis Coordinate System
    ctx.save();
    ctx.translate(cx, cy);

    const bodyLength = 340;
    const bodyGrad = ctx.createLinearGradient(-bodyLength / 2, -70, bodyLength / 2, 70);
    bodyGrad.addColorStop(0, adjustBrightness(activeColor.hex, -30));
    bodyGrad.addColorStop(0.35, activeColor.hex);
    bodyGrad.addColorStop(0.65, activeColor.accentHex || activeColor.hex);
    bodyGrad.addColorStop(1, adjustBrightness(activeColor.hex, -40));

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;

    const frontNoseY = -8 + sin * 12;
    const rearDeckY = -12 - sin * 12;

    ctx.beginPath();
    ctx.moveTo(-165, 30);
    ctx.lineTo(-160, rearDeckY);
    ctx.lineTo(-135, -25);
    ctx.lineTo(135, -25);
    ctx.lineTo(165, frontNoseY);
    ctx.lineTo(170, 48);
    ctx.lineTo(-160, 48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cabin Glass
    const glassGrad = ctx.createLinearGradient(0, -90, 0, -20);
    glassGrad.addColorStop(0, 'rgba(16, 20, 28, 0.95)');
    glassGrad.addColorStop(0.5, 'rgba(40, 52, 70, 0.85)');
    glassGrad.addColorStop(1, 'rgba(12, 14, 18, 0.95)');

    ctx.fillStyle = glassGrad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(-120, -25);
    ctx.lineTo(-70, -78);
    ctx.lineTo(65, -78);
    ctx.lineTo(125, -25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wheels & Brake Calipers
    const wheelY = 48;
    drawWheelCanvas(ctx, -105, wheelY, activeWheel.id, activeCaliper.colorHex);
    drawWheelCanvas(ctx, 105, wheelY, activeWheel.id, activeCaliper.colorHex);

    ctx.restore();
  }, [viewerMode, angle, activeColor, activeWheel, activeCaliper, studioEnvironment]);

  useEffect(() => {
    if (viewerMode === 'canvas') {
      const handleResize = () => {
        const canvas = canvasRef.current;
        const container = canvasContainerRef.current;
        if (!canvas || !container) return;
        canvas.width = container.clientWidth * window.devicePixelRatio;
        canvas.height = container.clientHeight * window.devicePixelRatio;
        renderCar();
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [viewerMode, renderCar]);

  useEffect(() => {
    if (viewerMode === 'canvas') {
      renderCar();
    }
  }, [viewerMode, renderCar]);

  // Drag handlers for canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setStartAngle(angle);
    setIsAutoSpin(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    let newAngle = (startAngle - Math.round(delta / 4) * 10) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setStartAngle(angle);
    setIsAutoSpin(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - dragStartX;
    let newAngle = (startAngle - Math.round(delta / 4) * 10) % 360;
    if (newAngle < 0) newAngle += 360;
    setAngle(newAngle);
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Compute Sketchfab embed URL
  const activeSketchfab = activeModel.sketchfabModel;
  const sketchfabEmbedUrl = activeSketchfab
    ? `https://sketchfab.com/models/${activeSketchfab.uid}/embed?autostart=1&preload=1&ui_theme=dark&ui_infos=0&ui_controls=1&ui_watermark=0${
        isAutoSpin ? '&autospin=0.25' : ''
      }`
    : null;

  return (
    <section id="studio" className="py-20 bg-[#080808] border-b border-white/8 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#0066B1] uppercase tracking-widest mb-1.5">
              <span>Interactive 360° Studio</span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Exact 3D CAD WebGL Model
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              {activeModel.name}
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">
              Inspect authentic 3D geometry sourced from{' '}
              <a
                href="https://sketchfab.com/tags/bmw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066B1] hover:underline inline-flex items-center gap-1 font-medium"
              >
                Sketchfab BMW Collection
                <ExternalLink className="w-3 h-3" />
              </a>
              . Experience 360° orbit, interior zoom, lighting controls, and tailored finishes.
            </p>
          </div>

          {/* Engine Mode Toggle */}
          <div className="flex items-center gap-2 bg-[#121214] p-1 rounded-lg border border-white/10 self-start lg:self-end">
            <button
              onClick={() => setViewerMode('sketchfab')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewerMode === 'sketchfab'
                  ? 'bg-[#0066B1] text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Exact 3D WebGL (Sketchfab)</span>
            </button>
            <button
              onClick={() => setViewerMode('canvas')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewerMode === 'canvas'
                  ? 'bg-white/15 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Multi-Angle Studio</span>
            </button>
          </div>
        </div>

        {/* Fleet Model Switcher Carousel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-[#0066B1]" />
              Select Car to Load in 360° Studio ({FLEET_MODELS.length} Models Available):
            </span>
            <span className="text-[11px] font-mono text-[#0066B1]">
              Active: {activeModel.name}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {FLEET_MODELS.map((model) => {
              const isSelected = activeModel.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => handleCarChange(model)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-left text-xs whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-lg font-semibold scale-[1.02]'
                      : 'bg-[#121214] text-white/70 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isSelected
                        ? 'bg-black text-white'
                        : model.category === 'BMW M'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : model.category === 'BMW i'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {model.category.replace('BMW ', '')}
                  </span>
                  <span className="truncate max-w-[140px] sm:max-w-none">{model.name}</span>
                  <span
                    className={`text-[11px] font-mono ${
                      isSelected ? 'text-black/60 font-normal' : 'text-white/40'
                    }`}
                  >
                    {model.powerHp} hp
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Box Viewport */}
        <div
          ref={studioWrapperRef}
          className={`bg-[#121214] border border-white/10 rounded-xl p-4 sm:p-6 lg:p-7 relative transition-all ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none p-6 bg-[#080808]' : ''
          }`}
        >
          {/* Main 3D / 360 Viewport Container */}
          <div
            className={`relative w-full rounded-lg overflow-hidden border border-white/10 bg-[#0b0c0e] ${
              isFullscreen
                ? 'h-[calc(100vh-180px)]'
                : 'h-[440px] sm:h-[520px] lg:h-[600px]'
            }`}
          >
            {/* Mode 1: Exact Sketchfab 3D WebGL Embed */}
            {viewerMode === 'sketchfab' && activeSketchfab && (
              <div className="relative w-full h-full">
                {/* Loading Skeleton & Spinner */}
                {is3dLoading && (
                  <div className="absolute inset-0 z-10 bg-[#0d0e12] flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative w-20 h-20 mb-5">
                      {/* Outer spinning ring */}
                      <div className="w-full h-full rounded-full border-2 border-transparent border-t-[#0066B1] border-r-[#E7222E] animate-spin" />
                      {/* Inner BMW kidney icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RotateCw className="w-8 h-8 text-white/70 animate-pulse" />
                      </div>
                    </div>
                    <div className="font-mono text-xs text-[#0066B1] uppercase tracking-widest mb-1">
                      Loading Exact 3D Model
                    </div>
                    <h4 className="font-display font-bold text-lg text-white mb-2">
                      {activeSketchfab.title}
                    </h4>
                    <p className="text-xs text-white/50 max-w-sm">
                      Initializing WebGL shaders, photorealistic PBR materials, and 360° orbit camera...
                    </p>
                  </div>
                )}

                {/* The Sketchfab iframe */}
                <iframe
                  ref={iframeRef}
                  title={activeSketchfab.title}
                  src={sketchfabEmbedUrl || ''}
                  className="w-full h-full border-0 block"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                  onLoad={() => setIs3dLoading(false)}
                />

                {/* Bottom Left Attribution overlay */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-[#080808]/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/15 text-xs">
                  <span className="text-white/60">Model:</span>
                  <span className="font-semibold text-white truncate max-w-[150px] sm:max-w-xs">
                    {activeSketchfab.title}
                  </span>
                  <span className="text-white/40">by</span>
                  <a
                    href={activeSketchfab.authorUrl || activeSketchfab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0066B1] hover:underline font-medium flex items-center gap-1"
                  >
                    {activeSketchfab.author}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Bottom Right 3D Orbit instructions */}
                <div className="absolute bottom-3 right-3 z-20 hidden sm:flex items-center gap-3 bg-[#080808]/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/15 text-[11px] font-mono text-white/70 pointer-events-none">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#0066B1]" /> Left Click + Drag: Orbit 360°
                  </span>
                  <span className="text-white/30">·</span>
                  <span>Scroll: Zoom</span>
                  <span className="text-white/30">·</span>
                  <span>Right Click: Pan</span>
                </div>
              </div>
            )}

            {/* Mode 2: Procedural Multi-Angle Canvas */}
            {viewerMode === 'canvas' && (
              <div
                ref={canvasContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
              >
                <canvas ref={canvasRef} className="w-full h-full block" />

                {/* Angle & Frame Telemetry HUD */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#080808]/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-xs font-mono text-white/80">
                  <RotateCw className="w-3.5 h-3.5 text-[#0066B1]" />
                  <span className="tabular-nums font-semibold">{angle}°</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/50">Angle {Math.floor(angle / 10) + 1} / 36</span>
                </div>

                {/* Drag instruction badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#080808]/85 backdrop-blur-md rounded-full border border-white/10 text-xs text-white/60 pointer-events-none flex items-center gap-2">
                  <span>↔ Drag to rotate 360°</span>
                </div>
              </div>
            )}

            {/* Viewport Top Left Active Model Badge */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#080808]/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/15 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-semibold">{activeModel.name}</span>
              <span className="text-white/40">|</span>
              <span className="text-[#0066B1]">{activeModel.category}</span>
            </div>

            {/* Viewport Top Right HUD Controls */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-[#080808]/85 backdrop-blur-md p-1 rounded-lg border border-white/15">
              {/* Auto-Spin Toggle */}
              <button
                onClick={() => setIsAutoSpin(!isAutoSpin)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isAutoSpin
                    ? 'bg-[#0066B1] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="Toggle 360° Auto-Spin"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isAutoSpin ? 'Spinning' : 'Auto-Spin'}</span>
              </button>

              {/* Reset View */}
              <button
                onClick={() => {
                  setIsAutoSpin(false);
                  setAngle(0);
                  if (iframeRef.current && sketchfabEmbedUrl) {
                    iframeRef.current.src = sketchfabEmbedUrl;
                  }
                }}
                className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Camera Angle"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title="Toggle Fullscreen 3D View"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* View on Sketchfab link */}
              {activeSketchfab && (
                <a
                  href={activeSketchfab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="View directly on Sketchfab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Configuration Options Bar */}
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            {/* Column 1: Exterior Paint Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                  Exterior Finish
                </span>
                <span className="text-xs font-semibold text-white">{activeColor.name}</span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {CAR_COLORS.map((c) => {
                  const isSelected = activeColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveColor(c)}
                      className={`relative w-9 h-9 rounded-full transition-all duration-150 p-0.5 ${
                        isSelected
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.finishType})`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2.5 text-[11px] text-white/40 font-mono flex items-center gap-2">
                <span>Finish: {activeColor.finishType}</span>
                <span>·</span>
                <span>Multi-coat OEM paint</span>
              </div>
            </div>

            {/* Column 2: Wheel & Brake Caliper Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                  Forged Wheels & Calipers
                </span>
                <span className="text-xs font-semibold text-white">{activeWheel.size}</span>
              </div>

              <div className="space-y-1.5">
                {WHEEL_OPTIONS.map((w) => {
                  const isSelected = activeWheel.id === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setActiveWheel(w)}
                      className={`w-full flex items-center justify-between p-2 rounded-md border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-[#0066B1] bg-[#0066B1]/10 text-white font-medium'
                          : 'border-white/10 bg-[#080808]/50 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <span className="truncate pr-2">{w.name}</span>
                      <span className="text-[10px] font-mono text-white/40 shrink-0">
                        {w.size}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Calipers */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-white/50 mr-1">Calipers:</span>
                {BRAKE_CALIPER_OPTIONS.map((cal) => (
                  <button
                    key={cal.id}
                    onClick={() => setActiveCaliper(cal)}
                    className={`px-2 py-1 text-[11px] rounded border transition-all flex items-center gap-1.5 ${
                      activeCaliper.id === cal.id
                        ? 'border-white text-white bg-white/10'
                        : 'border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cal.colorHex }}
                    />
                    <span>{cal.name.replace('M ', '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Telemetry & Reservation CTA */}
            <div className="flex flex-col justify-between bg-[#080808]/70 border border-white/10 rounded-lg p-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                    Live Performance Specs
                  </span>
                  <span className="text-xs font-mono text-[#0066B1]">
                    Starting €{activeModel.startingPriceEur.toLocaleString('en-US')}
                  </span>
                </div>

                {/* Key Spec metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-white/10 mb-3 text-center">
                  <div>
                    <div className="font-mono font-bold text-sm text-white">
                      {activeModel.powerHp} <span className="text-[10px] text-white/50 font-normal">hp</span>
                    </div>
                    <div className="text-[10px] uppercase font-mono text-white/40">Power</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm text-white">
                      {activeModel.acceleration0to100}s
                    </div>
                    <div className="text-[10px] uppercase font-mono text-white/40">0–100</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm text-white">
                      {activeModel.topSpeedKmH} <span className="text-[10px] text-white/50 font-normal">km/h</span>
                    </div>
                    <div className="text-[10px] uppercase font-mono text-white/40">V-Max</div>
                  </div>
                </div>

                <div className="text-[11px] text-white/60 mb-3">
                  Configured: <strong className="text-white">{activeColor.name}</strong> +{' '}
                  <strong className="text-white">{activeWheel.name}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    onReserveConfiguration({
                      model: activeModel,
                      color: activeColor,
                      wheel: activeWheel,
                      caliper: activeCaliper,
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-md transition-all shadow-md"
                >
                  <span>Book Test Drive with This Configuration</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {onOpenSpecsModal && (
                  <button
                    onClick={() => onOpenSpecsModal(activeModel)}
                    className="w-full text-center py-1.5 text-xs text-white/60 hover:text-white font-mono transition-colors"
                  >
                    View Full Technical Specifications →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function drawWheelCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  wheelType: string,
  caliperColor: string
) {
  const r = 32;
  ctx.fillStyle = '#141416';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#28282e';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#4a4d56';
  ctx.beginPath();
  ctx.arc(x, y, r - 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = caliperColor;
  ctx.fillRect(x - 8, y - r + 8, 16, 9);

  ctx.strokeStyle = wheelType === 'wheel-20-aero' ? '#e2e6ed' : '#9aa1ad';
  ctx.lineWidth = 2.5;
  const spokes = wheelType === 'wheel-22-individual' ? 12 : 5;
  for (let i = 0; i < spokes; i++) {
    const spokeAngle = (i * Math.PI * 2) / spokes;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(spokeAngle) * (r - 7), y + Math.sin(spokeAngle) * (r - 7));
    ctx.stroke();
  }

  ctx.fillStyle = '#080808';
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0066B1';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function adjustBrightness(hex: string, percent: number) {
  let num = parseInt(hex.replace('#', ''), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00ff) + amt;
  let B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
