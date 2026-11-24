import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';
import {
  SnowConfig,
  DEFAULT_SNOW_CONFIG,
  SeasonType,
  resolveActiveSeason
} from '../services/dataService';
import { Snowflake, Flower2, Sparkles, Leaf, Pause, Play } from 'lucide-react';

interface SnowOverlayProps {
  config?: SnowConfig;
  enabled?: boolean;
  lang: Language;
}

interface SpriteEntry {
  source: CanvasImageSource;
  width: number;
  height: number;
}

interface MicroGlint {
  distFrac: number;
  angleOffset: number;
  speed: number;
  phase: number;
  size: number;
}

type LeafRegime = 'flutter' | 'tumble' | 'chaotic';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  angle: number;
  spinSpeed: number;
  opacity: number;
  spriteIndex: number;
  // Shared kinematics slots reused cleanly per season
  auxA: number;
  auxB: number;
  auxC: number;
  regime: LeafRegime;
  glints?: MicroGlint[];
  // Spring flowerbed slots
  growProgress: number;
  growDuration: number;
  growDelay: number;
  respawnTimer: number;
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
  color: string;
}

const SEASONAL_SPRITE_URLS: Record<SeasonType, string[]> = {
  winter: [
    '/assets/seasonal/snowflake_1.png',
    '/assets/seasonal/snowflake_2.png',
    '/assets/seasonal/snowflake_3.png',
    '/assets/seasonal/snowflake_4.png',
    '/assets/seasonal/snowflake_5.png',
    '/assets/seasonal/snowflake_6.png',
    '/assets/seasonal/snowflake_7.png',
    '/assets/seasonal/snowflake_8.png'
  ],
  spring: [
    '/assets/seasonal/spring_1.png',
    '/assets/seasonal/spring_2.png',
    '/assets/seasonal/spring_3.png',
    '/assets/seasonal/spring_4.png',
    '/assets/seasonal/spring_5.png',
    '/assets/seasonal/spring_6.png'
  ],
  summer: [
    '/assets/seasonal/butterfly_1.png',
    '/assets/seasonal/butterfly_2.png',
    '/assets/seasonal/butterfly_3.png',
    '/assets/seasonal/butterfly_4.png',
    '/assets/seasonal/butterfly_5.png',
    '/assets/seasonal/butterfly_6.png'
  ],
  autumn: [
    '/assets/seasonal/leaf_1.png',
    '/assets/seasonal/leaf_2.png',
    '/assets/seasonal/leaf_3.png',
    '/assets/seasonal/leaf_4.png',
    '/assets/seasonal/leaf_5.png',
    '/assets/seasonal/leaf_6.png'
  ]
};

const HUD_LABELS: Record<
  Language,
  {
    seasons: Record<SeasonType, string>;
    pause: string;
    resume: string;
    pausedStatus: string;
  }
> = {
  lv: {
    seasons: {
      winter: 'Sniegpārsliņas',
      spring: 'Pavasara ziedi',
      summer: 'Tauriņi',
      autumn: 'Rudens lapas'
    },
    pause: 'Pauze',
    resume: 'Turpināt',
    pausedStatus: 'Pauzēts'
  },
  ru: {
    seasons: {
      winter: 'Снежинки',
      spring: 'Первоцветы',
      summer: 'Бабочки',
      autumn: 'Листики'
    },
    pause: 'Пауза',
    resume: 'Включить',
    pausedStatus: 'Пауза'
  },
  en: {
    seasons: {
      winter: 'Snowflakes',
      spring: 'Spring blooms',
      summer: 'Butterflies',
      autumn: 'Leaves'
    },
    pause: 'Pause',
    resume: 'Resume',
    pausedStatus: 'Paused'
  }
};

const SESSION_PAUSED_KEY = 'aneri_snow_paused';
const SESSION_POPPED_KEY = 'aneri_snow_popped';

