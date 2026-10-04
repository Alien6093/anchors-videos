import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT_SANS, FONT_SERIF } from '../components/theme';
import { Avatar, Pill, Stage } from './ui';
import { Cap } from './Furniture';
import { useS } from './layout';
import { CREATORS } from './tokens';
import { prog } from '../lib/anim';

const HUSH_AT = 45; // b55 = f825

/** Beat 52-56: Claude's line + the three revised creators; b55 hush dims the picture. */
export const S9Revised: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const dim = 0.35 * prog(f, HUSH_AT, 4, (x) => x);
  return (
    <>
      <Cap f={f} l916={['Revised drafts', 'return.']} l45={['The creators revise', 'and resubmit.']} acc916="return." acc45="revise" />
      <Stage f={f} dim={dim}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: s(72), color: '#fff', lineHeight: 1.27, marginBottom: s(60) }}>
          Revised drafts are back from Ashish, Darika and Priyanshu. Each now meets the brief.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['ashish', 'darika', 'priyanshu'].map((k) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: s(14), width: '33%' }}>
              <Avatar k={k} size={s(200)} ring="#F0A24A" />
              <div style={{ fontSize: s(46), fontWeight: 700, color: '#fff', fontFamily: FONT_SANS }}>{CREATORS[k].first}</div>
              <Pill status="Revised" font={42} />
            </div>
          ))}
        </div>
      </Stage>
    </>
  );
};
