// Data layer: everything is derived from timeline.json at bundle time, so
// script revisions (new times, focus rects, callouts) flow through untouched.
import raw from './timeline.json';
import {
  FPS,
  MAX_ZOOM,
  SRC_H_CLEAN,
  SRC_W,
  TRANS_FRAMES,
  VIEW,
  W,
  H,
} from './theme';

export type Rect = {x: number; y: number; w: number; h: number};
export type Key = Rect & {at: number};
export type Click = {t: number; x: number; y: number};
export type RawShot = {
  id: string;
  tIn: number;
  tOut: number;
  src: 1 | 2 | 3;
  srcIn: number;
  srcOut: number;
  freeze: boolean;
  chapter: number | null;
  focus: Key[];
  callout: string | null;
  // single rect, or keyframes [{at,x,y,w,h}] eased like focus
  callTarget: Rect | Key[] | null;
  // optional visibility window for highlight/mask, fractions of the shot
  callWin?: [number, number];
  // optional callout placement override (default 'auto')
  calloutAt?: 'auto' | 'below' | 'above' | 'bottom' | 'top';
  clicks: Click[];
  transition: string;
};
export type Chapter = {n: number; title: string; tIn: number; tOut: number};
export type EndCardData = {
  tIn: number;
  tOut: number;
  text: string;
  logoSource: {src: 1 | 2 | 3; t: number} & Rect;
};

export type Shot = Omit<RawShot, 'callTarget' | 'callWin'> & {
  callTarget: Key[] | null; // normalised to keyframes
  callWin: [number, number];
  index: number;
  from: number; // first output frame
  dur: number; // frames
  rate: number; // source seconds per output second
  isHook: boolean;
  isBig: boolean;
  transIn: number; // frames of incoming transition (overlap with previous)
  tail: number; // frames this shot is held (frozen) under the next shot's transition
};

const data = raw as unknown as {
  fps: number;
  durationSec: number;
  chapters: Chapter[];
  shots: RawShot[];
  endCard: EndCardData;
};

export const TOTAL_FRAMES = Math.round(data.durationSec * FPS);
export const chapters: Chapter[] = data.chapters;
export const endCard: EndCardData = data.endCard;

export const f = (sec: number) => Math.round(sec * FPS);

// "Big moments" get extra treatment (slower push, red glowing callout,
// sparkle, bounce). Detected from the callout text, so it follows revisions.
const BIG_RE = /matched|activated|approved|sentiment/i;

const sorted = [...data.shots].sort((a, b) => a.tIn - b.tIn);

export const shots: Shot[] = sorted.map((s, i) => {
  const from = f(s.tIn);
  const dur = Math.max(1, f(s.tOut) - from);
  const isHook = s.chapter === null && s.tIn < (chapters[0]?.tIn ?? 5);
  const transIn = i === 0 ? TRANS_FRAMES.fade : TRANS_FRAMES[s.transition] ?? 0;
  const ct = s.callTarget;
  const callTarget: Key[] | null = !ct
    ? null
    : Array.isArray(ct)
      ? ct.length
        ? [...ct].sort((a, b) => a.at - b.at)
        : null
      : [{at: 0, ...ct}];
  const win = s.callWin && s.callWin.length === 2 ? s.callWin : [0, 1];
  return {
    ...s,
    callTarget,
    callWin: [Math.max(0, Math.min(1, win[0])), Math.max(0, Math.min(1, win[1]))] as [number, number],
    focus: [...s.focus].sort((a, b) => a.at - b.at),
    index: i,
    from,
    dur,
    rate: s.freeze ? 0 : (s.srcOut - s.srcIn) / (s.tOut - s.tIn),
    isHook,
    isBig: !!s.callout && BIG_RE.test(s.callout) && !isHook,
    transIn: Math.min(transIn, Math.floor(dur / 2)),
    tail: 0,
  };
});
// tail = next shot's incoming transition (the end card dissolves over 12 f)
shots.forEach((s, i) => {
  const next = shots[i + 1];
  s.tail = next ? next.transIn : 12;
});

export const shotAt = (frame: number) =>
  shots.find((s) => frame >= s.from && frame < s.from + s.dur) ?? null;

/** Source time (seconds) shown at local frame of a shot. Frames beyond the
 * shot's duration (transition tails) hold its last frame. */
export const sourceTime = (s: Shot, local: number) => {
  if (s.freeze) return s.srcIn;
  const l = Math.min(Math.max(local, 0), s.dur - 1);
  return s.srcIn + (l / FPS) * s.rate;
};

// ---------- camera ----------
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const focusAt = (s: Shot, p: number): Rect => interpKeys(s.focus, p);

/** Eased keyframe interpolation shared by focus and callTarget. */
export const interpKeys = (k: Key[], p: number): Rect => {
  if (k.length === 1 || p <= k[0].at) return k[0];
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i];
    const b = k[i + 1];
    if (p <= b.at) {
      const e = easeInOutCubic(clamp01((p - a.at) / Math.max(1e-6, b.at - a.at)));
      return {
        x: lerp(a.x, b.x, e),
        y: lerp(a.y, b.y, e),
        w: lerp(a.w, b.w, e),
        h: lerp(a.h, b.h, e),
      };
    }
  }
  return k[k.length - 1];
};

