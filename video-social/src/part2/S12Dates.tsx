import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { Avatar, Panel, Stage } from './ui';
import { Cap } from './Furniture';
import { useS } from './layout';
import { CREATORS } from './tokens';
import { prog, lerp } from '../lib/anim';

const ROWS: { k: string; when: string }[] = [
  { k: 'ashish', when: 'Wed 7 Oct · 10:00 AM' },
  { k: 'riya', when: 'Wed 7 Oct · 1:00 PM' },
  { k: 'gunjan', when: 'Wed 7 Oct · 5:00 PM' },
];
const PULSE_AT = 90; // b76 = f1140 global

/** Beat 70-78: the ask, three live dates, the "Set live date" button pulses on b76. */
export const S12Dates: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const pulse = f >= PULSE_AT ? 0.5 + 0.5 * Math.sin((f - PULSE_AT) / 3.2 - Math.PI / 2) : 0;
  const hit = f >= PULSE_AT ? prog(f, PULSE_AT, 6) * (1 - prog(f, PULSE_AT + 6, 10)) : 0;
  return (
    <>
      <Cap f={f} l916={['Live dates', 'lock once set.']} l45={['Live dates are locked', 'once you set them.']} acc916="lock" acc45="locked" />
      <Stage f={f}>
        <div style={{ alignSelf: 'flex-end', maxWidth: '88%', background: C.bubble, color: '#fff', fontFamily: FONT_SANS, fontSize: s(56), fontWeight: 500, lineHeight: 1.3, padding: `${s(26)}px ${s(34)}px`, borderRadius: s(36), marginBottom: s(48) }}>
          Go live tomorrow or later, staggered over three days.
        </div>
        <Panel pad={22}>
          {ROWS.map((r, i) => {
            const t = prog(f, 3 + i * 4, 8);
            return (
              <div key={r.k} style={{ display: 'flex', alignItems: 'center', gap: s(18), height: s(120), borderBottom: i < 2 ? `1px solid ${C.border}` : 'none', opacity: lerp(0.5, 1, t) }}>
                <Avatar k={r.k} size={s(84)} />
                <div style={{ fontSize: s(46), fontWeight: 700, color: '#fff', fontFamily: FONT_SANS, flex: 1 }}>{CREATORS[r.k].first}</div>
                <div style={{ fontSize: s(46), fontWeight: 600, color: '#d3c3ff', fontFamily: FONT_SANS, whiteSpace: 'nowrap' }}>{r.when}</div>
              </div>
            );
          })}
        </Panel>
        <div style={{ marginTop: s(56), alignSelf: 'center', background: C.orange, color: '#fff', fontFamily: FONT_SANS, fontWeight: 800, fontSize: s(62), padding: `${s(30)}px ${s(80)}px`, borderRadius: s(28), transform: `scale(${1 + 0.06 * hit})`, boxShadow: `0 0 ${s(30 + 70 * pulse)}px rgba(232,116,59,${0.35 + 0.35 * pulse})` }}>
          Set live date
        </div>
      </Stage>
    </>
  );
};
