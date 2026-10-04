import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Format } from '../lib/format';
import { easeOut, lerp, pop, prog } from '../lib/anim';
import { FONT_SANS } from '../components/theme';
import { Backdrop } from './Backdrop';
import { ACCENT, T } from './tokens';

const WHIP = 7;
const SHADOW = '0 8px 30px rgba(0,0,0,.6)';

const Word: React.FC<{ text: string; f: number; at: number; size: number; color: string }> = ({ text, f, at, size, color }) => {
  const p = pop(f, at, 10, 210, 0.6);
  return (
    <div style={{
      fontFamily: FONT_SANS, fontWeight: 900, fontSize: size, letterSpacing: '-0.045em', lineHeight: 0.98, color, textShadow: SHADOW, whiteSpace: 'nowrap',
      opacity: Math.min(1, p * 4), transform: `translateY(${lerp(70, 0, Math.min(1, p))}px) scale(${lerp(0.7, 1, Math.min(p, 1.1))})`,
    }}>{text}</div>
  );
};

/** Native kinetic "Two weeks / later." card with date chip (frames 257-320). */
export const TimeJump: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  const f = frame - T.s4;
  if (f < 0 || f >= T.s5 - T.s4) return null;
  const is916 = format === '916';
  const swipe = 1 - prog(f, 0, WHIP);
  const chip = pop(f, 30, 12, 200, 0.6);
  const size = is916 ? 200 : 104;
  const cy = is916 ? 800 : 600;
  return (
    <AbsoluteFill style={{ transform: `translateX(${swipe * -1080}px)` }}>
      <Backdrop cyPct={(cy / (is916 ? 1920 : 1350)) * 100} strength={0.3} />
      <div style={{ position: 'absolute', left: 60, right: 60, top: cy, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        {is916 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Word text="Two weeks" f={f} at={6} size={size} color="#fff" />
            <Word text="later." f={f} at={14} size={size * 1.12} color={ACCENT} />
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24 }}>
            <Word text="Two weeks" f={f} at={6} size={size} color="#fff" />
            <Word text="later." f={f} at={14} size={size} color={ACCENT} />
          </div>
        )}
        <div style={{
          fontFamily: FONT_SANS, fontWeight: 700, fontSize: is916 ? 54 : 40, color: '#fff', letterSpacing: '-0.01em', padding: is916 ? '18px 40px' : '14px 30px', borderRadius: 999,
          background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.28)', opacity: Math.min(1, chip * 3), transform: `scale(${lerp(0.7, 1, Math.min(chip, 1.1))})`,
        }}>Fri 23 Oct 2026</div>
      </div>
    </AbsoluteFill>
  );
};
