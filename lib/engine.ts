import { ActiveEvent, ALL_EVENTS, createActiveEvent } from './events';
import { Tool, ALL_TOOLS, calculateToolMultiplier, getDefaultToolStates } from './tools';

export interface GameEngineConfig {
  initialPopulation?: number;
  initialTime?: number; // game time in years
  baseTickInterval?: number; // milliseconds
  timeGrowthRate?: number; // exponential growth rate for time acceleration
  populationGrowthRate?: number; // exponential growth rate for population
  populationVolatility?: number; // random variance factor (0-1)
  maxTickInterval?: number; // cap on how slow ticks can get
  minTickInterval?: number; // cap on how fast ticks can get
  targetGameYears?: number; // total game years to simulate
  targetRealMinutes?: number; // real time minutes for full simulation
  baseSupply?: number; // base energy supply
  eventCheckInterval?: number; // how many ticks between event checks
}

export interface GameState {
  currentTime: number;
  currentPopulation: number;
  tickCount: number;
  timeMultiplier: number;
  populationMultiplier: number;
  isRunning: boolean;
  activeEvents: ActiveEvent[];
  toolStates: Record<string, number>; // Current value/state of each tool
  totalDemand: number;
  totalSupply: number;
  capacityFactor: number; // demand / supply ratio (grid utilization)
  infrastructureTier: string; // Current infrastructure tier name
  warningCount: number;
  ticksInRedZone: number;
  isGameOver: boolean;
  gameOverReason?: string;
}

export type GameEventCallback = (state: GameState) => void;

export const BASE_DEMAND_PER_PERSON = 0.148; // kW per person

// Capacity factor thresholds (demand/supply ratio)
export const HEALTHY_CAPACITY_MIN = 0.8; // Below this is inefficient
export const HEALTHY_CAPACITY_MAX = 0.95; // Above this is risky/overload
export const TICKS_IN_RED_FOR_WARNING = 10; // Ticks in red zone before warning
export const MAX_WARNINGS = 3; // Game over after this many warnings