function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img.naturalWidth > 0 ? img : null);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function buildSpriteEntries(
  images: HTMLImageElement[],
  season: SeasonType,
  hexColor: string
): SpriteEntry[] {
  const normalizedHex = hexColor.trim().toUpperCase();
  const shouldTint = season === 'winter' && normalizedHex !== '#FFFFFF';

  return images.map(img => {
    if (!shouldTint) {
      return {
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight
      };
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = img.naturalWidth;
    offscreen.height = img.naturalHeight;
    const octx = offscreen.getContext('2d');
    if (!octx) {
      return {
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight
      };
    }

    octx.drawImage(img, 0, 0);
    octx.globalCompositeOperation = 'multiply';
    octx.fillStyle = normalizedHex;
    octx.fillRect(0, 0, offscreen.width, offscreen.height);
    octx.globalCompositeOperation = 'destination-in';
    octx.drawImage(img, 0, 0);
    octx.globalCompositeOperation = 'source-over';

    return {
      source: offscreen,
      width: offscreen.width,
      height: offscreen.height
    };
  });
}

function getEffectiveCount(
  width: number,
  desktopCount: number,
  season: SeasonType
): number {
  const clamped = Math.min(120, Math.max(8, Math.round(desktopCount)));
  const seasonScale =
    season === 'summer'
      ? 0.28 // airy swarm of butterflies (10-32 on desktop)
      : season === 'spring'
        ? 0.5 // flowerbed cluster count along bottom edge
        : 0.85;
  const scaled = Math.max(5, Math.round(clamped * seasonScale));
  if (width < 640) return Math.max(5, Math.round(scaled * 0.55));
  if (width < 1024) return Math.max(7, Math.round(scaled * 0.75));
  return scaled;
}

function createMicroGlints(): MicroGlint[] {
  const count = 4;
  return Array.from({ length: count }, (_, idx) => ({
    distFrac: 0.16 + Math.random() * 0.28,
    angleOffset: (idx * Math.PI) / 2 + Math.random() * 0.9,
    speed: 7.5 + Math.random() * 6.5, // rapid crisp twinkling
    phase: Math.random() * Math.PI * 2,
    size: 1.0 + Math.random() * 1.15 // tiny 1.0 - 2.15px pinpoints
  }));
}

function spawnParticle(
  width: number,
  height: number,
  baseSize: number,
  season: SeasonType,
  randomPos: boolean,
  spriteCount: number,
  index = 0,
  total = 1
): Particle {
  const minSize = Math.max(16, baseSize * 0.78);
  const maxSize = Math.max(minSize + 6, baseSize * 1.3);
  const size = minSize + Math.random() * (maxSize - minSize);

  // SPRING: Rooted bottom flowerbed of snowdrops, crocuses & tulips sprouting upward
  if (season === 'spring') {
    const slotWidth = Math.max(40, width - 56) / Math.max(1, total);
    const jitter = (Math.random() - 0.5) * slotWidth * 0.75;
    const x = Math.min(width - 28, Math.max(28, 28 + slotWidth * (index + 0.5) + jitter));
    // Prefer snowdrops/crocus (~60% springs 0,1,4) alongside tulips (2,3,5)
    const springWeights = [0, 0, 1, 2, 3, 4, 4, 5];
    const spriteIndex = springWeights[Math.floor(Math.random() * springWeights.length)] % Math.max(1, spriteCount);
    const flowerHeight = size * (2.55 + Math.random() * 1.15);

    return {
      x,
      y: height + 3,
      vx: 0,
      vy: 0,
      size: flowerHeight,
      swayAmp: 0.04 + Math.random() * 0.045, // breeze tilt in radians
      swayFreq: 0.9 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      angle: (Math.random() - 0.5) * 0.14, // slight natural stem lean
      spinSpeed: 0,
      opacity: 0.9 + Math.random() * 0.1,
      spriteIndex,
      auxA: 0.85 + Math.random() * 0.3, // subtle breeze harmonic
      auxB: 0,
      auxC: 0,
      regime: 'flutter',
      growProgress: randomPos ? Math.random() * 0.35 : 0,
      growDuration: 1.7 + Math.random() * 1.6,
      growDelay: randomPos ? (index / Math.max(1, total)) * 1.4 + Math.random() * 0.4 : 0.25,
      respawnTimer: 0
    };
  }

  // SUMMER: Flapping butterflies flying along smooth curved trails
  if (season === 'summer') {
    const bSize = size * 1.35;
    const edge = Math.floor(Math.random() * 4);
    let x = Math.random() * width;
    let y = Math.random() * height;
    let heading = Math.random() * Math.PI * 2;

    if (!randomPos) {
      if (edge === 0) {
        x = -bSize;
        y = height * (0.15 + Math.random() * 0.7);
        heading = (Math.random() - 0.5) * 1.1;
      } else if (edge === 1) {
        x = width + bSize;
        y = height * (0.15 + Math.random() * 0.7);
        heading = Math.PI + (Math.random() - 0.5) * 1.1;
      } else if (edge === 2) {
        x = width * (0.15 + Math.random() * 0.7);
        y = -bSize;
        heading = Math.PI / 2 + (Math.random() - 0.5) * 1.1;
      } else {
        x = width * (0.15 + Math.random() * 0.7);
        y = height + bSize;
        heading = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
      }
    }

    const baseSpeed = 48 + Math.random() * 46;
    return {
      x,
      y,
      vx: Math.cos(heading) * baseSpeed,
      vy: Math.sin(heading) * baseSpeed,
      size: bSize,
      swayAmp: baseSpeed, // cruise speed
      swayFreq: 1.1 + Math.random() * 1.3, // steering meander frequency
      phase: Math.random() * Math.PI * 2,
      angle: heading, // live heading angle
      spinSpeed: (Math.random() - 0.5) * 1.2, // turn angular velocity
      opacity: 0.88 + Math.random() * 0.12,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      auxA: 15 + Math.random() * 9, // wingbeat rad/s (~2.5 - 4 full open/close cycles per sec -> lively ~4-5Hz)
      auxB: Math.random() * Math.PI * 2, // wing flap phase
      auxC: 0.5 + Math.random() * 1.2, // glide burst cycle offset
      regime: 'flutter',
      growProgress: 1,
      growDuration: 1,
      growDelay: 0,
      respawnTimer: 0
    };
  }

  // AUTUMN: Independent chaotic fluid-dynamics leaf paths (Andersen, Pesavento & Wang)
  if (season === 'autumn') {
    const leafSize = size * (1.05 + Math.random() * 0.28);
    const r = Math.random();
    const regime: LeafRegime = r < 0.42 ? 'flutter' : r < 0.72 ? 'tumble' : 'chaotic';
    const spinSign = Math.random() < 0.5 ? 1 : -1;

    return {
      x: Math.random() * width,
      y: randomPos ? Math.random() * height : -leafSize - Math.random() * 90,
      // Independent horizontal wind pockets (no uniform herd lockstep)
      vx: (Math.random() - 0.44) * 42,
      vy: 28 + Math.random() * 26 + leafSize * 0.11,
      size: leafSize,
      // Independent flutter period & amplitude per leaf
      swayAmp: 36 + Math.random() * 58,
      swayFreq: 1.35 + Math.random() * 1.65,
      phase: Math.random() * Math.PI * 2,
      // Randomized 360-deg initial orientation so stems NEVER uniformly point downward
      angle: Math.random() * Math.PI * 2,
      spinSpeed:
        regime === 'tumble'
          ? spinSign * (1.1 + Math.random() * 1.4)
          : spinSign * (0.28 + Math.random() * 0.55),
      opacity: 0.85 + Math.random() * 0.14,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      auxA: 1.4 + Math.random() * 1.6, // 3D roll frequency
      auxB: Math.random() * Math.PI * 2, // 3D roll phase
      auxC: 0.65 + Math.random() * 0.7, // chaotic period-two asymmetry factor
      regime,
      growProgress: 1,
      growDuration: 1,
      growDelay: 0,
      respawnTimer: 0
    };
  }

  // WINTER: 8 macro snowflakes + micro pinpoint frost glint array
  const flakeSize = size * 1.2;
  return {
    x: Math.random() * width,
    y: randomPos ? Math.random() * height : -flakeSize - Math.random() * 70,
    vx: (Math.random() - 0.5) * 12,
    vy: 23 + Math.random() * 29 + size * 0.17,
    size: flakeSize,
    swayAmp: 12 + Math.random() * 18,
    swayFreq: 0.55 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    angle: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.6,
    opacity: 0.72 + Math.random() * 0.25,
    spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
    auxA: 0.85 + Math.random() * 0.85,
    auxB: 1.8 + Math.random() * 2.0,
    auxC: Math.random() * Math.PI * 2,
    regime: 'flutter',
    glints: createMicroGlints(),
    growProgress: 1,
    growDuration: 1,
    growDelay: 0,
    respawnTimer: 0
  };
}

function getSparklePalette(season: SeasonType, snowColor: string): string[] {
  switch (season) {
    case 'spring':
      return ['#FFFFFF', '#FDE047', '#F472B6', '#C084FC', '#4ADE80'];
    case 'summer':
      return ['#FDE047', '#38BDF8', '#FB7185', '#A78BFA', '#FFFFFF'];
    case 'autumn':
      return ['#EA580C', '#DC2626', '#F59E0B', '#FDE047', '#9A3412'];
    default:
      return [snowColor, '#FFFFFF', '#BAE6FD', '#E0F2FE'];
  }
}

// Micro crystal pinpoint sparkle dot (fast, tiny 1-2px light glints)
function drawMicroPinpoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  alpha: number
) {
  if (alpha <= 0.05) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Crisp tiny sub-pixel specular core cross
  ctx.strokeStyle = 'rgba(224, 242, 254, 0.92)';
  ctx.lineWidth = 0.75;
  const arm = r * 2.1;
  ctx.beginPath();
  ctx.moveTo(x - arm, y);
  ctx.lineTo(x + arm, y);
  ctx.moveTo(x, y - arm);
  ctx.lineTo(x, y + arm);
  ctx.stroke();
  ctx.restore();
}

