import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Img, staticFile } from 'remotion';
import { ChatShell, ClaudeReply, UserBubble, lerp, pop, prog, easeInOut, C, FONT_SANS } from '../components';
import { CREATORS } from '../lib/data';
import { Caption, Rise, ToolLine } from '../components/a/kit';
import { BriefPara, BriefLine } from '../components/a/Brief';

const ORDER = ['ashish', 'riya', 'gunjan', 'priyanshu', 'jyoti', 'sunidhi', 'shubhangi', 'darika'];
// label flashes span 51.5-56.5s => local frames 60..207
const LINES: BriefLine[] = [
  { text: 'The brief', at: 56, label: undefined },
  { label: 'Ask:', at: 60, text: 'Publish one LinkedIn post on why structured interviews still end in gut decisions. Name Zeko AI in the first two lines.' },
  { label: 'Key points to mention:', at: 90, text: '' },
  { bullet: true, at: 94, text: 'Zeko AI is an HRTech platform for Enterprise Workforce Intelligence, built for talent decisions.' },
  { bullet: true, at: 102, text: 'It turns adaptive talent conversations into verified capability intelligence.' },
  { bullet: true, at: 110, text: 'The goal is decisions that rest on evidence, not impressions.' },
  { label: 'Example angles:', at: 120, text: '' },
  { bullet: true, at: 124, text: '"Structured interviews, unstructured decisions."' },
  { bullet: true, at: 134, text: '"The last five minutes of a debrief decide more hires than the scorecard."' },
  { label: 'Avoid:', at: 150, text: 'Press-release tone ("excited to announce", "revolutionary"). Absolute claims: guarantees, "every time", "only tool". Competitor names.' },
  { label: 'Hashtags:', at: 180, text: 'Must include #ZekoAI, plus two of your own (#TalentDecisions and #HRTech work well).' },
  { label: 'Engagement tip:', at: 210, text: 'Close with a question and reply to the first 10 comments within the hour.' },
];

const Pill: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const c = CREATORS.find((x) => x.key === ORDER[i])!;
  const at = 12 + i * 3.5;
  const p = pop(f, at, 12, 200);
  const ck = prog(f, at + 8, 8);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.panel, border: `1.5px solid ${C.border}`, borderRadius: 999, padding: '6px 18px 6px 6px', fontFamily: FONT_SANS, fontSize: 26, color: C.text, opacity: Math.min(1, p * 2), transform: `scale(${lerp(0.7, 1, Math.min(1, p))})` }}>
      <Img src={staticFile(c.photo)} style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} />
      {c.name.split(' ')[0]}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="20" strokeDashoffset={20 * (1 - ck)} /></svg>
    </div>
  );
};

export const Scene09: React.FC = () => {
  const f = useCurrentFrame();
  const scale = lerp(1, 1.08, prog(f, 0, 285, (t) => t));
  const scroll = prog(f, 40, 240, easeInOut) * 700;
  const beforeAt = 261;
  return (
    <AbsoluteFill>
      <ChatShell camera={{ scale, originX: 960, originY: 500 }} scrollY={scroll}>
        <UserBubble text="Write briefs for all 8." enterAt={0} />
        <div style={{ marginTop: 16 }}><ToolLine label="CLEO - Write briefs for every creator missing one" start={6} doneAt={44} /></div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>{ORDER.map((_, i) => <Pill key={i} i={i} />)}</div>
        <Rise at={46} style={{ marginTop: 22 }}><ClaudeReply text="I've written Ashish's brief and saved it to the campaign." start={48} wordGap={1.6} size={34} /></Rise>
        <div style={{ marginTop: 16, paddingLeft: 6 }}>
          {LINES.map((l, i) => (i === 0 ? <Rise key={i} at={l.at}><div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 36, color: C.text, marginBottom: 8 }}>The brief</div></Rise> : <BriefPara key={i} line={l} />))}
        </div>
        <Rise at={beforeAt} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 32, color: C.text }}>Before paying</div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: C.muted, marginTop: 6 }}>Post format: not set yet.</div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: C.muted, marginTop: 4 }}>Quote: I'll run the checkout summary once the format is set.</div>
        </Rise>
      </ChatShell>
      <Caption text="The brief creators follow." at={30} />
    </AbsoluteFill>
  );
};
