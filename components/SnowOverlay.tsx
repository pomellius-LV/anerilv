import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';
import { SnowConfig, DEFAULT_SNOW_CONFIG } from '../services/dataService';
import { Snowflake, Pause, Play } from 'lucide-react';

interface SnowOverlayProps {
  config?: SnowConfig;
  enabled?: boolean;
  lang: Language;
}

interface Flake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  driftX: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  angle: number;
  spinSpeed: number;
  opacity: number;
  spriteIndex: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

interface PopRing {
  x: number;
  y: number;
  maxRadius: number;
  life: number;
  maxLife: number;
}

const HUD_LABELS: Record<
  Language,
  {
    counterLabel: string;
    pause: string;
    resume: string;
    pausedStatus: string;
  }
> = {
  lv: {
    counterLabel: 'Sniegpārsliņas',
    pause: 'Pauze',
    resume: 'Turpināt',
    pausedStatus: 'Pauzēts'
  },
  ru: {
    counterLabel: 'Снежинки',
    pause: 'Пауза',
    resume: 'Включить',
    pausedStatus: 'Пауза'
  },
  en: {
    counterLabel: 'Snowflakes',
    pause: 'Pause',
    resume: 'Resume',
    pausedStatus: 'Paused'
  }
};

const SESSION_PAUSED_KEY = 'aneri_snow_paused';
const SESSION_POPPED_KEY = 'aneri_snow_popped';

function parseHexRgb(hex: string): { r: number; g: number; b: number } {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.slice(1) : 'FFFFFF';
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function getContrastRimColor(hex: string): string {
  const { r, g, b } = parseHexRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65
    ? 'rgba(100, 116, 139, 0.36)'
    : 'rgba(255, 255, 255, 0.45)';
}

// Create 3 cached crystal sprites once per color/DPR for 60 FPS zero-allocation rendering
function createSnowflakeSprites(dpr: number, hexColor: string): HTMLCanvasElement[] {
  const logicalSize = 72;
  const pixelSize = Math.round(logicalSize * dpr);
  const center = logicalSize / 2;
  const radius = 26;

  const { r, g, b } = parseHexRgb(hexColor);
  const mainStroke = `rgba(${r}, ${g}, ${b}, 0.94)`;
  const rimStroke = getContrastRimColor(hexColor);

  return [0, 1, 2].map(variant => {
    const offscreen = document.createElement('canvas');
    offscreen.width = pixelSize;
    offscreen.height = pixelSize;
    const octx = offscreen.getContext('2d');
    if (!octx) return offscreen;

    octx.scale(dpr, dpr);
    octx.translate(center, center);
    octx.lineCap = 'round';
    octx.lineJoin = 'round';

    const drawCrystalPass = (strokeStyle: string, extraWidth: number) => {
      octx.strokeStyle = strokeStyle;
      octx.fillStyle = strokeStyle;

      for (let i = 0; i < 6; i++) {
        octx.save();
        octx.rotate((i * Math.PI) / 3);

        // Main axis
        octx.lineWidth = (variant === 0 ? 2.1 : 1.85) + extraWidth;
        octx.beginPath();
        octx.moveTo(0, 0);
        octx.lineTo(0, -radius);
        octx.stroke();

        // Outer V-branches
        octx.lineWidth = 1.65 + extraWidth;
        const b1Y = -radius * 0.63;
        const b1Len = variant === 1 ? 7.8 : 6.8;
        octx.beginPath();
        octx.moveTo(0, b1Y);
        octx.lineTo(-b1Len * 0.72, b1Y - b1Len * 0.72);
        octx.moveTo(0, b1Y);
        octx.lineTo(b1Len * 0.72, b1Y - b1Len * 0.72);
        octx.stroke();

        if (variant !== 2) {
          // Inner V-branches
          const b2Y = -radius * 0.35;
          const b2Len = 4.6;
          octx.beginPath();
          octx.moveTo(0, b2Y);
          octx.lineTo(-b2Len * 0.75, b2Y - b2Len * 0.75);
          octx.moveTo(0, b2Y);
          octx.lineTo(b2Len * 0.75, b2Y - b2Len * 0.75);
          octx.stroke();
        }

        if (variant === 2) {
          // Delicate crystal tip dot
          octx.beginPath();
          octx.arc(0, -radius, 2.0 + extraWidth * 0.45, 0, Math.PI * 2);
          octx.fill();
        }

        octx.restore();
      }

      if (variant === 1) {
        // Subtle inner crystal hexagon
        octx.lineWidth = 1.35 + extraWidth;
        octx.beginPath();
        const hexR = radius * 0.28;
        for (let i = 0; i <= 6; i++) {
          const a = (i * Math.PI) / 3;
          const hx = Math.cos(a) * hexR;
          const hy = Math.sin(a) * hexR;
          if (i === 0) octx.moveTo(hx, hy);
          else octx.lineTo(hx, hy);
        }
        octx.stroke();
      }
    };

    // Subtle rim beneath crystal so flakes remain readable on both dark hero & light sections
    drawCrystalPass(rimStroke, 1.45);
    drawCrystalPass(mainStroke, 0);

    return offscreen;
  });
}

function getEffectiveCount(width: number, desktopCount: number): number {
  const clamped = Math.min(120, Math.max(8, Math.round(desktopCount)));
  if (width < 640) return Math.max(6, Math.round(clamped * 0.55));
  if (width < 1024) return Math.max(8, Math.round(clamped * 0.75));
  return clamped;
}

function spawnFlake(
  width: number,
  height: number,
  baseSize: number,
  randomY: boolean
): Flake {
  const minSize = Math.max(12, baseSize * 0.72);
  const maxSize = Math.max(minSize + 4, baseSize * 1.28);
  const size = minSize + Math.random() * (maxSize - minSize);

  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -size - Math.random() * 64,
    size,
    speedY: 26 + Math.random() * 34 + (size * 0.2),
    driftX: (Math.random() - 0.5) * 11,
    swayAmp: 12 + Math.random() * 18,
    swayFreq: 0.65 + Math.random() * 0.85,
    phase: Math.random() * Math.PI * 2,
    angle: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.85,
    opacity: 0.58 + Math.random() * 0.34,
    spriteIndex: Math.floor(Math.random() * 3)
  };
}

