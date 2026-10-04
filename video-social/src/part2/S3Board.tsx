import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS, FONT_SERIF } from '../components/theme';
import { Avatar, Panel, Stage } from './ui';
import { BoardRow } from './Cards';
import { Cap } from './Furniture';
import { useS } from './layout';
import { CREATORS, FLIP_ORDER, ORDER_BRIEF } from './tokens';
import { pop } from '../lib/anim';

const SPLIT = 30; // b10: sent -> board

const Sent: React.FC<{ f: number }> = ({ f }) => {
  const s = useS();
  return (
    <>
      <div style={{ fontFamily: FONT_SERIF, fontSize: s(60), color: '#fff', lineHeight: 1.25, marginBottom: s(40) }}>
        Payment received.<br />Briefs sent to 8 creators.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: s(36), columnGap: s(10) }}>
        {ORDER_BRIEF.map((k, i) => {
          const t = pop(f, 1 + i * 3, 11, 190);
          return (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s(12), opacity: Math.min(1, t * 2) }}>
              <div style={{ position: 'relative', transform: `scale(${0.6 + 0.4 * Math.min(1.1, t)})`, opacity: Math.min(1, t * 2) }}>
                <Avatar k={k} size={s(170)} ring={C.green} />
                <div style={{ position: 'absolute', right: -s(6), bottom: -s(6), width: s(58), height: s(58), borderRadius: s(29), background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `${s(4)}px solid ${C.bg}` }}>
                  <svg width={s(34)} height={s(34)} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div style={{ fontSize: s(46), fontWeight: 700, color: '#fff', fontFamily: FONT_SANS }}>{CREATORS[k].first}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const FLIP_START = 2;
const FLIP_GAP = 2.5;

const Board: React.FC<{ f: number }> = ({ f }) => (
  <Panel pad={26}>
    {ORDER_BRIEF.map((k, i) => {
      const at = FLIP_START + FLIP_ORDER.indexOf(k) * FLIP_GAP;
      const ready = f >= at;
      return <BoardRow key={k} k={k} h={84} last={i === 7} status={ready ? 'Draft ready' : 'Awaiting draft'} since={ready ? f - at : undefined} />;
    })}
  </Panel>
);

/** Beat 8-12: briefs sent (avatars stamped), then the board flips to Draft ready. */
export const S3Board: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Cap f={f} l916={['Briefs out.', 'Drafts in.']} l45={['Briefs went out.', 'The drafts came back.']} acc916="Drafts" acc45="came" />
      <Stage f={f >= SPLIT ? f - SPLIT : f}>
        {f < SPLIT ? <Sent f={f} /> : <Board f={f - SPLIT} />}
      </Stage>
    </>
  );
};
