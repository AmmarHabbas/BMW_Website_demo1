/**
 * BMW Global Flagship - Standalone Pure Vanilla JS Engine
 * Zero external library dependencies - runs in any browser offline.
 */

// State
const state = {
  currentAngle: 0, // 0 to 350 deg
  isDragging: false,
  dragStartX: 0,
  startAngle: 0,
  isAutoSpin: false,
  autoSpinTimer: null,
  activeColor: '#114B3F', // Isle of Man Green
  activeWheel: '20-aero',
  activeCaliper: '#0066B1',
  heroMode: 'electric', // 'electric' or 'motorsport'
  activeFleetFilter: 'all',
  activeSoundMode: 'ev',
  rpm: 800,
  isRevving: false,
  audioCtx: null,
  oscillator1: null,
  oscillator2: null,
  gainNode: null,
  filterNode: null,
};

// Fleet Models Data
const FLEET_DATA = [
  {
    id: 'bmw-i7',
    name: 'BMW i7 xDrive60',
    series: '7 Series',
    category: 'electric',
    tagline: 'The pinnacle of electric visionary luxury.',
    powerHp: 544,
    acceleration: '4.7s',
    range: '625 km',
    drivetrain: 'xDrive AWD',
    price: '€139,900',
    type: 'Sedan',
    topSpeed: '240 km/h',
  },
  {
    id: 'bmw-ix',
    name: 'BMW iX M60',
    series: 'iX Series',
    category: 'electric',
    tagline: 'Over 1,100 Nm of instantaneous electric torque.',
    powerHp: 619,
    acceleration: '3.8s',
    range: '566 km',
    drivetrain: 'xDrive AWD',
    price: '€143,100',
    type: 'SAV',
    topSpeed: '250 km/h',
  },
  {
    id: 'bmw-m3',
    name: 'BMW M3 Competition',
    series: 'M3 Series',
    category: 'm',
    tagline: 'Motorsport heart with switchable M xDrive 2WD mode.',
    powerHp: 530,
    acceleration: '3.5s',
    range: '10.2 l/100km',
    drivetrain: 'M xDrive',
    price: '€105,300',
    type: 'Sedan',
    topSpeed: '290 km/h',
  },
  {
    id: 'bmw-m5',
    name: 'BMW M5 Sedan',
    series: 'M5 Series',
    category: 'm',
    tagline: '727 HP M HYBRID V8 propulsion technology.',
    powerHp: 727,
    acceleration: '3.5s',
    range: '69 km EV / V8',
    drivetrain: 'M xDrive',
    price: '€144,000',
    type: 'Sedan',
    topSpeed: '305 km/h',
  },
  {
    id: 'bmw-xm',
    name: 'BMW XM Label Red',
    series: 'XM Series',
    category: 'm',
    tagline: 'The most powerful BMW M model ever engineered.',
    powerHp: 748,
    acceleration: '3.8s',
    range: '83 km EV / V8',
    drivetrain: 'M xDrive',
    price: '€203,800',
    type: 'SAV',
    topSpeed: '290 km/h',
  },
  {
    id: 'bmw-x5',
    name: 'BMW X5 xDrive50e',
    series: 'X5 Series',
    category: 'x',
    tagline: 'Effortless authority. Plug-in hybrid confidence.',
    powerHp: 489,
    acceleration: '4.8s',
    range: '110 km EV',
    drivetrain: 'xDrive AWD',
    price: '€96,500',
    type: 'SAV',
    topSpeed: '250 km/h',
  },
  {
    id: 'bmw-x7',
    name: 'BMW X7 M60i xDrive',
    series: 'X7 Series',
    category: 'x',
    tagline: 'First-class luxury across three spacious rows.',
    powerHp: 530,
    acceleration: '4.7s',
    range: '12.9 l/100km',
    drivetrain: 'xDrive AWD',
    price: '€137,200',
    type: 'SAV',
    topSpeed: '250 km/h',
  },
  {
    id: 'bmw-i4',
    name: 'BMW i4 M50 Gran Coupé',
    series: '4 Series',
    category: 'sedan',
    tagline: 'The first pure electric high-performance four-door coupe.',
    powerHp: 544,
    acceleration: '3.9s',
    range: '520 km',
    drivetrain: 'xDrive AWD',
    price: '€71,100',
    type: 'Coupé',
    topSpeed: '225 km/h',
  },
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  init360Canvas();
  renderFleet();
  initSoundEngine();
  initModals();
});

