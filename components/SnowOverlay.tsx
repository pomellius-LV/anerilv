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

// Physical 3D crystal facet on a snowflake: only reflects light when rotated/tilted into specular alignment with Sun half-vector
interface CrystalFacet {
  distFrac: number;
  angleOffset: number;
  nx: number;
  ny: number;
  nz: number;
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
  // General / Autumn / Winter kinematics slots
  auxA: number;
  auxB: number;
  auxC: number;
  tiltFreqX: number;
  tiltFreqY: number;
  tiltAmpX: number;
  tiltAmpY: number;
  regime: LeafRegime;
  facets?: CrystalFacet[];
  // Summer asynchronous butterfly state machine
  wingPhase: number;
  flapSpeed: number;
  modeTimer: number;
  isGliding: boolean;
  glideAngle: number;
  // Spring staggered multi-step botanical flowerbed slots
  growProgress: number;
  growDuration: number;
  growDelay: number;
  bloomLife: number;
  wilting: number; // 0 = alive/growing, >0..1 = gentle fade before new sprout
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

const SPRITE_VERSION = '1.24';

const SEASONAL_SPRITE_URLS: Record<SeasonType, string[]> = {
  winter: [
    `/assets/seasonal/snowflake_1.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/snowflake_2.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/snowflake_3.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/snowflake_4.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/snowflake_5.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/snowflake_6.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/snowflake_7.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/snowflake_8.png?v=${SPRITE_VERSION}`
  ],
  spring: [
    `/assets/seasonal/spring_1.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/spring_2.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/spring_3.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/spring_4.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/spring_5.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/spring_6.png?v=${SPRITE_VERSION}`
  ],
  summer: [
    `/assets/seasonal/butterfly_1.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/butterfly_2.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/butterfly_3.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/butterfly_4.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/butterfly_5.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/butterfly_6.png?v=${SPRITE_VERSION}`
  ],
  autumn: [
    `/assets/seasonal/leaf_autumn_1.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/leaf_autumn_2.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/leaf_autumn_3.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/leaf_autumn_4.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/leaf_autumn_5.png?v=${SPRITE_VERSION}`,
    `/assets/seasonal/leaf_autumn_6.png?v=${SPRITE_VERSION}`
  ]
};

// Fixed directional Sun + Viewer Blinn-Phong Half-Vector H = normalize(L + V)
// L = normalize(-0.42, -0.58, 0.70), V = (0, 0, 1)
const HALF_VEC = (() => {
  const lx = -0.42;
  const ly = -0.58;
  const lz = 0.70;
  const lLen = Math.hypot(lx, ly, lz);
  const hx = lx / lLen;
  const hy = ly / lLen;
  const hz = lz / lLen + 1.0;
  const hLen = Math.hypot(hx, hy, hz);
  return { x: hx / hLen, y: hy / hLen, z: hz / hLen };
})();

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
      ? 0.28 // airy swarm of butterflies (8-34 on desktop)
      : season === 'spring'
        ? 0.45 // balanced flowerbed density along bottom edge
        : 0.85;
  const scaled = Math.max(5, Math.round(clamped * seasonScale));
  if (width < 640) return Math.max(5, Math.round(scaled * 0.55));
  if (width < 1024) return Math.max(7, Math.round(scaled * 0.75));
  return scaled;
}

// Create 5 physically oriented ice-crystal facets per snowflake (tilted bevels in crystal space)
function createCrystalFacets(): CrystalFacet[] {
  const count = 5;
  return Array.from({ length: count }, (_, idx) => {
    // Spread facets along crystal arms with distinct 3D bevel slopes (14-36 deg)
    const armAngle = (idx * Math.PI * 2) / count + (Math.random() - 0.5) * 0.65;
    const bevelTilt = 0.24 + Math.random() * 0.40;
    const azimuth = armAngle + (Math.random() - 0.5) * 1.4;
    return {
      distFrac: 0.14 + Math.random() * 0.28,
      angleOffset: armAngle,
      nx: Math.sin(bevelTilt) * Math.cos(azimuth),
      ny: Math.sin(bevelTilt) * Math.sin(azimuth),
      nz: Math.cos(bevelTilt),
      size: 0.95 + Math.random() * 0.95 // tiny 0.95 - 1.9px diamond glints
    };
  });
}