const SnowOverlay: React.FC<SnowOverlayProps> = ({ config, enabled, lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const effectiveConfig: SnowConfig = config || {
    ...DEFAULT_SNOW_CONFIG,
    enabled: enabled ?? DEFAULT_SNOW_CONFIG.enabled
  };

  const [poppedCount, setPoppedCount] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_POPPED_KEY);
      const parsed = saved ? parseInt(saved, 10) : 0;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const [visitorPaused, setVisitorPaused] = useState<boolean>(() => {
    try {
      if (sessionStorage.getItem(SESSION_PAUSED_KEY) === '1') return true;
      if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return true;
      }
    } catch {
      // Ignore storage/matchMedia errors
    }
    return false;
  });

  const [hasCookieBanner, setHasCookieBanner] = useState<boolean>(false);

  // Sync cookie banner offset only while the cookie notice exists in DOM
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkBanner = () => {
      setHasCookieBanner(Boolean(document.getElementById('cookie-consent-banner')));
    };
    checkBanner();
    const observer = new MutationObserver(checkBanner);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const toggleVisitorPause = () => {
    setVisitorPaused(prev => {
      const next = !prev;
      try {
        sessionStorage.setItem(SESSION_PAUSED_KEY, next ? '1' : '0');
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  useEffect(() => {
    if (!effectiveConfig.enabled || visitorPaused) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snowSize = effectiveConfig.size;
    const snowColor = effectiveConfig.color;
    const snowCount = effectiveConfig.count;
    const sparkleColors = [snowColor, '#FFFFFF', '#E0F2FE', '#FFE4E6', '#FDA4AF'];

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let sprites = createSnowflakeSprites(dpr, snowColor);

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprites = createSnowflakeSprites(dpr, snowColor);
    };

    resizeCanvas();

    const targetCount = getEffectiveCount(width, snowCount);
    const flakes: Flake[] = Array.from({ length: targetCount }, () =>
      spawnFlake(width, height, snowSize, true)
    );
    const sparkles: Sparkle[] = [];
    const popRings: PopRing[] = [];

    let animFrameId: number | null = null;
    let lastTime = performance.now();
    let elapsed = 0;

    const handleResize = () => {
      resizeCanvas();
      const desired = getEffectiveCount(width, snowCount);
      while (flakes.length < desired) {
        flakes.push(spawnFlake(width, height, snowSize, true));
      }
      if (flakes.length > desired) {
        flakes.length = desired;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;

      // Never interfere with interactive links, buttons, inputs, or HUD itself
      if (
        e.target instanceof Element &&
        e.target.closest('a, button, input, select, textarea, label, [role="button"], [data-snow-hud]')
      ) {
        return;
      }

      const clickX = e.clientX;
      const clickY = e.clientY;

      let bestIdx = -1;
      let bestDistSq = Infinity;

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        const hitRadius = Math.max(f.size * 0.85, 24);
        const dx = f.x - clickX;
        const dy = f.y - clickY;
        const distSq = dx * dx + dy * dy;
        if (distSq <= hitRadius * hitRadius && distSq < bestDistSq) {
          bestDistSq = distSq;
          bestIdx = i;
        }
      }

      if (bestIdx === -1) return;

      const hit = flakes[bestIdx];

      // Spawn crystalline sparkle burst
      if (sparkles.length < 180) {
        const burstCount = 10;
        for (let s = 0; s < burstCount; s++) {
          const angle = (Math.PI * 2 * s) / burstCount + (Math.random() - 0.5) * 0.4;
          const speed = 60 + Math.random() * 95;
          sparkles.push({
            x: hit.x,
            y: hit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 12,
            size: 1.8 + Math.random() * 2.3,
            life: 0,
            maxLife: 0.25 + Math.random() * 0.14,
            color: sparkleColors[s % sparkleColors.length]
          });
        }
        popRings.push({
          x: hit.x,
          y: hit.y,
          maxRadius: hit.size * 1.15,
          life: 0,
          maxLife: 0.28
        });
      }

      // Recycle popped snowflake cleanly at the top
      flakes[bestIdx] = spawnFlake(width, height, snowSize, false);

      setPoppedCount(prev => {
        const next = prev + 1;
        try {
          sessionStorage.setItem(SESSION_POPPED_KEY, String(next));
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    };

    const tick = (now: number) => {
      if (document.hidden) {
        lastTime = now;
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        const swayOffset = Math.sin(elapsed * f.swayFreq + f.phase) * f.swayAmp * dt;
        f.x += f.driftX * dt + swayOffset;
        f.y += f.speedY * dt;
        f.angle += f.spinSpeed * dt;

        if (f.y > height + f.size) {
          flakes[i] = spawnFlake(width, height, snowSize, false);
        } else if (f.x < -f.size) {
          f.x = width + f.size;
        } else if (f.x > width + f.size) {
          f.x = -f.size;
        }

        const sprite = sprites[f.spriteIndex];
        const half = f.size / 2;
        ctx.save();
        ctx.globalAlpha = f.opacity;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.drawImage(sprite, -half, -half, f.size, f.size);
        ctx.restore();
      }

      for (let i = popRings.length - 1; i >= 0; i--) {
        const r = popRings[i];
        r.life += dt;
        if (r.life >= r.maxLife) {
          popRings.splice(i, 1);
          continue;
        }
        const t = r.life / r.maxLife;
        const eased = 1 - Math.pow(1 - t, 3);
        const radius = 4 + r.maxRadius * eased;
        ctx.save();
        ctx.globalAlpha = (1 - t) * 0.72;
        ctx.strokeStyle = snowColor;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.life += dt;
        if (sp.life >= sp.maxLife) {
          sparkles.splice(i, 1);
          continue;
        }
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 120 * dt;
        const t = sp.life / sp.maxLife;
        ctx.save();
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = sp.color;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * (1 - t * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(tick);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        lastTime = performance.now();
      }
    };

    animFrameId = requestAnimationFrame(tick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ctx.clearRect(0, 0, width, height);
    };
  }, [
    effectiveConfig.enabled,
    effectiveConfig.size,
    effectiveConfig.color,
    effectiveConfig.count,
    visitorPaused
  ]);

  if (!effectiveConfig.enabled) {
    return null;
  }

  const copy = HUD_LABELS[lang] || HUD_LABELS.lv;
  const showHud = poppedCount > 0 || visitorPaused;

  return (
    <>
      {/* z-[5] places snowfall behind window-glass foreground text/CTAs/headers (z-10..z-100) while above background photos */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-[5] pointer-events-none select-none"
      />

      {showHud && (
        <div
          data-snow-hud="true"
          className={`fixed right-4 z-[45] flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/92 backdrop-blur-md border border-stone-200/90 shadow-lg text-stone-800 transition-all duration-200 ${
            hasCookieBanner ? 'bottom-24 md:bottom-20' : 'bottom-4'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-medium text-stone-700 whitespace-nowrap">
            <Snowflake size={15} className="text-primary shrink-0" />
            <span>{visitorPaused ? copy.pausedStatus : copy.counterLabel}</span>
            <span
              aria-live="polite"
              className="font-mono font-bold tabular-nums text-stone-900 text-sm"
            >
              {poppedCount}
            </span>
          </div>

          <span className="h-4 w-px bg-stone-200" aria-hidden="true" />

          <button
            type="button"
            onClick={toggleVisitorPause}
            aria-label={visitorPaused ? copy.resume : copy.pause}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {visitorPaused ? <Play size={12} /> : <Pause size={12} />}
            <span>{visitorPaused ? copy.resume : copy.pause}</span>
          </button>
        </div>
      )}
    </>
  );
};

export default SnowOverlay;
