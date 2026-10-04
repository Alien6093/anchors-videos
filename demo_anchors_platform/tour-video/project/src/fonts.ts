// Local Inter, embedded as data: URIs (src/fontData.ts is generated from
// public/fonts/*.woff2) and declared with plain CSS @font-face, so no request
// ever goes to the render server. We wait for the faces with a bounded
// delayRender: in some background render tabs FontFace promises never settle,
// so we continue after 5 s at the latest (data-URI faces are decoded by then).
import {continueRender, delayRender} from 'remotion';
import {INTER_WOFF2} from './fontData';

if (typeof document !== 'undefined' && !document.getElementById('inter-local')) {
  const style = document.createElement('style');
  style.id = 'inter-local';
  style.textContent = Object.entries(INTER_WOFF2)
    .map(
      ([w, b64]) =>
        `@font-face{font-family:'Inter';font-style:normal;font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');}`,
    )
    .join('\n');
  document.head.appendChild(style);

  const handle = delayRender('Loading Inter', {timeoutInMilliseconds: 60000});
  let done = false;
  const finish = () => {
    if (!done) {
      done = true;
      continueRender(handle);
    }
  };
  Promise.all(Object.keys(INTER_WOFF2).map((w) => document.fonts.load(`${w} 32px Inter`)))
    .then(finish)
    .catch(finish);
  setTimeout(finish, 5000);
}
