import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, X } from 'lucide-react';
import { CooldownPeriod } from '../types';
import { getMinutesSince, isCoolDownActive } from '../utils/habitTracking';

interface CooldownTimerProps {
  cooldown: CooldownPeriod;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({ 
  cooldown, 
  onComplete, 
  onCancel 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = getMinutesSince(cooldown.startTime);
      const remaining = cooldown.durationMinutes - elapsed;
      
      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown, onComplete]);

  if (!isCoolDownActive(cooldown) && !isComplete) {
    return null;
  }

  const progress = ((cooldown.durationMinutes - timeRemaining) / cooldown.durationMinutes) * 100;
  const minutes = Math.floor(timeRemaining);
  const seconds = Math.floor((timeRemaining - minutes) * 60);

  return (
    <div className="bg-gradient-to-br from-mindful-sky-400 via-mindful-sage-400 to-mindful-earth-400 text-white p-6 rounded-xl mb-8 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
            {isComplete ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {isComplete ? '🌟 Cool-down Complete!' : '🧘‍♀️ Mindful Pause Active'}
            </h3>
            <p className="text-white/80 text-sm">{cooldown.reason}</p>
          </div>
        </div>
        
        {onCancel && !isComplete && (
          <button
            onClick={onCancel}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {!isComplete ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-white/90">Time remaining</span>
              <span className="font-mono text-white">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className="bg-white/20 rounded-full h-4 backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-white via-mindful-sage-100 to-white h-4 rounded-full transition-all duration-1000 ease-linear shadow-inner"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold mb-2 text-white flex items-center">
                🫁 <span className="ml-2">Take Deep Breaths</span>
              </h4>
              <p className="text-white/90">Focus on slow, mindful breathing to create space between impulse and action.</p>
            </div>
            
            <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold mb-2 text-white flex items-center">
                💭 <span className="ml-2">Gentle Reflection</span>
              </h4>
              <p className="text-white/90">"What am I really seeking? How might my future self feel about this choice?"</p>
            </div>
            
            <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <h4 className="font-semibold mb-2 text-white flex items-center">
                🌱 <span className="ml-2">Nurturing Alternative</span>
              </h4>
              <p className="text-white/90">Connect with nature, reach out to loved ones, or engage in a creative activity.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg mb-6 text-white/95">
            🌟 Wonderful! You've created space for mindful reflection. How are you feeling in this moment?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
              Still interested
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
              Feeling grateful I waited
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20">
              Need more reflection time
            </button>
          </div>
        </div>
      )}
    </div>
  );
};