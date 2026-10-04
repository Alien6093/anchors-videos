import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { DraftCard } from './Cards';
import { Stage } from './ui';
import { Cap } from './Furniture';
import { DARIKA_TEXT } from './tokens';
import { useL, useS } from './layout';
import { prog, lerp } from '../lib/anim';

const STAMP_AT = 45;

/** Beat 0-4: Darika's off-brief draft, settled at f0, stamp slams at f45. */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const s = useS();
  const slam = prog(f, STAMP_AT, 4);
  const shake = L.fmt === '916' && f >= STAMP_AT + 2 && f < STAMP_AT + 8 ? ((f % 2 === 0 ? 1 : -1) * 4 * (1 - (f - STAMP_AT - 2) / 6)) : 0;
  const stamp = f >= STAMP_AT ? (
    <div style={{
      transform: `rotate(-6deg) scale(${lerp(2.4, 1, slam)})`, opacity: Math.min(1, slam * 3), border: `${s(8)}px solid ${C.red}`, color: C.red,
      borderRadius: s(18), padding: `${s(6)}px ${s(30)}px`, fontSize: s(76), fontWeight: 900, letterSpacing: '0.04em', fontFamily: FONT_SANS, lineHeight: 1.1,
      background: 'rgba(214,58,47,.07)',
    }}>OFF-BRIEF</div>
  ) : null;
  return (
    <>
      {f < STAMP_AT
        ? <Cap f={f} only="916" l916={['Would you', 'approve this?']} l45={[]} acc916="approve" acc45="" />
        : <Cap f={f - STAMP_AT} only="916" l916={["Claude didn't."]} l45={[]} acc916="Claude" acc45="" />}
      <Cap f={f} only="45" l916={[]} l45={["Would you approve this draft?", "Claude didn't."]} acc45="didn't." acc916="" />
      <div style={{ transform: `translateX(${shake}px)` }}>
        <Stage f={f} noEnter push={f * 0.0003}>
          <DraftCard
            k="darika" sub="First draft" text={DARIKA_TEXT} f={f + 8}
            marks={[{ phrase: 'revolutionary', at: 0 }, { phrase: "world's number one", at: 4 }]} textSize={58} avatar={100} pad={44}
          >
            <div style={{ height: s(170), display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: s(14) }}>{stamp}</div>
          </DraftCard>
        </Stage>
      </div>
    </>
  );
};

