// Types for Mischief Manager - Habit Tracking for Impulse Spending

export interface SpendingEntry {
  id: string;
  timestamp: Date;
  amount: number;
  category: string;
  description: string;
  isImpulsive: boolean;
  emotionalState: EmotionalState;
  triggers: Trigger[];
  location?: string;
  preventionAttempted: boolean;
  preventionMethods?: string[];
  regretLevel: number; // 1-5 scale
}

export interface Trigger {
  id: string;
  name: string;
  type: TriggerType;
  intensity: number; // 1-5 scale
  context?: string;
}

export enum TriggerType {
  EMOTIONAL = 'emotional',
  SOCIAL = 'social',
  ENVIRONMENTAL = 'environmental',
  TEMPORAL = 'temporal', // time-based
  PHYSICAL = 'physical'
}

export interface EmotionalState {
  mood: MoodLevel;
  stressLevel: number; // 1-5 scale
  energyLevel: number; // 1-5 scale
  tags: string[];
}

export enum MoodLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  NEUTRAL = 'neutral',
  GOOD = 'good',
  VERY_GOOD = 'very_good'
}

export interface HabitPattern {
  id: string;
  name: string;
  frequency: number; // occurrences per week
  averageAmount: number;
  commonTriggers: Trigger[];
  riskTimes: string[]; // time patterns
  locations: string[];
  emotionalPatterns: EmotionalState[];
}

export interface CooldownPeriod {
  startTime: Date;
  durationMinutes: number;
  isActive: boolean;
  reason: string;
  spendingAmount?: number;
}

export interface UserInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  actionSuggestions: string[];
  confidence: number; // 0-1 scale
  createdAt: Date;
}

export enum InsightType {
  TRIGGER_PATTERN = 'trigger_pattern',
  TIME_PATTERN = 'time_pattern',
  MOOD_CORRELATION = 'mood_correlation',
  SPENDING_TREND = 'spending_trend',
  SUCCESS_PATTERN = 'success_pattern'
}