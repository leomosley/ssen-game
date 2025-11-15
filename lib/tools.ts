import {
  Battery,
  PowerOff,
  Car,
  Zap,
  Wrench,
  Home,
  Building2,
} from 'lucide-react';

export type ToolImpact = 'supply' | 'demand';
export type ToolType = 'instant' | 'duration';

export interface Tool {
  id: string;
  name: string;
  description: string;
  impact: ToolImpact;
  type: ToolType;
  multiplier: number; // Effect strength
  duration?: number; // Duration in game years (for duration tools)
  cooldown: number; // Cooldown in game years
  cost?: number; // Optional cost (for future use)
  icon: React.ElementType;
}

export interface ActiveTool extends Tool {
  startTime: number;
  endTime: number;
  isOnCooldown: boolean;
  cooldownEndTime: number;
}

// Supply Tools - increase energy supply
export const SUPPLY_TOOLS: Tool[] = [
  {
    id: 'battery-discharge',
    name: 'Battery Discharge',
    description: 'Release stored energy from battery systems',
    impact: 'supply',
    type: 'duration',
    multiplier: 1.15, // +15% supply
    duration: 0.08, // ~1 month
    cooldown: 0.25, // 3 months cooldown
    icon: Battery,
  },
  {
    id: 'fix-infrastructure',
    name: 'Emergency Repairs',
    description: 'Rapidly repair damaged infrastructure to restore generation',
    impact: 'supply',
    type: 'instant',
    multiplier: 1.1, // +10% supply
    cooldown: 0.5, // 6 months cooldown
    icon: Wrench,
  },
];

// Demand Tools - reduce energy demand
export const DEMAND_TOOLS: Tool[] = [
  {
    id: 'pause-non-essential',
    name: 'Pause Non-Essential Loads',
    description: 'Temporarily reduce power to non-critical systems',
    impact: 'demand',
    type: 'duration',
    multiplier: 0.85, // -15% demand
    duration: 0.05, // ~2 weeks
    cooldown: 0.17, // ~2 months cooldown
    icon: PowerOff,
  },
  {
    id: 'delay-ev-charging',
    name: 'Delay EV Charging',
    description: 'Postpone electric vehicle charging to off-peak hours',
    impact: 'demand',
    type: 'duration',
    multiplier: 0.9, // -10% demand
    duration: 0.08, // ~1 month
    cooldown: 0.25, // 3 months cooldown
    icon: Car,
  },
  {
    id: 'accelerate-ev-charging',
    name: 'Accelerate EV Charging',
    description: 'Encourage early EV charging during surplus periods',
    impact: 'demand',
    type: 'duration',
    multiplier: 1.12, // +12% demand (to use excess supply)
    duration: 0.05, // ~2 weeks
    cooldown: 0.17, // ~2 months cooldown
    icon: Zap,
  },
  {
    id: 'residential-reduction',
    name: 'Residential Load Reduction',
    description: 'Public campaign to reduce household energy usage',
    impact: 'demand',
    type: 'duration',
    multiplier: 0.92, // -8% demand
    duration: 0.17, // ~2 months
    cooldown: 0.5, // 6 months cooldown
    icon: Home,
  },
  {
    id: 'industrial-shift',
    name: 'Industrial Load Shifting',
    description: 'Coordinate with industries to shift high-demand operations',
    impact: 'demand',
    type: 'duration',
    multiplier: 0.88, // -12% demand
    duration: 0.08, // ~1 month
    cooldown: 0.33, // ~4 months cooldown
    icon: Building2,
  },
];

// Combined tool pool
export const ALL_TOOLS: Tool[] = [...SUPPLY_TOOLS, ...DEMAND_TOOLS];

// Helper function to get tool by ID
export function getToolById(id: string): Tool | undefined {
  return ALL_TOOLS.find(tool => tool.id === id);
}

// Helper function to create an active tool
export function createActiveTool(tool: Tool, currentTime: number): ActiveTool {
  const endTime = tool.type === 'duration' && tool.duration
    ? currentTime + tool.duration
    : currentTime;

  return {
    ...tool,
    startTime: currentTime,
    endTime,
    isOnCooldown: false,
    cooldownEndTime: currentTime + tool.cooldown,
  };
}
