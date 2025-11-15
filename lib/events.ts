import {
  Factory,
  Trophy,
  Snowflake,
  Flame,
  Gift,
  CloudSun,
  TrendingDown,
  Wind,
  CloudOff,
  CloudDrizzle,
  CloudRain,
  ThermometerSun,
  Zap,
  Sparkles,
} from 'lucide-react';

export type EventImpact = 'supply' | 'demand';

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  impact: EventImpact;
  multiplier: number; // 0.9 = -10%, 1.1 = +10%, etc.
  duration: number; // in ticks
  probability: number; // 0-1, chance of occurring per check
  conflicts?: string[]; // IDs of events that can't be active at the same time
  icon: React.ElementType;
}

export interface ActiveEvent extends GameEvent {
  startTime: number; // game time when event started
  endTime: number; // game time when event will end
}

// Demand Events - affect energy consumption
export const DEMAND_EVENTS: GameEvent[] = [
  {
    id: 'factory-shift',
    name: 'Factory Shift Change',
    description: 'Major industrial facilities starting operations',
    impact: 'demand',
    multiplier: 1.3,
    duration: 5, // 2 ticks
    probability: 0.15,
    icon: Factory,
  },
  {
    id: 'sports-event',
    name: 'Major Sports Event',
    description: 'Large sporting event causing spike in viewership',
    impact: 'demand',
    multiplier: 1.2,
    duration: 3, // 0.4 ticks
    probability: 0.08,
    icon: Trophy,
  },
  {
    id: 'cold-weather',
    name: 'Cold Weather Snap',
    description: 'Unseasonably cold weather increasing heating demand',
    impact: 'demand',
    multiplier: 1.4,
    duration: 7, // 1 tick
    probability: 0.12,
    conflicts: ['heatwave-demand', 'mild-weather'],
    icon: Snowflake,
  },
  {
    id: 'heatwave-demand',
    name: 'Heatwave',
    description: 'Extreme heat causing air conditioning surge',
    impact: 'demand',
    multiplier: 1.35,
    duration: 6, // 0.8 ticks
    probability: 0.1,
    conflicts: ['cold-weather', 'mild-weather'],
    icon: Flame,
  },
  {
    id: 'holiday-season',
    name: 'Holiday Season',
    description: 'Increased residential energy consumption during holidays',
    impact: 'demand',
    multiplier: 1.15,
    duration: 4, // 0.6 ticks
    probability: 0.2,
    icon: Gift,
  },
  {
    id: 'mild-weather',
    name: 'Mild Weather',
    description: 'Pleasant temperatures reducing heating/cooling needs',
    impact: 'demand',
    multiplier: 0.85,
    duration: 11, // 1.2 ticks
    probability: 0.15,
    conflicts: ['cold-weather', 'heatwave-demand'],
    icon: CloudSun,
  },
];

// Supply Events - affect energy generation
export const SUPPLY_EVENTS: GameEvent[] = [
  {
    id: 'wind-surge',
    name: 'Wind Surge',
    description: 'Strong consistent winds boosting wind power generation',
    impact: 'supply',
    multiplier: 1.3,
    duration: 4, // 0.2 ticks
    probability: 0.12,
    conflicts: ['wind-drop'],
    icon: Wind,
  },
  {
    id: 'solar-dip',
    name: 'Solar Dip',
    description: 'Extended cloudy period reducing solar output',
    impact: 'supply',
    multiplier: 0.7,
    duration: 7, // 0.15 ticks
    probability: 0.15,
    conflicts: ['optimal-conditions'],
    icon: CloudOff,
  },
  {
    id: 'wind-drop',
    name: 'Wind Drop',
    description: 'Calm weather reducing wind power generation',
    impact: 'supply',
    multiplier: 0.75,
    duration: 5, // 0.25 ticks
    probability: 0.15,
    conflicts: ['wind-surge'],
    icon: Wind,
  },
  {
    id: 'drought',
    name: 'Drought',
    description: 'Low water levels affecting hydroelectric generation',
    impact: 'supply',
    multiplier: 0.8,
    duration: 4, // 0.5 ticks
    probability: 0.08,
    conflicts: ['extreme-downpour', 'optimal-conditions'],
    icon: CloudDrizzle,
  },
  {
    id: 'extreme-downpour',
    name: 'Extreme Downpour',
    description: 'Heavy rainfall boosting hydroelectric output',
    impact: 'supply',
    multiplier: 1.25,
    duration: 3, // 0.1 ticks
    probability: 0.1,
    conflicts: ['drought'],
    icon: CloudRain,
  },
  {
    id: 'heatwave-supply',
    name: 'Heatwave (Infrastructure)',
    description: 'Extreme heat causing equipment efficiency losses',
    impact: 'supply',
    multiplier: 0.85,
    duration: 5, // 0.2 ticks
    probability: 0.1,
    conflicts: ['extreme-cold'],
    icon: ThermometerSun,
  },
  {
    id: 'extreme-cold',
    name: 'Extreme Cold',
    description: 'Freezing conditions damaging infrastructure',
    impact: 'supply',
    multiplier: 0.65,
    duration: 8, // 0.15 ticks
    probability: 0.07,
    conflicts: ['heatwave-supply', 'optimal-conditions'],
    icon: Snowflake,
  },
  {
    id: 'optimal-conditions',
    name: 'Optimal Generation Conditions',
    description: 'Perfect weather conditions for renewable energy',
    impact: 'supply',
    multiplier: 1.2,
    duration: 5, // 0.25 ticks
    probability: 0.1,
    conflicts: ['solar-dip', 'extreme-cold', 'drought'],
    icon: Sparkles,
  },
];

// Combined event pool
export const ALL_EVENTS: GameEvent[] = [...DEMAND_EVENTS, ...SUPPLY_EVENTS];

// Helper function to get a random event
export function getRandomEvent(): GameEvent | null {
  const event = ALL_EVENTS[Math.floor(Math.random() * ALL_EVENTS.length)];

  return event;
}

// Helper function to check if an event should trigger
export function shouldTriggerEvent(event: GameEvent): boolean {
  return Math.random() < event.probability;
}

// Helper function to create an active event
export function createActiveEvent(
  event: GameEvent,
  currentTime: number
): ActiveEvent {
  return {
    ...event,
    startTime: currentTime,
    endTime: currentTime + event.duration,
  };
}
