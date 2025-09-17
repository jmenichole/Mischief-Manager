import React from 'react';
import { AlertTriangle, Clock, MapPin, Heart, Brain } from 'lucide-react';
import { SpendingEntry } from '../types';
import { formatCurrency } from '../utils/habitTracking';

interface TriggerIdentifierProps {
  entries: SpendingEntry[];
}

export const TriggerIdentifier: React.FC<TriggerIdentifierProps> = ({ entries }) => {
  const impulsiveEntries = entries.filter(entry => entry.isImpulsive);
  
  // Analyze trigger patterns
  const triggerAnalysis = analyzeTriggers(impulsiveEntries);
  const timePatterns = analyzeTimePatterns(impulsiveEntries);
  const locationPatterns = analyzeLocationPatterns(impulsiveEntries);
  const emotionalPatterns = analyzeEmotionalPatterns(impulsiveEntries);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Trigger Identification</h2>
        <p className="text-gray-600">Understanding what leads to your impulse purchases</p>
      </div>

      {impulsiveEntries.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No impulse purchases tracked yet</h3>
          <p className="text-gray-500">Start tracking your spending to identify your triggers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Triggers */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold">Your Top Triggers</h3>
            </div>
            {triggerAnalysis.length === 0 ? (
              <p className="text-gray-500">No triggers identified yet</p>
            ) : (
              <div className="space-y-3">
                {triggerAnalysis.slice(0, 5).map((trigger) => (
                  <div key={trigger.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{trigger.name}</p>
                      <p className="text-sm text-gray-600">{trigger.count} occurrences</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{formatCurrency(trigger.totalAmount)}</p>
                      <p className="text-xs text-gray-500">avg: {formatCurrency(trigger.averageAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Patterns */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Time Patterns</h3>
            </div>
            {timePatterns.length === 0 ? (
              <p className="text-gray-500">No time patterns identified yet</p>
            ) : (
              <div className="space-y-3">
                {timePatterns.map((pattern) => (
                  <div key={pattern.time} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{pattern.time}</p>
                      <p className="text-sm text-gray-600">{pattern.count} purchases</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{formatCurrency(pattern.totalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Patterns */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold">Location Patterns</h3>
            </div>
            {locationPatterns.length === 0 ? (
              <p className="text-gray-500">No location patterns identified yet</p>
            ) : (
              <div className="space-y-3">
                {locationPatterns.map((pattern) => (
                  <div key={pattern.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{pattern.location}</p>
                      <p className="text-sm text-gray-600">{pattern.count} purchases</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(pattern.totalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emotional Patterns */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-purple-500 mr-2" />
              <h3 className="text-lg font-semibold">Emotional Patterns</h3>
            </div>
            {emotionalPatterns.length === 0 ? (
              <p className="text-gray-500">No emotional patterns identified yet</p>
            ) : (
              <div className="space-y-3">
                {emotionalPatterns.map((pattern) => (
                  <div key={pattern.mood} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{getMoodLabel(pattern.mood)}</p>
                      <p className="text-sm text-gray-600">
                        Stress: {pattern.avgStress}/5 • Energy: {pattern.avgEnergy}/5
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{pattern.count} times</p>
                      <p className="text-sm text-gray-600">{formatCurrency(pattern.totalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trigger Prevention Tips */}
      {triggerAnalysis.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Prevention Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium mb-2">For your top trigger: "{triggerAnalysis[0]?.name}"</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Recognize early warning signs</li>
                <li>• Use the 10-minute rule before purchasing</li>
                <li>• Practice breathing exercises when triggered</li>
              </ul>
            </div>
            
            {timePatterns.length > 0 && (
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">For your risk time: {timePatterns[0]?.time}</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Set phone reminders during this time</li>
                  <li>• Plan alternative activities</li>
                  <li>• Avoid shopping apps/websites</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
function analyzeTriggers(entries: SpendingEntry[]) {
  const triggerCounts: Record<string, { count: number; totalAmount: number; entries: SpendingEntry[] }> = {};
  
  entries.forEach(entry => {
    entry.triggers.forEach(trigger => {
      if (!triggerCounts[trigger.name]) {
        triggerCounts[trigger.name] = { count: 0, totalAmount: 0, entries: [] };
      }
      triggerCounts[trigger.name].count++;
      triggerCounts[trigger.name].totalAmount += entry.amount;
      triggerCounts[trigger.name].entries.push(entry);
    });
  });

  return Object.entries(triggerCounts)
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalAmount: data.totalAmount,
      averageAmount: data.totalAmount / data.count
    }))
    .sort((a, b) => b.count - a.count);
}

function analyzeTimePatterns(entries: SpendingEntry[]) {
  const timePatterns: Record<string, { count: number; totalAmount: number }> = {};
  
  entries.forEach(entry => {
    const hour = entry.timestamp.getHours();
    const timeOfDay = getTimeOfDay(hour);
    
    if (!timePatterns[timeOfDay]) {
      timePatterns[timeOfDay] = { count: 0, totalAmount: 0 };
    }
    timePatterns[timeOfDay].count++;
    timePatterns[timeOfDay].totalAmount += entry.amount;
  });

  return Object.entries(timePatterns)
    .map(([time, data]) => ({
      time,
      count: data.count,
      totalAmount: data.totalAmount
    }))
    .sort((a, b) => b.count - a.count);
}

function analyzeLocationPatterns(entries: SpendingEntry[]) {
  const locationPatterns: Record<string, { count: number; totalAmount: number }> = {};
  
  entries.forEach(entry => {
    if (entry.location) {
      if (!locationPatterns[entry.location]) {
        locationPatterns[entry.location] = { count: 0, totalAmount: 0 };
      }
      locationPatterns[entry.location].count++;
      locationPatterns[entry.location].totalAmount += entry.amount;
    }
  });

  return Object.entries(locationPatterns)
    .map(([location, data]) => ({
      location,
      count: data.count,
      totalAmount: data.totalAmount
    }))
    .sort((a, b) => b.count - a.count);
}

function analyzeEmotionalPatterns(entries: SpendingEntry[]) {
  const emotionalPatterns: Record<string, { 
    count: number; 
    totalAmount: number; 
    totalStress: number; 
    totalEnergy: number; 
  }> = {};
  
  entries.forEach(entry => {
    const mood = entry.emotionalState.mood;
    
    if (!emotionalPatterns[mood]) {
      emotionalPatterns[mood] = { count: 0, totalAmount: 0, totalStress: 0, totalEnergy: 0 };
    }
    emotionalPatterns[mood].count++;
    emotionalPatterns[mood].totalAmount += entry.amount;
    emotionalPatterns[mood].totalStress += entry.emotionalState.stressLevel;
    emotionalPatterns[mood].totalEnergy += entry.emotionalState.energyLevel;
  });

  return Object.entries(emotionalPatterns)
    .map(([mood, data]) => ({
      mood,
      count: data.count,
      totalAmount: data.totalAmount,
      avgStress: Math.round(data.totalStress / data.count),
      avgEnergy: Math.round(data.totalEnergy / data.count)
    }))
    .sort((a, b) => b.count - a.count);
}

function getTimeOfDay(hour: number): string {
  if (hour < 6) return 'Late Night (12-6am)';
  if (hour < 12) return 'Morning (6am-12pm)';
  if (hour < 17) return 'Afternoon (12-5pm)';
  if (hour < 21) return 'Evening (5-9pm)';
  return 'Late Night (9pm-12am)';
}

function getMoodLabel(mood: string): string {
  const labels: Record<string, string> = {
    'very_low': 'Very Low',
    'low': 'Low', 
    'neutral': 'Neutral',
    'good': 'Good',
    'very_good': 'Very Good'
  };
  return labels[mood] || mood;
}