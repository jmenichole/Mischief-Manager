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
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg mb-8 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            {isComplete ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Clock className="h-6 w-6" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {isComplete ? 'Cool-down Complete!' : 'Cool-down Active'}
            </h3>
            <p className="text-orange-100 text-sm">{cooldown.reason}</p>
          </div>
        </div>
        
        {onCancel && !isComplete && (
          <button
            onClick={onCancel}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {!isComplete ? (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Time remaining</span>
              <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-10 p-3 rounded-lg">
              <h4 className="font-semibold mb-1">Take Deep Breaths</h4>
              <p>Focus on slow, controlled breathing to reduce impulse intensity.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-3 rounded-lg">
              <h4 className="font-semibold mb-1">Ask Yourself</h4>
              <p>"Do I really need this? How will I feel about it tomorrow?"</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-3 rounded-lg">
              <h4 className="font-semibold mb-1">Alternative Activity</h4>
              <p>Go for a walk, call a friend, or engage in a hobby instead.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg mb-4">
            Great job taking time to pause and reflect! How are you feeling now?
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
              Still want to buy
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
              Changed my mind
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
              Need more time
            </button>
          </div>
        </div>
      )}
    </div>
  );
};