// Canvas 360 Renderer
function init360Canvas() {
  const canvas = document.getElementById('car360Canvas');
  const wrap = document.getElementById('studioCanvasWrap');
  if (!canvas || !wrap) return;

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = wrap.clientWidth * window.devicePixelRatio;
    canvas.height = wrap.clientHeight * window.devicePixelRatio;
    drawCar(ctx, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse drag
  wrap.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    state.dragStartX = e.clientX;
    state.startAngle = state.currentAngle;
    stopAutoSpin();
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    const delta = e.clientX - state.dragStartX;
    let newAngle = (state.startAngle - Math.round(delta / 5) * 10) % 360;
    if (newAngle < 0) newAngle += 360;
    state.currentAngle = newAngle;
    updateAngleUI();
    drawCar(ctx, canvas.width, canvas.height);
  });

  window.addEventListener('mouseup', () => {
    state.isDragging = false;
  });

  // Touch drag
  wrap.addEventListener('touchstart', (e) => {
    state.isDragging = true;
    state.dragStartX = e.touches[0].clientX;
    state.startAngle = state.currentAngle;
    stopAutoSpin();
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!state.isDragging) return;
    const delta = e.touches[0].clientX - state.dragStartX;
    let newAngle = (state.startAngle - Math.round(delta / 5) * 10) % 360;
    if (newAngle < 0) newAngle += 360;
    state.currentAngle = newAngle;
    updateAngleUI();
    drawCar(ctx, canvas.width, canvas.height);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    state.isDragging = false;
  });

  // Controls
  document.querySelectorAll('.color-dot-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-dot-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeColor = btn.getAttribute('data-color');
      drawCar(ctx, canvas.width, canvas.height);
    });
  });

  document.querySelectorAll('.wheel-opt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.wheel-opt-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeWheel = btn.getAttribute('data-wheel');
      drawCar(ctx, canvas.width, canvas.height);
    });
  });

  const autoSpinBtn = document.getElementById('autoSpinBtn');
  if (autoSpinBtn) {
    autoSpinBtn.addEventListener('click', () => {
      if (state.isAutoSpin) {
        stopAutoSpin();
      } else {
        startAutoSpin(ctx, canvas);
      }
    });
  }

  const resetAngleBtn = document.getElementById('resetAngleBtn');
  if (resetAngleBtn) {
    resetAngleBtn.addEventListener('click', () => {
      stopAutoSpin();
      state.currentAngle = 0;
      updateAngleUI();
      drawCar(ctx, canvas.width, canvas.height);
    });
  }
}

function updateAngleUI() {
  const badge = document.getElementById('angleBadge');
  if (badge) {
    badge.textContent = `${state.currentAngle}° · Frame ${Math.floor(state.currentAngle / 10) + 1}/36`;
  }
}

function startAutoSpin(ctx, canvas) {
  state.isAutoSpin = true;
  const btn = document.getElementById('autoSpinBtn');
  if (btn) btn.textContent = 'Pause Auto-Spin';

  state.autoSpinTimer = setInterval(() => {
    state.currentAngle = (state.currentAngle + 10) % 360;
    updateAngleUI();
    drawCar(ctx, canvas.width, canvas.height);
  }, 100);
}

function stopAutoSpin() {
  state.isAutoSpin = false;
  if (state.autoSpinTimer) {
    clearInterval(state.autoSpinTimer);
    state.autoSpinTimer = null;
  }
  const btn = document.getElementById('autoSpinBtn');
  if (btn) btn.textContent = 'Auto-Spin 360°';
}

