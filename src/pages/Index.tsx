import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TambolaTicket, generateMultipleTickets, TambolaTicketData } from '@/components/tambola/TambolaTicket';
import { NumberPicker3D } from '@/components/tambola/NumberPicker3D';
import { VoiceAnnouncer } from '@/components/tambola/VoiceAnnouncer';
import { NumberHistory } from '@/components/tambola/NumberHistory';
import { useTambolaGame } from '@/hooks/useTambolaGame';
import { Plus, Ticket, Play, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const {
    gameState,
    addTickets,
    startGame,
    pickNumber,
    resetGame,
    isVoiceEnabled,
    toggleVoice,
    isPickingEnabled
  } = useTambolaGame();

  const [ticketCount, setTicketCount] = useState(1);

  const handleGenerateTickets = () => {
    const newTickets = generateMultipleTickets(ticketCount);
    addTickets(newTickets);
    toast({
      title: "Tickets Generated!",
      description: `${ticketCount} new ticket${ticketCount > 1 ? 's' : ''} added to the game.`,
    });
  };

  const handleStartGame = () => {
    if (gameState.tickets.length === 0) {
      toast({
        title: "No Tickets!",
        description: "Please generate at least one ticket before starting the game.",
        variant: "destructive"
      });
      return;
    }
    startGame();
    toast({
      title: "Game Started!",
      description: "Good luck! Start picking numbers.",
    });
  };

  const handlePickNumber = () => {
    pickNumber();
  };

  const handleResetGame = () => {
    resetGame();
    toast({
      title: "Game Reset",
      description: "Starting fresh! Generate new tickets to begin.",
    });
  };

  const calledNumbersSet = new Set(gameState.calledNumbers);

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-secondary-foreground mb-2">
                🎯 Tambola Game
              </h1>
              <p className="text-secondary-foreground/80">
                Classic Indian Bingo with 3D animations and voice announcements
              </p>
            </div>
            <div className="flex items-center gap-4">
              <VoiceAnnouncer
                number={gameState.currentNumber}
                isEnabled={isVoiceEnabled}
                onToggle={toggleVoice}
              />
              <div className="text-right">
                <div className="text-sm text-secondary-foreground/80">Status</div>
                <div className="font-semibold text-secondary-foreground capitalize">
                  {gameState.gameStatus}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Controls & Number Picker */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Controls */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Ticket className="h-5 w-5" />
                  Game Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-card-foreground">
                      Tickets to generate:
                    </label>
                    <select
                      value={ticketCount}
                      onChange={(e) => setTicketCount(Number(e.target.value))}
                      className="bg-input border border-border rounded px-2 py-1 text-foreground"
                      disabled={gameState.gameStatus === 'playing'}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Button
                    onClick={handleGenerateTickets}
                    disabled={gameState.gameStatus === 'playing'}
                    variant="outline"
                    className="bg-accent text-accent-foreground border-accent hover:bg-accent/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Tickets
                  </Button>

                  <Button
                    onClick={handleStartGame}
                    disabled={gameState.gameStatus === 'playing' || gameState.tickets.length === 0}
                    className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Game
                  </Button>

                  <Button
                    onClick={handleResetGame}
                    variant="destructive"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Game
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Tickets: {gameState.tickets.length}</span>
                  <span>Called: {gameState.calledNumbers.length}/90</span>
                  {gameState.winners.length > 0 && (
                    <span className="text-primary font-medium">
                      <Trophy className="h-4 w-4 inline mr-1" />
                      Winners: {gameState.winners.length}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 3D Number Picker */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">Number Picker</CardTitle>
              </CardHeader>
              <CardContent>
                <NumberPicker3D
                  currentNumber={gameState.currentNumber}
                  onPickNumber={handlePickNumber}
                  isPickingEnabled={isPickingEnabled}
                  calledNumbers={calledNumbersSet}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Number History */}
          <div>
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="pt-6">
                <NumberHistory
                  calledNumbers={gameState.calledNumbers}
                  currentNumber={gameState.currentNumber}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tickets Grid */}
        {gameState.tickets.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Game Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gameState.tickets.map((ticket) => {
                const hasWin = gameState.winners.some(w => w.ticketId === ticket.id);
                return (
                  <div key={ticket.id} className="relative">
                    <TambolaTicket
                      ticket={ticket}
                      calledNumbers={calledNumbersSet}
                      className={cn(
                        hasWin && "ring-2 ring-primary animate-celebration"
                      )}
                    />
                    {hasWin && (
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold animate-bounce-in">
                        <Trophy className="h-4 w-4 inline mr-1" />
                        Winner!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No tickets message */}
        {gameState.tickets.length === 0 && (
          <div className="mt-8 text-center py-12">
            <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Tickets Yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate some tickets to start playing Tambola!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;