// Infrastructure tiers - supply upgrades at population milestones
export const INFRASTRUCTURE_TIERS = [
  { name: 'Small Village', population: 0, supply: 400 },           // Starting tier
  { name: 'Small Town', population: 10000, supply: 2000 },         // 10k people
  { name: 'Larger Town', population: 30000, supply: 6000 },        // 30k people
  { name: 'Industrial Town', population: 75000, supply: 15000 },   // 75k people
  { name: 'Small City', population: 150000, supply: 30000 },       // 150k people
  { name: 'Large City', population: 300000, supply: 60000 },       // 300k people
  { name: 'Metropolitan Area', population: 500000, supply: 100000 }, // 500k people
];
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
    // Default: grow from small village (2000) to large city (500000) over 100 game years in 7.5 real minutes
    const targetGameYears = config.targetGameYears ?? 100;
    const targetRealMinutes = config.targetRealMinutes ?? 7.5;

    // Calculate growth rate needed to go from initialPop to ~500k in targetGameYears
    // Using exponential growth: finalPop = initialPop * e^(rate * years)
    // rate = ln(finalPop / initialPop) / years
    const initialPop = config.initialPopulation ?? 2000;
    const targetPop = 500000;
    const calculatedGrowthRate = Math.log(targetPop / initialPop) / targetGameYears;

    this.config = {
      initialPopulation: initialPop,
      initialTime: config.initialTime ?? 0,
      baseTickInterval: config.baseTickInterval ?? 500, // tick twice per second
      timeGrowthRate: config.timeGrowthRate ?? 0.01, // time acceleration
      populationGrowthRate: config.populationGrowthRate ?? calculatedGrowthRate,
      populationVolatility: config.populationVolatility ?? 0.03, // 3% variance
      maxTickInterval: config.maxTickInterval ?? 2000,
      minTickInterval: config.minTickInterval ?? 100,
      targetGameYears,
      targetRealMinutes,
      baseSupply: config.baseSupply ?? 20000, // kW base supply
      eventCheckInterval: config.eventCheckInterval ?? 5,
    };

    this.currentTickInterval = this.config.baseTickInterval;

    const initialDemand = this.config.initialPopulation * BASE_DEMAND_PER_PERSON;
    const initialSupply = INFRASTRUCTURE_TIERS[0].supply; // Start with first tier

    this.state = {
      currentTime: this.config.initialTime,
      currentPopulation: this.config.initialPopulation,
      tickCount: 0,
      timeMultiplier: 1,
      populationMultiplier: 1,
      isRunning: false,
      activeEvents: [],
      toolStates: getDefaultToolStates(),
      totalDemand: initialDemand,
      totalSupply: initialSupply,
      capacityFactor: initialDemand / initialSupply,
      infrastructureTier: INFRASTRUCTURE_TIERS[0].name,
      warningCount: 0,
      ticksInRedZone: 0,
      isGameOver: false,
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
    const initialDemand = this.config.initialPopulation * BASE_DEMAND_PER_PERSON;
    const initialSupply = INFRASTRUCTURE_TIERS[0].supply; // Start with first tier

    this.state = {
      currentTime: this.config.initialTime,
      currentPopulation: this.config.initialPopulation,
      tickCount: 0,
      timeMultiplier: 1,
      populationMultiplier: 1,
      isRunning: false,
      activeEvents: [],
      toolStates: getDefaultToolStates(),
      totalDemand: initialDemand,
      totalSupply: initialSupply,
      capacityFactor: initialDemand / initialSupply,
      infrastructureTier: INFRASTRUCTURE_TIERS[0].name,
      warningCount: 0,
      ticksInRedZone: 0,
      isGameOver: false,
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

    // Calculate how many game years should pass in target real minutes
    // Each tick represents a fraction of the total game time
    const totalTicks = (this.config.targetRealMinutes * 60 * 1000) / this.config.baseTickInterval;
    const yearsPerTick = this.config.targetGameYears / totalTicks;

    // Time accelerates exponentially to simulate time feeling faster
    this.state.timeMultiplier = Math.exp(this.config.timeGrowthRate * this.state.tickCount);
    const acceleratedYearsPerTick = yearsPerTick * this.state.timeMultiplier;

    // Update time in years
    this.state.currentTime += acceleratedYearsPerTick;
    this.notifyListeners(this.onTimeTick);

    // Calculate population using exponential growth formula: P(t) = P0 * e^(rate * t)
    // where t is the current time in years
    const basePopulation = this.config.initialPopulation * Math.exp(
      this.config.populationGrowthRate * this.state.currentTime
    );

    // Add volatility - small random fluctuations around the base population
    const volatilityFactor = 1 + (Math.random() - 0.5) * 2 * this.config.populationVolatility;
    this.state.currentPopulation = basePopulation * volatilityFactor;

    // Update population multiplier for display purposes
    this.state.populationMultiplier = this.state.currentPopulation / this.config.initialPopulation;

    this.notifyListeners(this.onPopulationTick);

    // Event management - check for new events and remove expired ones
    this.updateEvents();

    // Calculate network demand and supply with event and tool multipliers
    this.calculateNetworkMetrics();

    // Check network pressure and track warnings
    this.checkNetworkPressure();

    // Update tick interval (gets slower over time exponentially, but capped)
    // This makes the game feel faster as time goes on
    this.currentTickInterval = Math.min(
      this.config.maxTickInterval,
      Math.max(
        this.config.minTickInterval,
        this.config.baseTickInterval * (1 + Math.log(1 + this.state.timeMultiplier))
      )
    );

    // Notify general state update listeners
    this.notifyListeners(this.onStateUpdate);
  }

  /**
   * Update active events - add new ones and remove expired ones
   * Max 4 events active at any time, new event every EVENT_CHECK_INTERVAL ticks when possible
   */
  private updateEvents(): void {
    const MAX_ACTIVE_EVENTS = 4;
    const EVENT_CHECK_INTERVAL = this.config.eventCheckInterval;

    // Remove expired events (based on tick count)
    this.state.activeEvents = this.state.activeEvents.filter(
      event => event.endTick > this.state.tickCount
    );

    // Check for new events every EVENT_CHECK_INTERVAL ticks
    if (this.state.tickCount % EVENT_CHECK_INTERVAL === 0) {
      // Only add new event if we have fewer than MAX_ACTIVE_EVENTS active events
      if (this.state.activeEvents.length < MAX_ACTIVE_EVENTS) {
        // Try to find a suitable event to trigger
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loop

        while (attempts < maxAttempts) {
          const randomEvent = ALL_EVENTS[Math.floor(Math.random() * ALL_EVENTS.length)];

          // Check if event isn't already active
          const isAlreadyActive = this.state.activeEvents.some(e => e.id === randomEvent.id);

          // Check if event conflicts with any active events
          const hasConflict = randomEvent.conflicts?.some(conflictId =>
            this.state.activeEvents.some(activeEvent => activeEvent.id === conflictId)
          ) ?? false;

          if (!isAlreadyActive && !hasConflict) {
            // Create and add the active event (using tick count)
            const activeEvent = createActiveEvent(randomEvent, this.state.tickCount);
            this.state.activeEvents.push(activeEvent);
            break; // Event successfully added, exit loop
          }

          attempts++;
        }
      }
    }
  }

  /**
   * Set the value/state of a tool
   * @param toolId - The ID of the tool to update
   * @param value - For sliders: the value (-0.15 to 0.15), for toggles: 0 (off) or 1 (on)
   */
  setToolValue(toolId: string, value: number): void {
    this.state.toolStates[toolId] = value;

    // Recalculate metrics immediately
    this.calculateNetworkMetrics();
    this.notifyListeners(this.onStateUpdate);
  }

  /**
   * Get the current value/state of a tool
   */
  getToolValue(toolId: string): number {
    return this.state.toolStates[toolId] ?? 0;
  }

  /**
   * Calculate network demand, supply, and pressure
   * Formula: (Population * Demand) + events + tools = pressure on network
   */
  private calculateNetworkMetrics(): void {
    // Base demand from population
    const baseDemand = this.state.currentPopulation * BASE_DEMAND_PER_PERSON;

    // Apply demand event multipliers
    const demandEventMultiplier = this.state.activeEvents
      .filter(e => e.impact === 'demand')
      .reduce((acc, event) => acc * event.multiplier, 1);

    // Apply demand tool multipliers
    const demandToolMultiplier = ALL_TOOLS
      .filter((tool: Tool) => tool.impact === 'demand')
      .reduce((acc: number, tool: Tool) => {
        const value = this.state.toolStates[tool.id] ?? 0;
        const multiplier = calculateToolMultiplier(tool, value);
        return acc * multiplier;
      }, 1);

    this.state.totalDemand = baseDemand * demandEventMultiplier * demandToolMultiplier;

    // Base supply from infrastructure tier (jumps at population milestones)
    const currentTier = this.getInfrastructureTier(this.state.currentPopulation);
    const baseSupply = currentTier.supply;
    this.state.infrastructureTier = currentTier.name;

    // Apply supply event multipliers
    const supplyEventMultiplier = this.state.activeEvents
      .filter(e => e.impact === 'supply')
      .reduce((acc, event) => acc * event.multiplier, 1);

    // Apply supply tool multipliers
    const supplyToolMultiplier = ALL_TOOLS
      .filter((tool: Tool) => tool.impact === 'supply')
      .reduce((acc: number, tool: Tool) => {
        const value = this.state.toolStates[tool.id] ?? 0;
        const multiplier = calculateToolMultiplier(tool, value);
        return acc * multiplier;
      }, 1);

    this.state.totalSupply = baseSupply * supplyEventMultiplier * supplyToolMultiplier;

    // Calculate capacity factor (demand/supply ratio)
    // Healthy range is 0.8-0.95 (80-95% utilization)
    this.state.capacityFactor = this.state.totalDemand / this.state.totalSupply;
  }

  /**
   * Get infrastructure tier based on current population
   * Returns the tier object for the highest tier the population has reached
   */
  private getInfrastructureTier(population: number) {
    // Find the highest tier we've reached (iterate backwards from highest to lowest)
    for (let i = INFRASTRUCTURE_TIERS.length - 1; i >= 0; i--) {
      if (population >= INFRASTRUCTURE_TIERS[i].population) {
        return INFRASTRUCTURE_TIERS[i];
      }
    }
    // Fallback to first tier (should never happen)
    return INFRASTRUCTURE_TIERS[0];
  }

  /**
   * Check capacity factor and issue warnings if in red zone
   * Red zone is below HEALTHY_CAPACITY_MIN or above HEALTHY_CAPACITY_MAX
   */
  private checkNetworkPressure(): void {
    if (this.state.isGameOver) return;

    const isInRedZone =
      this.state.capacityFactor < HEALTHY_CAPACITY_MIN ||
      this.state.capacityFactor > HEALTHY_CAPACITY_MAX;

    if (isInRedZone) {
      this.state.ticksInRedZone++;

      // Issue warning after being in red zone for 10 ticks
      if (this.state.ticksInRedZone === TICKS_IN_RED_FOR_WARNING) {
        this.state.warningCount++;
        this.state.ticksInRedZone = 0; // Reset counter

        // Check if game should end
        if (this.state.warningCount >= MAX_WARNINGS) {
          this.state.isGameOver = true;
          this.state.isRunning = false;
          this.state.gameOverReason =
            this.state.capacityFactor > HEALTHY_CAPACITY_MAX
              ? 'Grid overload! Demand exceeded safe operating capacity.'
              : 'Grid underutilized! Excessive unused capacity is wasteful and costly.';
          this.stop();
        }
      }
    } else {
      // Reset red zone counter if we're back in healthy range
      this.state.ticksInRedZone = 0;
    }
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
