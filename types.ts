
export interface BrandIdentity {
  name: string;
  mission: string;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    rationale: string;
  };
  typography: {
    heading: string;
    body: string;
    style: string;
  };
}

export interface ActivityItem {
  id: string;
  type: 'milestone' | 'content' | 'action';
  title: string;
  description: string;
  timestamp: number;
  meta?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: 'content' | 'strategy' | 'outreach';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface UserProfile {
  archetype: 'visionary' | 'analyst' | 'rebel' | 'narrator';
  tone: string[];
  values: string[];
  expertise: string;
}

export interface Persona {
  name: string;
  demographics: string;
  fears: string[];
  desires: string[];
  habits: string[];
}

export interface MarketGap {
  niche: string;
  opportunity: string;
  intentScore: number;
  competition: string;
}

export enum AppPhase {
  FOUNDATION = 'foundation',
  GROWTH = 'growth',
  HERO = 'hero',
  SCALING = 'scaling'
}

export interface ContentPiece {
  id: string;
  title: string;
  type: 'blog' | 'thread' | 'linkedin';
  content: string;
}
