#!/bin/bash
# full pipeline: node music.mjs; sfx; mix 916; master 916; analyze  (set PARTS=... to skip)
cd "$(dirname "$0")"
node music.mjs >/dev/null && node sfx.mjs >/dev/null && node mix.mjs 916 && node master.mjs 916 -14 ${CLIP:-0.85} | tail -2 && python3 analyze.py 916 | python3 -c "
import json,sys; r=json.load(sys.stdin); print({k:r[k] for k in ['I','LRA','TP_decoded','phone_drop','shares','first_half_sec','crest_master','crest_decoded','hook_hit_phone_db','ST_min_after_3s']})"
