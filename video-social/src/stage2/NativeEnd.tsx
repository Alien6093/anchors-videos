import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Format } from '../lib/format';
import { lerp, prog } from '../lib/anim';
import { AnchorsLogo } from '../components/AnchorsLogo';
import { FONT_SANS } from '../components/theme';
import { F, beatFrame } from './spec';
import { INK_BLACK, ORANGE } from './tokens';

export const TAGLINE = 'Run your creator campaign in a chat.';
export const CTA_LINE_1 = 'Brief your creators in Claude';
export const CTA_LINE_2 = '→ anchors.in';

const FADE_IN = 10;
const LOGO_DRAW = 18;
const TAG_START = 1368;
const TAG_FRAMES = 20;
const CTA_START = 1388;
const FADE_OUT_START = 1470;
const DRIFT_TO = 1.02;
const PULSE_BEATS = [88, 90] as const;
const PULSE_FRAMES = 12;

type Layout = { logoY: number; logoSize: number; tagY: number; tagSize: number; ctaY: number; ctaSize: number; ctaPad: string };
const LAYOUT: Record<Format, Layout> = {
  '916': { logoY: 800, logoSize: 150, tagY: 950, tagSize: 64, ctaY: 1180, ctaSize: 46, ctaPad: '30px 60px' },
  '45': { logoY: 430, logoSize: 130, tagY: 650, tagSize: 52, ctaY: 910, ctaSize: 42, ctaPad: '26px 52px' },
};

const beatPulse = (f: number): number =>
  PULSE_BEATS.reduce((m, b) => {
    const d = f - beatFrame(b);
    return d >= 0 && d < PULSE_FRAMES ? Math.max(m, 1 - d / PULSE_FRAMES) : m;
  }, 0);

/** Native end card: logo, tagline, CTA pill. Soft cross-blur in, fade to near-black at the loop seam. */
export const NativeEnd: React.FC<{ format: Format }> = ({ format }) => {
  const f = useCurrentFrame();
  if (f < F.endCard) return null;
  const t = f - F.endCard;
  const L = LAYOUT[format];
  const inP = prog(f, F.endCard, FADE_IN);
  const tag = prog(f, TAG_START, TAG_FRAMES);
  const cta = prog(f, CTA_START, 12);
  const pulse = beatPulse(f);
  const drift = lerp(1, DRIFT_TO, prog(f, F.endCard, F.end - F.endCard, (x) => x));
  const fadeOut = prog(f, FADE_OUT_START, F.end - 1 - FADE_OUT_START, (x) => x);
  return (
    <AbsoluteFill style={{ fontFamily: FONT_SANS, opacity: inP }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, #2a1810 0%, #1b1411 45%, ${INK_BLACK} 100%)` }} />
      <AbsoluteFill style={{ transform: `scale(${drift})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 0, width: 1080, top: L.logoY, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', filter: `blur(${lerp(10, 0, prog(t, 0, LOGO_DRAW))}px)` }}>
          <AnchorsLogo size={L.logoSize} frame={t} delay={0} />
        </div>
        <div style={{ position: 'absolute', left: 100, width: 880, top: L.tagY, transform: `translateY(${-50 + lerp(24, 0, tag) / 4}%)`, textAlign: 'center', color: '#fff', fontSize: L.tagSize, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.12, opacity: tag }}>{TAGLINE}</div>
        <div style={{
          position: 'absolute', left: 540, top: L.ctaY, opacity: Math.min(1, cta * 2), textAlign: 'center', whiteSpace: 'nowrap',
          transform: `translate(-50%, -50%) scale(${lerp(0.88, 1, cta) + 0.035 * pulse})`, background: ORANGE, color: '#fff', padding: L.ctaPad, borderRadius: 28,
          fontSize: L.ctaSize, fontWeight: 800, lineHeight: 1.18, letterSpacing: '-0.01em', boxShadow: `0 0 ${30 + 50 * pulse}px rgba(232,116,59,${0.28 + 0.3 * pulse}), 0 14px 40px rgba(0,0,0,.5)`,
        }}>
          <div>{CTA_LINE_1}</div>
          <div>{CTA_LINE_2}</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: INK_BLACK, opacity: fadeOut * 0.94 }} />
    </AbsoluteFill>
  );
};
