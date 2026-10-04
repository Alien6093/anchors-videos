import React from 'react';
import { Format } from '../lib/format';
import { FONT_SANS } from '../components/theme';
import { Box } from './spec';

export const DISCLOSURE_RANGES: readonly (readonly [number, number])[] = [[0, 64], [852, 1157]];
const TAG_GAP = 14;

export const isDisclosureFrame = (frame: number): boolean => DISCLOSURE_RANGES.some(([a, b]) => frame >= a && frame < b);

/** "Dramatised example" tag, bottom-left under the card (or fixed spot for the full-bleed hook). */
export const Disclosure: React.FC<{ format: Format; box: Box; hard: boolean }> = ({ format, box, hard }) => {
  const hookTop = format === '916' ? 1140 : 836;
  const left = hard ? (format === '916' ? 40 : 80) : box.left + 6;
  const top = hard ? hookTop : box.top + box.h + TAG_GAP;
  return (
    <div style={{ position: 'absolute', left, top, fontFamily: FONT_SANS, fontSize: 26, fontWeight: 600, letterSpacing: '0.02em', color: 'rgba(255,255,255,.6)', textShadow: '0 2px 10px rgba(0,0,0,.6)' }}>
      Dramatised example
    </div>
  );
};
