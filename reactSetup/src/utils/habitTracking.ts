import { SpendingEntry, Trigger, HabitPattern, UserInsight, InsightType, MoodLevel } from '../types';

// Generate unique ID for entries
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Calculate time difference in minutes
export const getMinutesSince = (timestamp: Date): number => {
  return Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60));
};

// Analyze spending patterns
export const analyzeSpendingPatterns = (entries: SpendingEntry[]): HabitPattern[] => {
  const patterns: HabitPattern[] = [];
  
  // Group by common triggers
  const triggerGroups = groupEntriesByTriggers(entries);
  
  Object.entries(triggerGroups).forEach(([triggerName, groupEntries]) => {
    if (groupEntries.length >= 3) { // Only consider patterns with 3+ occurrences
      const pattern: HabitPattern = {
        id: generateId(),
        name: `${triggerName} Spending Pattern`,
        frequency: groupEntries.length,
        averageAmount: groupEntries.reduce((sum, entry) => sum + entry.amount, 0) / groupEntries.length,
        commonTriggers: extractCommonTriggers(groupEntries),
        riskTimes: extractTimePatterns(groupEntries),
        locations: [...new Set(groupEntries.map(e => e.location).filter(Boolean) as string[])],
        emotionalPatterns: extractEmotionalPatterns(groupEntries)
      };
      patterns.push(pattern);
    }
  });
  
  return patterns;
};

// Generate insights from spending data
export const generateInsights = (entries: SpendingEntry[]): UserInsight[] => {
  const insights: UserInsight[] = [];
  
  // Trigger pattern insights
  const triggerInsights = analyzeTriggerPatterns(entries);
  insights.push(...triggerInsights);
  
  // Time-based insights
  const timeInsights = analyzeTimePatterns(entries);
  insights.push(...timeInsights);
  
  // Mood correlation insights
  const moodInsights = analyzeMoodCorrelations(entries);
  insights.push(...moodInsights);
  
  return insights;
};

// Helper functions
const groupEntriesByTriggers = (entries: SpendingEntry[]): Record<string, SpendingEntry[]> => {
  const groups: Record<string, SpendingEntry[]> = {};
  
  entries.forEach(entry => {
    entry.triggers.forEach(trigger => {
      if (!groups[trigger.name]) {
        groups[trigger.name] = [];
      }
      groups[trigger.name].push(entry);
    });
  });
  
  return groups;
};

const extractCommonTriggers = (entries: SpendingEntry[]): Trigger[] => {
  const triggerCounts: Record<string, { trigger: Trigger; count: number }> = {};
  
  entries.forEach(entry => {
    entry.triggers.forEach(trigger => {
      if (!triggerCounts[trigger.id]) {
        triggerCounts[trigger.id] = { trigger, count: 0 };
      }
      triggerCounts[trigger.id].count++;
    });
  });
  
  return Object.values(triggerCounts)
    .filter(item => item.count >= 2)
    .map(item => item.trigger);
};

const extractTimePatterns = (entries: SpendingEntry[]): string[] => {
  const timePatterns: Record<string, number> = {};
  
  entries.forEach(entry => {
    const hour = entry.timestamp.getHours();
    const timeOfDay = getTimeOfDay(hour);
    timePatterns[timeOfDay] = (timePatterns[timeOfDay] || 0) + 1;
  });
  
  return Object.entries(timePatterns)
    .filter(([, count]) => count >= 2)
    .map(([timeOfDay]) => timeOfDay);
};

const extractEmotionalPatterns = (entries: SpendingEntry[]) => {
  // Return the most common emotional states
  const emotionalCounts: Record<string, number> = {};
  
  entries.forEach(entry => {
    const key = `${entry.emotionalState.mood}-${entry.emotionalState.stressLevel}`;
    emotionalCounts[key] = (emotionalCounts[key] || 0) + 1;
  });
  
  const commonStates = Object.entries(emotionalCounts)
    .filter(([, count]) => count >= 2)
    .map(([key]) => {
      const [mood, stress] = key.split('-');
      return entries.find(e => 
        e.emotionalState.mood === mood && 
        e.emotionalState.stressLevel === parseInt(stress)
      )?.emotionalState;
    })
    .filter(Boolean);
    
  return commonStates.slice(0, 3); // Return top 3 patterns
};