export type Cam = {s: number; tx: number; ty: number};

const rawCamera = (s: Shot, local: number): Cam => {
  const l = Math.min(Math.max(local, 0), s.dur - 1);
  const p = s.dur > 1 ? l / (s.dur - 1) : 0;
  const r = focusAt(s, p);
  const vw = VIEW.right - VIEW.left;
  const vh = VIEW.bottom - VIEW.top;
  let scale = Math.min(vw / r.w, vh / r.h);
  // slow push for life; more on hero moments
  const pushAmt = s.isHook ? 0.07 : s.isBig ? 0.07 : 0.025;
  scale *= 1 + pushAmt * Math.sin((p * Math.PI) / 2);
  // hook: zoom-punch on entry
  if (s.isHook) scale *= 1 + 0.14 * (1 - easeOutCubic(clamp01(l / 9)));
  scale = Math.min(scale, MAX_ZOOM);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  let tx = (VIEW.left + VIEW.right) / 2 - cx * scale;
  let ty = (VIEW.top + VIEW.bottom) / 2 - cy * scale;
  // keep the frame covered by real footage whenever the zoom allows it
  const vwS = SRC_W * scale;
  const vhS = SRC_H_CLEAN * scale;
  if (vwS >= W) tx = Math.min(0, Math.max(W - vwS, tx));
  else tx = (W - vwS) / 2;
  if (vhS >= H) ty = Math.min(0, Math.max(H - vhS, ty));
  else ty = (H - vhS) / 2;
  // ...but the focus rect always wins: it must stay inside the view area
  // (the blurred fill covers any edge this exposes).
  const clampTo = (v: number, lo: number, hi: number) =>
    lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v));
  tx = clampTo(tx, VIEW.right - (r.x + r.w) * scale, VIEW.left - r.x * scale);
  ty = clampTo(ty, VIEW.bottom - (r.y + r.h) * scale, VIEW.top - r.y * scale);
  return {s: scale, tx, ty};
};

const CARRY = 10; // frames of camera continuity across same-source cuts

/** Final camera for a shot at a local frame (used by video, mask, clicks). */
export const camera = (s: Shot, local: number): Cam => {
  const c = rawCamera(s, local);
  const prev = shots[s.index - 1];
  if (
    prev &&
    !s.isHook &&
    !prev.isHook &&
    s.transition === 'cut' &&
    prev.src === s.src &&
    local < CARRY
  ) {
    const c0 = rawCamera(prev, prev.dur - 1);
    const ratio = Math.max(c.s / c0.s, c0.s / c.s);
    if (ratio < 1.6) {
      const e = easeOutCubic(clamp01((local + 1) / CARRY));
      const sc = Math.exp(lerp(Math.log(c0.s), Math.log(c.s), e));
      // interpolate the source point under the view centre, re-derive t
      const vcx = W / 2;
      const vcy = (VIEW.top + VIEW.bottom) / 2;
      const p0x = (vcx - c0.tx) / c0.s;
      const p0y = (vcy - c0.ty) / c0.s;
      const p1x = (vcx - c.tx) / c.s;
      const p1y = (vcy - c.ty) / c.s;
      const px = lerp(p0x, p1x, e);
      const py = lerp(p0y, p1y, e);
      return {s: sc, tx: vcx - px * sc, ty: vcy - py * sc};
    }
  }
  return c;
};

export const mapRect = (c: Cam, r: Rect): Rect => ({
  x: r.x * c.s + c.tx,
  y: r.y * c.s + c.ty,
  w: r.w * c.s,
  h: r.h * c.s,
});

// ---------- highlight target ----------
const FADE = 6; // frames

/** Target rect (source px) at a local frame, or null if the shot has none. */
export const targetAt = (s: Shot, local: number): Rect | null => {
  if (!s.callTarget) return null;
  const l = Math.min(Math.max(local, 0), s.dur - 1);
  return interpKeys(s.callTarget, s.dur > 1 ? l / (s.dur - 1) : 0);
};

/** Highlight/mask opacity (0..1) at a local frame, honouring callWin.
 * A window starting at 0 is fully on from the shot's first frame; a window
 * ending at 1 holds to the cut. Interior edges fade over ~6 frames. */
export const targetOpacity = (s: Shot, local: number): number => {
  if (!s.callTarget || s.isHook) return 0;
  if (local >= s.dur) return 0;
  const a = s.callWin[0] * s.dur;
  const b = s.callWin[1] * s.dur;
  if (b - a < 1) return 0;
  const fade = Math.max(2, Math.min(FADE, Math.floor((b - a) / 3)));
  let o = 1;
  if (s.callWin[0] > 0) o = Math.min(o, (local - a) / fade);
  else if (local < 0) o = 0;
  if (s.callWin[1] < 1) o = Math.min(o, (b - local) / fade);
  return Math.max(0, Math.min(1, o));
};

