import { ActiveEvent, ALL_EVENTS, createActiveEvent } from './events';
import { ActiveTool, Tool, createActiveTool } from './tools';

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
  activeTools: ActiveTool[];
  totalDemand: number;
  totalSupply: number;
  networkPressure: number; // demand / supply ratio
}

export type GameEventCallback = (state: GameState) => void;

export const BASE_DEMAND_PER_PERSON = 0.148; // kW per person
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
      eventCheckInterval: config.eventCheckInterval ?? 20, // check for events every 20 ticks
    };

    this.currentTickInterval = this.config.baseTickInterval;

    const initialDemand = this.config.initialPopulation * BASE_DEMAND_PER_PERSON;
    const initialSupply = this.config.baseSupply;

    this.state = {
      currentTime: this.config.initialTime,
      currentPopulation: this.config.initialPopulation,
      tickCount: 0,
      timeMultiplier: 1,
      populationMultiplier: 1,
      isRunning: false,
      activeEvents: [],
      activeTools: [],
      totalDemand: initialDemand,
      totalSupply: initialSupply,
      networkPressure: initialDemand / initialSupply,
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
    const initialSupply = this.config.baseSupply;

    this.state = {
      currentTime: this.config.initialTime,
      currentPopulation: this.config.initialPopulation,
      tickCount: 0,
      timeMultiplier: 1,
      populationMultiplier: 1,
      isRunning: false,
      activeEvents: [],
      activeTools: [],
      totalDemand: initialDemand,
      totalSupply: initialSupply,
      networkPressure: initialDemand / initialSupply,
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

    // Tool management - remove expired tools and update cooldowns
    this.updateTools();

    // Calculate network demand and supply with event and tool multipliers
    this.calculateNetworkMetrics();

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
   * Max 4 events active at any time, new event every 10 ticks when possible
   */
  private updateEvents(): void {
    const MAX_ACTIVE_EVENTS = 4;
    const EVENT_CHECK_INTERVAL = 10;

    // Remove expired events
    this.state.activeEvents = this.state.activeEvents.filter(
      event => event.endTime > this.state.currentTime
    );

    // Check for new events every 10 ticks
    if (this.state.tickCount % EVENT_CHECK_INTERVAL === 0) {
      // Only add new event if we have fewer than 4 active events
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
            // Create and add the active event
            const activeEvent = createActiveEvent(randomEvent, this.state.currentTime);
            this.state.activeEvents.push(activeEvent);
            break; // Event successfully added, exit loop
          }

          attempts++;
        }
      }
    }
  }

  /**
   * Update active tools - remove expired ones and update cooldowns
   */
  private updateTools(): void {
    // Remove expired tools
    this.state.activeTools = this.state.activeTools.filter(tool => {
      if (tool.endTime > this.state.currentTime) {
        return true;
      }
      // Tool expired, set to cooldown
      tool.isOnCooldown = true;
      return false;
    });

    // Update cooldown status
    this.state.activeTools.forEach(tool => {
      if (tool.isOnCooldown && this.state.currentTime >= tool.cooldownEndTime) {
        tool.isOnCooldown = false;
      }
    });
  }

  /**
   * Use a tool to manage network pressure
   */
  useTool(tool: Tool): boolean {
    // Check if tool is already active or on cooldown
    const existingTool = this.state.activeTools.find(t => t.id === tool.id);
    if (existingTool && (existingTool.endTime > this.state.currentTime || existingTool.isOnCooldown)) {
      return false; // Tool is active or on cooldown
    }

    // Create and add active tool
    const activeTool = createActiveTool(tool, this.state.currentTime);
    this.state.activeTools.push(activeTool);

    // Recalculate metrics immediately
    this.calculateNetworkMetrics();
    this.notifyListeners(this.onStateUpdate);

    return true;
  }

  /**
   * Check if a tool is available (not active and not on cooldown)
   */
  isToolAvailable(toolId: string): boolean {
    const tool = this.state.activeTools.find(t => t.id === toolId);
    if (!tool) return true; // Tool has never been used

    return this.state.currentTime >= tool.cooldownEndTime;
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

    // Apply demand tool multipliers (only active tools, not on cooldown)
    const demandToolMultiplier = this.state.activeTools
      .filter(t => t.impact === 'demand' && t.endTime > this.state.currentTime)
      .reduce((acc, tool) => acc * tool.multiplier, 1);

    this.state.totalDemand = baseDemand * demandEventMultiplier * demandToolMultiplier;

    // Base supply (grows slowly with population to keep pace somewhat)
    const baseSupply = this.config.baseSupply + (this.state.currentPopulation - this.config.initialPopulation) * 2;

    // Apply supply event multipliers
    const supplyEventMultiplier = this.state.activeEvents
      .filter(e => e.impact === 'supply')
      .reduce((acc, event) => acc * event.multiplier, 1);

    // Apply supply tool multipliers (only active tools, not on cooldown)
    const supplyToolMultiplier = this.state.activeTools
      .filter(t => t.impact === 'supply' && t.endTime > this.state.currentTime)
      .reduce((acc, tool) => acc * tool.multiplier, 1);

    this.state.totalSupply = baseSupply * supplyEventMultiplier * supplyToolMultiplier;

    // Calculate network pressure (demand/supply ratio)
    // Ideal pressure is around 0.8-0.9 (80-90% utilization)
    this.state.networkPressure = this.state.totalDemand / this.state.totalSupply;
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
