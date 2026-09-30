export interface DJFloriaDossier {
  name: string;
  tagline: string;
  genres: string;
  bpmRange: string;
  bio: string;
  pressKit: string;
  website: string;
  instagram: string;
  youtube: string;
  soundcloud: string;
  spotify: string;
  targetAudience: string;
  releasesAndGigs: string;
  recentExperiences?: string;
  currentExploringGenres?: string;
  excludedTopicsAndOutdatedInfo?: string;
  visualAestheticCurrent: string;
  notes: string;
  lastUpdated: string;
}

export interface BrandPositioning {
  tagline: string;
  archetype: {
    name: string;
    description: string;
    energy: string;
  };
  positioningStatement: string;
  brandManifesto: string;
  brandPillars: Array<{
    pillar: string;
    concept: string;
    inAction: string;
  }>;
  toneOfVoice: {
    traits: string[];
    dos: string[];
    donts: string[];
  };
  competitiveEdge: string;
  bookerPitch: string;
}

export interface InstagramStrategy {
  profileOptimization: {
    recommendedUsernames: string[];
    bioOptions: Array<{
      type: string;
      bio: string;
      cta: string;
    }>;
    linkTreeRecommendations: string[];
    profilePictureTip: string;
    highlights: Array<{
      name: string;
      coverVibe: string;
      purpose: string;
    }>;
  };
  contentPillars: Array<{
    name: string;
    percentage: number;
    description: string;
    exampleIdea: string;
  }>;
  reelsBlueprints: Array<{
    title: string;
    targetGoal: string;
    hookTimecode: string;
    bodyAction: string;
    audioRecommendation: string;
    onScreenText: string;
    caption: string;
  }>;
  carouselConcept: {
    title: string;
    slides: Array<{
      slideNumber: number;
      title: string;
      content: string;
    }>;
    caption: string;
  };
  storiesEcosystem: {
    gigDayTimeline: Array<{
      time: string;
      action: string;
    }>;
    engagementStickersAdvice: string;
  };
}

export interface PlatformAuditItem {
  platform: string;
  healthScore: number;
  status: string;
  keyDiagnosis: string;
  missingElements: string[];
  quickWins: string[];
  strategicNextSteps: string[];
}

export interface PlatformAudit {
  overallHealthScore: number;
  platforms: PlatformAuditItem[];
  crossPlatformSynergy: string;
  priorityActionPlan: Array<{
    order: number;
    title: string;
    platform: string;
    impact: string;
  }>;
}

export interface ColorSwatch {
  role: string;
  hex: string;
  name: string;
  usage: string;
}

export interface VisualIdentity {
  conceptTitle: string;
  conceptDescription: string;
  palette: ColorSwatch[];
  typographySystem: {
    headerFont: string;
    headerFontVibe: string;
    bodyFont: string;
    bodyFontVibe: string;
    technicalFont: string;
    technicalFontVibe?: string;
  };
  visualCodes: Array<{
    element: string;
    rule: string;
  }>;
  moodboardKeywords: string[];
  outfitStyle: string;
}

export interface ContentPiece {
  dayOrType: string;
  platform: string;
  format: string;
  hookOrSubject: string;
  visualDescription: string;
  copyText: string;
  audioOrBPM: string;
  cta: string;
}

export interface GeneratedContentBatch {
  title: string;
  summary: string;
  contentPieces: ContentPiece[];
  curatorTip: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
