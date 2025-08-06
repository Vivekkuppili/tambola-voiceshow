import { useState, useCallback, useEffect } from 'react';
import { TambolaTicketData } from '@/components/tambola/TambolaTicket';

export interface TambolaGameState {
  tickets: TambolaTicketData[];
  calledNumbers: number[];
  currentNumber: number | null;
  availableNumbers: number[];
  gameStatus: 'waiting' | 'playing' | 'completed';
  winners: {
    ticketId: string;
    type: 'line' | 'full-house';
    timestamp: number;
  }[];
}

export const useTambolaGame = () => {
  const [gameState, setGameState] = useState<TambolaGameState>({
    tickets: [],
    calledNumbers: [],
    currentNumber: null,
    availableNumbers: Array.from({ length: 90 }, (_, i) => i + 1),
    gameStatus: 'waiting',
    winners: []
  });

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const addTickets = useCallback((newTickets: TambolaTicketData[]) => {
    setGameState(prev => ({
      ...prev,
      tickets: [...prev.tickets, ...newTickets]
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing'
    }));
  }, []);

  const pickNumber = useCallback(() => {
    setGameState(prev => {
      if (prev.availableNumbers.length === 0 || prev.gameStatus !== 'playing') {
        return prev;
      }

      const randomIndex = Math.floor(Math.random() * prev.availableNumbers.length);
      const pickedNumber = prev.availableNumbers[randomIndex];
      
      const newAvailableNumbers = prev.availableNumbers.filter(num => num !== pickedNumber);
      const newCalledNumbers = [...prev.calledNumbers, pickedNumber];
      
      const newGameStatus = newAvailableNumbers.length === 0 ? 'completed' : 'playing';

      return {
        ...prev,
        currentNumber: pickedNumber,
        calledNumbers: newCalledNumbers,
        availableNumbers: newAvailableNumbers,
        gameStatus: newGameStatus
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      tickets: [],
      calledNumbers: [],
      currentNumber: null,
      availableNumbers: Array.from({ length: 90 }, (_, i) => i + 1),
      gameStatus: 'waiting',
      winners: []
    });
  }, []);

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
  }, []);

  // Check for wins
  const checkWins = useCallback((tickets: TambolaTicketData[], calledNumbers: number[]) => {
    const calledSet = new Set(calledNumbers);
    const newWinners: TambolaGameState['winners'] = [];

    tickets.forEach(ticket => {
      // Check for full house
      const allNumbers = ticket.numbers.flat().filter(num => num !== null) as number[];
      const isFullHouse = allNumbers.every(num => calledSet.has(num));
      
      if (isFullHouse) {
        const existingWin = gameState.winners.find(w => 
          w.ticketId === ticket.id && w.type === 'full-house'
        );
        if (!existingWin) {
          newWinners.push({
            ticketId: ticket.id,
            type: 'full-house',
            timestamp: Date.now()
          });
        }
      }

      // Check for lines
      ticket.numbers.forEach((row, rowIndex) => {
        const rowNumbers = row.filter(num => num !== null) as number[];
        const isLine = rowNumbers.every(num => calledSet.has(num));
        
        if (isLine) {
          const existingWin = gameState.winners.find(w => 
            w.ticketId === ticket.id && w.type === 'line'
          );
          if (!existingWin) {
            newWinners.push({
              ticketId: ticket.id,
              type: 'line',
              timestamp: Date.now()
            });
          }
        }
      });
    });

    if (newWinners.length > 0) {
      setGameState(prev => ({
        ...prev,
        winners: [...prev.winners, ...newWinners]
      }));
    }
  }, [gameState.winners]);

  // Check for wins when numbers are called
  useEffect(() => {
    if (gameState.calledNumbers.length > 0 && gameState.tickets.length > 0) {
      checkWins(gameState.tickets, gameState.calledNumbers);
    }
  }, [gameState.calledNumbers, gameState.tickets, checkWins]);

  return {
    gameState,
    addTickets,
    startGame,
    pickNumber,
    resetGame,
    isVoiceEnabled,
    toggleVoice,
    isPickingEnabled: gameState.gameStatus === 'playing' && gameState.availableNumbers.length > 0
  };
};