import { CutPlan } from '../lib/plan';
import { SceneSpec, R, buildStage2Plan } from './spec';

const W = 1000;
/** Darika's draft plus the source's own Off-brief stamp (lands at src frame 33), kept inside the 250px top / 450px bottom safe zone. */
const HOOK = R(700, 150, 1050, 900);
const HOOK_FREEZE_SRC = 46;

/** 9:16 EDL: sub-scenes are the plan's in-scene cut-ins (punch on the beat). */
export const SPECS_916: readonly SceneSpec[] = [
  { id: 'hook', a: 0, b: 64, src: 0, freezeSrc: HOOK_FREEZE_SRC, crop: HOOK, view: { kind: 'free', w: 1080, top: 250 } },
  { id: 'creators', a: 64, b: 129, src: 129, crop: R(400, 320, 1120, 300), view: { kind: 'card', w: W } },
  { id: 'brief-a', a: 129, b: 193, src: 193, crop: R(400, 90, 1120, 560), view: { kind: 'card', w: W } },
  { id: 'brief-b', a: 193, b: 257, src: 257, crop: R(400, 400, 1120, 520), view: { kind: 'card', w: W }, transition: 'punch' },
  { id: 'angle-a', a: 257, b: 305, src: 354, crop: R(380, 120, 1400, 850), view: { kind: 'card', w: W } },
  { id: 'angle-b', a: 305, b: 354, src: 402, crop: R(395, 770, 1340, 300), view: { kind: 'card', w: W }, transition: 'punch' },
  { id: 'details-a', a: 354, b: 386, src: 450, crop: R(400, 100, 1120, 460), view: { kind: 'card', w: W } },
  { id: 'details-b', a: 386, b: 418, src: 482, crop: R(400, 380, 1120, 260), view: { kind: 'card', w: W }, transition: 'punch' },
  { id: 'sent', a: 418, b: 498, src: 595, crop: R(395, 300, 1130, 300), view: { kind: 'card', w: W } },
  { id: 'arrive-a', a: 498, b: 530, src: 675, crop: R(300, 200, 1330, 630), view: { kind: 'card', w: W } },
  { id: 'arrive-b', a: 530, b: 579, src: 707, crop: R(315, 260, 900, 560), view: { kind: 'card', w: W }, transition: 'punch' },
  { id: 'review-a', a: 579, b: 643, src: 755, speed: 1.25, crop: R(10, 125, 1055, 760), view: { kind: 'card', w: W } },
  { id: 'review-b', a: 643, b: 707, src: 835, speed: 1.25, crop: R(1118, 232, 790, 476), view: { kind: 'card', w: W }, transition: 'punch' },
  { id: 'same-std', a: 707, b: 771, src: 948, crop: R(10, 125, 1055, 760), view: { kind: 'card', w: W } },
  { id: 'approve', a: 771, b: 852, src: 1012, crop: R(270, 262, 1400, 680), view: { kind: 'card', w: W } },
  { id: 'back1-a', a: 852, b: 916, src: 1093, crop: R(695, 120, 1010, 330), view: { kind: 'card', w: W } },
  { id: 'back1-b', a: 916, b: 1012, src: 1157, crop: R(690, 490, 1020, 330), view: { kind: 'card', w: W }, transition: 'punch' },
  { id: 'back2-a', a: 1012, b: 1077, src: 1254, crop: R(53, 156, 886, 630), view: { kind: 'card', w: W } },
  { id: 'back2-b', a: 1077, b: 1125, src: 1319, crop: R(981, 168, 888, 620), view: { kind: 'card', w: W }, transition: 'punch' },
  { id: 'back2-c', a: 1125, b: 1157, src: 1367, speed: 1.4, crop: R(981, 168, 888, 620), view: { kind: 'card', w: W } },
  { id: 'count-a', a: 1157, b: 1221, src: 1414, speed: 1.3125, crop: R(300, 110, 1560, 640), view: { kind: 'card', w: W }, transition: 'whip' },
  { id: 'count-b', a: 1221, b: 1286, src: 1498, speed: 0.5, freezeSrc: 1503, crop: R(407, 100, 1100, 880), view: { kind: 'free', w: 1040, top: 400 } },
  { id: 'bridge', a: 1286, b: 1479, src: 1511, freezeSrc: 1511, crop: R(0, 0, 1920, 1080), view: { kind: 'blur' } },
];

export const plan: CutPlan = buildStage2Plan('916', SPECS_916);
