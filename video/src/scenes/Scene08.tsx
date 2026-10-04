import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatShell, ClaudeReply, DraftPreview, FakeCursor, KineticText, POSTS, ReviewTable, easeInOut, prog } from '../components';
import { CenterText, REVISED, ROW_ORDER, TopText, creator, dimAmt, makeRow } from './shared';

const WAVE = 30;

export const Scene08: React.FC = () => {
  const f = useCurrentFrame();
  const ashish = creator('ashish');
  const scrollY = 70 + prog(f, 30, 24, easeInOut) * 746;
  const rows = ROW_ORDER.map((k, i) => {
    const revised = REVISED.includes(k);
    const at = WAVE + i * 4.29;
    return makeRow(k, {
      enterAt: -20,
      status: [{ at: 0, v: revised ? 'Changes requested' : 'Draft ready' }, { at, v: 'Approved' }],
      drafts: [{ at: 0, v: revised ? '2' : '1' }],
      cr: [{ at: 0, v: revised ? '1 / 2' : '0 / 2' }],
    });
  });
  const burst = prog(f, 88, 26);
  return (
    <AbsoluteFill>
      <ChatShell dim={dimAmt(f - 88, 999, 0.6)} scrollY={scrollY} camera={{ scale: 0.97 + f * 0.0002, originY: 480 }}>
        <ClaudeReply start={0} wordGap={2} text="Revised drafts are back from Ashish, Darika and Priyanshu." style={{ marginBottom: 18 }} />
        <DraftPreview post={POSTS.ashish2} name={ashish.name} photo={ashish.photo} enterAt={-10}
          status={f >= 26 ? 'approved' : 'review'} statusAt={26} changeCount={1} changeCountAt={-20} pressApproveAt={24} approvePulse={f > 8 && f < 24} />
        <div style={{ marginTop: 24, marginLeft: -230 }}><ReviewTable rows={rows} rowH={60} headerAt={-20} /></div>
        <ClaudeReply style={{ marginTop: 26 }} start={72} text="All 8 drafts are approved." />
      </ChatShell>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, rgba(232,116,59,${0.5 * (1 - burst)}), transparent ${20 + 60 * burst}%)`, opacity: burst > 0 ? 1 : 0 }} />
      <CenterText>
        <KineticText size={230} wordGap={7} pulseAt={110} lines={[{ text: '8 of 8.', start: 90, accent: ['of'] }]} />
      </CenterText>
      <TopText opacity={prog(f, 12, 4) * (1 - prog(f, 52, 10))}>
        <KineticText size={100} wordGap={8} lines={[{ text: 'Revised. Approved.', start: 15 }]} />
      </TopText>
      <FakeCursor keys={[{ f: 6, x: 1500, y: 600 }, { f: 22, x: 1368, y: 812 }]} clicks={[24]} />
    </AbsoluteFill>
  );
};
