import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { lerp, pop, prog } from '../lib/anim';
import { Bubble, Pill, ToolLine } from './kit';

const WORDS: { t: string; at: number }[] = [{ t: 'Two', at: 180 }, { t: 'weeks', at: 184 }, { t: 'later.', at: 190 }];

/** f 180-239: "Two weeks later." kinetic card + date chip. Word 1 is fully present on the first frame. */
export const SceneTwoWeeks: React.FC<{ f: number }> = ({ f }) => {
  const chip = pop(f, 198, 12, 190);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 56, fontFamily: FONT_SANS }}>
      <div style={{ textAlign: 'center', fontSize: 150, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, color: '#fff' }}>
        {WORDS.map((w, i) => {
          const k = pop(f, w.at, 11, 200);
          const first = i === 0;
          return (
            <React.Fragment key={w.t}>
              <span style={{ display: 'inline-block', color: i === 2 ? C.orange : '#fff', opacity: first ? 1 : Math.min(1, k * 2), transform: `translateY(${first ? lerp(0, 0, k) : lerp(40, 0, Math.min(1, k))}px) scale(${first ? lerp(1.1, 1, Math.min(1, k)) : 1})` }}>{w.t}</span>
              {i === 1 ? <br /> : ' '}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ opacity: Math.min(1, chip * 2), transform: `scale(${lerp(0.8, 1, Math.min(1, chip))})` }}>
        <Pill size={56} color={C.ink} bg={C.cream}>Fri 23 Oct 2026</Pill>
      </div>
    </div>
  );
};

/** f 240-299: the bubble "Update me." and the tool line. Bubble is present on the first frame. */
export const SceneUpdate: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44 }}>
    <Bubble instant f={f} at={240} text="Update me." size={84} />
    <div style={{ opacity: prog(f, 255, 8) }}>
      <ToolLine f={f} at={255} doneAt={285} text="How the campaign is performing" size={44} />
    </div>
  </div>
);
