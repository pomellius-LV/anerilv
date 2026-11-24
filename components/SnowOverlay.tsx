import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../types';
import {
  SnowConfig,
  DEFAULT_SNOW_CONFIG,
  SeasonType,
  resolveActiveSeason
} from '../services/dataService';
import { Snowflake, Flower2, Bird, Leaf, Pause, Play } from 'lucide-react';

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
  dir: 1 | -1;
  flapFreq: number;
  glideAmp: number;
  shimmerFreq: number;
  shimmerPhase: number;
  glintOffsetAngle: number;
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
    '/assets/seasonal/tulip_1.png',
    '/assets/seasonal/tulip_2.png',
    '/assets/seasonal/tulip_3.png',
    '/assets/seasonal/tulip_4.png',
    '/assets/seasonal/tulip_5.png',
    '/assets/seasonal/tulip_6.png'
  ],
  summer: [
    '/assets/seasonal/bird_1.png',
    '/assets/seasonal/bird_2.png',
    '/assets/seasonal/bird_3.png',
    '/assets/seasonal/bird_4.png',
    '/assets/seasonal/bird_5.png',
    '/assets/seasonal/bird_6.png'
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
      spring: 'Tulpes',
      summer: 'Putniņi',
      autumn: 'Rudens lapas'
    },
    pause: 'Pauze',
    resume: 'Turpināt',
    pausedStatus: 'Pauzēts'
  },
  ru: {
    seasons: {
      winter: 'Снежинки',
      spring: 'Тюльпаны',
      summer: 'Птички',
      autumn: 'Листики'
    },
    pause: 'Пауза',
    resume: 'Включить',
    pausedStatus: 'Пауза'
  },
  en: {
    seasons: {
      winter: 'Snowflakes',
      spring: 'Tulips',
      summer: 'Birds',
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

// Applies optional custom color tint from /admin while keeping crystal shimmer & transparency intact
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
  const seasonScale = season === 'summer' ? 0.36 : season === 'spring' ? 0.65 : 0.85;
  const scaled = Math.max(5, Math.round(clamped * seasonScale));
  if (width < 640) return Math.max(4, Math.round(scaled * 0.55));
  if (width < 1024) return Math.max(6, Math.round(scaled * 0.75));
  return scaled;
}

function spawnParticle(
  width: number,
  height: number,
  baseSize: number,
  season: SeasonType,
  randomPos: boolean,
  spriteCount: number
): Particle {
  const minSize = Math.max(16, baseSize * 0.76);
  const maxSize = Math.max(minSize + 6, baseSize * 1.32);
  const size = minSize + Math.random() * (maxSize - minSize);

  if (season === 'summer') {
    const dir: 1 | -1 = Math.random() < 0.72 ? 1 : -1;
    const birdSize = size * 1.55;
    const speedX = (58 + Math.random() * 68 + birdSize * 0.45) * dir;
    return {
      x: randomPos
        ? Math.random() * width
        : dir === 1
          ? -birdSize - Math.random() * 110
          : width + birdSize + Math.random() * 110,
      y: height * (0.08 + Math.random() * 0.72),
      vx: speedX,
      vy: (Math.random() - 0.5) * 14,
      size: birdSize,
      swayAmp: 0,
      swayFreq: 1.25 + Math.random() * 1.25,
      phase: Math.random() * Math.PI * 2,
      angle: 0,
      spinSpeed: 0,
      opacity: 0.84 + Math.random() * 0.14,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      dir,
      flapFreq: 4.5 + Math.random() * 2.5,
      glideAmp: 12 + Math.random() * 18,
      shimmerFreq: 0,
      shimmerPhase: 0,
      glintOffsetAngle: 0
    };
  }

  if (season === 'autumn') {
    const leafSize = size * (1.1 + Math.random() * 0.25);
    return {
      x: Math.random() * width,
      y: randomPos ? Math.random() * height : -leafSize - Math.random() * 80,
      vx: -4 + Math.random() * 16,
      vy: 25 + Math.random() * 22 + leafSize * 0.12,
      size: leafSize,
      swayAmp: 34 + Math.random() * 38,
      swayFreq: 1.0 + Math.random() * 0.85,
      phase: Math.random() * Math.PI * 2,
      angle: (Math.random() - 0.5) * 0.8,
      spinSpeed: (Math.random() - 0.5) * 0.22,
      opacity: 0.84 + Math.random() * 0.14,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      dir: 1,
      flapFreq: 1.3 + Math.random() * 1.05,
      glideAmp: Math.random() * Math.PI * 2,
      shimmerFreq: 0,
      shimmerPhase: 0,
      glintOffsetAngle: 0
    };
  }

  if (season === 'spring') {
    const tulipSize = size * 1.65;
    return {
      x: Math.random() * width,
      y: randomPos ? Math.random() * height : -tulipSize - Math.random() * 70,
      vx: (Math.random() - 0.5) * 10,
      vy: 23 + Math.random() * 24 + size * 0.16,
      size: tulipSize,
      swayAmp: 13 + Math.random() * 18,
      swayFreq: 0.7 + Math.random() * 0.75,
      phase: Math.random() * Math.PI * 2,
      angle: (Math.random() - 0.5) * 0.45,
      spinSpeed: 0,
      opacity: 0.84 + Math.random() * 0.14,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      dir: 1,
      flapFreq: 0,
      glideAmp: 0,
      shimmerFreq: 0,
      shimmerPhase: 0,
      glintOffsetAngle: 0
    };
  }

  // Winter macro snowflake with crystal shimmer parameters
  const flakeSize = size * 1.22;
  return {
    x: Math.random() * width,
    y: randomPos ? Math.random() * height : -flakeSize - Math.random() * 70,
    vx: (Math.random() - 0.5) * 11,
    vy: 24 + Math.random() * 30 + size * 0.18,
    size: flakeSize,
    swayAmp: 12 + Math.random() * 18,
    swayFreq: 0.6 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2,
    angle: Math.random() * Math.PI * 2,
    spinSpeed: (Math.random() - 0.5) * 0.65,
    opacity: 0.68 + Math.random() * 0.28,
    spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
    dir: 1,
    flapFreq: 0.9 + Math.random() * 0.9, // gentle 3D crystal facet wobble
    glideAmp: 0,
    shimmerFreq: 1.8 + Math.random() * 2.2,
    shimmerPhase: Math.random() * Math.PI * 2,
    glintOffsetAngle: (Math.floor(Math.random() * 6) * Math.PI) / 3
  };
}

function getSparklePalette(season: SeasonType, snowColor: string): string[] {
  switch (season) {
    case 'spring':
      return ['#E11D48', '#F472B6', '#FBBF24', '#A855F7', '#22C55E', '#FFF1F2'];
    case 'summer':
      return ['#38BDF8', '#FBBF24', '#FFFFFF', '#BAE6FD', '#0EA5E9'];
    case 'autumn':
      return ['#EA580C', '#DC2626', '#F59E0B', '#FDE047', '#9A3412'];
    default:
      return [snowColor, '#FFFFFF', '#BAE6FD', '#E0F2FE', '#FDE68A'];
  }
}

// Delicate 4-point diamond light glint on turning ice crystals
function drawDiamondGlint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number
) {
  if (alpha <= 0.04) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.quadraticCurveTo(radius * 0.14, -radius * 0.14, radius, 0);
  ctx.quadraticCurveTo(radius * 0.14, radius * 0.14, 0, radius);
  ctx.quadraticCurveTo(-radius * 0.14, radius * 0.14, -radius, 0);
  ctx.quadraticCurveTo(-radius * 0.14, -radius * 0.14, 0, -radius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const SeasonIcon: React.FC<{ season: SeasonType }> = ({ season }) => {
  switch (season) {
    case 'spring':
      return <Flower2 size={15} className="text-rose-500 shrink-0" />;
    case 'summer':
      return <Bird size={15} className="text-sky-600 shrink-0" />;
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
    const particles: Particle[] = Array.from({ length: targetCount }, () =>
      spawnParticle(width, height, itemSize, activeSeason, true, urlCount)
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
        const hitRadius = Math.max(p.size * 0.72, 26);
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const distSq = dx * dx + dy * dy;
        if (distSq <= hitRadius * hitRadius && distSq < bestDistSq) {
          bestDistSq = distSq;
          bestIdx = i;
        }
      }

      if (bestIdx === -1) return;

      const hit = particles[bestIdx];

      if (sparkles.length < 180) {
        const burstCount = 12;
        for (let s = 0; s < burstCount; s++) {
          const angle = (Math.PI * 2 * s) / burstCount + (Math.random() - 0.5) * 0.4;
          const speed = 60 + Math.random() * 95;
          sparkles.push({
            x: hit.x,
            y: hit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 12,
            size: 1.9 + Math.random() * 2.4,
            life: 0,
            maxLife: 0.25 + Math.random() * 0.14,
            color: sparkleColors[s % sparkleColors.length]
          });
        }
        popRings.push({
          x: hit.x,
          y: hit.y,
          maxRadius: hit.size * 0.9,
          life: 0,
          maxLife: 0.28,
          color: sparkleColors[0]
        });
      }

      particles[bestIdx] = spawnParticle(
        width,
        height,
        itemSize,
        activeSeason,
        false,
        urlCount
      );

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
        const autumnWind =
          activeSeason === 'autumn'
            ? 16 + Math.sin(elapsed * 0.34) * 18 + Math.sin(elapsed * 0.82 + 1.3) * 9
            : 0;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const sprite = sprites[p.spriteIndex % sprites.length];
          const maxDim = Math.max(sprite.width, sprite.height) || 1;
          const drawW = (sprite.width / maxDim) * p.size;
          const drawH = (sprite.height / maxDim) * p.size;

          if (activeSeason === 'summer') {
            p.x += p.vx * dt;
            const vertBob = Math.sin(elapsed * p.swayFreq + p.phase) * p.glideAmp;
            p.y += (p.vy + vertBob) * dt;

            const outRight = p.dir === 1 && p.x > width + p.size * 1.4;
            const outLeft = p.dir === -1 && p.x < -p.size * 1.4;
            if (outRight || outLeft || p.y < -p.size || p.y > height + p.size) {
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

            const glidePitch = Math.atan2(p.vy + vertBob, Math.abs(p.vx)) * 0.45;
            const wingBreath = 1 + 0.06 * Math.sin(elapsed * p.flapFreq + p.phase);

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.scale(p.dir, 1);
            ctx.rotate(glidePitch);
            ctx.scale(1, wingBreath);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
          } else if (activeSeason === 'autumn') {
            const glideSwing = Math.cos(elapsed * p.swayFreq + p.phase);
            const windResponse = 0.65 + (p.size / 48) * 0.35;
            p.x += (p.vx + autumnWind * windResponse + glideSwing * p.swayAmp) * dt;

            const airCushionLift = 1 - 0.44 * Math.abs(glideSwing);
            p.y += p.vy * airCushionLift * dt;

            const bankAngle =
              glideSwing * 0.54 + Math.sin(elapsed * 0.55 + p.glideAmp) * 0.32;
            const perspectiveRoll = 0.64 + 0.36 * Math.cos(elapsed * p.flapFreq + p.glideAmp);
            const perspectivePitch = 0.85 + 0.15 * Math.sin(elapsed * p.flapFreq * 0.7 + p.phase);

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
            ctx.rotate(bankAngle);
            ctx.scale(perspectivePitch, perspectiveRoll);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
          } else if (activeSeason === 'spring') {
            const swayOffset = Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp * dt;
            p.x += p.vx * dt + swayOffset;
            p.y += p.vy * dt;
            const rockAngle = Math.sin(elapsed * 1.2 + p.phase) * 0.28 + p.angle * 0.25;

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
            ctx.rotate(rockAngle);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
          } else {
            // Winter iridescent macro snowflakes
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

            // Soft shimmering light wave as crystal turns
            const shimmerWave = 0.5 + 0.5 * Math.sin(elapsed * p.shimmerFreq + p.shimmerPhase);
            const liveAlpha = Math.min(1, p.opacity * (0.78 + 0.26 * shimmerWave));
            const facetTilt = 0.88 + 0.12 * Math.cos(elapsed * p.flapFreq + p.phase);

            ctx.save();
            ctx.globalAlpha = liveAlpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.scale(facetTilt, 1);
            ctx.drawImage(sprite.source, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();

            // Specular sparkle glint on crystal branch tip when catching light
            const glintPulse = Math.pow(shimmerWave, 5);
            if (glintPulse > 0.35) {
              const tipAngle = p.angle + p.glintOffsetAngle;
              const tipDist = Math.min(drawW, drawH) * 0.36;
              drawDiamondGlint(
                ctx,
                p.x + Math.cos(tipAngle) * tipDist,
                p.y + Math.sin(tipAngle) * tipDist,
                Math.max(4, p.size * 0.14),
                glintPulse * 0.85
              );
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
