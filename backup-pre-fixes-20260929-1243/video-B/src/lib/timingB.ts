export const FPS_B = 30;
export const TOTAL_B = 1800;

/** 13 scenes, 112 BPM grid, frames from script_B BUILD SPEC section 2 (out exclusive). */
export const SCENES_B = [
  { id: 1, name: 'HookTitle', from: 0, dur: 129 },
  { id: 2, name: 'Context8Live', from: 129, dur: 96 },
  { id: 3, name: 'SnapshotTiles', from: 225, dur: 161 },
  { id: 4, name: 'SnapshotTable', from: 386, dur: 128 },
  { id: 5, name: 'PacingBand', from: 514, dur: 65 },
  { id: 6, name: 'TwoWeeksLater', from: 579, dur: 64 },
  { id: 7, name: 'FinalCountUp', from: 643, dur: 257 },
  { id: 8, name: 'FinalTableResort', from: 900, dur: 129 },
  { id: 9, name: 'PlanVsActual', from: 1029, dur: 128 },
  { id: 10, name: 'CreatorInsights', from: 1157, dur: 129 },
  { id: 11, name: 'Comments', from: 1286, dur: 193 },
  { id: 12, name: 'Audience', from: 1479, dur: 192 },
  { id: 13, name: 'EndCard', from: 1671, dur: 129 },
] as const;