// ---------- callouts ----------
export type CalloutSeg = {
  text: string;
  from: number;
  to: number;
  big: boolean;
  shot: Shot;
  // pill placement (screen px): horizontal centre and top edge
  cx: number;
  top: number;
  // which side it enters from
  dir: 1 | -1;
};

const PILL_H = 92;
const PILL_SAFE = {top: 118, bottom: 1000}; // below the step chip, above the progress bar
const pillWidth = (text: string, big: boolean) =>
  text.length * (big ? 48 : 40) * 0.56 + (big ? 80 : 90);

type Box = {x0: number; y0: number; x1: number; y1: number};
const overlaps = (a: Box, b: Box) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

export const callouts: CalloutSeg[] = (() => {
  const out: CalloutSeg[] = [];
  shots.forEach((s, i) => {
    if (!s.callout || s.isHook) return;
    const start = s.from + Math.max(3, s.transIn);
    let end = s.from + s.dur;
    // carry through following shots without a callout (same chapter)
    for (let j = i + 1; j < shots.length; j++) {
      const n = shots[j];
      if (n.callout || n.chapter !== s.chapter) break;
      end = Math.min(n.from + n.dur, s.from + s.dur + f(2.2));
      if (end < n.from + n.dur) break;
    }
    const nextStart = shots.slice(i + 1).find((n) => n.callout)?.from ?? Infinity;
    end = Math.max(end, Math.min(start + f(1.3), nextStart));

    // Everything the pill must not cover, sampled over the frames it is on
    // screen: highlighted targets (where visible) and click points.
    const avoid: Box[] = [];
    for (let fr = start; fr < end; fr += 3) {
      const sh = shots.find((n) => fr >= n.from && fr < n.from + n.dur);
      if (!sh) continue;
      const local = fr - sh.from;
      const cam = camera(sh, local);
      const t = targetAt(sh, local);
      if (t && targetOpacity(sh, local) > 0.05) {
        const r = mapRect(cam, t);
        avoid.push({x0: r.x - 16, y0: r.y - 16, x1: r.x + r.w + 16, y1: r.y + r.h + 16});
      }
      for (const c of sh.clicks) {
        const x = c.x * cam.s + cam.tx;
        const y = c.y * cam.s + cam.ty;
        avoid.push({x0: x - 60, y0: y - 50, x1: x + 60, y1: y + 50});
      }
    }
    const pw = pillWidth(s.callout, s.isBig);
    const clampCx = (cx: number) => Math.min(W - 40 - pw / 2, Math.max(40 + pw / 2, cx));
    const boxAt = (cx: number, top: number): Box => ({x0: cx - pw / 2, y0: top, x1: cx + pw / 2, y1: top + PILL_H});

    // candidates, best first: next to the target (below, then above),
    // then the bottom band, then the top band
    type Cand = {cx: number; top: number; dir: 1 | -1; kind: string};
    const cands: Cand[] = [];
    const t0 = targetAt(s, Math.max(0, start - s.from));
    if (t0) {
      const r = mapRect(camera(s, Math.max(0, start - s.from)), t0);
      const cx = clampCx(r.x + r.w / 2);
      const u = avoid.filter((b) => b.x1 - b.x0 > 140); // target boxes only
      const yb = Math.max(...u.map((b) => b.y1), r.y + r.h + 16) + 10;
      const ya = Math.min(...u.map((b) => b.y0), r.y - 16) - 10 - PILL_H;
      cands.push({cx, top: yb, dir: 1, kind: 'below'}, {cx, top: ya, dir: -1, kind: 'above'});
    }
    cands.push(
      {cx: W / 2, top: PILL_SAFE.bottom - PILL_H, dir: 1, kind: 'bottom'},
      {cx: W / 2, top: 30, dir: -1, kind: 'top'},
    );
    const valid = (c: {cx: number; top: number}) =>
      (c.top >= PILL_SAFE.top || (c.top === 30 && c.cx === W / 2)) && c.top + PILL_H <= PILL_SAFE.bottom;
    const cost = (c: {cx: number; top: number}) => {
      const b = boxAt(c.cx, c.top);
      return avoid.filter((a) => overlaps(a, b)).length;
    };
    const forced = s.calloutAt && s.calloutAt !== 'auto' ? cands.find((c) => c.kind === s.calloutAt) : undefined;
    let best = forced ?? cands.find((c) => valid(c) && cost(c) === 0);
    if (!best) best = [...cands].filter(valid).sort((a, b) => cost(a) - cost(b))[0];
    out.push({text: s.callout, from: start, to: end, big: s.isBig, shot: s, cx: best.cx, top: best.top, dir: best.dir});
  });
  return out;
})();

export const firstChapterFrame = f(chapters[0]?.tIn ?? 5);
