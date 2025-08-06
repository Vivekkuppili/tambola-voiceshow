import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NumberPicker3DProps {
  currentNumber: number | null;
  onPickNumber: () => void;
  isPickingEnabled: boolean;
  calledNumbers: Set<number>;
}

export const NumberPicker3D: React.FC<NumberPicker3DProps> = ({
  currentNumber,
  onPickNumber,
  isPickingEnabled,
  calledNumbers
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentNumber) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentNumber]);

  // Generate some decorative numbers for visual effect
  const decorativeNumbers = Array.from({ length: 12 }, (_, i) => {
    const number = Math.floor(Math.random() * 90) + 1;
    const angle = (i / 12) * 360;
    return { number, angle, delay: i * 0.1 };
  });

  return (
    <div className="relative">
      <div className="h-96 w-full bg-gradient-to-br from-muted/20 to-background rounded-lg overflow-hidden border border-border relative">
        {/* Decorative Background Numbers */}
        <div className="absolute inset-0 overflow-hidden">
          {decorativeNumbers.map((item, index) => (
            <div
              key={index}
              className={cn(
                "absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold",
                "bg-tambola-cell border border-tambola-border text-muted-foreground",
                "transition-all duration-1000",
                calledNumbers.has(item.number) ? "bg-tambola-called text-white" : "",
                isAnimating && "animate-spin"
              )}
              style={{
                left: `${50 + 35 * Math.cos((item.angle * Math.PI) / 180)}%`,
                top: `${50 + 35 * Math.sin((item.angle * Math.PI) / 180)}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${item.delay}s`
              }}
            >
              {item.number}
            </div>
          ))}
        </div>

        {/* Central Picking Area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            "w-32 h-32 rounded-full border-4 border-tambola-border",
            "bg-gradient-primary flex items-center justify-center",
            "shadow-golden transition-all duration-500",
            isAnimating && "animate-golden-pulse scale-110"
          )}>
            <div className="text-center">
              <div className="text-xs font-medium text-primary-foreground mb-1">
                {currentNumber ? "Called" : "Next"}
              </div>
              <div className="text-2xl font-bold text-primary-foreground">
                {currentNumber || "?"}
              </div>
            </div>
          </div>
        </div>

        {/* Number History Indicator */}
        <div className="absolute top-4 right-4 text-sm text-muted-foreground">
          {calledNumbers.size}/90
        </div>
      </div>
      
      {/* Current Number Display */}
      {currentNumber && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-lg shadow-golden animate-number-reveal text-4xl font-bold">
            {currentNumber}
          </div>
        </div>
      )}
      
      {/* Pick Number Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <button
          onClick={onPickNumber}
          disabled={!isPickingEnabled}
          className={cn(
            "bg-gradient-primary text-primary-foreground px-8 py-3 rounded-lg",
            "font-semibold shadow-golden transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:scale-105 hover:shadow-glow active:scale-95"
          )}
        >
          {isPickingEnabled ? "Pick Number" : "Game Complete"}
        </button>
      </div>
    </div>
  );
};