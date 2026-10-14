import { PLAN_RANK, videos } from '../data/static.js';
import {
  getVideoById as sbGetVideoById,
  getVideoFeed as sbGetVideoFeed,
  supabaseEnabled,
} from './supabase-store.service.js';
import type { PlanTier, Video } from '../types.js';

export interface VideoWithLock extends Video {
  locked: boolean;
}

export function isLockedFor(video: Video, plan: PlanTier): boolean {
  return PLAN_RANK[plan] < PLAN_RANK[video.requiredPlan];
}

export async function getFeed(plan: PlanTier): Promise<VideoWithLock[]> {
  if (supabaseEnabled()) {
    const feed = await sbGetVideoFeed(plan);
    return feed.map((v) => ({ ...v, locked: isLockedFor(v, plan) }));
  }
  return [];
}

export async function getById(id: string): Promise<Video | undefined> {
  if (supabaseEnabled()) return sbGetVideoById(id);
  return videos.find((v) => v.id === id);
}
