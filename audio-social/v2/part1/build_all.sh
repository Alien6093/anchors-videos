#!/bin/bash
# Part 1 audio, full rebuild (run from anywhere). Output in out/. Cue gains / bus gains: cues.mjs, build/mixcfg.json.
cd "$(dirname "$0")"
node ../render-anchor.mjs                      # anchor-motif.wav (shared reference)
node music.mjs && node sfx.mjs                 # raw layer buses (build/*.f32)
node mix.mjs 916 && node mix.mjs 45            # kick sidechain, energy curve, holes, ducks
CREST=9.85 node master.mjs 916 -14 0.85        # master + AAC 320k round-trip loop (decoded file measured)
CREST=11 node master.mjs 45 -15 0.85
./stems.sh && node cuesheet.mjs
python3 analyze.py 916 && python3 analyze.py 45
