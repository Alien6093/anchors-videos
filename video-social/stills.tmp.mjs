import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import fs from 'fs';
const root = '/Users/adityasingh/anchors video/video-social';
const S = '/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/social1';
const url = await bundle({ entryPoint: root + '/src/stage1/entry.tsx', publicDir: root + '/public' });
const items = fs.readFileSync(S + '/list.txt', 'utf8').trim().split('\n').map((l) => l.split(' '));
for (const [fm, fr] of items) {
  const comp = await selectComposition({ serveUrl: url, id: 'Stage1-' + fm });
  await renderStill({ composition: comp, serveUrl: url, frame: Number(fr), output: `${S}/${fm}_${fr.padStart(4, '0')}.png`, logLevel: 'error' });
}
console.log('done');
