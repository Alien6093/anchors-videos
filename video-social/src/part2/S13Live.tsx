import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { Avatar, Panel, Stage } from './ui';
import { BoardRow } from './Cards';
import { Cap } from './Furniture';
import { useS } from './layout';
import { ORDER_LIVE } from './tokens';
import { prog } from '../lib/anim';

const SPLIT = 30; // b80
const LIVE = new Set(['ashish', 'riya', 'gunjan', 'shubhangi']);

/** b78-80: hard crop on the post header only. */
const PostHeader: React.FC<{ f: number }> = ({ f }) => {
  const s = useS();
  return (
    <div style={{ background: '#F6F4EC', borderRadius: s(40), padding: s(50), display: 'flex', alignItems: 'center', gap: s(36), boxShadow: '0 30px 70px rgba(0,0,0,.5)', fontFamily: FONT_SANS, transform: `scale(${1 + f * 0.0012})` }}>
      <Avatar k="ashish" size={s(200)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: s(72), whiteSpace: "nowrap", fontWeight: 800, color: C.ink, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Ashish Shukla</div>
        <div style={{ fontSize: s(56), color: C.inkSoft, marginTop: s(10), display: 'flex', alignItems: 'center', gap: s(12) }}>
          <span style={{ width: s(18), height: s(18), borderRadius: s(9), background: C.green, display: 'inline-block' }} />Just now
        </div>
      </div>
    </div>
  );
};

const PING_AT: Record<string, number> = { ashish: 0, riya: 15, gunjan: 30, shubhangi: 45 };

const LiveBoard: React.FC<{ f: number }> = ({ f }) => {
  const s = useS();
  const pill = (txt: string, fg: string, bg: string, dot?: boolean) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: s(14), background: bg, color: fg, fontWeight: 800, fontSize: s(56), borderRadius: 999, padding: `${s(8)}px ${s(30)}px`, fontFamily: FONT_SANS, whiteSpace: 'nowrap' }}>
      {dot && <span style={{ width: s(20), height: s(20), borderRadius: s(10), background: C.green, boxShadow: `0 0 ${s(14)}px ${C.green}` }} />}{txt}
    </span>
  );
  const chip = (t: string) => (
    <span key={t} style={{ background: C.cream, color: C.ink, fontWeight: 800, fontSize: s(46), borderRadius: s(18), padding: `${s(4)}px ${s(24)}px`, fontFamily: FONT_SANS }}>{t}</span>
  );
  return (
    <>
      <div style={{ display: 'flex', gap: s(18), marginBottom: s(16) }}>
        {pill('4 Live', '#6fe0a8', 'rgba(63,178,127,.2)', true)}
        {pill('4 Scheduled', '#d3c3ff', 'rgba(182,156,255,.2)')}
      </div>
      <div style={{ display: 'flex', gap: s(12), marginBottom: s(18) }}>{['Wed 7', 'Thu 8', 'Fri 9'].map(chip)}</div>
      <Panel pad={16}>
        {ORDER_LIVE.map((k, i) => {
          const live = LIVE.has(k);
          const at = PING_AT[k];
          const glow = live && f >= at ? 0.26 * (1 - prog(f, at, 20)) : 0;
          return (
            <div key={k} style={{ background: `rgba(63,178,127,${glow})`, borderRadius: s(18), padding: `0 ${s(8)}px` }}>
              <BoardRow k={k} h={72} last={i === 7} status={live ? 'Live' : 'Scheduled'} />
            </div>
          );
        })}
      </Panel>
    </>
  );
};

/** Beat 78-88: header crop, then the live board (4 Live / 4 Scheduled). */
export const S13Live: React.FC = () => {
  const f = useCurrentFrame();
  const board = f >= SPLIT;
  const lf = f - SPLIT;
  return (
    <>
      <Cap f={f} l916={['Live on', 'LinkedIn.']} l45={['Posts go live on LinkedIn', 'over three days.']} acc916="Live" acc45="live" />
      <Stage f={board ? lf : f} align={board ? 'top' : 'center'}>
        {board ? <LiveBoard f={lf} /> : <PostHeader f={f} />}
      </Stage>
    </>
  );
};
