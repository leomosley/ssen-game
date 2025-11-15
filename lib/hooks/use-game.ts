import { useEffect, useState, useRef, useCallback } from 'react';
import { GameEngine, GameState, GameEngineConfig } from '../engine';
import { Tool } from '../tools';

export interface UseGameOptions extends GameEngineConfig {
  autoStart?: boolean;
}

export interface UseGameReturn {
  gameState: GameState;
  tickInterval: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  toggle: () => void;
  applyTool: (tool: Tool) => boolean;
  isToolAvailable: (toolId: string) => boolean;
}

export function useGame(options: UseGameOptions = {}): UseGameReturn {
  const { autoStart = true, ...engineConfig } = options;

  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentTime: 0,
    currentPopulation: 0,
    tickCount: 0,
    timeMultiplier: 1,
    populationMultiplier: 1,
    isRunning: false,
    activeEvents: [],
    activeTools: [],
    totalDemand: 0,
    totalSupply: 0,
    capacityFactor: 0,
    infrastructureTier: 'Small Village',
    warningCount: 0,
    ticksInRedZone: 0,
    isGameOver: false,
  });
  const [tickInterval, setTickInterval] = useState<number>(500);

  useEffect(() => {
    // Initialize the game engine
    const engine = new GameEngine(engineConfig);
    engineRef.current = engine;

    // Subscribe to state updates
    const unsubscribe = engine.onStateUpdateEvent((state) => {
      setGameState(state);
      setTickInterval(engine.getCurrentTickInterval());
    });

    // Auto-start if enabled
    if (autoStart) {
      engine.start();
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
      engine.stop();
    };
  }, []); // Empty deps - only initialize once

  const start = useCallback(() => {
    engineRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    engineRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
      setGameState(engineRef.current.getState());
      setTickInterval(engineRef.current.getCurrentTickInterval());
    }
  }, []);

  const toggle = useCallback(() => {
    if (engineRef.current) {
      if (gameState.isRunning) {
        engineRef.current.stop();
      } else {
        engineRef.current.start();
      }
    }
  }, [gameState.isRunning]);

  const applyTool = useCallback((tool: Tool): boolean => {
    if (engineRef.current) {
      return engineRef.current.useTool(tool);
    }
    return false;
  }, []);

  const isToolAvailable = useCallback((toolId: string): boolean => {
    if (engineRef.current) {
      return engineRef.current.isToolAvailable(toolId);
    }
    return true;
  }, []);

  return {
    gameState,
    tickInterval,
    start,
    stop,
    reset,
    toggle,
    applyTool,
    isToolAvailable,
  };
}
