import { PLAN_RANK, videos } from '../data/static.js';
import type { PlanTier, Video } from '../types.js';

export interface VideoWithLock extends Video {
  locked: boolean;
}

export function isLockedFor(video: Video, plan: PlanTier): boolean {
  return PLAN_RANK[plan] < PLAN_RANK[video.requiredPlan];
}

export function getFeed(_plan: PlanTier): VideoWithLock[] {
  return [];
}

export function getById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}
