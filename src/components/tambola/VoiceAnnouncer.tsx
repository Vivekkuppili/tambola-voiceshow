import React, { useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceAnnouncerProps {
  number: number | null;
  isEnabled: boolean;
  onToggle: () => void;
}

const numberToWords = (num: number): string => {
  const ones = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'
  ];
  
  const tens = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
  ];

  if (num < 20) {
    return ones[num];
  } else if (num < 100) {
    const tensDigit = Math.floor(num / 10);
    const onesDigit = num % 10;
    return tens[tensDigit] + (onesDigit > 0 ? ' ' + ones[onesDigit] : '');
  }
  
  return num.toString();
};

const getTambolaCallout = (num: number): string => {
  // Traditional Tambola callouts
  const callouts: { [key: number]: string } = {
    1: "Kelly's Eye, number one",
    2: "One little duck, number two",
    3: "Cup of tea, number three",
    4: "Knock at the door, number four",
    5: "Man alive, number five",
    6: "Half a dozen, number six",
    7: "Lucky seven",
    8: "Garden gate, number eight",
    9: "Doctor's orders, number nine",
    10: "Uncle's den, number ten",
    11: "Legs eleven",
    12: "One dozen, number twelve",
    13: "Unlucky for some, thirteen",
    16: "Sweet sixteen",
    18: "Coming of age, eighteen",
    21: "Key of the door, twenty one",
    22: "Two little ducks, twenty two",
    25: "Quarter of a century, twenty five",
    30: "Dirty Gertie, thirty",
    33: "Dirty knees, thirty three",
    40: "Life begins at forty",
    44: "Droopy drawers, forty four",
    50: "Half a century, fifty",
    55: "Snakes alive, fifty five",
    66: "Clickety click, sixty six",
    77: "Sunset strip, seventy seven",
    88: "Two fat ladies, eighty eight",
    90: "Top of the shop, ninety"
  };

  return callouts[num] || `Number ${numberToWords(num)}`;
};

export const VoiceAnnouncer: React.FC<VoiceAnnouncerProps> = ({
  number,
  isEnabled,
  onToggle
}) => {
  const speak = useCallback((text: string) => {
    if (!isEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    // Try to use a more pleasant voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Daniel') || 
      voice.name.includes('Samantha')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [isEnabled]);

  useEffect(() => {
    if (number !== null && isEnabled) {
      const callout = getTambolaCallout(number);
      // Add a small delay to let the animation start
      setTimeout(() => speak(callout), 500);
    }
  }, [number, isEnabled, speak]);

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className={cn(
          "transition-all duration-300",
          isEnabled 
            ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
        )}
      >
        {isEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
        <span className="ml-2 text-sm">
          {isEnabled ? "Voice On" : "Voice Off"}
        </span>
      </Button>
      
      {isEnabled && (
        <div className="text-xs text-muted-foreground">
          Voice announcements enabled
        </div>
      )}
    </div>
  );
};

import { cn } from '@/lib/utils';