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
  // Bird-specific kinematics
  dir: 1 | -1;
  flapFreq: number;
  glideAmp: number;
  color: string;
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

const TULIP_PALETTES = [
  { main: '#E11D48', light: '#FB7185', dark: '#9F1239' }, // Crimson Rose
  { main: '#F472B6', light: '#FBCFE8', dark: '#DB2777' }, // Soft Tulip Pink
  { main: '#F59E0B', light: '#FDE68A', dark: '#B45309' }, // Sunny Yellow
  { main: '#A855F7', light: '#E9D5FF', dark: '#7E22CE' }, // Spring Lilac
  { main: '#FB7185', light: '#FFE4E6', dark: '#E11D48' }  // Coral Blush
];

const AUTUMN_LEAF_PALETTES = [
  // 0: Fiery Red-Orange Sugar Maple
  { base: '#F59E0B', mid: '#EA580C', tip: '#B91C1C', vein: '#7C2D12', spot: '#9A3412', type: 'maple', asym: 1 },
  // 1: Deep Crimson Red Maple
  { base: '#FB7185', mid: '#DC2626', tip: '#881337', vein: '#4C0519', spot: '#9F1239', type: 'maple', asym: -1 },
  // 2: Golden Amber Maple
  { base: '#FDE047', mid: '#F59E0B', tip: '#C2410C', vein: '#78350F', spot: '#B45309', type: 'maple', asym: 0.6 },
  // 3: Classic Canadian Scarlet-Gold Maple
  { base: '#FBBF24', mid: '#E11D48', tip: '#9F1239', vein: '#7F1D1D', spot: '#881337', type: 'maple', asym: -0.7 },
  // 4: Sunlit Ochre & Cinnamon Maple
  { base: '#FEF08A', mid: '#D97706', tip: '#9A3412', vein: '#713F12', spot: '#92400E', type: 'maple', asym: 0.4 },
  // 5: Warm Autumn Oak (Copper-Amber)
  { base: '#F59E0B', mid: '#B45309', tip: '#78350F', vein: '#451A03', spot: '#92400E', type: 'oak', asym: 1 },
  // 6: Bright Carrot-Crimson Maple
  { base: '#FDBA74', mid: '#EA580C', tip: '#991B1B', vein: '#7C2D12', spot: '#7F1D1D', type: 'maple', asym: -0.5 },
  // 7: Russet Oak (Red-Bronze)
  { base: '#FB923C', mid: '#C2410C', tip: '#7C2D12', vein: '#431407', spot: '#9A3412', type: 'oak', asym: -1 }
] as const;

const BIRD_COLORS = ['#1E293B', '#0369A1', '#334155', '#475569', '#312E81'];

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

// 1. WINTER SPRITES: 3 cached crystal variants in chosen hex color
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

        octx.lineWidth = (variant === 0 ? 2.1 : 1.85) + extraWidth;
        octx.beginPath();
        octx.moveTo(0, 0);
        octx.lineTo(0, -radius);
        octx.stroke();

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
          octx.beginPath();
          octx.arc(0, -radius, 2.0 + extraWidth * 0.45, 0, Math.PI * 2);
          octx.fill();
        }

        octx.restore();
      }

      if (variant === 1) {
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

    drawCrystalPass(rimStroke, 1.45);
    drawCrystalPass(mainStroke, 0);

    return offscreen;
  });
}

