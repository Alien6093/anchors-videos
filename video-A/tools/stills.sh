#!/bin/bash
# usage: stills.sh frame...
cd "$(dirname "$0")/.."
for fr in "$@"; do
  npx remotion still src/index.ts BriefReviewApprove out/qa/f$(printf %04d $fr).png --frame=$fr --log=error >/dev/null 2>&1 &
  while [ $(jobs -r | wc -l) -ge 4 ]; do sleep 0.5; done
done
wait
