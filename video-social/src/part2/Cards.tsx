import React from 'react';
import { C, FONT_SANS } from '../components/theme';
import { Avatar, MarkedText, Mark, Pill, St, Tick } from './ui';
import { useS } from './layout';
import { prog } from '../lib/anim';

/** Cream draft card (the film's LinkedIn draft look), rebuilt natively. */
export const DraftCard: React.FC<{
  k: string; sub?: string; text: string; marks?: Mark[]; f: number; tags?: string; tagsMark?: Mark[];
  right?: React.ReactNode; children?: React.ReactNode; textSize?: number; avatar?: number; pad?: number; short?: boolean;
}> = ({ k, sub, text, marks = [], f, tags, right, children, textSize = 46, avatar = 84, pad = 38, short }) => {
  const s = useS();
  const names: Record<string, string> = { darika: 'Darika Jain', priyanshu: 'Priyanshu Manas', ashish: 'Ashish Shukla', riya: 'Riya Dadhich', jyoti: 'Jyoti Vyas', gunjan: 'Gunjan Mishra', shubhangi: 'Shubhangi Shrivastava', sunidhi: 'Sunidhi' };
  return (
    <div style={{ background: '#F6F4EC', borderRadius: s(34), padding: s(pad), color: C.ink, boxShadow: '0 30px 70px rgba(0,0,0,.5)', fontFamily: FONT_SANS }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: s(20), marginBottom: s(22) }}>
        <Avatar k={k} size={s(avatar)} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: s(50), fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{short ? names[k].split(' ')[0] : names[k]}</div>
          {sub && <div style={{ fontSize: s(44), color: C.inkSoft, lineHeight: 1.15 }}>{sub}</div>}
        </div>
        {right}
      </div>
      <MarkedText text={text} marks={marks} f={f} size={s(textSize)} />
      {tags && <div style={{ fontSize: s(textSize), color: C.li, fontWeight: 600, marginTop: s(8), lineHeight: 1.3 }}>
        {tags.split(' ').map((t, i) => {
          const m = marks.find((x) => x.phrase === t);
          const p = m ? prog(f, m.at, 8) : 0;
          return <span key={i} style={{ background: m ? `rgba(240,162,74,${0.45 * p})` : undefined, borderRadius: 6 }}>{t}{' '}</span>;
        })}
      </div>}
      {children}
    </div>
  );
};

export type CheckItem = { label: string; at: number; bad?: boolean };

/** "Claude's check against the brief" panel: dim until its tick lands. */
export const CheckPanel: React.FC<{ items: CheckItem[]; f: number; title?: string }> = ({ items, f, title = "Claude's check against the brief" }) => {
  const s = useS();
  return (
    <div style={{ background: C.panel, border: `2px solid ${C.border}`, borderRadius: s(30), padding: `${s(24)}px ${s(30)}px`, boxShadow: '0 24px 60px rgba(0,0,0,.45)', fontFamily: FONT_SANS }}>
      <div style={{ fontSize: s(42), color: C.muted, fontWeight: 600, marginBottom: s(8), lineHeight: 1.3, whiteSpace: 'nowrap' }}>{title}</div>
      {items.map((it, i) => {
        const on = f >= it.at;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: s(22), height: s(66), opacity: on ? 1 : 0.38 }}>
            {on ? <Tick size={s(44)} bad={it.bad} since={f - it.at} /> : <div style={{ width: s(44), height: s(44), borderRadius: s(22), border: `3px solid ${C.border}`, flexShrink: 0 }} />}
            <div style={{ fontSize: s(48), fontWeight: 700, color: on ? (it.bad ? '#ff8a7e' : '#fff') : C.muted, whiteSpace: 'nowrap' }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Avatar + first name + status row used by boards. */
export const BoardRow: React.FC<{ k: string; status: St; since?: number; h: number; right?: React.ReactNode; last?: boolean }> = ({ k, status, since, h, right, last }) => {
  const s = useS();
  const names: Record<string, string> = { ashish: 'Ashish', riya: 'Riya', gunjan: 'Gunjan', priyanshu: 'Priyanshu', jyoti: 'Jyoti', sunidhi: 'Sunidhi', shubhangi: 'Shubhangi', darika: 'Darika' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s(20), height: s(h), borderBottom: last ? 'none' : `1px solid ${C.border}` }}>
      <Avatar k={k} size={s(h - 18)} />
      <div style={{ fontSize: s(48), fontWeight: 700, color: '#fff', flex: 1 }}>{names[k]}</div>
      {right ?? <Pill status={status} since={since} />}
    </div>
  );
};
