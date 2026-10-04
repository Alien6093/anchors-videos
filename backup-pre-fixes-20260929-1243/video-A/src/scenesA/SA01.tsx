import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { AnchorsMark, C, FONT_SANS, KineticText, easeInOut, lerp, pop, prog } from '../components';
import { MarkedText } from '../components/b/bits';
import { DARIKA_FIRST } from '../components/b/posts';
import { cre } from '../components/b/kit';

const STAMP_AT = 32; // beat 2 (1.071s)
const SMASH = 48; // beat 3 (1.607s): hard black for 1 beat
const TITLE_AT = 64; // beat 4 (2.143s)
const TITLE_OUT = 123; // 4.107s
const AMBER = '#F0A24A';
const easeIn = Easing.in(Easing.cubic);

const Draft: React.FC = () => {
  const f = useCurrentFrame();
  const d = cre('darika');
  const push = lerp(1, 1.12, prog(f, 0, SMASH, easeIn));
  const slam = pop(f, STAMP_AT, 9, 320, 0.45);
  const shake = f >= STAMP_AT && f < STAMP_AT + 5 ? Math.sin((f - STAMP_AT) * 3) * 8 * (1 - (f - STAMP_AT) / 5) : 0;
  const flash = f >= STAMP_AT && f < STAMP_AT + 3 ? 0.22 * (1 - (f - STAMP_AT) / 3) : 0;
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #2a2321 0%, #0c0b0b 70%)' }}>
      <AbsoluteFill style={{ transform: `translateY(${shake}px) scale(${push})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 300, top: 170, width: 1320, boxSizing: 'border-box', background: C.cream, borderRadius: 26, padding: '38px 50px 44px', fontFamily: FONT_SANS, boxShadow: '0 40px 100px rgba(0,0,0,.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Img src={staticFile(d.photo)} style={{ width: 96, height: 96, borderRadius: 48, objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: 42, fontWeight: 700, color: C.ink }}>{d.name}</div>
              <div style={{ fontSize: 28, color: C.inkSoft }}>First draft</div>
            </div>
          </div>
          <div style={{ marginTop: 30, fontSize: 46, lineHeight: 1.5, color: '#222' }}>
            <MarkedText text={DARIKA_FIRST} marks={['revolutionary', "world's number one"]} at={6} gap={9} color={AMBER} tint="rgba(240,162,74,.22)" />
          </div>
        </div>
        <div style={{
          position: 'absolute', left: 1080, top: 760, transform: `rotate(-9deg) scale(${lerp(2.8, 1, Math.min(1, slam))})`, opacity: Math.min(1, slam * 3),
          border: `10px solid ${AMBER}`, borderRadius: 18, padding: '6px 34px', color: AMBER, fontFamily: FONT_SANS, fontWeight: 900, fontSize: 96, letterSpacing: '-0.02em',
          background: 'rgba(31,30,29,.86)', boxShadow: '0 20px 60px rgba(0,0,0,.6)',
        }}>Off-brief</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})` }} />
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const out = prog(f, TITLE_OUT, 6, easeIn);
  const drift = 1 + 0.0004 * (f - TITLE_AT);
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 46%, #1b1615 0%, #0b0a0a 72%)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ transform: `translateY(${-out * 150}px) scale(${drift})`, opacity: 1 - out, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: 34, transform: `scale(${lerp(0.4, 1, Math.min(1, pop(f, TITLE_AT, 12, 200)))})` }}><AnchorsMark size={84} /></div>
        <div style={{ transform: `scale(${1 + 0.05 * (1 - prog(f, TITLE_AT, 9))})` }}>
          <KineticText size={140} wordGap={3} lines={[{ text: 'Brief. Review. Approve.', start: TITLE_AT, accent: ['Approve'] }]} />
        </div>
        <div style={{ marginTop: 36, fontFamily: FONT_SANS, fontSize: 44, fontWeight: 500, color: C.muted, letterSpacing: '0.03em', opacity: prog(f, TITLE_AT + 12, 12) }}>Zeko AI x anchors</div>
      </div>
    </AbsoluteFill>
  );
};

export const SA01: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {f < SMASH && <Draft />}
      {f >= TITLE_AT && <Title />}
    </AbsoluteFill>
  );
};
