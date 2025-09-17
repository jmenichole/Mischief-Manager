import React, { useState } from 'react';
import { TrendingUp, Brain, Clock, AlertCircle } from 'lucide-react';
import { SpendingEntry, CooldownPeriod } from '../types';
import { formatCurrency, generateInsights, isCoolDownActive } from '../utils/habitTracking';
import { SpendingTracker } from './SpendingTracker';
import { TriggerIdentifier } from './TriggerIdentifier';
import { InsightsDashboard } from './InsightsDashboard';
import { CooldownTimer } from './CooldownTimer';

interface HabitTrackerProps {
  entries: SpendingEntry[];
  onAddEntry: (entry: SpendingEntry) => void;
  cooldownPeriod?: CooldownPeriod;
  onStartCooldown: (period: CooldownPeriod) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  entries,
  onAddEntry,
  cooldownPeriod,
  onStartCooldown
}) => {
  const [activeView, setActiveView] = useState<'tracker' | 'insights' | 'triggers'>('tracker');
  
  const impulsiveEntries = entries.filter(entry => entry.isImpulsive);
  const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const impulsiveSpent = impulsiveEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const insights = generateInsights(entries);
  
  const isCooldownActive = cooldownPeriod ? isCoolDownActive(cooldownPeriod) : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mindful-sage-50 via-mindful-sky-50 to-mindful-earth-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-mindful-earth-800 mb-2">Mischief Manager</h1>
          <p className="text-lg text-mindful-earth-600">Your mindful companion for understanding spending patterns</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-mindful-sage-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mindful-earth-600">Total Tracked</p>
                <p className="text-2xl font-bold text-mindful-earth-800">{formatCurrency(totalSpent)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-mindful-sky-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-mindful-coral-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mindful-earth-600">Impulse Spending</p>
                <p className="text-2xl font-bold text-mindful-coral-600">{formatCurrency(impulsiveSpent)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-mindful-coral-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-mindful-sage-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mindful-earth-600">Entries This Week</p>
                <p className="text-2xl font-bold text-mindful-earth-800">{entries.length}</p>
              </div>
              <Brain className="h-8 w-8 text-mindful-sage-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-mindful-lavender-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mindful-earth-600">Active Insights</p>
                <p className="text-2xl font-bold text-mindful-lavender-600">{insights.length}</p>
              </div>
              <Clock className="h-8 w-8 text-mindful-lavender-500" />
            </div>
          </div>
        </div>

        {/* Cooldown Notice */}
        {isCooldownActive && cooldownPeriod && (
          <CooldownTimer cooldown={cooldownPeriod} />
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-mindful-sage-100/50 p-1 rounded-xl mb-8 backdrop-blur-sm">
          <button
            onClick={() => setActiveView('tracker')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'tracker'
                ? 'bg-white/90 text-mindful-sage-700 shadow-lg backdrop-blur-sm'
                : 'text-mindful-earth-600 hover:text-mindful-earth-800 hover:bg-white/30'
            }`}
          >
            Track Spending
          </button>
          <button
            onClick={() => setActiveView('triggers')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'triggers'
                ? 'bg-white/90 text-mindful-sage-700 shadow-lg backdrop-blur-sm'
                : 'text-mindful-earth-600 hover:text-mindful-earth-800 hover:bg-white/30'
            }`}
          >
            Identify Triggers
          </button>
          <button
            onClick={() => setActiveView('insights')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeView === 'insights'
                ? 'bg-white/90 text-mindful-sage-700 shadow-lg backdrop-blur-sm'
                : 'text-mindful-earth-600 hover:text-mindful-earth-800 hover:bg-white/30'
            }`}
          >
            Your Insights
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg">
          {activeView === 'tracker' && (
            <SpendingTracker 
              onAddEntry={onAddEntry}
              onStartCooldown={onStartCooldown}
              recentEntries={entries.slice(0, 5)}
            />
          )}
          {activeView === 'triggers' && (
            <TriggerIdentifier entries={entries} />
          )}
          {activeView === 'insights' && (
            <InsightsDashboard insights={insights} entries={entries} />
          )}
        </div>
      </div>
    </div>
  );
};