// 2. SPRING SPRITES: 5 colorful botanical tulip blossoms with green stem & leaves
function createTulipSprites(dpr: number): HTMLCanvasElement[] {
  const logicalSize = 76;
  const pixelSize = Math.round(logicalSize * dpr);
  const cx = logicalSize / 2;
  const cy = logicalSize / 2;

  return TULIP_PALETTES.map(palette => {
    const offscreen = document.createElement('canvas');
    offscreen.width = pixelSize;
    offscreen.height = pixelSize;
    const octx = offscreen.getContext('2d');
    if (!octx) return offscreen;

    octx.scale(dpr, dpr);
    octx.translate(cx, cy);
    octx.lineCap = 'round';
    octx.lineJoin = 'round';

    // Fresh green stem
    octx.strokeStyle = 'rgba(255,255,255,0.45)';
    octx.lineWidth = 4.6;
    octx.beginPath();
    octx.moveTo(0, 6);
    octx.quadraticCurveTo(2, 18, -1, 29);
    octx.stroke();

    octx.strokeStyle = '#16A34A';
    octx.lineWidth = 2.8;
    octx.beginPath();
    octx.moveTo(0, 6);
    octx.quadraticCurveTo(2, 18, -1, 29);
    octx.stroke();

    // Twin graceful tulip leaves
    octx.fillStyle = '#22C55E';
    octx.strokeStyle = '#15803D';
    octx.lineWidth = 1.1;

    // Left leaf
    octx.beginPath();
    octx.moveTo(0, 26);
    octx.quadraticCurveTo(-15, 19, -13, 5);
    octx.quadraticCurveTo(-5, 12, 0, 22);
    octx.closePath();
    octx.fill();
    octx.stroke();

    // Right leaf
    octx.beginPath();
    octx.moveTo(0, 24);
    octx.quadraticCurveTo(15, 17, 13, 4);
    octx.quadraticCurveTo(5, 12, 0, 20);
    octx.closePath();
    octx.fill();
    octx.stroke();

    // Subtle soft glow behind tulip head
    octx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    octx.beginPath();
    octx.ellipse(0, -6, 15, 17, 0, 0, Math.PI * 2);
    octx.fill();

    // Center back petal
    octx.fillStyle = palette.dark;
    octx.beginPath();
    octx.moveTo(0, -25);
    octx.bezierCurveTo(9, -20, 10, -2, 0, 7);
    octx.bezierCurveTo(-10, -2, -9, -20, 0, -25);
    octx.fill();

    // Left overlapping petal
    octx.fillStyle = palette.main;
    octx.beginPath();
    octx.moveTo(-1, 8);
    octx.bezierCurveTo(-16, 4, -17, -14, -9, -23);
    octx.bezierCurveTo(-2, -16, 1, -4, 0, 8);
    octx.closePath();
    octx.fill();

    // Right overlapping petal
    octx.fillStyle = palette.main;
    octx.beginPath();
    octx.moveTo(1, 8);
    octx.bezierCurveTo(16, 4, 17, -14, 9, -23);
    octx.bezierCurveTo(2, -16, -1, -4, 0, 8);
    octx.closePath();
    octx.fill();

    // Front glowing center petal highlight
    octx.fillStyle = palette.light;
    octx.beginPath();
    octx.moveTo(0, -22);
    octx.bezierCurveTo(6.5, -14, 7, 1, 0, 8);
    octx.bezierCurveTo(-7, 1, -6.5, -14, 0, -22);
    octx.fill();

    // Crisp rim outline on flower cup
    octx.strokeStyle = 'rgba(255,255,255,0.45)';
    octx.lineWidth = 1;
    octx.beginPath();
    octx.moveTo(-1, 8);
    octx.bezierCurveTo(-16, 4, -17, -14, -9, -23);
    octx.quadraticCurveTo(-4, -18, 0, -25);
    octx.quadraticCurveTo(4, -18, 9, -23);
    octx.bezierCurveTo(17, -14, 16, 4, 1, 8);
    octx.stroke();

    return offscreen;
  });
}

