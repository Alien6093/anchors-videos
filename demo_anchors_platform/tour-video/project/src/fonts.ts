// Local Inter, embedded as data: URIs (generated from public/fonts by
// src/fontData.ts) so loading never waits on the busy render server.
// Render is blocked until all weights are decoded.
import {continueRender, delayRender} from 'remotion';
import {INTER_WOFF2} from './fontData';

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading Inter', {timeoutInMilliseconds: 60000});
  Promise.all(
    Object.entries(INTER_WOFF2).map(([w, b64]) => {
      const face = new FontFace('Inter', `url(data:font/woff2;base64,${b64}) format('woff2')`, {
        weight: w,
        style: 'normal',
      });
      return face.load().then((loaded) => {
        document.fonts.add(loaded);
      });
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error('Font load failed', err);
      continueRender(handle);
    });
}
