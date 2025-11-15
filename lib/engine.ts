export interface GameEngineConfig {
  initialPopulation?: number;
  initialTime?: number;
  baseTickInterval?: number; // milliseconds
  timeGrowthRate?: number; // exponential growth rate for time acceleration
  populationGrowthRate?: number; // exponential growth rate for population
  maxTickInterval?: number; // cap on how slow ticks can get
  minTickInterval?: number; // cap on how fast ticks can get
}

export interface GameState {
  currentTime: number;
  currentPopulation: number;
  tickCount: number;
  timeMultiplier: number;
  populationMultiplier: number;
  isRunning: boolean;
}

export type GameEventCallback = (state: GameState) => void;

export class GameEngine {
  private state: GameState;
  private config: Required<GameEngineConfig>;
  private tickIntervalId: NodeJS.Timeout | null = null;
  private currentTickInterval: number;

  // Event callbacks
  private onTimeTick: GameEventCallback[] = [];
  private onPopulationTick: GameEventCallback[] = [];
  private onStateUpdate: GameEventCallback[] = [];

  constructor(config: GameEngineConfig = {}) {
    this.config = {
      initialPopulation: config.initialPopulation ?? 1000,
      initialTime: config.initialTime ?? 0,
      baseTickInterval: config.baseTickInterval ?? 1000,
      timeGrowthRate: config.timeGrowthRate ?? 0.001,
      populationGrowthRate: config.populationGrowthRate ?? 0.002,
      maxTickInterval: config.maxTickInterval ?? 5000,
      minTickInterval: config.minTickInterval ?? 100,
    };

    this.currentTickInterval = this.config.baseTickInterval;

    this.state = {
      currentTime: this.config.initialTime,
      currentPopulation: this.config.initialPopulation,
      tickCount: 0,
      timeMultiplier: 1,
      populationMultiplier: 1,
      isRunning: false,
    };
  }

  /**
   * Start the game engine
   */
  start(): void {
    if (this.state.isRunning) {
      console.warn('GameEngine is already running');
      return;
    }

    this.state.isRunning = true;
    this.scheduleTick();
  }

  /**
   * Stop the game engine
   */
  stop(): void {
    if (this.tickIntervalId) {
      clearTimeout(this.tickIntervalId);
      this.tickIntervalId = null;
    }
    this.state.isRunning = false;
  }

  /**
   * Reset the game engine to initial state
   */
  reset(): void {
    this.stop();
    this.state = {
      currentTime: this.config.initialTime,
      currentPopulation: this.config.initialPopulation,
      tickCount: 0,
      timeMultiplier: 1,
      populationMultiplier: 1,
      isRunning: false,
    };
    this.currentTickInterval = this.config.baseTickInterval;
  }

  /**
   * Schedule the next tick with exponentially increasing interval
   */
  private scheduleTick(): void {
    if (!this.state.isRunning) return;

    this.tickIntervalId = setTimeout(() => {
      this.tick();
      this.scheduleTick();
    }, this.currentTickInterval);
  }

  /**
   * Main game tick - updates time and population
   */
  private tick(): void {
    this.state.tickCount++;

    // Calculate exponential multipliers based on tick count
    this.state.timeMultiplier = Math.exp(this.config.timeGrowthRate * this.state.tickCount);
    this.state.populationMultiplier = Math.exp(this.config.populationGrowthRate * this.state.tickCount);

    // Update time (each tick represents time passing, accelerating exponentially)
    const timeIncrement = 1 * this.state.timeMultiplier;
    this.state.currentTime += timeIncrement;
    this.notifyListeners(this.onTimeTick);

    // Update population (grows exponentially)
    const populationIncrement = this.config.initialPopulation *
      (this.state.populationMultiplier - 1) / 100; // Smaller increments
    this.state.currentPopulation += populationIncrement;
    this.notifyListeners(this.onPopulationTick);

    // Update tick interval (gets slower over time exponentially)
    this.currentTickInterval = Math.min(
      this.config.maxTickInterval,
      Math.max(
        this.config.minTickInterval,
        this.config.baseTickInterval * this.state.timeMultiplier
      )
    );

    // Notify general state update listeners
    this.notifyListeners(this.onStateUpdate);
  }

  /**
   * Notify all listeners with current state
   */
  private notifyListeners(listeners: GameEventCallback[]): void {
    listeners.forEach(callback => callback(this.getState()));
  }

  /**
   * Register a callback for time tick events
   */
  onTimeTickEvent(callback: GameEventCallback): () => void {
    this.onTimeTick.push(callback);
    return () => {
      this.onTimeTick = this.onTimeTick.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for population tick events
   */
  onPopulationTickEvent(callback: GameEventCallback): () => void {
    this.onPopulationTick.push(callback);
    return () => {
      this.onPopulationTick = this.onPopulationTick.filter(cb => cb !== callback);
    };
  }

  /**
   * Register a callback for any state update
   */
  onStateUpdateEvent(callback: GameEventCallback): () => void {
    this.onStateUpdate.push(callback);
    return () => {
      this.onStateUpdate = this.onStateUpdate.filter(cb => cb !== callback);
    };
  }

  /**
   * Get current game state (immutable copy)
   */
  getState(): Readonly<GameState> {
    return { ...this.state };
  }

  /**
   * Manually set population (for game events, disasters, etc.)
   */
  setPopulation(population: number): void {
    this.state.currentPopulation = Math.max(0, population);
    this.notifyListeners(this.onStateUpdate);
  }

  /**
   * Manually adjust population by a delta
   */
  adjustPopulation(delta: number): void {
    this.setPopulation(this.state.currentPopulation + delta);
  }

  /**
   * Manually set time
   */
  setTime(time: number): void {
    this.state.currentTime = Math.max(0, time);
    this.notifyListeners(this.onStateUpdate);
  }

  /**
   * Get current tick interval (for debugging)
   */
  getCurrentTickInterval(): number {
    return this.currentTickInterval;
  }
}
