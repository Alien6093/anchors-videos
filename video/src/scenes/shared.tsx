import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CREATORS, Creator } from '../lib/data';
import { C, Step, Status, ReviewRow, onBeat, prog } from '../components';

export const creator = (key: string): Creator => CREATORS.find((c) => c.key === key)!;

export const ROW_ORDER = ['riya', 'gunjan', 'shubhangi', 'sunidhi', 'darika', 'priyanshu', 'jyoti', 'ashish'];

/** dim curve for chat while a centered kinetic headline is up */
export const dimAmt = (f: number, outAt: number, max = 0.7): number => prog(f, 0, 5) * (1 - prog(f, outAt, 12)) * max;

export const CenterText: React.FC<{ children: React.ReactNode; y?: number }> = ({ children, y = 0 }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 - y, pointerEvents: 'none' }}>{children}</AbsoluteFill>
);

export const TopText: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 200, background: `linear-gradient(to bottom, ${C.bg} 30%, transparent)` }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 6, display: 'flex', justifyContent: 'center' }}>{children}</div>
  </AbsoluteFill>
);

export const beat = (sceneStartSec: number) => (approx: number): number => onBeat(sceneStartSec, approx);

const s = <T,>(v: T, at = 0): Step<T>[] => [{ at, v }];

type RowOpts = {
  enterAt: number;
  status: Step<Status>[];
  drafts?: Step<string>[];
  cr?: Step<string>[];
  publish?: Step<string>[];
  publishType?: { at: number; text: string };
};

export const makeRow = (key: string, o: RowOpts): ReviewRow => ({
  name: creator(key).name, enterAt: o.enterAt, status: o.status,
  drafts: o.drafts ?? s('1'), cr: o.cr ?? s('0 / 2'), publish: o.publish ?? s('-'), publishType: o.publishType,
});

export const steps = s;

export const SCHEDULE: Record<string, string> = {
  riya: 'Tue, 6 Oct, 10:00 AM', gunjan: 'Tue, 6 Oct, 10:00 AM', shubhangi: 'Wed, 7 Oct, 10:00 AM', sunidhi: 'Wed, 7 Oct, 10:00 AM',
  darika: 'Thu, 8 Oct, 10:00 AM', priyanshu: 'Tue, 6 Oct, 10:00 AM', jyoti: 'Wed, 7 Oct, 10:00 AM', ashish: 'Thu, 8 Oct, 10:00 AM',
};

export const REVISED = ['ashish', 'darika', 'priyanshu'];