function easeOutBack(t: number): number {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

const SeasonIcon: React.FC<{ season: SeasonType }> = ({ season }) => {
  switch (season) {
    case 'spring':
      return <Flower2 size={15} className="text-emerald-600 shrink-0" />;
    case 'summer':
      return <Sparkles size={15} className="text-amber-500 shrink-0" />;
    case 'autumn':
      return <Leaf size={15} className="text-amber-600 shrink-0" />;
    default:
      return <Snowflake size={15} className="text-primary shrink-0" />;
  }
};

const SnowOverlay: React.FC<SnowOverlayProps> = ({ config, enabled, lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const effectiveConfig: SnowConfig = config || {
    ...DEFAULT_SNOW_CONFIG,
    enabled: enabled ?? DEFAULT_SNOW_CONFIG.enabled
  };

  const activeSeason: SeasonType = resolveActiveSeason(effectiveConfig.seasonMode);

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

    let cancelled = false;
    const itemSize = effectiveConfig.size;
    const snowColor = effectiveConfig.color;
    const itemCount = effectiveConfig.count;
    const sparkleColors = getSparklePalette(activeSeason, snowColor);

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    let sprites: SpriteEntry[] = [];
    const targetCount = getEffectiveCount(width, itemCount, activeSeason);
    const urlCount = SEASONAL_SPRITE_URLS[activeSeason].length;
    const particles: Particle[] = Array.from({ length: targetCount }, (_, i) =>
      spawnParticle(width, height, itemSize, activeSeason, true, urlCount, i, targetCount)
    );
    const sparkles: Sparkle[] = [];
    const popRings: PopRing[] = [];

    let animFrameId: number | null = null;
    let lastTime = performance.now();
    let elapsed = 0;

    Promise.all(SEASONAL_SPRITE_URLS[activeSeason].map(loadImage)).then(loaded => {
      if (cancelled) return;
      const valid = loaded.filter((img): img is HTMLImageElement => img !== null);
      if (valid.length > 0) {
        sprites = buildSpriteEntries(valid, activeSeason, snowColor);
      }
    });

    const handleResize = () => {
      resizeCanvas();
      const desired = getEffectiveCount(width, itemCount, activeSeason);
      if (activeSeason === 'spring') {
        // Reflow flowerbed bases cleanly across updated viewport width
        particles.length = 0;
        for (let i = 0; i < desired; i++) {
          particles.push(
            spawnParticle(width, height, itemSize, activeSeason, true, urlCount, i, desired)
          );
        }
        return;
      }

      while (particles.length < desired) {
        particles.push(
          spawnParticle(width, height, itemSize, activeSeason, true, urlCount)
        );
      }
      if (particles.length > desired) {
        particles.length = desired;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;

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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (activeSeason === 'spring' && (p.growProgress < 0.25 || p.respawnTimer > 0)) {
          continue;
        }
        // Flower head center sits above bottom base; floating items center at (p.x, p.y)
        const targetX = p.x;
        const targetY =
          activeSeason === 'spring'
            ? p.y - p.size * 0.58 * easeOutBack(Math.min(1, p.growProgress))
            : p.y;
        const hitRadius = activeSeason === 'spring' ? Math.max(p.size * 0.45, 28) : Math.max(p.size * 0.72, 26);

        const dx = targetX - clickX;
        const dy = targetY - clickY;
        const distSq = dx * dx + dy * dy;
        if (distSq <= hitRadius * hitRadius && distSq < bestDistSq) {
          bestDistSq = distSq;
          bestIdx = i;
        }
      }

      if (bestIdx === -1) return;

      const hit = particles[bestIdx];
      const burstX = hit.x;
      const burstY =
        activeSeason === 'spring'
          ? hit.y - hit.size * 0.62 * easeOutBack(Math.min(1, hit.growProgress))
          : hit.y;

      if (sparkles.length < 180) {
        const burstCount = 12;
        for (let s = 0; s < burstCount; s++) {
          const angle = (Math.PI * 2 * s) / burstCount + (Math.random() - 0.5) * 0.4;
          const speed = 55 + Math.random() * 90;
          sparkles.push({
            x: burstX,
            y: burstY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 18,
            size: 1.9 + Math.random() * 2.4,
            life: 0,
            maxLife: 0.26 + Math.random() * 0.16,
            color: sparkleColors[s % sparkleColors.length]
          });
        }
        popRings.push({
          x: burstX,
          y: burstY,
          maxRadius: activeSeason === 'spring' ? hit.size * 0.45 : hit.size * 0.9,
          life: 0,
          maxLife: 0.28,
          color: sparkleColors[0]
        });
      }

      if (activeSeason === 'spring') {
        // Gently re-sprout a fresh blossom in the same garden bed slot
        particles[bestIdx] = spawnParticle(
          width,
          height,
          itemSize,
          activeSeason,
          false,
          urlCount,
          bestIdx,
          particles.length
        );
      } else {
        particles[bestIdx] = spawnParticle(
          width,
          height,
          itemSize,
          activeSeason,
          false,
          urlCount
        );
      }

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

      if (sprites.length > 0) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const sprite = sprites[p.spriteIndex % sprites.length];
          const maxDim = Math.max(sprite.width, sprite.height) || 1;
          const drawW = (sprite.width / maxDim) * p.size;
          const drawH = (sprite.height / maxDim) * p.size;

          if (activeSeason === 'spring') {
            // Sprouting flowerbed anchored cleanly along viewport bottom edge
            if (p.growDelay > 0) {
              p.growDelay = Math.max(0, p.growDelay - dt);
              continue;
            }
            if (p.growProgress < 1) {
              p.growProgress = Math.min(1, p.growProgress + dt / p.growDuration);
            }

            const ease = easeOutBack(p.growProgress);
            const scaleY = Math.max(0.02, ease);
            const scaleX = 0.55 + 0.45 * Math.min(1, p.growProgress * 1.3);
            const breezeSway =
              p.angle +
              Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp * Math.min(1, p.growProgress) +
              Math.sin(elapsed * p.swayFreq * 0.43 + p.auxA) * (p.swayAmp * 0.45);

            ctx.save();
            ctx.globalAlpha = p.opacity * Math.min(1, p.growProgress * 2.5);
            ctx.translate(p.x, p.y);
            ctx.rotate(breezeSway);
            ctx.scale(scaleX, scaleY);
            // Draw anchored at stem base center (-drawW/2, -drawH)
            ctx.drawImage(sprite.source, -drawW / 2, -drawH, drawW, drawH);
            ctx.restore();
          } else if (activeSeason === 'summer') {
            // Smooth curvilinear butterfly flight with realistic periodic wing-flapping + glides
            const turnWobble =
              Math.sin(elapsed * p.swayFreq + p.phase) * 1.45 +
              Math.cos(elapsed * (p.swayFreq * 0.47) + p.phase * 1.7) * 0.75;

            // Gentle inward edge steering so butterflies gracefully cruise across screen
            const margin = 80;
            let steerOffset = 0;
            if (p.x < margin) steerOffset += Math.sin(0 - p.angle) * 2.2;
            else if (p.x > width - margin) steerOffset += Math.sin(Math.PI - p.angle) * 2.2;
            if (p.y < margin) steerOffset += Math.sin(Math.PI / 2 - p.angle) * 2.2;
            else if (p.y > height - margin) steerOffset += Math.sin(-Math.PI / 2 - p.angle) * 2.2;

            p.angle += (turnWobble + steerOffset) * dt;

            // Alternate between rapid flapping (~80% of time) & brief soaring open-wing glides (~20%)
            const glideGate = Math.sin(elapsed * 1.2 + p.auxC);
            const isGliding = glideGate > 0.65;
            const wingFold = isGliding
              ? 0.92 + 0.06 * Math.sin(elapsed * 4 + p.auxB)
              : 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(elapsed * p.auxA + p.auxB));

            // Wing downstroke provides subtle forward speed pulse
            const flapBoost = 0.85 + 0.32 * (1 - wingFold);
            const speed = p.swayAmp * flapBoost;
            p.x += Math.cos(p.angle) * speed * dt;
            p.y += Math.sin(p.angle) * speed * dt;

            // Recycle smoothly only if far outside viewport
            if (
              p.x < -p.size * 2.2 ||
              p.x > width + p.size * 2.2 ||
              p.y < -p.size * 2.2 ||
              p.y > height + p.size * 2.2
            ) {
              particles[i] = spawnParticle(
                width,
                height,
                itemSize,
                activeSeason,
                false,
                urlCount
              );
              continue;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            // Symmetrical dorsal sprite points straight UP (-PI/2), so +PI/2 aligns nose with flight tangent
            ctx.rotate(p.angle + Math.PI / 2);
            // Folding wings inward/outward symmetrically along body spine
            ctx.scale(wingFold, 1.0 - (1.0 - wingFold) * 0.08);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
          } else if (activeSeason === 'autumn') {
            // Independent Andersen-Pesavento-Wang falling leaf dynamics (flutter / tumble / chaotic)
            const tPhase = elapsed * p.swayFreq + p.phase;
            const glideSwing =
              Math.cos(tPhase) + 0.34 * Math.cos(tPhase * p.auxC + p.auxB);

            // Spatial micro-turbulence unique to leaf's position rather than uniform global wave
            const eddyX =
              Math.sin(p.y * 0.007 + p.phase) * 14 +
              Math.cos(p.x * 0.006 + elapsed * 0.6) * 10;

            p.x += (p.vx + eddyX + glideSwing * p.swayAmp) * dt;

            // Upward cusp lift phenomenon: at turning points (where |glideSwing| spikes),
            // rotational circulation creates upward lift that stalls or briefly raises the leaf
            const cuspLift =
              p.regime === 'tumble'
                ? 1.0 - 0.25 * Math.abs(Math.sin(tPhase))
                : 1.0 - 1.18 * Math.pow(Math.min(1, Math.abs(glideSwing) * 0.78), 2);
            p.y += p.vy * cuspLift * dt;

            let renderAngle: number;
            if (p.regime === 'tumble') {
              p.angle += p.spinSpeed * dt;
              renderAngle = p.angle;
            } else if (p.regime === 'chaotic') {
              // Bifurcation flips between fluttering glide and sudden mid-air tumbling bursts
              const tumbleBurst = Math.sin(elapsed * 0.85 + p.auxB) > 0.35;
              p.angle += (tumbleBurst ? p.spinSpeed * 2.4 : p.spinSpeed * 0.35) * dt;
              renderAngle = p.angle + glideSwing * 0.55;
            } else {
              // Asymmetric tilted fluttering around randomized starting orientation
              p.angle += p.spinSpeed * 0.22 * dt;
              renderAngle = p.angle + glideSwing * 0.68;
            }

            // Continuous 3D pitch/roll tumbling so stems & blades flip naturally in air
            const rollScaleX = 0.56 + 0.44 * Math.cos(elapsed * p.auxA + p.auxB);
            const pitchScaleY = 0.72 + 0.28 * Math.sin(elapsed * p.auxA * 0.73 + p.phase);

            if (p.y > height + p.size) {
              particles[i] = spawnParticle(
                width,
                height,
                itemSize,
                activeSeason,
                false,
                urlCount
              );
              continue;
            } else if (p.x < -p.size) {
              p.x = width + p.size;
            } else if (p.x > width + p.size) {
              p.x = -p.size;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(renderAngle);
            ctx.scale(rollScaleX, pitchScaleY);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
          } else {
            // WINTER: Macro snowflakes + rapid micro pinpoint twinkling dots
            const swayOffset = Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp * dt;
            p.x += p.vx * dt + swayOffset;
            p.y += p.vy * dt;
            p.angle += p.spinSpeed * dt;

            if (p.y > height + p.size) {
              particles[i] = spawnParticle(
                width,
                height,
                itemSize,
                activeSeason,
                false,
                urlCount
              );
              continue;
            } else if (p.x < -p.size) {
              p.x = width + p.size;
            } else if (p.x > width + p.size) {
              p.x = -p.size;
            }

            const shimmerWave = 0.5 + 0.5 * Math.sin(elapsed * p.auxB + p.auxC);
            const liveAlpha = Math.min(1, p.opacity * (0.82 + 0.2 * shimmerWave));
            const facetTilt = 0.9 + 0.1 * Math.cos(elapsed * p.auxA + p.phase);

            ctx.save();
            ctx.globalAlpha = liveAlpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.scale(facetTilt, 1);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();

            // Multiple fast, tiny crystal pinpoint glints (1-2px) flashing briefly on light reflections
            if (p.glints) {
              const baseRadius = Math.min(drawW, drawH);
              for (let g = 0; g < p.glints.length; g++) {
                const gl = p.glints[g];
                const wave = 0.5 + 0.5 * Math.sin(elapsed * gl.speed + gl.phase);
                // High power curve -> stays dark most of the time, then rapidly twinkles & vanishes
                const intensity = Math.pow(wave, 11);
                if (intensity > 0.25) {
                  const a = p.angle + gl.angleOffset;
                  const dist = baseRadius * gl.distFrac;
                  drawMicroPinpoint(
                    ctx,
                    p.x + Math.cos(a) * dist * facetTilt,
                    p.y + Math.sin(a) * dist,
                    gl.size,
                    intensity * 0.95
                  );
                }
              }
            }
          }
        }
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
        ctx.strokeStyle = r.color;
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
      cancelled = true;
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
    activeSeason,
    visitorPaused
  ]);

  if (!effectiveConfig.enabled) {
    return null;
  }

  const copy = HUD_LABELS[lang] || HUD_LABELS.lv;
  const showHud = poppedCount > 0 || visitorPaused;
  const seasonLabel = copy.seasons[activeSeason];

  return (
    <>
      {/* z-[5] places seasonal artwork behind window-glass foreground text/CTAs/headers (z-10..z-100) while above background photos */}
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
            <SeasonIcon season={activeSeason} />
            <span>{visitorPaused ? copy.pausedStatus : seasonLabel}</span>
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