// Generate shuffled appearance ranks so spring blooms pop up organically across the bed rather than left-to-right
function createShuffledRanks(count: number): number[] {
  const ranks = Array.from({ length: count }, (_, i) => i);
  for (let i = ranks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  return ranks;
}

function spawnParticle(
  width: number,
  height: number,
  baseSize: number,
  season: SeasonType,
  randomPos: boolean,
  spriteCount: number,
  index = 0,
  total = 1,
  spawnOrderRank?: number
): Particle {
  const minSize = Math.max(16, baseSize * 0.78);
  const maxSize = Math.max(minSize + 6, baseSize * 1.3);
  const size = minSize + Math.random() * (maxSize - minSize);

  // SPRING: Living bottom flowerbed growing gradually one-by-one in 6 rhythmic botanical pulses ("чик-чик-чик")
  if (season === 'spring') {
    const slotWidth = Math.max(40, width - 56) / Math.max(1, total);
    const jitter = (Math.random() - 0.5) * slotWidth * 0.78;
    const x = Math.min(width - 28, Math.max(28, 28 + slotWidth * (index + 0.5) + jitter));
    // Prefer snowdrops/crocus (~60% springs 0,1,4) alongside tulips (2,3,5)
    const springWeights = [0, 0, 1, 2, 3, 4, 4, 5];
    const spriteIndex = springWeights[Math.floor(Math.random() * springWeights.length)] % Math.max(1, spriteCount);
    const flowerHeight = size * (2.55 + Math.random() * 1.15);

    const rank = spawnOrderRank ?? index;
    // First 2 early snowdrops begin quickly (0.3s, 1.1s); subsequent blooms appear gradually over ~16s
    const staggeredDelay = randomPos
      ? rank < 2
        ? 0.25 + rank * 0.85
        : 1.9 + ((rank - 2) / Math.max(1, total - 2)) * 14.5 + Math.random() * 1.1
      : 0.4 + Math.random() * 1.1;

    return {
      x,
      y: height + 3,
      vx: 0,
      vy: 0,
      size: flowerHeight,
      swayAmp: 0.038 + Math.random() * 0.042,
      swayFreq: 0.85 + Math.random() * 0.75,
      phase: Math.random() * Math.PI * 2,
      angle: (Math.random() - 0.5) * 0.14,
      spinSpeed: 0,
      opacity: 0.9 + Math.random() * 0.1,
      spriteIndex,
      auxA: 0.8 + Math.random() * 0.35,
      auxB: 0,
      auxC: 0,
      tiltFreqX: 0,
      tiltFreqY: 0,
      tiltAmpX: 0,
      tiltAmpY: 0,
      regime: 'flutter',
      wingPhase: 0,
      flapSpeed: 0,
      modeTimer: 0,
      isGliding: false,
      glideAngle: 0,
      growProgress: 0,
      growDuration: 5.2 + Math.random() * 2.4, // ~5.2 - 7.6s total for 6 distinct botanical growth steps
      growDelay: staggeredDelay,
      bloomLife: 34 + Math.random() * 26, // blooms stay 34-60s then gently cycle to a fresh sprout
      wilting: 0
    };
  }

  // SUMMER: Completely asynchronous per-butterfly flight & wingbeat state machine
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

    const baseSpeed = 46 + Math.random() * 48;
    // Diverse individual wingbeat cadence: smaller butterflies beat faster, larger Monarchs slower
    const sizeRatio = Math.min(1.3, Math.max(0.75, baseSize / Math.max(12, size)));
    const flapSpeed = (14 + Math.random() * 19) * sizeRatio; // ~2.1 to 5.6 full wingbeats/sec!
    const startGliding = Math.random() < 0.25;

    return {
      x,
      y,
      vx: Math.cos(heading) * baseSpeed,
      vy: Math.sin(heading) * baseSpeed,
      size: bSize,
      swayAmp: baseSpeed,
      swayFreq: 0.9 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      angle: heading,
      spinSpeed: (Math.random() - 0.5) * 1.3,
      opacity: 0.88 + Math.random() * 0.12,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      auxA: 0.85 + Math.random() * 0.35, // current burst cadence multiplier
      auxB: 0,
      auxC: 0,
      tiltFreqX: 0,
      tiltFreqY: 0,
      tiltAmpX: 0,
      tiltAmpY: 0,
      regime: 'flutter',
      wingPhase: Math.random() * Math.PI * 2,
      flapSpeed,
      modeTimer: startGliding ? 0.2 + Math.random() * 0.8 : 0.4 + Math.random() * 1.9,
      isGliding: startGliding,
      glideAngle: 0.78 + Math.random() * 0.2,
      growProgress: 1,
      growDuration: 1,
      growDelay: 0,
      bloomLife: 0,
      wilting: 0
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
      vx: (Math.random() - 0.44) * 42,
      vy: 28 + Math.random() * 26 + leafSize * 0.11,
      size: leafSize,
      swayAmp: 36 + Math.random() * 58,
      swayFreq: 1.35 + Math.random() * 1.65,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      spinSpeed:
        regime === 'tumble'
          ? spinSign * (1.1 + Math.random() * 1.4)
          : spinSign * (0.28 + Math.random() * 0.55),
      opacity: 0.86 + Math.random() * 0.14,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      auxA: 1.4 + Math.random() * 1.6,
      auxB: Math.random() * Math.PI * 2,
      auxC: 0.65 + Math.random() * 0.7,
      tiltFreqX: 0,
      tiltFreqY: 0,
      tiltAmpX: 0,
      tiltAmpY: 0,
      regime,
      wingPhase: 0,
      flapSpeed: 0,
      modeTimer: 0,
      isGliding: false,
      glideAngle: 0,
      growProgress: 1,
      growDuration: 1,
      growDelay: 0,
      bloomLife: 0,
      wilting: 0
    };
  }

  // WINTER: 8 macro crystal snowflakes with physically aligned 3D crystal facets
  const flakeSize = size * 1.2;
  const spinDir = Math.random() < 0.5 ? 1 : -1;
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
    spinSpeed: spinDir * (0.35 + Math.random() * 0.65),
    opacity: 0.76 + Math.random() * 0.22,
    spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
    auxA: 0,
    auxB: Math.random() * Math.PI * 2,
    auxC: Math.random() * Math.PI * 2,
    tiltFreqX: 0.9 + Math.random() * 1.1,
    tiltFreqY: 0.85 + Math.random() * 1.15,
    tiltAmpX: 0.35 + Math.random() * 0.32, // subtle real 3D wobble (~20-38 deg)
    tiltAmpY: 0.35 + Math.random() * 0.32,
    regime: 'flutter',
    facets: createCrystalFacets(),
    wingPhase: 0,
    flapSpeed: 0,
    modeTimer: 0,
    isGliding: false,
    glideAngle: 0,
    growProgress: 1,
    growDuration: 1,
    growDelay: 0,
    bloomLife: 0,
    wilting: 0
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

// Micro crystal pinpoint specular flash (only visible when rotated/tilted into reflection cone)
function drawMicroPinpoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  alpha: number
) {
  if (alpha <= 0.04) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(224, 242, 254, 0.95)';
  ctx.lineWidth = 0.7;
  const arm = r * 2.2;
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

// 6-stage botanical "chik-chik-chik" time-lapse curve:
// Each beat surges smoothly in the first 36% of the beat, then pauses & sways before the next growth spurt
function steppedBotanicalGrowth(progress: number): { scaleY: number; scaleX: number } {
  if (progress <= 0) return { scaleY: 0, scaleX: 0 };
  if (progress >= 1) return { scaleY: 1, scaleX: 1 };

  const stages = 6;
  const scaled = progress * stages;
  const stageIdx = Math.min(stages - 1, Math.floor(scaled));
  const local = scaled - stageIdx;

  // Within each stage: quick upward surge during 0..0.36, steady rest during 0.36..1.0
  const pulseEnd = 0.36;
  const localEase =
    local < pulseEnd ? easeOutBack(local / pulseEnd) : 1.0;

  const prevTier = stageIdx / stages;
  const nextTier = (stageIdx + 1) / stages;
  const stepHeight = prevTier + (nextTier - prevTier) * localEase;

  // Leaves/petals gradually unfurl wider across the upper stages
  const unfurl = Math.min(1, 0.42 + stepHeight * 0.62);
  return { scaleY: Math.max(0.03, stepHeight), scaleX: unfurl };
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
  const [hasMobileCallDock, setHasMobileCallDock] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkOverlays = () => {
      setHasCookieBanner(Boolean(document.getElementById('cookie-consent-banner')));
      const dock = document.getElementById('mobile-call-dock');
      setHasMobileCallDock(dock?.getAttribute('data-visible') === 'true');
    };
    checkOverlays();
    const observer = new MutationObserver(checkOverlays);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-visible']
    });
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
    const springRanks = activeSeason === 'spring' ? createShuffledRanks(targetCount) : [];
    const particles: Particle[] = Array.from({ length: targetCount }, (_, i) =>
      spawnParticle(
        width,
        height,
        itemSize,
        activeSeason,
        true,
        urlCount,
        i,
        targetCount,
        springRanks[i]
      )
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
        const ranks = createShuffledRanks(desired);
        particles.length = 0;
        for (let i = 0; i < desired; i++) {
          particles.push(
            spawnParticle(width, height, itemSize, activeSeason, true, urlCount, i, desired, ranks[i])
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
        if (activeSeason === 'spring' && (p.growProgress < 0.25 || p.wilting > 0.4)) {
          continue;
        }
        const targetX = p.x;
        const targetY =
          activeSeason === 'spring'
            ? p.y - p.size * 0.58 * steppedBotanicalGrowth(Math.min(1, p.growProgress)).scaleY
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
          ? hit.y - hit.size * 0.62 * steppedBotanicalGrowth(Math.min(1, hit.growProgress)).scaleY
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
            // Gradual one-by-one appearance + 6-stage organic growth pulse ("чик-чик-чик")
            if (p.growDelay > 0) {
              p.growDelay = Math.max(0, p.growDelay - dt);
              continue;
            }
            if (p.growProgress < 1) {
              p.growProgress = Math.min(1, p.growProgress + dt / p.growDuration);
            } else {
              p.bloomLife -= dt;
              if (p.bloomLife <= 0) {
                p.wilting += dt / 1.4;
                if (p.wilting >= 1) {
                  particles[i] = spawnParticle(
                    width,
                    height,
                    itemSize,
                    activeSeason,
                    false,
                    urlCount,
                    i,
                    particles.length
                  );
                  continue;
                }
              }
            }

            const { scaleY, scaleX } = steppedBotanicalGrowth(p.growProgress);
            const wiltScale = p.wilting > 0 ? 1 - p.wilting * 0.25 : 1;
            const wiltAlpha = p.wilting > 0 ? 1 - p.wilting : 1;

            const breezeSway =
              p.angle +
              Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp * Math.min(1, p.growProgress * 1.4) +
              Math.sin(elapsed * p.swayFreq * 0.43 + p.auxA) * (p.swayAmp * 0.45);

            ctx.save();
            ctx.globalAlpha = p.opacity * Math.min(1, p.growProgress * 6) * wiltAlpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(breezeSway);
            ctx.scale(scaleX * wiltScale, scaleY * wiltScale);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH, drawW, drawH);
            ctx.restore();
          } else if (activeSeason === 'summer') {
            // Asynchronous per-butterfly curved flight + independent flap bursts & soaring glides
            const turnWobble =
              Math.sin(elapsed * p.swayFreq + p.phase) * 1.45 +
              Math.cos(elapsed * (p.swayFreq * 0.47) + p.phase * 1.7) * 0.8;

            const margin = 80;
            let steerOffset = 0;
            if (p.x < margin) steerOffset += Math.sin(0 - p.angle) * 2.2;
            else if (p.x > width - margin) steerOffset += Math.sin(Math.PI - p.angle) * 2.2;
            if (p.y < margin) steerOffset += Math.sin(Math.PI / 2 - p.angle) * 2.2;
            else if (p.y > height - margin) steerOffset += Math.sin(-Math.PI / 2 - p.angle) * 2.2;

            p.angle += (turnWobble + steerOffset) * dt;

            // Independent timer toggles each butterfly between wingbeats & brief soaring glides
            p.modeTimer -= dt;
            if (p.modeTimer <= 0) {
              p.isGliding = !p.isGliding;
              if (p.isGliding) {
                p.modeTimer = 0.28 + Math.random() * 0.95;
                p.glideAngle = 0.72 + Math.random() * 0.24;
              } else {
                p.modeTimer = 0.55 + Math.random() * 2.1;
                p.auxA = 0.8 + Math.random() * 0.42; // vary tempo slightly on every new flap burst
              }
            }

            let wingFold: number;
            if (p.isGliding) {
              wingFold = p.glideAngle + 0.04 * Math.sin(elapsed * 3.5 + p.phase);
            } else {
              p.wingPhase += dt * p.flapSpeed * p.auxA;
              // Crisp natural wingstroke shape (lingering slightly open, quick crisp closure)
              const stroke = Math.pow(0.5 + 0.5 * Math.sin(p.wingPhase), 0.72);
              wingFold = 0.18 + 0.82 * stroke;
            }

            const flapBoost = p.isGliding ? 0.92 : 0.84 + 0.34 * (1 - wingFold);
            const speed = p.swayAmp * flapBoost;
            p.x += Math.cos(p.angle) * speed * dt;
            p.y += Math.sin(p.angle) * speed * dt;

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
            ctx.rotate(p.angle + Math.PI / 2);
            ctx.scale(wingFold, 1.0 - (1.0 - wingFold) * 0.08);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
          } else if (activeSeason === 'autumn') {
            // Independent Andersen-Pesavento-Wang falling leaf dynamics
            const tPhase = elapsed * p.swayFreq + p.phase;
            const glideSwing =
              Math.cos(tPhase) + 0.34 * Math.cos(tPhase * p.auxC + p.auxB);

            const eddyX =
              Math.sin(p.y * 0.007 + p.phase) * 14 +
              Math.cos(p.x * 0.006 + elapsed * 0.6) * 10;

            p.x += (p.vx + eddyX + glideSwing * p.swayAmp) * dt;

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
              const tumbleBurst = Math.sin(elapsed * 0.85 + p.auxB) > 0.35;
              p.angle += (tumbleBurst ? p.spinSpeed * 2.4 : p.spinSpeed * 0.35) * dt;
              renderAngle = p.angle + glideSwing * 0.55;
            } else {
              p.angle += p.spinSpeed * 0.22 * dt;
              renderAngle = p.angle + glideSwing * 0.68;
            }

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
            // WINTER: Macro crystal snowflakes with physically aligned 3D sun-glint reflections
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

            // Real 3D flutter tilt (pitch around X, roll around Y)
            const pitch = p.tiltAmpX * Math.sin(elapsed * p.tiltFreqX + p.auxB);
            const roll = p.tiltAmpY * Math.cos(elapsed * p.tiltFreqY + p.auxC);
            const cosP = Math.cos(pitch);
            const sinP = Math.sin(pitch);
            const cosR = Math.cos(roll);
            const sinR = Math.sin(roll);
            const cosA = Math.cos(p.angle);
            const sinA = Math.sin(p.angle);

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.scale(cosR, cosP);
            ctx.rotate(p.angle);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();

            // Specular crystal glints: fire ONLY when rotated & tilted facet normal aligns with Blinn-Phong half-vector H
            if (p.facets) {
              const baseRadius = Math.min(drawW, drawH);
              for (let g = 0; g < p.facets.length; g++) {
                const fc = p.facets[g];
                // 1) Spin facet normal in snowflake plane (Z rotation by p.angle)
                const n1x = fc.nx * cosA - fc.ny * sinA;
                const n1y = fc.nx * sinA + fc.ny * cosA;
                const n1z = fc.nz;
                // 2) Tilt around Y (roll)
                const n2x = n1x * cosR + n1z * sinR;
                const n2y = n1y;
                const n2z = -n1x * sinR + n1z * cosR;
                // 3) Tilt around X (pitch)
                const n3x = n2x;
                const n3y = n2y * cosP - n2z * sinP;
                const n3z = n2y * sinP + n2z * cosP;

                const specDot = n3x * HALF_VEC.x + n3y * HALF_VEC.y + n3z * HALF_VEC.z;
                // Narrow ~17 deg specular reflection cone: off when turned away, crisp glint only at sun angle
                const threshold = 0.955;
                if (specDot > threshold) {
                  const normIntensity = (specDot - threshold) / (1 - threshold);
                  const flash = Math.pow(normIntensity, 1.7);
                  if (flash > 0.08) {
                    const localA = p.angle + fc.angleOffset;
                    const dist = baseRadius * fc.distFrac;
                    const gx = p.x + Math.cos(localA) * dist * cosR;
                    const gy = p.y + Math.sin(localA) * dist * cosP;
                    drawMicroPinpoint(ctx, gx, gy, fc.size * (0.7 + 0.5 * flash), flash * 0.95);
                  }
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
            hasCookieBanner
              ? 'bottom-24 md:bottom-20'
              : hasMobileCallDock
                ? 'bottom-20 md:bottom-4'
                : 'bottom-4'
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
