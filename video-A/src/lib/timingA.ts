export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_FRAMES = 1800; // 60.000s = 112 beats at 112 BPM

/** Scene windows (frames, out exclusive) from script_A BUILD SPEC section 2. */
export const SCENES_A = [
  { id: 1, name: 'HookTitle', from: 0, frames: 129 },
  { id: 2, name: 'Context', from: 129, frames: 64 },
  { id: 3, name: 'BriefWritten', from: 193, frames: 129 },
  { id: 4, name: 'EditBrief', from: 322, frames: 128 },
  { id: 5, name: 'FormatLinkFiles', from: 450, frames: 64 },
  { id: 6, name: 'PaymentBridge', from: 514, frames: 81 },
  { id: 7, name: 'BriefsSent', from: 595, frames: 80 },
  { id: 8, name: 'DraftsArrive', from: 675, frames: 80 },
  { id: 9, name: 'ReviewRiya', from: 755, frames: 193 },
  { id: 10, name: 'SameStandard', from: 948, frames: 65 },
  { id: 11, name: 'ApproveFive', from: 1013, frames: 80 },
  { id: 12, name: 'AshishSentBack', from: 1093, frames: 161 },
  { id: 13, name: 'DarikaPriyanshu', from: 1254, frames: 160 },
  { id: 14, name: 'EightOfEight', from: 1414, frames: 97 },
  { id: 15, name: 'SetLiveDates', from: 1511, frames: 96 },
  { id: 16, name: 'Live', from: 1607, frames: 64 },
  { id: 17, name: 'EndCard', from: 1671, frames: 129 },
] as const;
