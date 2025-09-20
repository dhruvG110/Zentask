// src/components/PomodoroTimer.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw } from 'lucide-react';

// Default durations in seconds. In the future, these can be fetched from user settings.
const FOCUS_DURATION = 25 * 60;
const SHORT_BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // This effect handles the core countdown logic.
  useEffect(() => {
    // This ensures the Audio object is only created on the client side.
    if (typeof window !== 'undefined' && !audioRef.current) {
        // NOTE: You need to add a sound file named 'notification.mp3' to your /public folder.
        audioRef.current = new Audio('/notification.mp3'); 
    }

    // If the timer is active and there's time left, count down.
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    
    } else if (timeRemaining === 0) {
      if (audioRef.current) audioRef.current.play(); // Play a sound
      handleTimerEnd();
    }

    // Update the browser tab title with the current time.
    document.title = `${formatTime(timeRemaining)} - ZenTask`;

    // Cleanup: This function runs when the component unmounts or dependencies change.
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  // Handles what happens when a timer session finishes.
  const handleTimerEnd = () => {
    setIsActive(false);
    if (mode === 'focus') {
      logFocusSession();
      // A simple cycle: after focus, go to a short break.
      // A more advanced version could track cycles to switch to a long break.
      switchMode('shortBreak');
    } else {
      // After any break, return to focus.
      switchMode('focus');
    }
  };

  // Calls the backend API to log a completed focus session.
  const logFocusSession = async () => {
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          durationMinutes: FOCUS_DURATION / 60,
          sessionType: 'FOCUS'
        }),
      });
      console.log("Focus session logged successfully.");
    } catch (error) {
      console.error("Failed to log session:", error);
    }
  };

  // Switches the timer to a new mode and resets the time.
  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    switch (newMode) {
      case 'focus':
        setTimeRemaining(FOCUS_DURATION);
        break;
      case 'shortBreak':
        setTimeRemaining(SHORT_BREAK_DURATION);
        break;
      case 'longBreak':
        setTimeRemaining(LONG_BREAK_DURATION);
        break;
    }
  };

  // Toggles the timer between the 'active' (running) and 'paused' state.
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Resets the timer to the start of the current mode.
  const resetTimer = () => {
    setIsActive(false);
    switchMode(mode);
  };

  // Formats the remaining seconds into a MM:SS string.
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-lg border bg-card p-6 shadow-sm">
      {/* Mode Selection Buttons */}
      <div className="flex gap-2 rounded-md bg-muted p-1">
        <Button variant={mode === 'focus' ? 'secondary' : 'ghost'} size="sm" onClick={() => switchMode('focus')}>Focus</Button>
        <Button variant={mode === 'shortBreak' ? 'secondary' : 'ghost'} size="sm" onClick={() => switchMode('shortBreak')}>Short Break</Button>
        <Button variant={mode === 'longBreak' ? 'secondary' : 'ghost'} size="sm" onClick={() => switchMode('longBreak')}>Long Break</Button>
      </div>

      {/* Time Display */}
      <div className="my-8 text-8xl font-bold tracking-tighter">
        {formatTime(timeRemaining)}
      </div>

      {/* Control Buttons */}
      <div className="flex w-full items-center justify-center gap-4">
        <Button 
          className="h-16 w-32 text-xl"
          onClick={toggleTimer}
        >
          {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button variant="outline" size="icon" className="h-16 w-16" onClick={resetTimer}>
            <RotateCcw />
            <span className="sr-only">Reset</span>
        </Button>
      </div>
    </div>
  );
}