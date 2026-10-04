// Film B copy of audio-common/engine.mjs (v4): identical except film.LEVEL_PIN (optional {anchorIndex: logGain}) lets a section keep a fixed auto-level gain,
// and env ANCHOR_DUMP=<file> dumps the computed per-section log gains. Kept separate so audio-common (shared with film A) is untouched.
// Shared score renderer for the 60 s films (A and B). Same voices, buses, sidechain, reverb/delay and
// section auto-levelling as the v4 150 s score; everything film-specific comes from a `film` object.
import fs from 'node:fs';
import { SR, Stereo, addMono, addStereo, reverb, pingPong, SVF, mtof, writeWav, peakOf, rng } from '../audio-common/lib.mjs';
import * as V from '../audio-common/voices.mjs';

export const BPM = 112;
export const BEAT = 60 / BPM;
export const STEP = BEAT / 4;
export const BAR = BEAT * 4;
export const bt = (n) => n * BEAT;

// Voice-led chord table (A minor family, C major for A's payment scene)
export const CHORDS = {
  Am: { root: 33, arp: [57, 60, 64, 67] }, F: { root: 29, arp: [57, 60, 65, 69] }, C: { root: 36, arp: [55, 60, 64, 67] },
  G: { root: 31, arp: [55, 59, 62, 67] }, Em: { root: 28, arp: [55, 59, 64, 67] }, E: { root: 28, arp: [56, 59, 64, 68] },
  Dm: { root: 38, arp: [57, 62, 65, 69] }, Cmaj: { root: 36, arp: [55, 59, 64, 71] }, Fmaj: { root: 29, arp: [57, 60, 64, 69] },
  Am9: { root: 33, arp: [57, 60, 64, 71] },
};
export const tonesOf = (name) => { const a = CHORDS[name].arp; return [a[1] + 12, a[2] + 12, a[3] + 12, a[1] + 24]; };
export const ENERGY_DB = { 2: -25, 3: -22.5, 4: -20.5, 5: -18.5, 6: -16.5, 7: -15, 8: -13.5, 9: -12.8, 10: -11, dip: -24 };
export const SCALE = [69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88];
export const R = (t0, t1, o) => ({ t0, t1, ...o });