// 3. AUTUMN SPRITES: 6 realistic curved botanical Maple leaves (75%) + 2 scalloped Oak leaves (25%)
function createAutumnLeafSprites(dpr: number): HTMLCanvasElement[] {
  const logicalSize = 96;
  const pixelSize = Math.round(logicalSize * dpr);
  const cx = logicalSize / 2;
  const cy = logicalSize / 2;

  return AUTUMN_LEAF_PALETTES.map(palette => {
    const offscreen = document.createElement('canvas');
    offscreen.width = pixelSize;
    offscreen.height = pixelSize;
    const octx = offscreen.getContext('2d');
    if (!octx) return offscreen;

    octx.scale(dpr, dpr);
    octx.translate(cx, cy);
    octx.lineCap = 'round';
    octx.lineJoin = 'round';

    const a = palette.asym;

    // Slender curved petiole (stem)
    octx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    octx.lineWidth = 3.1;
    octx.beginPath();
    octx.moveTo(0, 14);
    octx.quadraticCurveTo(2.4 * a, 25, -1.8 * a, 37);
    octx.stroke();

    octx.strokeStyle = palette.vein;
    octx.lineWidth = 1.9;
    octx.beginPath();
    octx.moveTo(0, 14);
    octx.quadraticCurveTo(2.4 * a, 25, -1.8 * a, 37);
    octx.stroke();

    // Rich multi-stop autumn foliage gradient (sunlit base -> fiery mid -> deep tip)
    const grad = octx.createLinearGradient(-12 * a, 22, 8 * a, -38);
    grad.addColorStop(0, palette.base);
    grad.addColorStop(0.48, palette.mid);
    grad.addColorStop(1, palette.tip);

    octx.fillStyle = grad;

    if (palette.type === 'maple') {
      // Sculpted botanical 5-lobed Acer maple silhouette with curved U-sinuses & secondary teeth
      octx.beginPath();
      octx.moveTo(0, 15);
      // Bottom-right basal lobe
      octx.quadraticCurveTo(8, 22, 22 + a, 19);
      octx.quadraticCurveTo(17, 13, 21, 11);
      octx.quadraticCurveTo(13, 9, 12, 8);
      // Middle-right major lobe with lower & upper sharp teeth
      octx.quadraticCurveTo(20, 10, 30, 8);
      octx.quadraticCurveTo(26, 2, 39, -3);
      octx.quadraticCurveTo(29, -6, 27, -11);
      octx.quadraticCurveTo(18, -9, 13, -10);
      // Center-top crown lobe with shoulder serrations
      octx.quadraticCurveTo(17, -17, 17 + a, -23);
      octx.quadraticCurveTo(10, -21, 10, -27);
      octx.quadraticCurveTo(4, -30, 0, -40);
      octx.quadraticCurveTo(-4, -30, -10, -27);
      octx.quadraticCurveTo(-10, -21, -17 + a, -23);
      octx.quadraticCurveTo(-17, -17, -13, -10);
      // Middle-left major lobe
      octx.quadraticCurveTo(-18, -9, -27, -11);
      octx.quadraticCurveTo(-29, -6, -39, -3);
      octx.quadraticCurveTo(-26, 2, -30, 8);
      octx.quadraticCurveTo(-20, 10, -12, 8);
      // Bottom-left basal lobe
      octx.quadraticCurveTo(-13, 9, -21, 11);
      octx.quadraticCurveTo(-17, 13, -22 + a, 19);
      octx.quadraticCurveTo(-8, 22, 0, 15);
      octx.closePath();

      octx.fill();
      octx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
      octx.lineWidth = 1.25;
      octx.stroke();

      // Subtle organic autumn freckles inside leaf blade
      octx.fillStyle = palette.spot;
      octx.globalAlpha = 0.28;
      [
        [6 * a, -14, 1.4],
        [-8 * a, -4, 1.8],
        [14, 2, 1.2],
        [-11, -18, 1.1]
      ].forEach(([fx, fy, fr]) => {
        octx.beginPath();
        octx.arc(fx, fy, fr, 0, Math.PI * 2);
        octx.fill();
      });
      octx.globalAlpha = 1;

      // Delicate palmate maple venation (5 primary radiating ribs + fine secondary veinlets)
      octx.strokeStyle = palette.vein;
      octx.globalAlpha = 0.72;
      octx.lineWidth = 1.35;
      octx.beginPath();
      // Center rib
      octx.moveTo(0, 15);
      octx.quadraticCurveTo(0.8 * a, -10, 0, -35);
      // Left & right main lobe ribs
      octx.moveTo(0, 14);
      octx.quadraticCurveTo(14, 4, 34, -2);
      octx.moveTo(0, 14);
      octx.quadraticCurveTo(-14, 4, -34, -2);
      // Basal lobe ribs
      octx.moveTo(0, 14);
      octx.quadraticCurveTo(10, 17, 19, 17);
      octx.moveTo(0, 14);
      octx.quadraticCurveTo(-10, 17, -19, 17);
      octx.stroke();

      // Fine secondary veins branching out
      octx.lineWidth = 0.75;
      octx.globalAlpha = 0.55;
      octx.beginPath();
      octx.moveTo(0, -14);
      octx.lineTo(13, -21);
      octx.moveTo(0, -14);
      octx.lineTo(-13, -21);
      octx.moveTo(0, -24);
      octx.lineTo(7, -28);
      octx.moveTo(0, -24);
      octx.lineTo(-7, -28);
      octx.moveTo(16, 4);
      octx.lineTo(25, 7);
      octx.moveTo(21, 1);
      octx.lineTo(26, -7);
      octx.moveTo(-16, 4);
      octx.lineTo(-25, 7);
      octx.moveTo(-21, 1);
      octx.lineTo(-26, -7);
      octx.stroke();
      octx.globalAlpha = 1;
    } else {
      // Sculpted deep-lobed Autumn Oak leaf (25% variety alongside maple)
      octx.beginPath();
      octx.moveTo(0, 16);
      octx.bezierCurveTo(6, 17, 10, 13, 8, 9);
      octx.bezierCurveTo(18, 11, 22, 3, 12, -1);
      octx.bezierCurveTo(24, 1, 27, -10, 13, -13);
      octx.bezierCurveTo(22, -14, 21, -24, 9, -24);
      octx.bezierCurveTo(11, -31, 5, -36, 0, -37);
      octx.bezierCurveTo(-5, -36, -11, -31, -9, -24);
      octx.bezierCurveTo(-21, -24, -22, -14, -13, -13);
      octx.bezierCurveTo(-27, -10, -24, 1, -12, -1);
      octx.bezierCurveTo(-22, 3, -18, 11, -8, 9);
      octx.bezierCurveTo(-10, 13, -6, 17, 0, 16);
      octx.closePath();

      octx.fill();
      octx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      octx.lineWidth = 1.2;
      octx.stroke();

      // Oak midrib & alternating lobe veins
      octx.strokeStyle = palette.vein;
      octx.globalAlpha = 0.7;
      octx.lineWidth = 1.3;
      octx.beginPath();
      octx.moveTo(0, 15);
      octx.quadraticCurveTo(0.8 * a, -10, 0, -33);
      octx.stroke();

      octx.lineWidth = 0.85;
      octx.globalAlpha = 0.58;
      octx.beginPath();
      octx.moveTo(0, 4);
      octx.lineTo(14, 4);
      octx.moveTo(0, 2);
      octx.lineTo(-14, 3);
      octx.moveTo(0, -8);
      octx.lineTo(18, -7);
      octx.moveTo(0, -10);
      octx.lineTo(-18, -9);
      octx.moveTo(0, -20);
      octx.lineTo(13, -20);
      octx.moveTo(0, -22);
      octx.lineTo(-13, -21);
      octx.stroke();
      octx.globalAlpha = 1;
    }

    return offscreen;
  });
}

