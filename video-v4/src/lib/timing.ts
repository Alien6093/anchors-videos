export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_FRAMES = 150 * FPS; // 4500

export const sec = (s: number) => Math.round(s * FPS);

// 27 scene windows from script_v4.md (seconds). Boundaries snap to 112 BPM grid where noted in the script.
export const SCENES = [
  { id: 1, name: 'HookTitle', start: 0, end: 4.5 },
  { id: 2, name: 'Prompt', start: 4.5, end: 8.5 },
  { id: 3, name: 'ChoicesBuild', start: 8.5, end: 15.5 },
  { id: 4, name: 'Plan', start: 15.5, end: 23 },
  { id: 5, name: 'CreatorCards', start: 23, end: 30 },
  { id: 6, name: 'OpenCreatorCredit', start: 30, end: 37.5 },
  { id: 7, name: 'TheCutSaid', start: 37.5, end: 42.5 },
  { id: 8, name: 'SixteenToEight', start: 42.5, end: 49.5 },
  { id: 9, name: 'BriefWritten', start: 49.5, end: 59 },
  { id: 10, name: 'EditBrief', start: 59, end: 62 },
  { id: 11, name: 'FormatLinkFiles', start: 62, end: 65.5 },
  { id: 12, name: 'Quote', start: 65.5, end: 70 },
  { id: 13, name: 'PaymentDashboard', start: 70, end: 75 },
  { id: 14, name: 'BriefsSent', start: 75, end: 77.5 },
  { id: 15, name: 'DraftsArrive', start: 77.5, end: 82.5 },
  { id: 16, name: 'ReviewRiya', start: 82.5, end: 88.5 },
  { id: 17, name: 'ReviewFlashes', start: 88.5, end: 92 },
  { id: 18, name: 'ApproveFive', start: 92, end: 96 },
  { id: 19, name: 'ChangesAshish', start: 96, end: 100.5 },
  { id: 20, name: 'ChangesDarikaPriyanshu', start: 100.5, end: 104.5 },
  { id: 21, name: 'EightOfEight', start: 104.5, end: 110 },
  { id: 22, name: 'SetLiveDates', start: 110, end: 115 },
  { id: 23, name: 'Live', start: 115, end: 120 },
  { id: 24, name: 'Metrics', start: 120, end: 132 },
  { id: 25, name: 'Comments', start: 132, end: 138 },
  { id: 26, name: 'Audience', start: 138, end: 145.5 },
  { id: 27, name: 'EndCard', start: 145.5, end: 150 },
] as const;