const analyzeTriggerPatterns = (entries: SpendingEntry[]): UserInsight[] => {
  const insights: UserInsight[] = [];
  const impulsiveEntries = entries.filter(e => e.isImpulsive);
  
  if (impulsiveEntries.length >= 3) {
    const triggerCounts = getTriggerCounts(impulsiveEntries);
    const topTrigger = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topTrigger) {
      insights.push({
        id: generateId(),
        type: InsightType.TRIGGER_PATTERN,
        title: `${topTrigger[0]} is your top impulse trigger`,
        description: `You've made ${topTrigger[1]} impulse purchases when experiencing ${topTrigger[0].toLowerCase()}.`,
        actionSuggestions: [
          `Set up a 10-minute cool-down when feeling ${topTrigger[0].toLowerCase()}`,
          'Practice mindfulness techniques when this trigger appears',
          'Identify early warning signs of this emotional state'
        ],
        confidence: Math.min(topTrigger[1] / 5, 1),
        createdAt: new Date()
      });
    }
  }
  
  return insights;
};

const analyzeTimePatterns = (entries: SpendingEntry[]): UserInsight[] => {
  const insights: UserInsight[] = [];
  const timePatterns: Record<string, number> = {};
  
  entries.filter(e => e.isImpulsive).forEach(entry => {
    const timeOfDay = getTimeOfDay(entry.timestamp.getHours());
    timePatterns[timeOfDay] = (timePatterns[timeOfDay] || 0) + 1;
  });
  
  const riskTime = Object.entries(timePatterns)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (riskTime && riskTime[1] >= 2) {
    insights.push({
      id: generateId(),
      type: InsightType.TIME_PATTERN,
      title: `${riskTime[0]} is your highest risk time`,
      description: `You tend to make more impulse purchases during ${riskTime[0].toLowerCase()}.`,
      actionSuggestions: [
        `Be extra mindful during ${riskTime[0].toLowerCase()}`,
        'Set phone reminders to check in with yourself during this time',
        'Plan alternative activities for this time period'
      ],
      confidence: Math.min(riskTime[1] / 4, 1),
      createdAt: new Date()
    });
  }
  
  return insights;
};

const analyzeMoodCorrelations = (entries: SpendingEntry[]): UserInsight[] => {
  const insights: UserInsight[] = [];
  const moodCounts: Record<string, number> = {};
  
  entries.filter(e => e.isImpulsive).forEach(entry => {
    moodCounts[entry.emotionalState.mood] = (moodCounts[entry.emotionalState.mood] || 0) + 1;
  });
  
  const riskMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (riskMood && riskMood[1] >= 2) {
    const moodLabel = getMoodLabel(riskMood[0] as MoodLevel);
    insights.push({
      id: generateId(),
      type: InsightType.MOOD_CORRELATION,
      title: `${moodLabel} mood correlates with impulse spending`,
      description: `You've made ${riskMood[1]} impulse purchases when feeling ${moodLabel.toLowerCase()}.`,
      actionSuggestions: [
        'Track your mood regularly to increase awareness',
        'Develop healthy coping strategies for this emotional state',
        'Consider reaching out to support when feeling this way'
      ],
      confidence: Math.min(riskMood[1] / 3, 1),
      createdAt: new Date()
    });
  }
  
  return insights;
};

const getTriggerCounts = (entries: SpendingEntry[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  entries.forEach(entry => {
    entry.triggers.forEach(trigger => {
      counts[trigger.name] = (counts[trigger.name] || 0) + 1;
    });
  });
  
  return counts;
};

const getTimeOfDay = (hour: number): string => {
  if (hour < 6) return 'Late Night';
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Late Night';
};

const getMoodLabel = (mood: MoodLevel): string => {
  switch (mood) {
    case MoodLevel.VERY_LOW: return 'Very Low';
    case MoodLevel.LOW: return 'Low';
    case MoodLevel.NEUTRAL: return 'Neutral';
    case MoodLevel.GOOD: return 'Good';
    case MoodLevel.VERY_GOOD: return 'Very Good';
  }
};

// Cool-down timer utilities
export const startCoolDown = (minutes: number, reason: string) => {
  return {
    startTime: new Date(),
    durationMinutes: minutes,
    isActive: true,
    reason
  };
};

export const isCoolDownActive = (cooldown: { startTime: Date; durationMinutes: number }): boolean => {
  const elapsed = getMinutesSince(cooldown.startTime);
  return elapsed < cooldown.durationMinutes;
};