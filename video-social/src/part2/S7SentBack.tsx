import React from 'react';
import { useCurrentFrame } from 'remotion';
import { DraftCard, CheckPanel } from './Cards';
import { AmberBadge, NoteBox } from './Note';
import { Stage } from './ui';
import { Cap } from './Furniture';
import { useS } from './layout';

const ASHISH = "Structured interviews were supposed to fix hiring. They didn't fully.";
export const ASHISH_NOTE = 'Name Zeko AI in the first two lines and add #ZekoAI. Keep the rest.';

/** Beat 30-40: two crosses, the typed fix, then "Changes requested". */
export const S7SentBack: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  return (
    <>
      <Cap f={f} l916={['Misses get', 'the exact fix.']} l45={['Misses go back with', 'the exact fix.']} acc916="exact" acc45="exact" />
      <Stage f={f}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: s(22) }}>
          <div style={{ opacity: 0.72 }}>
            <DraftCard
              k="ashish" short text={ASHISH} f={f} textSize={46} avatar={72} pad={28}
              right={f >= 120 ? <AmberBadge f={f - 120} /> : null}
            />
          </div>
          <CheckPanel items={[{ label: 'Zeko AI not in first two lines', at: 0, bad: true }, { label: '#ZekoAI missing', at: 15, bad: true }]} f={f} />
          <NoteBox f={f} start={30} cps={26} minH={280} text={ASHISH_NOTE} pauses={[{ at: 57, frames: 10 }]} />
        </div>
      </Stage>
    </>
  );
};
