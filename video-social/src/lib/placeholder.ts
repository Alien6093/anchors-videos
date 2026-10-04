import { CutPlan, Rect, Scene, SourceId, buildPlan } from './plan';
import { Format, formatAspect } from './format';
import { formatRect } from './crop';

const FULL_FRAME: Rect = { x: 0, y: 0, w: 1920, h: 1080 };
const SEG_SEC = 10;
const SEGMENTS = 5;

/** Testable placeholder: first ~50s of a source, 10s scenes, slow punch-in, one stack-blur scene, demo overlays. */
export const placeholderPlan = (format: Format, source: SourceId): CutPlan => {
  const aspect = formatAspect(format);
  const scenes: Scene[] = Array.from({ length: SEGMENTS }, (_, i) => ({
    id: `ph${i + 1}`,
    source,
    srcInSec: i * SEG_SEC,
    srcOutSec: (i + 1) * SEG_SEC,
    crop: i === 2 ? FULL_FRAME : formatRect(aspect, 960, 1),
    cropTo: i === 2 ? undefined : formatRect(aspect, 960, 1.25),
    layout: i === 2 ? 'stack-blur' : 'full-crop',
    transitionIn: i === 0 ? 'none' : (['whip', 'zoom-punch', 'flash', 'whip'] as const)[i - 1],
    caption: { text: ['Placeholder plan', 'Punch in', 'Stack blur', 'Kinetic words', 'Almost done'][i], inSec: 1.5, outSec: 4.5, style: i === 1 ? 'accent' : 'pop', position: i % 2 ? 'upper' : 'lower' },
    callouts: i === 3 ? [{ text: 'Live metrics', inSec: 5, outSec: 8, x: 0.5, y: 0.35, arrow: 'down', tone: 'green' }] : undefined,
  }));
  return buildPlan({
    format,
    scenes,
    hook: { text: 'Placeholder hook', durationSec: 1.5 },
    endCard: { durationSec: 3, tagline: 'Run your creator campaign in a chat.', cta: 'Connect anchors to Claude', sub: 'anchors.in' },
    progressBar: true,
  });
};
