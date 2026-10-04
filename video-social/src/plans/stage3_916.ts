import { buildPlan } from '../lib/plan';
import { buildScenes } from '../stage3/scenes';

export const plan = buildPlan({ format: '916', scenes: buildScenes('916'), progressBar: false });
