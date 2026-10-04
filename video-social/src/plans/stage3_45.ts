import { buildPlan } from '../lib/plan';
import { buildScenes } from '../stage3/scenes';

export const plan = buildPlan({ format: '45', scenes: buildScenes('45'), progressBar: false });
