import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { Panel, Stage, Tick } from './ui';
import { BoardRow } from './Cards';
import { CounterOf8, SegBar } from './Counter';
import { Cap } from './Furniture';
import { useS } from './layout';

const NAMES = ['riya', 'jyoti', 'gunjan', 'shubhangi', 'sunidhi'];
const APPROVE_AT = [0, 15, 30, 45, 60]; // b24..b28
const COUNTER_AT = 60; // b28 = f420 global

/** Beat 24-30: five badges turn Approved one per beat; "5 of 8" lands on b28. */
export const S6Approve: React.FC = () => {
  const f = useCurrentFrame();
  const s = useS();
  const done = APPROVE_AT.filter((a) => f >= a + 4).length;
  return (
    <>
      <Cap f={f} l916={['Passing drafts', 'get approved.']} l45={['Drafts that match the brief', 'are approved.']} acc916="approved." acc45="approved." />
      <Stage f={f} align="top">
        <div style={{ display: 'flex', alignItems: 'center', gap: s(16), marginBottom: s(18), fontFamily: FONT_SANS, color: C.muted, fontSize: s(46), fontWeight: 600 }}>
          <Tick size={s(44)} /> CLEO · Approve a draft
        </div>
        <Panel pad={22}>
          {NAMES.map((k, i) => {
            const ok = f >= APPROVE_AT[i] + 4;
            return <BoardRow key={k} k={k} h={84} last={i === 4} status={ok ? 'Approved' : 'Draft ready'} since={ok ? f - APPROVE_AT[i] - 4 : undefined} />;
          })}
        </Panel>
        <div style={{ marginTop: s(36) }}><SegBar filled={done} /></div>
        <div style={{ marginTop: s(30), height: s(150), opacity: f >= COUNTER_AT ? 1 : 0 }}>
          <CounterOf8 n={5} since={f - COUNTER_AT} size={140} />
        </div>
      </Stage>
    </>
  );
};
