import React, { createContext, useContext } from 'react';
import { Format } from '../lib/format';

export type Layout = {
  fmt: Format;
  W: number;
  H: number;
  margin: number;
  chipX: number;
  chipY: number;
  chipFont: number;
  capTop: number;
  capH: number;
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
  /** content scale: card width / 1000 */
  u: number;
  /** content is laid out at cardW/zoom and scaled up (fills the taller 4:5 band) */
  zoom: number;
  inW: number;
  inH: number;
};

export const LAYOUTS: Record<Format, Layout> = {
  '916': { fmt: '916', W: 1080, H: 1920, margin: 60, chipX: 60, chipY: 280, chipFont: 44, capTop: 360, capH: 200, cardX: 60, cardY: 600, cardW: 960, cardH: 820, u: 0.96, zoom: 1, inW: 960, inH: 820 },
  '45': { fmt: '45', W: 1080, H: 1350, margin: 80, chipX: 80, chipY: 80, chipFont: 36, capTop: 150, capH: 160, cardX: 80, cardY: 340, cardW: 920, cardH: 930, u: 0.92, zoom: 1.15, inW: 800, inH: 808 },
};

const Ctx = createContext<Layout>(LAYOUTS['916']);
export const LayoutProvider: React.FC<{ fmt: Format; children: React.ReactNode }> = ({ fmt, children }) => (
  <Ctx.Provider value={LAYOUTS[fmt]}>{children}</Ctx.Provider>
);
export const useL = (): Layout => useContext(Ctx);
/** scale a design-px value (designed at 1000 px card width) to this format */
export const useS = (): ((n: number) => number) => {
  const { u } = useL();
  return (n: number) => Math.round(n * u);
};
