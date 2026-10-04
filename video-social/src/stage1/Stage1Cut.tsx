import React from 'react';
import { SocialCut } from '../components/SocialCut';
import { CutPlan } from '../lib/plan';
import { Stage1Overlay } from './Stage1Overlay';

/** SocialCut + the Stage 1 overlay. The overlay is injected here because defaultProps are JSON-serialised (functions are dropped). */
export const Stage1Cut: React.FC<{ plan: CutPlan }> = ({ plan }) => <SocialCut plan={{ ...plan, overlay: Stage1Overlay }} />;
