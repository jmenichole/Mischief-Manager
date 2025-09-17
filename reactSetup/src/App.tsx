import React, { useState } from 'react';
import { SpendingEntry, CooldownPeriod } from './types';
import { HabitTracker } from './components/HabitTracker';

function App() {
  const [entries, setEntries] = useState<SpendingEntry[]>([]);
  const [cooldownPeriod, setCooldownPeriod] = useState<CooldownPeriod | undefined>();

  const handleAddEntry = (entry: SpendingEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const handleStartCooldown = (period: CooldownPeriod) => {
    setCooldownPeriod(period);
  };

  return (
    <HabitTracker
      entries={entries}
      onAddEntry={handleAddEntry}
      cooldownPeriod={cooldownPeriod}
      onStartCooldown={handleStartCooldown}
    />
  );
}

export default App;
