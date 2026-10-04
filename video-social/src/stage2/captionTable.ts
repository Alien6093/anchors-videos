import { Format } from '../lib/format';

export type CaptionSpec = { readonly a: number; readonly b: number; readonly text: string; /** index of the orange accent word, -1 for none */ readonly accent: number };

const c = (a: number, b: number, text: string, accent = -1): CaptionSpec => ({ a, b, text, accent });

/** Director's caption table. 9:16 = kinetic reel style, 4:5 = sentence-case headline. The hook and bridge are drawn separately. */
export const CAPTIONS: Record<Format, readonly CaptionSpec[]> = {
  '916': [
    c(64, 129, '8 creators.', 1),
    c(129, 257, 'One brief. Six parts.', 3),
    c(257, 354, 'Same brief. Own angle.', 3),
    c(354, 418, 'Format. Link. Files.', 2),
    c(418, 498, 'Sent to all 8.', 3),
    c(498, 579, 'Drafts land themselves.', 2),
    c(579, 707, 'Check it against the brief.', 5),
    c(707, 771, 'Same standard.', 1),
    c(771, 852, 'Approve is final.', 2),
    c(852, 1012, 'Say exactly why.', 2),
    c(1012, 1157, 'Two more. Sent back.', 3),
  ],
  '45': [
    c(64, 129, 'Eight creators to brief.'),
    c(129, 257, 'Every creator gets a clear brief.'),
    c(257, 354, 'Same brief. Their own angle.'),
    c(354, 418, 'The small details, settled.'),
    c(418, 498, 'Briefs sent to 8 creators.'),
    c(498, 579, 'Drafts arrive on their own.'),
    c(579, 707, 'Each draft checked against the brief.'),
    c(707, 771, 'Same standard, every draft.'),
    c(771, 852, 'Approve is final.'),
    c(852, 1012, 'Changes requested, with reasons.'),
    c(1012, 1157, 'Two more, sent back.'),
    c(1157, 1286, 'Revised. Every draft approved.'),
  ],
};

/** 9:16 only: small kicker above the big counter. */
export const KICKER_916 = { a: 1170, b: 1280, text: 'Revised.' } as const;

export const HOOK_TEXT: Record<Format, { readonly text: string; readonly accent: number }> = {
  '916': { text: 'Would you approve this?', accent: 2 },
  '45': { text: 'Would you approve this draft?', accent: -1 },
};
