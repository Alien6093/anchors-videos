import React, { createContext, useContext } from 'react';
import { BASE_W, Fmt, SPEC } from './tokens';

type FmtInfo = { fmt: Fmt; is916: boolean; k: number; baseH: number };
const Ctx = createContext<FmtInfo>({ fmt: '916', is916: true, k: 1, baseH: 718 });

export const FmtProvider: React.FC<{ fmt: Fmt; children: React.ReactNode }> = ({ fmt, children }) => {
  const s = SPEC[fmt];
  const k = s.bandW / BASE_W;
  return <Ctx.Provider value={{ fmt, is916: fmt === '916', k, baseH: s.bandH / k }}>{children}</Ctx.Provider>;
};
export const useFmt = (): FmtInfo => useContext(Ctx);

/** Content box in the card band, laid out in base units (920 wide) and scaled to the band. */
export const Band: React.FC<{ children: React.ReactNode; align?: 'center' | 'start'; scale?: number; opacity?: number; style?: React.CSSProperties }> = ({ children, align = 'center', scale = 1, opacity = 1, style }) => {
  const { fmt, k, baseH } = useFmt();
  const s = SPEC[fmt];
  return (
    <div style={{ position: 'absolute', left: s.bandX, top: s.bandY, width: s.bandW, height: s.bandH, opacity, transform: `scale(${scale})`, transformOrigin: '50% 50%' }}>
      <div style={{ width: BASE_W, height: baseH, transform: `scale(${k})`, transformOrigin: '0 0', display: 'flex', flexDirection: 'column', justifyContent: align === 'center' ? 'center' : 'flex-start', alignItems: 'stretch', ...style }}>
        {children}
      </div>
    </div>
  );
};
