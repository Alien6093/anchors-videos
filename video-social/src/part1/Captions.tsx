import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT_SANS } from '../components/theme';
import { easeOut, lerp, prog } from '../lib/anim';
import { useFmt } from './ctx';
import { beat } from './tokens';

type Cap = { f0: number; f1: number; lines: readonly string[]; accent?: string; size?: number };

/** 9:16 kinetic captions, hand-broken lines, <= 5 words each. */
export const CAPS_916: readonly Cap[] = [
  { f0: 0, f1: 30, lines: ['One website.', 'One budget.'], accent: 'budget.' },
  { f0: 30, f1: 60, lines: ['A creator campaign.', 'In Claude.'], accent: 'Claude.' },
  { f0: 60, f1: 75, lines: ['Who.'], size: 170, accent: 'Who.' },
  { f0: 75, f1: 90, lines: ['What.'], size: 170, accent: 'What.' },
  { f0: 90, f1: 120, lines: ['Why.'], size: 170, accent: 'Why.' },
  { f0: 120, f1: 180, lines: ['A plan', 'builds itself.'], accent: 'plan' },
  { f0: 180, f1: 300, lines: ['See reach', 'before you spend.'], accent: 'reach' },
  { f0: 300, f1: 405, lines: ['16 creators', 'matched.'], accent: '16' },
  { f0: 405, f1: 480, lines: ['Sort by', 'engagement.'], accent: 'engagement.' },
  { f0: 480, f1: 660, lines: ['Cut the list.', 'Cap spend.'], accent: 'Cap' },
  { f0: 705, f1: 780, lines: ['Budget and', 'forecast update.'], accent: 'update.' },
  { f0: 780, f1: 900, lines: ['Every creator', 'gets a brief.'], accent: 'brief.' },
  { f0: 900, f1: 960, lines: ['Every rupee', 'itemised.'], accent: 'itemised.' },
  { f0: 960, f1: 1020, lines: ['Pay once.'], size: 140, accent: 'once.' },
  { f0: 1020, f1: 1140, lines: ['Briefs on', 'their way.'], accent: 'way.' },
  { f0: 1140, f1: 1200, lines: ['You pick who.'], size: 120, accent: 'who.' },
  { f0: 1200, f1: 1260, lines: ['You set', 'the budget.'], accent: 'budget.' },
  { f0: 1260, f1: 1320, lines: ['Claude writes', 'the briefs.'], accent: 'briefs.' },
];

type Head = { f0: number; f1: number; lines: readonly string[] };
/** 4:5 sentence-case headlines, one per scene, <= 8 words, hand-broken. */
export const HEADS_45: readonly Head[] = [
  { f0: 0, f1: 60, lines: ['One website, one budget,', 'a full creator campaign.'] },
  { f0: 60, f1: 120, lines: ['It asks three things:', 'who, what, why.'] },
  { f0: 120, f1: 180, lines: ['Claude drafts the storyline', 'and direction.'] },
  { f0: 180, f1: 300, lines: ['See projected reach', 'before you spend.'] },
  { f0: 300, f1: 480, lines: ['16 matched creators,', 'sortable by engagement.'] },
  { f0: 480, f1: 660, lines: ['One message trims the list', 'and caps spend.'] },
  { f0: 660, f1: 780, lines: ['Budget and forecast update', 'with the roster.'] },
  { f0: 780, f1: 900, lines: ['Each creator gets', 'a written brief.'] },
  { f0: 900, f1: 960, lines: ['An itemised quote', 'before you pay.'] },
  { f0: 960, f1: 1020, lines: ['One payment activates', 'the campaign.'] },
  { f0: 1020, f1: 1140, lines: ['Briefs sent', 'to every creator.'] },
  { f0: 1140, f1: 1200, lines: ['You pick who.'] },
  { f0: 1200, f1: 1260, lines: ['You pick who.', 'You set the budget.'] },
  { f0: 1260, f1: 1320, lines: ['You pick who.', 'You set the budget.', 'Claude writes the briefs.'] },
];

const CAP_W = 960;
const CHAR_W = 0.6;

const Kinetic: React.FC<{ cap: Cap; t: number }> = ({ cap, t }) => {
  const longest = Math.max(...cap.lines.map((l) => l.length));
  const size = Math.min(cap.size ?? 88, CAP_W / (longest * CHAR_W));
  const s = lerp(1.08, 1, prog(t, 0, 6, easeOut));
  return (
    <div style={{ position: 'absolute', left: 60, width: 960, top: 360, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', transform: `scale(${s})`, fontFamily: FONT_SANS, fontWeight: 900, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.03em', color: '#fff', textShadow: '0 5px 0 rgba(0,0,0,.55), 0 12px 32px rgba(0,0,0,.55)', whiteSpace: 'pre' }}>
        {cap.lines.map((l, i) => (
          <div key={i}>
            {l.split(' ').map((w, j, arr) => (
              <span key={j} style={{ color: w === cap.accent ? C.orange : '#fff' }}>{w}{j < arr.length - 1 ? ' ' : ''}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Headline: React.FC<{ head: Head; t: number }> = ({ head, t }) => {
  const p = prog(t, 0, 6, easeOut);
  return (
    <div style={{ position: 'absolute', left: 80, width: 920, top: 150, transform: `translateY(${(1 - p) * 8}px)`, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', whiteSpace: 'pre', textShadow: '0 3px 18px rgba(0,0,0,.5)' }}>
      {head.lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
};

export const CaptionLayer: React.FC = () => {
  const f = useCurrentFrame();
  const { is916 } = useFmt();
  if (f >= beat(88)) return null;
  if (is916) {
    const cap = CAPS_916.find((c) => f >= c.f0 && f < c.f1);
    return cap ? <Kinetic cap={cap} t={f - cap.f0} /> : null;
  }
  const head = HEADS_45.find((c) => f >= c.f0 && f < c.f1);
  if (!head) return null;
  // recap stacks: only the newly added line animates, earlier lines stay put
  return <Headline head={head} t={f - head.f0} />;
};
