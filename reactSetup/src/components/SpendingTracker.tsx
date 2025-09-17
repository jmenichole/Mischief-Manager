import React, { useState } from 'react';
import { DollarSign, AlertTriangle, Clock, Plus, CheckCircle } from 'lucide-react';
import { SpendingEntry, EmotionalState, Trigger, TriggerType, MoodLevel, CooldownPeriod } from '../types';
import { generateId, formatCurrency, startCoolDown } from '../utils/habitTracking';

interface SpendingTrackerProps {
  onAddEntry: (entry: SpendingEntry) => void;
  onStartCooldown: (period: CooldownPeriod) => void;
  recentEntries: SpendingEntry[];
}

export const SpendingTracker: React.FC<SpendingTrackerProps> = ({
  onAddEntry,
  onStartCooldown,
  recentEntries
}) => {
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isImpulsive, setIsImpulsive] = useState(false);
  const [mood, setMood] = useState<MoodLevel>(MoodLevel.NEUTRAL);
  const [stressLevel, setStressLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [emotionalTags, setEmotionalTags] = useState('');
  const [triggers, setTriggers] = useState<string>('');
  const [location, setLocation] = useState('');
  const [preventionAttempted, setPreventionAttempted] = useState(false);
  const [preventionMethods, setPreventionMethods] = useState('');
  const [regretLevel, setRegretLevel] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emotionalState: EmotionalState = {
      mood,
      stressLevel,
      energyLevel,
      tags: emotionalTags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const triggerList: Trigger[] = triggers.split(',').map(trigger => ({
      id: generateId(),
      name: trigger.trim(),
      type: TriggerType.EMOTIONAL, // Default type, could be enhanced
      intensity: 3, // Default intensity
      context: description
    })).filter(t => t.name);

    const newEntry: SpendingEntry = {
      id: generateId(),
      timestamp: new Date(),
      amount: parseFloat(amount),
      category,
      description,
      isImpulsive,
      emotionalState,
      triggers: triggerList,
      location: location || undefined,
      preventionAttempted,
      preventionMethods: preventionMethods ? preventionMethods.split(',').map(m => m.trim()) : undefined,
      regretLevel
    };

    onAddEntry(newEntry);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setIsImpulsive(false);
    setMood(MoodLevel.NEUTRAL);
    setStressLevel(3);
    setEnergyLevel(3);
    setEmotionalTags('');
    setTriggers('');
    setLocation('');
    setPreventionAttempted(false);
    setPreventionMethods('');
    setRegretLevel(1);
    setIsAddingEntry(false);
  };

  const handleStartCooldown = (minutes: number) => {
    const cooldown = startCoolDown(minutes, 'Impulse spending prevention');
    onStartCooldown(cooldown);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Track Your Spending</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStartCooldown(10)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Clock className="h-4 w-4" />
            <span>10-min Cooldown</span>
          </button>
          <button
            onClick={() => setIsAddingEntry(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button 
          onClick={() => handleStartCooldown(5)}
          className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 text-center"
        >
          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
          <p className="text-sm font-medium">Feeling Triggered</p>
          <p className="text-xs text-gray-600">5-min pause</p>
        </button>
        
        <button 
          onClick={() => handleStartCooldown(15)}
          className="p-4 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 text-center"
        >
          <DollarSign className="h-6 w-6 mx-auto mb-2 text-red-600" />
          <p className="text-sm font-medium">Strong Urge</p>
          <p className="text-xs text-gray-600">15-min pause</p>
        </button>
        
        <button className="p-4 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 text-center">
          <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
          <p className="text-sm font-medium">Resisted Urge</p>
          <p className="text-xs text-gray-600">Log success</p>
        </button>
        
        <button 
          onClick={() => setIsAddingEntry(true)}
          className="p-4 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 text-center"
        >
          <Plus className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <p className="text-sm font-medium">Made Purchase</p>
          <p className="text-xs text-gray-600">Track it</p>
        </button>
      </div>

      {/* Add Entry Form */}
      {isAddingEntry && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Spending Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Clothing, Food, Entertainment"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you buy?"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isImpulsive"
                checked={isImpulsive}
                onChange={(e) => setIsImpulsive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isImpulsive" className="text-sm font-medium text-gray-700">
                This was an impulse purchase
              </label>
            </div>

            {/* Emotional State Section */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">How were you feeling?</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as MoodLevel)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={MoodLevel.VERY_LOW}>Very Low</option>
                    <option value={MoodLevel.LOW}>Low</option>
                    <option value={MoodLevel.NEUTRAL}>Neutral</option>
                    <option value={MoodLevel.GOOD}>Good</option>
                    <option value={MoodLevel.VERY_GOOD}>Very Good</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{stressLevel}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Energy Level (1-5)</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{energyLevel}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Triggers</label>
                <input
                  type="text"
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  placeholder="e.g., Stress, Boredom, Social media ad (separate with commas)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {isImpulsive && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regret Level (1-5)</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={regretLevel}
                  onChange={(e) => setRegretLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{regretLevel}</div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddingEntry(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Entries */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
        {recentEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No entries yet. Start tracking your spending!</p>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg border ${
                  entry.isImpulsive ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <p className="text-sm text-gray-600">{entry.category}</p>
                    {entry.triggers.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Triggers: {entry.triggers.map(t => t.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${entry.isImpulsive ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(entry.amount)}
                    </p>
                    {entry.isImpulsive && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Impulse
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};