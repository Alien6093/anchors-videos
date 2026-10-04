import { buildPlan, CutPlan } from '../lib/plan';
import { scenes45 } from '../stage1/scenes45';
import { Stage1Overlay } from '../stage1/Stage1Overlay';

export const plan: CutPlan = buildPlan({
  format: '45',
  scenes: scenes45,
  progressBar: false,
  overlay: Stage1Overlay,
  endCard: { durationSec: 4.3, tagline: 'Run your creator campaign in a chat.', cta: 'Connect anchors to Claude → anchors.in', sub: 'Zeko AI, live on LinkedIn.' },
});