// Procedural 360 Car Canvas Rendering
function drawCar(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2 + 30;
  const angleRad = (state.currentAngle * Math.PI) / 180;
  const sin = Math.sin(angleRad);
  const cos = Math.cos(angleRad);

  // 1. Studio Floor Drop Shadow with soft gradient
  const shadowGrad = ctx.createRadialGradient(cx, cy + 90, 20, cx, cy + 90, 280);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  shadowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 90, 260, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  // Perspective scaling based on rotation
  const carLen = 320;
  const carH = 95;
  const carW = 140;

  // 2. Chassis Lower Body
  ctx.save();
  ctx.translate(cx, cy);

  // Body Base Shape
  const bodyGrad = ctx.createLinearGradient(-carLen / 2, -carH, carLen / 2, carH);
  bodyGrad.addColorStop(0, adjustBrightness(state.activeColor, -25));
  bodyGrad.addColorStop(0.3, state.activeColor);
  bodyGrad.addColorStop(0.6, adjustBrightness(state.activeColor, 35));
  bodyGrad.addColorStop(1, adjustBrightness(state.activeColor, -35));

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  // Sleek BMW sedan fastback silhouette calculated with perspective
  const frontX = 180 * cos;
  const rearX = -180 * cos;
  const frontY = 25 * sin;

  ctx.beginPath();
  ctx.roundRect(-160, -10, 320, 65, [15, 25, 10, 10]);
  ctx.fill();
  ctx.stroke();

  // 3. Cabin & Glasshouse with Hofmeister Kink
  const glassGrad = ctx.createLinearGradient(0, -75, 0, -10);
  glassGrad.addColorStop(0, 'rgba(15, 20, 28, 0.95)');
  glassGrad.addColorStop(0.5, 'rgba(30, 40, 55, 0.85)');
  glassGrad.addColorStop(1, 'rgba(10, 12, 16, 0.95)');

  ctx.fillStyle = glassGrad;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.moveTo(-110, -10);
  ctx.lineTo(-65, -68);
  ctx.lineTo(70, -68);
  ctx.lineTo(125, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Hofmeister kink pillar highlight
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-70, -68);
  ctx.lineTo(-105, -12);
  ctx.stroke();

  // 4. Iconic BMW Kidney Grille Illumination (Visible near front angle)
  const isFrontFacing = state.currentAngle <= 80 || state.currentAngle >= 280;
  if (isFrontFacing) {
    const grilleAlpha = Math.max(0.2, (cos + 1) / 2);
    ctx.strokeStyle = `rgba(0, 102, 177, ${grilleAlpha})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = '#0066B1';
    ctx.shadowBlur = 12;

    // Left kidney
    ctx.strokeRect(100, 5, 22, 36);
    // Right kidney
    ctx.strokeRect(128, 5, 22, 36);
    ctx.shadowBlur = 0;
  }

  // Laser Headlight Beams
  if (isFrontFacing) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#0066B1';
    ctx.shadowBlur = 15;
    ctx.fillRect(152, 10, 8, 4);
    ctx.fillRect(85, 10, 8, 4);
    ctx.shadowBlur = 0;
  }

  // 5. Wheels & M Brake Calipers
  drawWheel(ctx, -95, 55, state.activeWheel, state.activeCaliper);
  drawWheel(ctx, 95, 55, state.activeWheel, state.activeCaliper);

  // 6. Dynamic Specular Light Glare
  const glossGrad = ctx.createLinearGradient(-150, -40, 150, 40);
  glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  glossGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
  glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glossGrad;
  ctx.fillRect(-160, -68, 320, 120);

  ctx.restore();
}

function drawWheel(ctx, x, y, wheelType, caliperColor) {
  const r = 32;
  // Tire rubber
  ctx.fillStyle = '#141416';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#28282e';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Brake disc
  ctx.fillStyle = '#555861';
  ctx.beginPath();
  ctx.arc(x, y, r - 6, 0, Math.PI * 2);
  ctx.fill();

  // M Brake Caliper
  ctx.fillStyle = caliperColor;
  ctx.fillRect(x - 6, y - r + 8, 14, 8);

  // Wheel Rim Spokes
  ctx.strokeStyle = wheelType === '20-aero' ? '#d0d4dc' : '#8a909d';
  ctx.lineWidth = 2.5;
  const spokes = wheelType === '22-individual' ? 10 : 5;
  for (let i = 0; i < spokes; i++) {
    const angle = (i * Math.PI * 2) / spokes;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * (r - 7), y + Math.sin(angle) * (r - 7));
    ctx.stroke();
  }

  // BMW Center Cap Roundel
  ctx.fillStyle = '#080808';
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0066B1';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function adjustBrightness(hex, percent) {
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

// Fleet Lineup Rendering
function renderFleet() {
  const container = document.getElementById('fleetGrid');
  if (!container) return;

  const filtered = state.activeFleetFilter === 'all'
    ? FLEET_DATA
    : FLEET_DATA.filter((m) => m.category === state.activeFleetFilter);

  container.innerHTML = filtered
    .map(
      (m) => `
    <div class="model-card">
      <div class="model-card-img-wrap">
        <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;">
          ${m.name}
        </div>
        <div style="position: absolute; bottom: 12px; right: 14px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--bmw-blue);">
          ${m.drivetrain}
        </div>
      </div>
      <div class="model-card-content">
        <div class="model-meta">
          <span>${m.series}</span>
          <span>·</span>
          <span>${m.type}</span>
          <span>·</span>
          <span style="color: #fff; font-weight: 600;">From ${m.price}</span>
        </div>
        <h3 class="model-title">${m.name}</h3>
        <p class="model-tagline">${m.tagline}</p>
        <div class="model-spec-strip">
          <div>
            <div class="spec-cell-val">${m.powerHp} hp</div>
            <div class="spec-cell-label">Power</div>
          </div>
          <div>
            <div class="spec-cell-val">${m.acceleration}</div>
            <div class="spec-cell-label">0-100 km/h</div>
          </div>
          <div>
            <div class="spec-cell-val">${m.topSpeed}</div>
            <div class="spec-cell-label">Top Speed</div>
          </div>
        </div>
        <div class="model-card-actions">
          <button class="btn-outline" style="flex:1;" onclick="openSpecsModal('${m.id}')">View Specs</button>
          <button class="btn-primary" style="flex:1;" onclick="openTestDriveModal('${m.id}')">Book Drive</button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  // Setup filter buttons
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFleetFilter = btn.getAttribute('data-filter');
      renderFleet();
    };
  });
}

