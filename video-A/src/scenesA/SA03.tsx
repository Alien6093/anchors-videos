import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, ChatShell, ClaudeReply, FONT_SANS, UserBubble, easeInOut, prog } from '../components';
import { Rise, ToolLine } from '../components/a/kit';
import { Caption } from '../components/b/bits';
import { BriefLine, BriefPara } from '../components/a/Brief';

// six labels ping on beats 13-18 => local frames 16, 32, 48, 64, 80, 96
const LINES: (BriefLine & { gap?: number; body?: number })[] = [
  { label: 'Ask:', at: 16, gap: 1.0, body: 0.9, text: 'Publish one LinkedIn post on why structured interviews still end in gut decisions. Name Zeko AI in the first two lines.' },
  { label: 'Key points to mention:', at: 32, text: '' },
  { bullet: true, at: 34, gap: 0.5, text: 'Zeko AI is an HRTech platform for Enterprise Workforce Intelligence, built for talent decisions.' },
  { bullet: true, at: 40, gap: 0.5, text: 'It turns adaptive talent conversations into verified capability intelligence.' },
  { bullet: true, at: 45, gap: 0.5, text: 'The goal is decisions that rest on evidence, not impressions.' },
  { label: 'Example angles:', at: 48, text: '' },
  { bullet: true, at: 50, gap: 0.5, text: '"Structured interviews, unstructured decisions."' },
  { bullet: true, at: 56, gap: 0.5, text: '"The last five minutes of a debrief decide more hires than the scorecard."' },
  { label: 'Avoid:', at: 64, gap: 0.7, text: 'Press-release tone ("excited to announce", "revolutionary"). Absolute claims: guarantees, "every time", "only tool". Competitor names.' },
  { label: 'Hashtags:', at: 80, gap: 0.7, text: 'Must include #ZekoAI, plus two of your own (#TalentDecisions and #HRTech work well).' },
  { label: 'Engagement tip:', at: 96, gap: 0.7, text: 'Close with a question and reply to the first 10 comments within the hour.' },
];

export const SA03: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = prog(f, 22, 84, easeInOut) * 380;
  return (
    <AbsoluteFill>
      <ChatShell scrollY={scroll} inputGlow={0.1}>
        <UserBubble text="Write briefs for all 8." enterAt={0} />
        <div style={{ marginTop: 16 }}><ToolLine label="CLEO - Write briefs for every creator missing one" start={3} doneAt={13} dim={0.35 * prog(f, 20, 10)} /></div>
        <Rise at={7} style={{ marginTop: 22 }} dim={prog(f, 20, 10)}><ClaudeReply text="I've written Ashish's brief and saved it to the campaign." start={7} wordGap={1} size={34} /></Rise>
        <div style={{ marginTop: 16, paddingLeft: 6 }}>
          {LINES.map((l, i) => <BriefPara key={i} line={l} wordGap={l.gap ?? 1} bodyDim={l.body ?? 0.4} />)}
        </div>
        <Rise at={108} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 30, color: C.muted }}>Before paying: post format not set yet.</div>
        </Rise>
      </ChatShell>
      <Caption text="The brief creators follow." at={14} />
    </AbsoluteFill>
  );
};
