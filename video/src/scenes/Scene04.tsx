import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, CleoWidget, CreatorCard, FakeCursor, KineticText, easeInOut, prog } from '../components';
import { CenterText, creator, dimAmt } from './shared';

const ORDER = ['riya', 'gunjan', 'shubhangi', 'ashish', 'priyanshu', 'jyoti', 'sunidhi', 'darika'];
const ROW_H = 380;
const BODY_H = 560;
const SCROLL_TO = ROW_H * 4 - BODY_H + 40;

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const count = Math.round(16 * prog(f, 8, 26));
  const scroll = prog(f, 78, 56, easeInOut) * SCROLL_TO;
  return (
    <AbsoluteFill>
      <ChatShell dim={dimAmt(f, 42)} camera={{ scale: 1 + f * 0.0004, originY: 500 }} scrollY={0}>
        <div style={{ marginTop: -6 }}>
          <CleoWidget activeTab="creators" tabCount={count}>
            <div style={{ height: BODY_H, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 34, right: 34, top: 28, transform: `translateY(${-scroll}px)`, display: 'flex', flexWrap: 'wrap', gap: 26 }}>
                {ORDER.map((k, i) => (
                  <CreatorCard key={k} creator={creator(k)} width={503}
                    enterAt={i < 4 ? 14 + i * 2.5 : 84 + (i - 4) * 5} hoverButtonAt={k === 'riya' ? 58 : undefined} />
                ))}
              </div>
            </div>
          </CleoWidget>
        </div>
      </ChatShell>
      <CenterText>
        <KineticText size={122} wordGap={8} exitAt={40} lines={[{ text: '16 creators.', start: 0 }, { text: 'Matched.', start: 10 }]} />
      </CenterText>
      <FakeCursor keys={[{ f: 40, x: 1500, y: 760 }, { f: 56, x: 700, y: 660 }, { f: 100, x: 760, y: 700 }]} />
    </AbsoluteFill>
  );
};
