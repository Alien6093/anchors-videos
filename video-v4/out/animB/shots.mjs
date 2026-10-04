import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
const spec = JSON.parse(process.argv[2]); // {"14":[5,40],...}
const entry = path.resolve('src/scenes/_previewRootB.ts');
const serveUrl = await bundle({ entryPoint: entry });
for (const [id, frames] of Object.entries(spec)) {
  const comp = await selectComposition({ serveUrl, id: `S${id}` });
  for (const fr of frames) {
    await renderStill({ composition: comp, serveUrl, frame: fr, output: `out/animB/s${id}-f${fr}.png`, scale: 0.5 });
  }
}
console.log('done');
