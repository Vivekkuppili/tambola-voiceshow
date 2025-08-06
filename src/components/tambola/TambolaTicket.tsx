import React from 'react';
import { cn } from '@/lib/utils';

export interface TambolaTicketData {
  id: string;
  numbers: (number | null)[][];
}

interface TambolaTicketProps {
  ticket: TambolaTicketData;
  calledNumbers: Set<number>;
  className?: string;
  onCellClick?: (number: number) => void;
}

export const TambolaTicket: React.FC<TambolaTicketProps> = ({
  ticket,
  calledNumbers,
  className,
  onCellClick
}) => {
  return (
    <div className={cn(
      "bg-gradient-card rounded-lg border-2 border-tambola-border p-4",
      "shadow-card animate-ticket-appear",
      "hover:shadow-golden transition-all duration-300",
      className
    )}>
      <div className="grid grid-cols-9 gap-1 mb-2">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="text-center text-xs font-semibold text-muted-foreground py-1">
            {i === 0 ? '1-10' : `${i * 10 + 1}-${(i + 1) * 10}`}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-9 gap-1">
        {ticket.numbers.flat().map((number, index) => {
          const isCalled = number !== null && calledNumbers.has(number);
          
          return (
            <div
              key={index}
              className={cn(
                "aspect-square flex items-center justify-center rounded border",
                "text-sm font-bold transition-all duration-300 cursor-pointer",
                number === null 
                  ? "bg-muted border-border" 
                  : isCalled
                    ? "bg-tambola-called border-tambola-called text-white shadow-glow animate-bounce-in"
                    : "bg-tambola-cell border-tambola-border text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-105"
              )}
              onClick={() => number && onCellClick?.(number)}
            >
              {number}
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-xs font-medium text-muted-foreground">
          Ticket #{ticket.id}
        </span>
      </div>
    </div>
  );
};

export const generateTambolaTicket = (): TambolaTicketData => {
  const ticket: (number | null)[][] = Array(3).fill(null).map(() => Array(9).fill(null));
  
  // Generate numbers for each column according to Tambola rules
  const columnNumbers: number[][] = Array(9).fill(null).map((_, col) => {
    const min = col * 10 + (col === 0 ? 1 : 1);
    const max = col * 10 + 10;
    const numbers: number[] = [];
    
    for (let i = min; i <= max; i++) {
      numbers.push(i);
    }
    
    // Shuffle and take first 3 for this column
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    return numbers.slice(0, 3).sort((a, b) => a - b);
  });
  
  // Place numbers in rows ensuring each row has exactly 5 numbers
  for (let row = 0; row < 3; row++) {
    const availableColumns = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // Shuffle columns
    for (let i = availableColumns.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableColumns[i], availableColumns[j]] = [availableColumns[j], availableColumns[i]];
    }
    
    // Take first 5 columns for this row
    const selectedColumns = availableColumns.slice(0, 5).sort((a, b) => a - b);
    
    selectedColumns.forEach(col => {
      if (columnNumbers[col].length > 0) {
        ticket[row][col] = columnNumbers[col].shift()!;
      }
    });
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    numbers: ticket
  };
};

export const generateMultipleTickets = (count: number): TambolaTicketData[] => {
  return Array.from({ length: count }, () => generateTambolaTicket());
};