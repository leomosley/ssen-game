'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useGame, UseGameOptions, UseGameReturn } from '../hooks/use-game';

// Create the context with undefined as default
const GameContext = createContext<UseGameReturn | undefined>(undefined);

// Provider component props
interface GameProviderProps {
  children: ReactNode;
  options?: UseGameOptions;
}

/**
 * GameProvider - Provides game state and controls to all child components
 *
 * @example
 * ```tsx
 * <GameProvider options={{ initialPopulation: 2000, targetGameYears: 100 }}>
 *   <YourApp />
 * </GameProvider>
 * ```
 */
export function GameProvider({ children, options = {} }: GameProviderProps) {
  const gameContext = useGame(options);

  return (
    <GameContext.Provider value={gameContext}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * useGameContext - Hook to access game state and controls
 * Must be used within a GameProvider
 *
 * @example
 * ```tsx
 * const { gameState, toggle, reset, applyTool } = useGameContext();
 * ```
 */
export function useGameContext() {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }

  return context;
}