// Web Audio API Acoustic Simulator
function initSoundEngine() {
  const throttleBtn = document.getElementById('throttleBtn');
  const rpmDisplay = document.getElementById('rpmDisplay');
  const audioContextClass = window.AudioContext || window.webkitAudioContext;

  function ensureAudioCtx() {
    if (!state.audioCtx) {
      state.audioCtx = new audioContextClass();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function startEngineSound() {
    ensureAudioCtx();
    state.isRevving = true;
    throttleBtn.classList.add('pressing');

    const ctx = state.audioCtx;
    const now = ctx.currentTime;

    // Create oscillator synth nodes
    state.oscillator1 = ctx.createOscillator();
    state.oscillator2 = ctx.createOscillator();
    state.gainNode = ctx.createGain();
    state.filterNode = ctx.createBiquadFilter();

    if (state.activeSoundMode === 'ev') {
      // Hans Zimmer Futuristic Electric Harmony
      state.oscillator1.type = 'sine';
      state.oscillator2.type = 'triangle';
      state.oscillator1.frequency.setValueAtTime(80, now);
      state.oscillator2.frequency.setValueAtTime(160, now);
      state.oscillator1.frequency.exponentialRampToValueAtTime(440, now + 1.2);
      state.oscillator2.frequency.exponentialRampToValueAtTime(880, now + 1.2);

      state.filterNode.type = 'lowpass';
      state.filterNode.frequency.setValueAtTime(1200, now);
    } else {
      // Twin-Turbo V8 Throaty Growl
      state.oscillator1.type = 'sawtooth';
      state.oscillator2.type = 'square';
      state.oscillator1.frequency.setValueAtTime(55, now);
      state.oscillator2.frequency.setValueAtTime(110, now);
      state.oscillator1.frequency.exponentialRampToValueAtTime(280, now + 1.5);
      state.oscillator2.frequency.exponentialRampToValueAtTime(560, now + 1.5);

      state.filterNode.type = 'bandpass';
      state.filterNode.frequency.setValueAtTime(450, now);
      state.filterNode.Q.setValueAtTime(3.0, now);
    }

    state.gainNode.gain.setValueAtTime(0.01, now);
    state.gainNode.gain.linearRampToValueAtTime(0.25, now + 0.1);

    state.oscillator1.connect(state.filterNode);
    state.oscillator2.connect(state.filterNode);
    state.filterNode.connect(state.gainNode);
    state.gainNode.connect(ctx.destination);

    state.oscillator1.start(now);
    state.oscillator2.start(now);

    // RPM animation
    let targetRpm = state.activeSoundMode === 'ev' ? 12500 : 6800;
    let current = state.rpm;
    let revInterval = setInterval(() => {
      if (!state.isRevving) {
        clearInterval(revInterval);
        return;
      }
      current += (targetRpm - current) * 0.15;
      rpmDisplay.textContent = Math.round(current);
    }, 40);
  }

  function stopEngineSound() {
    state.isRevving = false;
    throttleBtn.classList.remove('pressing');
    if (!state.audioCtx || !state.gainNode) return;

    const now = state.audioCtx.currentTime;
    state.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.4);
    setTimeout(() => {
      if (state.oscillator1) {
        state.oscillator1.stop();
        state.oscillator1.disconnect();
      }
      if (state.oscillator2) {
        state.oscillator2.stop();
        state.oscillator2.disconnect();
      }
    }, 450);

    // Decay back to idle
    let idleRpm = state.activeSoundMode === 'ev' ? 0 : 750;
    let decayInterval = setInterval(() => {
      if (state.isRevving) {
        clearInterval(decayInterval);
        return;
      }
      state.rpm += (idleRpm - state.rpm) * 0.2;
      rpmDisplay.textContent = Math.round(state.rpm);
      if (Math.abs(state.rpm - idleRpm) < 10) {
        state.rpm = idleRpm;
        rpmDisplay.textContent = state.rpm;
        clearInterval(decayInterval);
      }
    }, 40);
  }

  if (throttleBtn) {
    throttleBtn.addEventListener('mousedown', startEngineSound);
    window.addEventListener('mouseup', stopEngineSound);
    throttleBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startEngineSound();
    });
    window.addEventListener('touchend', stopEngineSound);
  }

  // Sound Mode tabs
  document.querySelectorAll('.sound-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sound-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeSoundMode = btn.getAttribute('data-sound');
      const soundModeTitle = document.getElementById('soundModeTitle');
      if (soundModeTitle) {
        soundModeTitle.textContent =
          state.activeSoundMode === 'ev'
            ? 'BMW IconicSounds Electric (Hans Zimmer)'
            : '4.4L M TwinPower Turbo V8 Exhaust';
      }
    });
  });
}

