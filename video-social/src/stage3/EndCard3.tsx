import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Format } from '../lib/format';
import { AnchorsLogo } from '../components/AnchorsLogo';
import { FONT_SANS } from '../components/theme';
import { lerp, pop, prog } from '../lib/anim';
import { Backdrop } from './Backdrop';
import { ACCENT, T, beatF } from './tokens';

const TAGLINE = 'Run your creator campaign in a chat.';
const CTA_1 = 'Ask Claude: How is it performing?';
const CTA_2 = '→ anchors.in';
const SMALL = 'Zeko AI, live on LinkedIn.';
const BRIDGE_FRAMES = 12;
const PULSE_FRAMES = 10;
const PULSE_BEATS = [88, 89, 90, 91] as const;

const pulseAt = (f: number): number =>
  PULSE_BEATS.reduce((m, b) => {
    const d = f - beatF(b);
    return d >= 0 && d < PULSE_FRAMES ? Math.max(m, Math.sin((d / PULSE_FRAMES) * Math.PI)) : m;
  }, 0);

type L = { logo: number; logoSize: number; tag: number; tagSize: number; btn: number; btnW: number; f1: number; f2: number; small: number; align: 'center' | 'left' };
const LAYOUT: Record<Format, L> = {
  '916': { logo: 600, logoSize: 136, tag: 800, tagSize: 70, btn: 1110, btnW: 920, f1: 46, f2: 66, small: 1300, align: 'center' },
  '45': { logo: 300, logoSize: 110, tag: 500, tagSize: 74, btn: 840, btnW: 920, f1: 42, f2: 58, small: 1010, align: 'left' },
};

/** Native vertical end card (frames 1350-1478) with loop-bridge fade to the teaser glow over the last 12 frames. */
export const EndCard3: React.FC<{ format: Format; frame: number }> = ({ format, frame }) => {
  if (frame < T.s11) return null;
  const t = frame - T.s11;
  const l = LAYOUT[format];
  const left = l.align === 'left';
  const tag = pop(t, 10, 14, 160, 0.7);
  const cta = pop(t, 22, 12, 200, 0.6);
  const pulse = pulseAt(frame);
  const content = 1 - prog(frame, T.bridgeStart, BRIDGE_FRAMES, (x) => x);
  const h = format === '916' ? 1920 : 1350;
  return (
    <AbsoluteFill>
      <Backdrop cyPct={(l.btn / h) * 100} strength={0.22 + 0.06 * (1 - content)} />
      <AbsoluteFill style={{ opacity: content, fontFamily: FONT_SANS }}>
        <div style={{ position: 'absolute', left: left ? 80 : 0, width: left ? 920 : 1080, top: l.logo, transform: 'translateY(-50%)', display: 'flex', justifyContent: left ? 'flex-start' : 'center' }}>
          <AnchorsLogo size={l.logoSize} frame={t} delay={0} />
        </div>
        <div style={{
          position: 'absolute', left: 80, width: 920, top: l.tag, transform: `translateY(calc(-50% + ${lerp(24, 0, Math.min(1, tag))}px))`, opacity: Math.min(1, tag * 2),
          textAlign: left ? 'left' : 'center', color: '#fff', fontSize: l.tagSize, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.08,
        }}>{TAGLINE}</div>
        <div style={{
          position: 'absolute', left: left ? 80 : (1080 - l.btnW) / 2, width: l.btnW, top: l.btn, transform: `translateY(-50%) scale(${lerp(0.88, 1, Math.min(1, cta)) + 0.03 * pulse})`, transformOrigin: left ? '0 50%' : '50% 50%',
          opacity: Math.min(1, cta * 2), background: ACCENT, color: '#fff', borderRadius: 34, padding: '42px 36px', textAlign: 'center',
          boxShadow: `0 0 ${36 + 60 * pulse}px rgba(242,128,58,${0.32 + 0.3 * pulse}), 0 18px 44px rgba(0,0,0,.5)`,
        }}>
          <div style={{ fontSize: l.f1, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{CTA_1}</div>
          <div style={{ fontSize: l.f2, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: 10 }}>{CTA_2}</div>
        </div>
        <div style={{ position: 'absolute', left: 80, width: 920, top: l.small, textAlign: left ? 'left' : 'center', fontSize: 34, fontWeight: 600, color: 'rgba(255,255,255,.62)', opacity: prog(t, 40, 10) }}>{SMALL}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
