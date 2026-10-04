import { buildPlan, CutPlan } from '../lib/plan';
import { scenes916 } from '../stage1/scenes916';
import { Stage1Overlay } from '../stage1/Stage1Overlay';

export const plan: CutPlan = buildPlan({
  format: '916',
  scenes: scenes916,
  progressBar: false,
  overlay: Stage1Overlay,
  endCard: { durationSec: 4.3, tagline: 'Run your creator campaign in a chat.', cta: 'Connect anchors to Claude → anchors.in', sub: 'Zeko AI, live on LinkedIn.' },
});
