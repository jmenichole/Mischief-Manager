import React from 'react';
import { Lightbulb, TrendingDown, Clock, Heart, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { UserInsight, SpendingEntry, InsightType } from '../types';
import { formatCurrency } from '../utils/habitTracking';

interface InsightsDashboardProps {
  insights: UserInsight[];
  entries: SpendingEntry[];
}

export const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ insights, entries }) => {
  const successfulPreventions = entries.filter(entry => entry.preventionAttempted && !entry.isImpulsive);
  
  // Calculate streak and statistics
  const currentWeekEntries = getThisWeekEntries(entries);
  const lastWeekEntries = getLastWeekEntries(entries);
  const weeklyComparison = calculateWeeklyComparison(currentWeekEntries, lastWeekEntries);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Insights</h2>
        <p className="text-gray-600">Patterns and recommendations based on your spending data</p>
      </div>

      {/* Weekly Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-lg border ${
          weeklyComparison.impulseChange < 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week's Impulse Spending</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(weeklyComparison.currentImpulse)}</p>
              <p className={`text-sm ${weeklyComparison.impulseChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {weeklyComparison.impulseChange < 0 ? '↓' : '↑'} {Math.abs(weeklyComparison.impulseChange)}% from last week
              </p>
            </div>
            <TrendingDown className={`h-8 w-8 ${weeklyComparison.impulseChange < 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prevention Successes</p>
              <p className="text-2xl font-bold text-green-600">{successfulPreventions.length}</p>
              <p className="text-sm text-gray-600">Times you resisted impulse</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Insights</p>
              <p className="text-2xl font-bold text-blue-600">{insights.length}</p>
              <p className="text-sm text-gray-600">Recommendations available</p>
            </div>
            <Lightbulb className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Insights List */}
      {insights.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No insights available yet</h3>
          <p className="text-gray-500">Keep tracking your spending to generate personalized insights</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Personalized Insights</h3>
          
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">{insight.title}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getInsightBadgeStyle(insight.type)}`}>
                        {getInsightTypeLabel(insight.type)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`h-2 w-2 rounded-full ${getConfidenceColor(insight.confidence)}`}></div>
                        <span className="text-xs text-gray-500">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 mb-2">Recommended Actions:</h5>
                    <ul className="space-y-1">
                      {insight.actionSuggestions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Stories */}
      {successfulPreventions.length > 0 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Your Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {successfulPreventions.slice(0, 4).map((entry) => (
              <div key={entry.id} className="bg-white p-4 rounded-lg">
                <p className="font-medium text-gray-800">{entry.description}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Would have spent: {formatCurrency(entry.amount)}
                </p>
                {entry.preventionMethods && (
                  <p className="text-xs text-green-700">
                    Used: {entry.preventionMethods.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
function getInsightIcon(type: InsightType) {
  const iconProps = { className: "h-6 w-6" };
  
  switch (type) {
    case InsightType.TRIGGER_PATTERN:
      return <AlertCircle {...iconProps} className="h-6 w-6 text-red-500" />;
    case InsightType.TIME_PATTERN:
      return <Clock {...iconProps} className="h-6 w-6 text-blue-500" />;
    case InsightType.MOOD_CORRELATION:
      return <Heart {...iconProps} className="h-6 w-6 text-purple-500" />;
    case InsightType.SPENDING_TREND:
      return <TrendingDown {...iconProps} className="h-6 w-6 text-orange-500" />;
    case InsightType.SUCCESS_PATTERN:
      return <CheckCircle {...iconProps} className="h-6 w-6 text-green-500" />;
    default:
      return <Lightbulb {...iconProps} className="h-6 w-6 text-gray-500" />;
  }
}

function getInsightBadgeStyle(type: InsightType): string {
  switch (type) {
    case InsightType.TRIGGER_PATTERN:
      return 'bg-red-100 text-red-800';
    case InsightType.TIME_PATTERN:
      return 'bg-blue-100 text-blue-800';
    case InsightType.MOOD_CORRELATION:
      return 'bg-purple-100 text-purple-800';
    case InsightType.SPENDING_TREND:
      return 'bg-orange-100 text-orange-800';
    case InsightType.SUCCESS_PATTERN:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getInsightTypeLabel(type: InsightType): string {
  switch (type) {
    case InsightType.TRIGGER_PATTERN:
      return 'Trigger';
    case InsightType.TIME_PATTERN:
      return 'Time';
    case InsightType.MOOD_CORRELATION:
      return 'Mood';
    case InsightType.SPENDING_TREND:
      return 'Trend';
    case InsightType.SUCCESS_PATTERN:
      return 'Success';
    default:
      return 'Insight';
  }
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'bg-green-500';
  if (confidence >= 0.6) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getThisWeekEntries(entries: SpendingEntry[]): SpendingEntry[] {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  
  return entries.filter(entry => entry.timestamp >= startOfWeek);
}

function getLastWeekEntries(entries: SpendingEntry[]): SpendingEntry[] {
  const now = new Date();
  const endOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay() - 1));
  endOfLastWeek.setHours(23, 59, 59, 999);
  
  const startOfLastWeek = new Date(endOfLastWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);
  startOfLastWeek.setHours(0, 0, 0, 0);
  
  return entries.filter(entry => 
    entry.timestamp >= startOfLastWeek && entry.timestamp <= endOfLastWeek
  );
}

function calculateWeeklyComparison(currentWeek: SpendingEntry[], lastWeek: SpendingEntry[]) {
  const currentImpulse = currentWeek
    .filter(entry => entry.isImpulsive)
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const lastImpulse = lastWeek
    .filter(entry => entry.isImpulsive)
    .reduce((sum, entry) => sum + entry.amount, 0);

  const impulseChange = lastImpulse === 0 ? 0 : 
    Math.round(((currentImpulse - lastImpulse) / lastImpulse) * 100);

  return {
    currentImpulse,
    lastImpulse,
    impulseChange
  };
}