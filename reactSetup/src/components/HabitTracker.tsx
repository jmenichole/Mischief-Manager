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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mischief Manager</h1>
          <p className="text-lg text-gray-600">Understanding your impulse spending patterns</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impulse Spending</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(impulsiveSpent)}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entries This Week</p>
                <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Insights</p>
                <p className="text-2xl font-bold text-purple-600">{insights.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Cooldown Notice */}
        {isCooldownActive && cooldownPeriod && (
          <CooldownTimer cooldown={cooldownPeriod} />
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveView('tracker')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeView === 'tracker'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Track Spending
          </button>
          <button
            onClick={() => setActiveView('triggers')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeView === 'triggers'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Identify Triggers
          </button>
          <button
            onClick={() => setActiveView('insights')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeView === 'insights'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
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