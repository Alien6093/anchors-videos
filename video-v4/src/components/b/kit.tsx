import React from 'react';
import { CREATORS, Creator } from '../../lib/data';
import { BStatus as Status } from './BPill';
import { Step } from '../anim';
import { BoardRow } from './Board';

export const cre = (key: string): Creator => CREATORS.find((c) => c.key === key)!;
export const ORDER_BRIEF = ['ashish', 'riya', 'gunjan', 'priyanshu', 'jyoti', 'sunidhi', 'shubhangi', 'darika'];
export const ORDER_LIVE = ['ashish', 'riya', 'gunjan', 'shubhangi', 'jyoti', 'sunidhi', 'priyanshu', 'darika'];
export const LIVE_DATES: Record<string, string> = {
  ashish: 'Wed 7 Oct 10:00 AM', riya: 'Wed 7 Oct 1:00 PM', gunjan: 'Wed 7 Oct 5:00 PM', shubhangi: 'Thu 8 Oct 9:30 AM',
  jyoti: 'Thu 8 Oct 12:00 PM', sunidhi: 'Thu 8 Oct 5:00 PM', priyanshu: 'Fri 9 Oct 10:00 AM', darika: 'Fri 9 Oct 1:00 PM',
};
export const st = <T,>(...s: [number, T][]): Step<T>[] => s.map(([at, v]) => ({ at, v }));
export type RowOpt = Partial<BoardRow> & { status: Step<Status>[] };
export const row = (key: string, o: RowOpt): BoardRow => ({ name: cre(key).name, enterAt: -20, ...o });
export const Bare: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