export function renderMusic(film, outFile) {
  const { DUR, TAIL = 3 } = film;
  const stems = Object.fromEntries(['drums', 'bass', 'pad', 'pluck', 'mallet', 'stab', 'fx', 'tail'].map((k) => [k, new Stereo(DUR + TAIL)]));
  const kicks = [];
  const rand = rng(film.seed ?? 12345);
  const mono = (stem, buf, t, g, pan) => addMono(stems[stem], buf, t, g, pan);
  const secAt = (t) => { let o = {}; for (const s of film.SECS) if (t >= s.t0 - 1e-6 && t < s.t1 - 1e-6) o = s; return o; };
  const chordAt = (t) => {
    for (const [a, b, c] of film.OVERRIDES ?? []) if (t >= a - 1e-6 && t < b - 1e-6) return c;
    let c = film.PROG[0][1];
    for (const [beat, name] of film.PROG) if (t + 1e-6 >= bt(beat)) c = name;
    return c;
  };
  const roll = (a, b, i0, i1, v0, v1, g = 0.55, stem = 'drums') => {
    let t = a, i = 0;
    while (t < b - 0.005) { const p = (t - a) / (b - a); mono(stem, V.snare(v0 + (v1 - v0) * p, 100 + i++), t, g, 0); t += i0 * (i1 / i0) ** p; }
  };
  const st = film.style;

  for (let s = 0; s * STEP < DUR - 1e-6; s++) {
    const t = s * STEP, p = s % 16, barIdx = Math.floor(s / 16);
    const sec = secAt(t), chord = chordAt(t), root = CHORDS[chord].root, arp = CHORDS[chord].arp;
    const v = sec.vel ?? 1, hum = 0.9 + rand() * 0.2;

    let k = 0;
    if (sec.kick === 1) k = st.kickHalf.includes(p) ? 0.75 : 0;
    else if (sec.kick >= 2) k = st.kickFour.includes(p) ? 0.95 : sec.kick === 3 && p === st.ghost ? 0.5 : 0;
    if (k) { kicks.push(t); mono('drums', V.kick(k * v, s), t, 0.95, 0); }

    if (sec.hat === 1 && p % 4 === 2) mono('drums', V.brush(0.55 * hum, s), t, 0.5, 0.25);
    else if (sec.hat === 2 && p % 2 === 0) mono('drums', V.hat((p % 4 === 2 ? 0.8 : 0.35) * hum, false, s), t, 0.42, p % 4 ? -0.3 : 0.3);
    else if (sec.hat === 3) {
      if (p % 8 === 6 && barIdx % 2 === st.openHatBarParity) mono('drums', V.hat(0.9, true, s), t, 0.6, 0.3);
      else mono('drums', V.hat((p % 4 === 2 ? 1 : p % 2 === 0 ? 0.55 : 0.35) * hum, false, s), t, 0.45, p % 2 ? -0.3 : 0.3);
    }
    if (sec.clap && p % 8 === 4) {
      mono('drums', V.clap(1, s), t, sec.clap, 0.05);
      if (sec.snare) mono('drums', V.snare(0.8, s), t, 0.45, 0);
    }
    if (sec.clap >= 0.5 && barIdx % 4 === 3 && p >= 13) mono('drums', V.snare(0.3 + (p - 13) * 0.15, s), t, 0.4, 0);

    const b = sec.bass;
    const bass = (n, dur, vel, saw = 0.45) => {
      mono('bass', V.subNote(mtof(n), dur, 0.9 * vel), t, 0.8);
      if (saw) mono('bass', V.bassSaw(mtof(n + 12), dur, 0.5 * vel, 900), t, saw);
    };
    if (b === 'pulse') { if (p % 4 === 0) bass(root, 0.28, 0.9, 0); }
    else if (b === 'sub') { if (p === 0 && !sec.subSkip) bass(root, BAR * 0.97, 0.9, 0); }
    else if (b === 1) { if (p === 0) bass(root, STEP * 14, 0.85 * v, 0); }
    else if (b === 1.5) { const h = st.bassSparse[p]; if (h) bass(root + h[0], h[1] * STEP * 0.95, 0.9 * v); }
    else if (b === 2) { const h = st.bassGroove[p]; if (h) bass(root + h[0], h[1] * STEP * 0.95, v); }
    else if (b === 'walk') { const h = st.bassWalk[p]; if (h) bass(root + h[0], h[1] * STEP * 0.95, 0.95 * v); }

    if (sec.click && p % 2 === 0) mono('fx', V.rim(0.7, s), t, 0.5, p % 4 ? 0.3 : -0.3);

    const pl = sec.pluck;
    const seqPl = (arr, i) => arp[arr[i % arr.length]] + 12;
    if (pl === 'arp' && p % 2 === 0) {
      const seq = [0, 1, 2, 3, 4, 3, 2, 1][(p / 2) % 8];
      mono('pluck', V.pluck(mtof([57, 60, 64, 67, 69][Math.min(seq, 4)] + 12), 0.8 * (p % 4 ? 0.8 : 1)), t, 0.6, p % 4 ? 0.25 : -0.25);
    } else if (pl === 1 && p % 2 === 0) {
      mono('pluck', V.pluck(mtof(seqPl(st.pluckQuiet, p / 2)), 0.6), t, 0.6, p % 4 ? 0.25 : -0.25);
    } else if (pl === 2 && p % 2 === 0) {
      mono('pluck', V.pluck(mtof(seqPl(st.pluck8, p / 2)), v * (p % 4 ? 0.6 : 0.8)), t, 0.6, p % 4 ? 0.25 : -0.25);
    } else if (pl === 3) {
      mono('pluck', V.pluck(mtof(seqPl(st.pluck16, p)), v * (p % 2 ? 0.5 : 0.85), 0.25), t, 0.55, p % 2 ? 0.3 : -0.3);
    }

    const mp = st.melPattern(sec.mel, barIdx);
    if (mp && p % 2 === 0) {
      const idx = mp[(p / 2) % 8];
      if (idx >= 0) {
        const n = tonesOf(chord)[idx];
        const vel = (sec.mel === 'resolve' ? 0.8 : sec.mel === 1 ? 0.8 : 0.95) * (idx === 3 ? 0.9 : 1);
        mono('mallet', V.marimba(mtof(n), vel), t, 0.6, (p / 2) % 2 ? 0.35 : -0.35);
        if (sec.oct) mono('mallet', V.marimba(mtof(n + 12), vel * 0.4, 0.5), t, 0.4, (p / 2) % 2 ? -0.4 : 0.4);
      }
    }
    if (sec.mel === 'climb') {
      const prog = (t - sec.t0) / (sec.t1 - sec.t0);
      const n = SCALE[Math.min(SCALE.length - 1, Math.round(prog * (SCALE.length - 1)))];
      mono('mallet', V.marimba(mtof(n), 0.8 + 0.25 * prog, 0.6), t, 0.6, p % 2 ? 0.3 : -0.3);
    }
    if (sec.stabs && (p === 0 || p === 10)) mono('stab', V.stab(arp.map((n) => mtof(n + 12)), p ? 0.6 : 0.85, 0.5), t, 0.5, 0);
    if (sec.glass && (sec.glass === 2 || p % 2 === 0)) {
      const idx = [0, 2, 1, 3, 2, 3, 1, 2][(p / (sec.glass === 2 ? 1 : 2)) % 8];
      const glassy = [[1, 1, 1.0], [2.02, 0.3, 0.55], [3.98, 0.12, 0.3]];
      const prog = Math.min(1, Math.max(0, (t - film.glassStart) / (film.glassEnd - film.glassStart)));
      mono('stab', V.bell(mtof(tonesOf(chord)[idx % 4]), 1.3, 0.32 * (0.6 + 0.4 * prog), glassy), t, 0.55, p % 4 ? 0.4 : -0.4);
    }
  }

  // film-specific one-offs: intro, rolls, impacts, end card
  film.events({ mono, roll, stems, V, mtof, kicks, rand, BEAT, BAR, bt, secAt, chordAt });

  // pads: one voice-led chord per segment, merged across same-chord segments
  {
    const barLines = Array.from({ length: Math.ceil(DUR / BAR) + 1 }, (_, i) => +(i * BAR).toFixed(4));
    const chordLines = film.PROG.map(([b]) => +bt(b).toFixed(4));
    const brk = film.PAD_BREAKS.map((x) => +x.toFixed(4));
    const cuts = [...new Set([...barLines, ...chordLines, ...brk, DUR])].filter((x) => x <= DUR).sort((a, b) => a - b);
    const forced = new Set(brk);
    const segs = [];
    for (let i = 0; i < cuts.length - 1; i++) {
      const a = cuts[i], bEnd = cuts[i + 1], mid = (a + bEnd) / 2, sec = secAt(mid), ch = chordAt(mid);
      if (!sec.pad || a >= film.padEnd) continue;
      const prev = segs[segs.length - 1];
      if (prev && !forced.has(a) && prev.chord === ch && prev.pad === sec.pad && prev.cut === (sec.padCut ?? 1800) && Math.abs(prev.t1 - a) < 1e-3) prev.t1 = bEnd;
      else segs.push({ t0: a, t1: bEnd, chord: ch, pad: sec.pad, cut: sec.padCut ?? 1800, atk: sec.padAtk ?? 0.7 });
    }
    segs.forEach((g, i) => {
      const rel = secAt(g.t1 + 0.01).pad ? 0.9 : 0.12;
      const notes = [CHORDS[g.chord].root + 12, ...CHORDS[g.chord].arp].map(mtof);
      mono('pad', V.pad(notes, g.t1 - g.t0 + 0.05, g.pad, g.cut, g.atk, rel, i), g.t0, 0.42, 0);
    });
  }
  film.padExtras?.({ mono, V, mtof });

  // typing duck on pluck (-3 dB)
  for (const [a, b] of film.TYPING ?? []) {
    for (let i = Math.round(a * SR); i < Math.min(stems.pluck.n, Math.round(b * SR)); i++) { stems.pluck.L[i] *= 0.708; stems.pluck.R[i] *= 0.708; }
  }
  // rising-filter sweeps on pad / pluck / mallet
  for (const name of ['pad', 'pluck', 'mallet']) {
    for (const [a, b, f0, f1] of film.SWEEPS) {
      for (const ch of [stems[name].L, stems[name].R]) {
        const f = new SVF();
        for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) {
          const p = (i / SR - a) / (b - a);
          f.run(ch[i], f0 * (f1 / f0) ** p, 0.9);
          ch[i] = f.lp;
        }
      }
    }
  }
  // kick sidechain
  const duck = new Float32Array(stems.pad.n).fill(1);
  for (const tk of kicks) {
    const i0 = Math.round(tk * SR);
    for (let i = i0; i < Math.min(duck.length, i0 + 0.4 * SR); i++) { const g = 1 - 0.55 * Math.exp(-((i - i0) / SR) / 0.11); if (g < duck[i]) duck[i] = g; }
  }
  for (const [name, amt] of [['pad', 1], ['bass', 0.8], ['pluck', 0.5]]) {
    const s = stems[name];
    for (let i = 0; i < s.n; i++) { const g = 1 - (1 - duck[i]) * amt; s.L[i] *= g; s.R[i] *= g; }
  }

  // buses + reverb + delay
  const sum = new Stereo(DUR + TAIL), send = new Stereo(DUR + TAIL), dsend = new Stereo(DUR + TAIL);
  const busGain = { drums: 1.0, bass: 1.0, pad: 0.85, pluck: 0.8, mallet: 0.9, stab: 0.8, fx: 0.8, tail: 1.0 };
  const revAmt = { drums: 0.05, bass: 0, pad: 0.5, pluck: 0.3, mallet: 0.4, stab: 0.4, fx: 0.25, tail: 0.5 };
  const sumT = new Stereo(DUR + TAIL); // 'tail' stem (drum tail-outs) can bypass the near-silence gate
  for (const [name, s] of Object.entries(stems)) {
    if (name === 'tail' && film.tailBypass) { addStereo(sumT, s, 0, busGain[name]); addStereo(sumT, reverb(Object.assign(new Stereo(DUR + TAIL), { L: s.L, R: s.R }), { decay: 0.8, damp: 0.4, size: 1.2 }), 0, 0.3); continue; }
    addStereo(sum, s, 0, busGain[name]); addStereo(send, s, 0, revAmt[name]);
  }
  addStereo(dsend, stems.mallet, 0, 0.35); addStereo(dsend, stems.pluck, 0, 0.25); addStereo(dsend, stems.stab, 0, 0.25);
  addStereo(sum, reverb(send, { decay: 0.86, damp: 0.4, pre: 0.015, size: 1.4 }), 0, 0.75);
  addStereo(sum, pingPong(dsend, BEAT * 0.75, 0.38, 3200), 0, 0.7);

  // auto-level each section to the energy map, gates, room tone, tone shaping
  const nOut = Math.round(DUR * SR);
  const mid = (i) => (sum.L[i] + sum.R[i]) * 0.5;
  const anchors = [];
  film.LEVELS.forEach(([a, b, e], k) => {
    let s = 0, c = 0;
    for (let i = Math.round((a + 0.3) * SR); i < Math.round((b - 0.1) * SR); i++) { s += mid(i) ** 2; c++; }
    const rms = Math.sqrt(s / Math.max(1, c)) || 1e-6;
    const lg = film.LEVEL_PIN?.[k] ?? Math.log(10 ** (ENERGY_DB[e] / 20) / rms);
    anchors.push([a + 0.25, lg], [b - 0.25, lg]);
  });
  if (process.env.ANCHOR_DUMP) fs.writeFileSync(process.env.ANCHOR_DUMP, JSON.stringify(anchors.filter((_, i) => i % 2 === 0).map(([, g]) => g)));
  const levelAt = (t) => {
    if (t <= anchors[0][0]) return Math.exp(anchors[0][1]);
    for (let k = 1; k < anchors.length; k++) if (t <= anchors[k][0]) { const [a, ga] = anchors[k - 1], [b, gb] = anchors[k]; return Math.exp(ga + ((gb - ga) * (t - a)) / Math.max(1e-6, b - a)); }
    return Math.exp(anchors[anchors.length - 1][1]);
  };
  const room = rng(777);
  let rl = 0, rr = 0;
  const out = new Stereo(DUR);
  let hpL = 0, hpR = 0;
  const hpk = Math.exp((-2 * Math.PI * 28) / SR);
  for (let i = 0; i < nOut; i++) {
    const t = i / SR;
    let g = film.gate(t) * levelAt(t);
    if (t < 0.02) g *= t / 0.02;
    const tg = film.tailBypass ? levelAt(t) * (film.tailGain ?? 0.3) : 0;
    let l = sum.L[i] * g + sumT.L[i] * tg, r = sum.R[i] * g + sumT.R[i] * tg;
    hpL = hpk * hpL + (1 - hpk) * l; hpR = hpk * hpR + (1 - hpk) * r;
    l -= hpL; r -= hpR;
    out.L[i] = Math.tanh(l * 1.15) / 1.15;
    out.R[i] = Math.tanh(r * 1.15) / 1.15;
    const rt = film.roomTone(t);
    if (rt > 0) { rl += 0.05 * ((room() * 2 - 1) - rl); rr += 0.05 * ((room() * 2 - 1) - rr); out.L[i] += rl * 0.012 * rt; out.R[i] += rr * 0.012 * rt; }
  }
  out.L[nOut - 1] = 0; out.R[nOut - 1] = 0;
  const pk = peakOf(out.L, out.R);
  const scale = 0.85 / pk;
  for (let i = 0; i < nOut; i++) { out.L[i] *= scale; out.R[i] *= scale; }
  writeWav(outFile, out.L, out.R, 24);
  console.log('music rendered, peak', pk.toFixed(3), 'samples', nOut, 'kicks', kicks.length);
}

export const ramp = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