// Direct fast bezier renderer for gliding summer birds with continuous smooth wing flaps
function drawFlyingBird(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  elapsed: number
) {
  const s = p.size / 34; // normalized around default 34px scale
  const flap = Math.sin(elapsed * p.flapFreq + p.phase);
  const wingLift = flap * 12 * s;
  const wingBend = Math.cos(elapsed * p.flapFreq + p.phase) * 4 * s;
  const tilt = Math.atan2(p.vy + Math.cos(elapsed * p.swayFreq + p.phase) * p.glideAmp, Math.abs(p.vx)) * 0.45;

  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(p.x, p.y);
  ctx.scale(p.dir, 1);
  ctx.rotate(tilt);

  // Subtle sunlit halo for crisp legibility over dark Hero AND light sections
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2.6 * s;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const drawBirdSilhouette = (fill: string, strokeOnly: boolean) => {
    // Far wing (behind body)
    ctx.beginPath();
    ctx.moveTo(-2 * s, -2 * s);
    ctx.quadraticCurveTo(-10 * s, (-11 + wingLift * 0.85) * s, -20 * s, (-5 + wingLift * 1.15) * s);
    ctx.quadraticCurveTo(-9 * s, (-2 + wingLift * 0.45) * s, 2 * s, 0);
    ctx.closePath();
    if (strokeOnly) ctx.stroke();
    else {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    // Streamlined swallow body + forked tail + beak
    ctx.beginPath();
    // Tail fork top
    ctx.moveTo(-24 * s, -5 * s);
    ctx.lineTo(-13 * s, 0);
    // Tail fork bottom
    ctx.lineTo(-22 * s, 5.5 * s);
    ctx.quadraticCurveTo(-10 * s, 3.5 * s, 3 * s, 3 * s);
    // Breast & head
    ctx.quadraticCurveTo(12 * s, 3 * s, 15 * s, -1.5 * s);
    // Delicate beak tip
    ctx.lineTo(20 * s, -2.5 * s);
    ctx.lineTo(14.5 * s, -4.5 * s);
    // Back of neck
    ctx.quadraticCurveTo(9 * s, -6 * s, -4 * s, -2 * s);
    ctx.closePath();
    if (strokeOnly) ctx.stroke();
    else {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    // Near primary wing (dynamic soaring arc)
    ctx.beginPath();
    ctx.moveTo(4 * s, -1 * s);
    ctx.quadraticCurveTo(-4 * s, (-15 + wingLift * 1.1) * s, -16 * s + wingBend, (-13 + wingLift * 1.45) * s);
    ctx.quadraticCurveTo(-5 * s, (-3 + wingLift * 0.4) * s, -3 * s, 2 * s);
    ctx.closePath();
    if (strokeOnly) ctx.stroke();
    else {
      ctx.fillStyle = fill;
      ctx.fill();
    }
  };

  drawBirdSilhouette(p.color, true);
  drawBirdSilhouette(p.color, false);

  ctx.restore();
}

function getEffectiveCount(
  width: number,
  desktopCount: number,
  season: SeasonType
): number {
  const clamped = Math.min(120, Math.max(8, Math.round(desktopCount)));
  // Summer birds have larger wingspans, so scale density gracefully to keep a natural sky flock
  const seasonScale = season === 'summer' ? 0.46 : season === 'spring' ? 0.8 : 1;
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
  const minSize = Math.max(12, baseSize * 0.72);
  const maxSize = Math.max(minSize + 4, baseSize * 1.28);
  const size = minSize + Math.random() * (maxSize - minSize);

  if (season === 'summer') {
    const dir: 1 | -1 = Math.random() < 0.72 ? 1 : -1;
    const speedX = (55 + Math.random() * 65 + size * 0.65) * dir;
    return {
      x: randomPos
        ? Math.random() * width
        : dir === 1
          ? -size * 1.4 - Math.random() * 90
          : width + size * 1.4 + Math.random() * 90,
      y: height * (0.08 + Math.random() * 0.72),
      vx: speedX,
      vy: (Math.random() - 0.5) * 14,
      size: size * 1.05,
      swayAmp: 0,
      swayFreq: 1.4 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      angle: 0,
      spinSpeed: 0,
      opacity: 0.72 + Math.random() * 0.24,
      spriteIndex: Math.floor(Math.random() * spriteCount),
      dir,
      flapFreq: 7.5 + Math.random() * 4.5,
      glideAmp: 12 + Math.random() * 18,
      color: BIRD_COLORS[Math.floor(Math.random() * BIRD_COLORS.length)]
    };
  }

  if (season === 'autumn') {
    const leafSize = size * (0.95 + Math.random() * 0.25);
    return {
      x: Math.random() * width,
      y: randomPos ? Math.random() * height : -leafSize - Math.random() * 75,
      vx: -4 + Math.random() * 16,
      vy: 26 + Math.random() * 24 + leafSize * 0.14,
      size: leafSize,
      // Aerodynamic gliding swing (wide horizontal swoops + pendulum tilt)
      swayAmp: 34 + Math.random() * 38,
      swayFreq: 1.05 + Math.random() * 0.85,
      phase: Math.random() * Math.PI * 2,
      angle: (Math.random() - 0.5) * 0.8,
      spinSpeed: (Math.random() - 0.5) * 0.24,
      opacity: 0.78 + Math.random() * 0.2,
      spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
      dir: 1,
      // Used here as 3D perspective tumble frequency
      flapFreq: 1.35 + Math.random() * 1.15,
      glideAmp: Math.random() * Math.PI * 2,
      color: '#FFFFFF'
    };
  }

  return {
    x: Math.random() * width,
    y: randomPos ? Math.random() * height : -size - Math.random() * 64,
    vx: (Math.random() - 0.5) * 11,
    vy:
      season === 'spring'
        ? 24 + Math.random() * 28 + size * 0.16
        : 26 + Math.random() * 34 + size * 0.2,
    size,
    swayAmp: 12 + Math.random() * 18,
    swayFreq: 0.65 + Math.random() * 0.85,
    phase: Math.random() * Math.PI * 2,
    angle:
      season === 'spring'
        ? (Math.random() - 0.5) * 0.65
        : Math.random() * Math.PI * 2,
    spinSpeed:
      season === 'spring'
        ? (Math.random() - 0.5) * 0.55
        : (Math.random() - 0.5) * 0.85,
    opacity: 0.64 + Math.random() * 0.32,
    spriteIndex: Math.floor(Math.random() * Math.max(1, spriteCount)),
    dir: 1,
    flapFreq: 0,
    glideAmp: 0,
    color: '#FFFFFF'
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
      return [snowColor, '#FFFFFF', '#E0F2FE', '#FFE4E6', '#FDA4AF'];
  }
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

    const itemSize = effectiveConfig.size;
    const snowColor = effectiveConfig.color;
    const itemCount = effectiveConfig.count;
    const sparkleColors = getSparklePalette(activeSeason, snowColor);

    const buildSpritesForSeason = (deviceRatio: number): HTMLCanvasElement[] => {
      if (activeSeason === 'spring') return createTulipSprites(deviceRatio);
      if (activeSeason === 'autumn') return createAutumnLeafSprites(deviceRatio);
      if (activeSeason === 'summer') return []; // drawn dynamically for smooth wing animation
      return createSnowflakeSprites(deviceRatio, snowColor);
    };

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let sprites = buildSpritesForSeason(dpr);

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprites = buildSpritesForSeason(dpr);
    };

    resizeCanvas();

    const spriteCount = Math.max(1, sprites.length || 5);
    const targetCount = getEffectiveCount(width, itemCount, activeSeason);
    const particles: Particle[] = Array.from({ length: targetCount }, () =>
      spawnParticle(width, height, itemSize, activeSeason, true, spriteCount)
    );
    const sparkles: Sparkle[] = [];
    const popRings: PopRing[] = [];

    let animFrameId: number | null = null;
    let lastTime = performance.now();
    let elapsed = 0;

    const handleResize = () => {
      resizeCanvas();
      const desired = getEffectiveCount(width, itemCount, activeSeason);
      while (particles.length < desired) {
        particles.push(
          spawnParticle(width, height, itemSize, activeSeason, true, spriteCount)
        );
      }
      if (particles.length > desired) {
        particles.length = desired;
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

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const hitRadius = Math.max(p.size * 0.85, 26);
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

      // Spawn seasonal sparkle burst
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
            size: 1.9 + Math.random() * 2.4,
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
          maxLife: 0.28,
          color: sparkleColors[0]
        });
      }

      // Respawn cleanly at edge/top
      particles[bestIdx] = spawnParticle(
        width,
        height,
        itemSize,
        activeSeason,
        false,
        spriteCount
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

      // Coherent ambient autumn breeze with soft natural gusts
      const autumnWind =
        activeSeason === 'autumn'
          ? 16 + Math.sin(elapsed * 0.34) * 18 + Math.sin(elapsed * 0.82 + 1.3) * 9
          : 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (activeSeason === 'summer') {
          p.x += p.vx * dt;
          p.y += (p.vy + Math.sin(elapsed * p.swayFreq + p.phase) * p.glideAmp) * dt;

          const outRight = p.dir === 1 && p.x > width + p.size * 2;
          const outLeft = p.dir === -1 && p.x < -p.size * 2;
          if (outRight || outLeft || p.y < -p.size || p.y > height + p.size) {
            particles[i] = spawnParticle(
              width,
              height,
              itemSize,
              activeSeason,
              false,
              spriteCount
            );
            continue;
          }

          drawFlyingBird(ctx, p, elapsed);
        } else if (activeSeason === 'autumn') {
          // True leaf-in-the-wind aerodynamics: wide gliding arcs, air-cushion slowdown at apex, pendulum tilt
          const glideSwing = Math.cos(elapsed * p.swayFreq + p.phase);
          const windResponse = 0.65 + (p.size / 42) * 0.35;
          p.x += (p.vx + autumnWind * windResponse + glideSwing * p.swayAmp) * dt;

          // Air resistance lifts the leaf near horizontal extremes and lets it settle between swings
          const airCushionLift = 1 - 0.44 * Math.abs(glideSwing);
          p.y += p.vy * airCushionLift * dt;

          // Leaf banks into its glide arc rather than spinning mechanically like a snowflake
          const bankAngle =
            glideSwing * 0.56 + Math.sin(elapsed * 0.55 + p.glideAmp) * 0.34;
          const perspectiveRoll = 0.62 + 0.38 * Math.cos(elapsed * p.flapFreq + p.glideAmp);
          const perspectivePitch = 0.84 + 0.16 * Math.sin(elapsed * p.flapFreq * 0.7 + p.phase);

          if (p.y > height + p.size) {
            particles[i] = spawnParticle(
              width,
              height,
              itemSize,
              activeSeason,
              false,
              spriteCount
            );
            continue;
          } else if (p.x < -p.size) {
            p.x = width + p.size;
          } else if (p.x > width + p.size) {
            p.x = -p.size;
          }

          const sprite = sprites[p.spriteIndex % sprites.length];
          const half = p.size / 2;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(bankAngle);
          ctx.scale(perspectivePitch, perspectiveRoll);
          ctx.drawImage(sprite, -half, -half, p.size, p.size);
          ctx.restore();
        } else {
          const swayOffset = Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp * dt;
          p.x += p.vx * dt + swayOffset;
          p.y += p.vy * dt;

          if (activeSeason === 'spring') {
            p.angle = Math.sin(elapsed * 1.3 + p.phase) * 0.35;
          } else {
            p.angle += p.spinSpeed * dt;
          }

          if (p.y > height + p.size) {
            particles[i] = spawnParticle(
              width,
              height,
              itemSize,
              activeSeason,
              false,
              spriteCount
            );
            continue;
          } else if (p.x < -p.size) {
            p.x = width + p.size;
          } else if (p.x > width + p.size) {
            p.x = -p.size;
          }

          const sprite = sprites[p.spriteIndex % sprites.length];
          const half = p.size / 2;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.drawImage(sprite, -half, -half, p.size, p.size);
          ctx.restore();
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
      {/* z-[5] places seasonal elements behind window-glass foreground text/CTAs/headers (z-10..z-100) while above background photos */}
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