// Modals
function initModals() {
  const driveModal = document.getElementById('testDriveModal');
  const specsModal = document.getElementById('specsModal');

  document.querySelectorAll('.close-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (driveModal) driveModal.classList.remove('open');
      if (specsModal) specsModal.classList.remove('open');
    });
  });

  const bookingForm = document.getElementById('testDriveForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = 'BMW-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const confirmationBox = document.getElementById('bookingConfirmation');
      if (confirmationBox) {
        confirmationBox.innerHTML = `
          <div style="background: rgba(0, 102, 177, 0.15); border: 1px solid var(--bmw-blue); border-radius: 6px; padding: 1.5rem; text-align: center; margin-top: 1rem;">
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--bmw-blue); margin-bottom: 0.5rem;">RESERVATION CONFIRMED</div>
            <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Pass ID: ${code}</div>
            <p style="font-size: 0.875rem; color: var(--text-secondary);">Your flagship test drive appointment has been locked with your selected dealership.</p>
          </div>
        `;
      }
      bookingForm.reset();
    });
  }
}

window.openTestDriveModal = function (modelId) {
  const modal = document.getElementById('testDriveModal');
  const select = document.getElementById('driveModelSelect');
  if (select && modelId) select.value = modelId;
  if (modal) modal.classList.add('open');
};

window.openSpecsModal = function (modelId) {
  const modal = document.getElementById('specsModal');
  const model = FLEET_DATA.find((m) => m.id === modelId) || FLEET_DATA[0];
  const specsBody = document.getElementById('specsModalBody');
  if (specsBody) {
    specsBody.innerHTML = `
      <h2 style="font-family: var(--font-display); font-size: 1.75rem; margin-bottom: 0.5rem;">${model.name}</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${model.tagline}</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
        <div><strong>Power:</strong> ${model.powerHp} hp</div>
        <div><strong>0-100 km/h:</strong> ${model.acceleration}</div>
        <div><strong>Top Speed:</strong> ${model.topSpeed}</div>
        <div><strong>Drivetrain:</strong> ${model.drivetrain}</div>
        <div><strong>Efficiency/Range:</strong> ${model.range}</div>
        <div><strong>Starting MSRP:</strong> ${model.price}</div>
      </div>
    `;
  }
  if (modal) modal.classList.add('open');
};
