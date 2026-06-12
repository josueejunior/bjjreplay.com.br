/** Mídia da landing — imagens geradas + vídeo no hero. */

const AI_COMMUNITY = {
  guardPass: '/images/landing/ai-community-guard-pass.jpg',
  warmup: '/images/landing/ai-community-warmup.jpg',
  competition: '/images/landing/ai-community-competition.jpg',
  roll: '/images/landing/ai-community-roll.jpg',
  drill: '/images/landing/ai-community-drill.jpg',
  grappling: '/images/landing/ai-community-grappling.jpg',
  sparring: '/images/landing/ai-community-sparring.jpg',
  submission: '/images/landing/ai-community-submission.jpg',
  sweep: '/images/landing/ai-community-sweep.jpg',
  kids: '/images/landing/ai-community-kids.jpg',
  kimono: '/images/landing/ai-community-kimono.jpg',
  podium: '/images/landing/ai-community-podium.jpg',
} as const;

/** Vídeo do hero — clip cinematográfico BJJ. */
const HERO_VIDEO = '/videos/hero-cinematic.mp4';

export const LANDING_MEDIA = {
  heroVideo: HERO_VIDEO,
  featuresPreview: AI_COMMUNITY.grappling,
  ctaBackground: AI_COMMUNITY.warmup,

  videos: {
    roll: AI_COMMUNITY.roll,
    grappling: AI_COMMUNITY.grappling,
    competition: AI_COMMUNITY.competition,
    features: AI_COMMUNITY.submission,
  },

  steps: {
    signup: '/images/landing/ai-step-signup.jpg',
    fight: '/images/landing/ai-step-fight.jpg',
    ranking: '/images/landing/ai-step-ranking.jpg',
  },

  /** 12 fotos — galeria da comunidade. */
  community: {
    guardPass: AI_COMMUNITY.guardPass,
    matTraining: AI_COMMUNITY.warmup,
    competition: AI_COMMUNITY.competition,
    functional: AI_COMMUNITY.roll,
    gym: AI_COMMUNITY.drill,
    grappling: AI_COMMUNITY.grappling,
    boxing: AI_COMMUNITY.sparring,
    strength: AI_COMMUNITY.submission,
    sweep: AI_COMMUNITY.sweep,
    conditioning: AI_COMMUNITY.kids,
    kimono: AI_COMMUNITY.kimono,
    olympic: AI_COMMUNITY.podium,
  },
} as const;
