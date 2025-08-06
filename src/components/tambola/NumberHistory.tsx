import React from 'react';
import { cn } from '@/lib/utils';

interface NumberHistoryProps {
  calledNumbers: number[];
  currentNumber: number | null;
  className?: string;
}

export const NumberHistory: React.FC<NumberHistoryProps> = ({
  calledNumbers,
  currentNumber,
  className
}) => {
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-foreground">Number History</h3>
      
      <div className="bg-gradient-card p-4 rounded-lg border border-border">
        <div className="grid grid-cols-10 gap-1">
          {allNumbers.map(number => {
            const isCalled = calledNumbers.includes(number);
            const isCurrent = number === currentNumber;
            
            return (
              <div
                key={number}
                className={cn(
                  "aspect-square flex items-center justify-center text-xs font-medium rounded border transition-all duration-300",
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary animate-golden-pulse scale-110"
                    : isCalled
                      ? "bg-tambola-called text-white border-tambola-called"
                      : "bg-tambola-pending text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {number}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Called: {calledNumbers.length}</span>
        <span>Remaining: {90 - calledNumbers.length}</span>
      </div>
    </div>
  );
};