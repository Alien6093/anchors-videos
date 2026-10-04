// Local Inter, embedded as data: URIs (src/fontData.ts is generated from
// public/fonts/*.woff2) and declared with plain CSS @font-face, so no request
// ever goes to the render server. The render waits for the faces through
// useInterFonts() (called inside the Tour component — a module-level
// delayRender would also block the composition-listing tab, where it never
// cleared and timed the render out).
import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {INTER_WOFF2} from './fontData';

const injectCss = () => {
  if (typeof document === 'undefined' || document.getElementById('inter-local')) return;
  const style = document.createElement('style');
  style.id = 'inter-local';
  style.textContent = Object.entries(INTER_WOFF2)
    .map(
      ([w, b64]) =>
        `@font-face{font-family:'Inter';font-style:normal;font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');}`,
    )
    .join('\n');
  document.head.appendChild(style);
};
injectCss();

export const useInterFonts = () => {
  const [handle] = useState(() => delayRender('Loading Inter', {timeoutInMilliseconds: 30000}));
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        continueRender(handle);
      }
    };
    Promise.all(Object.keys(INTER_WOFF2).map((w) => document.fonts.load(`${w} 32px Inter`)))
      .then(finish, finish);
    const t = setTimeout(finish, 5000);
    return () => {
      clearTimeout(t);
      finish();
    };
  }, [handle]);
};
