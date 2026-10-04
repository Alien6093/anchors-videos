// Film B copy of audio-common/cues-lib.mjs (v2): also accepts film-local one-shots. Kept separate so audio-common (shared with film A) is untouched.
// Cue-list builder: collects SFX and music cues, validates them against the script's key-cue frames (30 fps),
// copies the used one-shots into <film>/sfx, and writes sfx-cues.json + cue sheet (.md and .csv).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FPS = 30, BEAT = 60 / 112;
const COMMON_SFX = path.join(path.dirname(fileURLToPath(import.meta.url)), '../audio-common/sfx');
export const linspace = (a, b, n) => Array.from({ length: n }, (_, i) => (n === 1 ? a : a + ((b - a) * i) / (n - 1)));

export function makeCues(filmName, filmDir) {
  const sfx = [], music = [];
  return {
    // at = the moment the sound should be HEARD (transient); lead = seconds of file before its transient.
    cue(file, at, volume, pan, { event, tier, frame, lead = 0 }) {
      sfx.push({ file: `sfx/${file}.wav`, time: +(at - lead).toFixed(4), at: +at.toFixed(4), volume, pan, event, tier, frame, name: file });
    },
    music(at, event, sound, frame) { music.push({ at, event, sound, frame }); },
    finish() {
      const errors = [];
      const rows = [...sfx.map((c) => ({ ...c, kind: 'SFX' })), ...music.map((m) => ({ ...m, kind: 'MUSIC', tier: '-', volume: '', name: m.sound }))]
        .sort((a, b) => a.at - b.at || (a.kind < b.kind ? -1 : 1));
      for (const r of rows) {
        r.fr = Math.round(r.at * FPS);
        r.dev = r.frame == null ? null : r.fr - r.frame;
        if (r.dev != null && Math.abs(r.dev) > 1) errors.push(`${r.event}: ${r.at}s = frame ${r.fr}, script ${r.frame}`);
        const off = ((r.at / BEAT) % 0.5); const d = Math.min(off, 0.5 - off) * BEAT;
        r.gridMs = Math.round(d * 1000);
      }
      fs.mkdirSync(path.join(filmDir, 'sfx'), { recursive: true });
      for (const c of sfx) {
        // v2: film-local one-shots (rendered by sfx-v2.mjs straight into <film>/sfx) are used in place when no shared one exists
        const shared = path.join(COMMON_SFX, `${c.name}.wav`);
        const local = path.join(filmDir, 'sfx', `${c.name}.wav`);
        if (fs.existsSync(shared)) fs.copyFileSync(shared, local);
        else if (!fs.existsSync(local)) errors.push(`missing sfx ${c.name}`);
      }
      const json = sfx.sort((a, b) => a.time - b.time).map(({ file, time, volume, pan }) => ({ file, time, volume, pan }));
      fs.writeFileSync(path.join(filmDir, 'sfx-cues.json'), JSON.stringify(json, null, 2));
      const head = ['time_s', 'frame_30fps', 'beat', 'kind', 'tier', 'event', 'sound', 'volume', 'script_frame', 'delta_frames', 'off_half_beat_ms'];
      const line = (r) => [r.at.toFixed(3), r.fr, (r.at / BEAT).toFixed(2), r.kind, r.tier, r.event, r.name, r.volume, r.frame ?? '', r.dev ?? '', r.gridMs];
      fs.writeFileSync(path.join(filmDir, `${filmName}_cue_sheet.csv`), [head, ...rows.map(line)].map((l) => l.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n'));
      const md = [`# Film ${filmName} cue sheet (60.000 s, 112 BPM, 30 fps)`, '',
        'time = the moment the sound is heard (a transient with a lead-in is placed early so its hit lands here). script_frame = key-cue frame from the BUILD SPEC; delta = frame(time) - script_frame (must be within +/-1). Tiers: T1 loud, T2 subtle; T3 (ticks) cut.', '',
        `| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${line(r).join(' | ')} |`)].join('\n');
      fs.writeFileSync(path.join(filmDir, `${filmName}_cue_sheet.md`), md + '\n');
      const checked = rows.filter((r) => r.dev != null);
      console.log(`cues: ${sfx.length} sfx + ${music.length} music rows; ${checked.length} checked against script frames, max |delta| ${Math.max(0, ...checked.map((r) => Math.abs(r.dev)))} frames`);
      if (errors.length) { console.error('CUE ERRORS:\n' + errors.join('\n')); process.exit(1); }
    },
  };
}
