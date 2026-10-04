import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { Panel, Stage, MarkedText } from './ui';
import { Cap } from './Furniture';
import { useS } from './layout';
import { prog } from '../lib/anim';

const LABELS_TOP = ['Ask', 'Key points to mention', 'Example angles'];
const LABELS_BOTTOM = ['Hashtags', 'Engagement tip'];

/** Beat 4-8: the brief's Avoid line, lit; the other five labels stay dim. */
export const S2Brief: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const lit = prog(f, 0, 8);
  const row = (label: string) => (
    <div key={label} style={{ height: s(74), display: 'flex', alignItems: 'center', fontSize: s(48), fontWeight: 700, color: 'rgba(255,255,255,.34)', fontFamily: FONT_SANS }}>{label}</div>
  );
  return (
    <>
      <Cap f={f} l916={['The brief warned', 'against this.']} l45={['The brief told every creator', 'what to avoid.']} acc916="warned" acc45="avoid." />
      <Stage f={f}>
        <Panel pad={34}>
          <div style={{ fontSize: s(44), color: C.muted, fontWeight: 600, marginBottom: s(10), fontFamily: FONT_SANS }}>Creator brief</div>
          {LABELS_TOP.map(row)}
          <div style={{ margin: `${s(8)}px 0`, padding: `${s(18)}px ${s(26)}px`, borderRadius: s(22), background: `rgba(232,116,59,${0.14 * lit})`, borderLeft: `${s(8)}px solid ${C.orange}` }}>
            <div style={{ fontSize: s(52), fontWeight: 800, color: C.orange, fontFamily: FONT_SANS, marginBottom: s(6) }}>Avoid</div>
            <MarkedText
              text={'Press-release tone ("excited to announce", "revolutionary").'}
              marks={[{ phrase: 'excited to announce', at: 6 }, { phrase: 'revolutionary', at: 10 }]}
              f={f} size={s(48)} color="#fff" lineHeight={1.3}
            />
          </div>
          {LABELS_BOTTOM.map(row)}
        </Panel>
      </Stage>
    </>
  );
};
