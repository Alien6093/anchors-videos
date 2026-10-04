import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
const root = '/Users/adityasingh/anchors video/video-social';
const S = '/private/tmp/claude-501/-Users-adityasingh-anchors-video/a89522d6-7b95-46bf-9acf-9559772f78c2/scratchpad/social1';
const url = await bundle({ entryPoint: root + '/src/stage1/entry.tsx', publicDir: root + '/public' });
for (const fr of process.argv.slice(2)) {
  const comp = await selectComposition({ serveUrl: url, id: 'Stage1-916' });
  await renderStill({ composition: comp, serveUrl: url, frame: Number(fr), output: `${S}/t_${fr}.png`, logLevel: 'warn' });
}
