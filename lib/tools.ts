import {
  Battery,
  PowerOff,
  Car,
  Wrench,
  Home,
  Building2,
} from 'lucide-react';

export type ToolImpact = 'supply' | 'demand';
export type ToolType = 'slider' | 'toggle';

/**
 * Base tool interface
 */
export interface BaseTool {
  id: string;
  name: string;
  description: string;
  impact: ToolImpact;
  type: ToolType;
  icon: React.ElementType;
}

/**
 * Slider tool - continuous value control
 * Value represents the adjustment as a decimal (e.g., -0.15 = -15%, 0.10 = +10%)
 */
export interface SliderTool extends BaseTool {
  type: 'slider';
  min: number; // Minimum value (e.g., -0.15)
  max: number; // Maximum value (e.g., 0.15)
  step: number; // Step size (e.g., 0.01 for 1%)
  defaultValue: number; // Default/neutral value (usually 0)
}

/**
 * Toggle tool - on/off switch
 * When ON, applies the multiplier effect
 */
export interface ToggleTool extends BaseTool {
  type: 'toggle';
  multiplier: number; // Multiplier when toggle is ON (e.g., 0.85 = -15%, 1.10 = +10%)
}

export type Tool = SliderTool | ToggleTool;

/**
 * Tool state - tracks current value/state of each tool
 */
export interface ToolState {
  id: string;
  value: number; // For slider: current value, for toggle: 0 (off) or 1 (on)
}

// Slider Tools
export const SLIDER_TOOLS: SliderTool[] = [
  {
    id: 'ev-charging',
    name: 'EV Charging Control',
    description: 'Delay charging (left) or accelerate charging (right)',
    impact: 'demand',
    type: 'slider',
    min: -0.15, // -15% demand (delay charging)
    max: 0.15, // +15% demand (accelerate charging)
    step: 0.01,
    defaultValue: 0,
    icon: Car,
  },
  {
    id: 'residential-load',
    name: 'Residential Load Control',
    description: 'Decrease (left) or increase (right) residential consumption',
    impact: 'demand',
    type: 'slider',
    min: -0.15, // -15% demand
    max: 0.15, // +15% demand
    step: 0.01,
    defaultValue: 0,
    icon: Home,
  },
  {
    id: 'industrial-load',
    name: 'Industrial Load Shifting',
    description: 'Shift industrial loads to reduce (left) or increase (right) demand',
    impact: 'demand',
    type: 'slider',
    min: -0.20, // -20% demand
    max: 0.20, // +20% demand
    step: 0.01,
    defaultValue: 0,
    icon: Building2,
  },
  {
    id: 'battery-storage',
    name: 'Battery Storage Control',
    description: 'Send to storage (left) or draw from storage (right)',
    impact: 'supply',
    type: 'slider',
    min: -0.15, // -15% supply (sending to storage)
    max: 0.15, // +15% supply (drawing from storage)
    step: 0.01,
    defaultValue: 0,
    icon: Battery,
  },
];

// Toggle Tools
export const TOGGLE_TOOLS: ToggleTool[] = [
  {
    id: 'pause-non-essential',
    name: 'Pause Non-Essential Loads',
    description: 'Temporarily reduce power to non-critical systems',
    impact: 'demand',
    type: 'toggle',
    multiplier: 0.85, // -15% demand when ON
    icon: PowerOff,
  },
  {
    id: 'emergency-repairs',
    name: 'Emergency Repairs',
    description: 'Rapidly repair infrastructure to restore generation',
    impact: 'supply',
    type: 'toggle',
    multiplier: 1.10, // +10% supply when ON
    icon: Wrench,
  },
];

// Combined tool pool
export const ALL_TOOLS: Tool[] = [...SLIDER_TOOLS, ...TOGGLE_TOOLS];

// Helper function to get tool by ID
export function getToolById(id: string): Tool | undefined {
  return ALL_TOOLS.find((tool) => tool.id === id);
}

/**
 * Calculate the multiplier effect for a given tool and value
 * @param tool - The tool definition
 * @param value - The current value (for slider) or state (for toggle: 0/1)
 * @returns The multiplier to apply (e.g., 0.9 = -10%, 1.1 = +10%)
 */
export function calculateToolMultiplier(tool: Tool, value: number): number {
  if (tool.type === 'slider') {
    // For sliders, value is the direct adjustment (e.g., -0.10 = -10%)
    // Convert to multiplier: value of -0.10 becomes multiplier of 0.90
    return 1 + value;
  } else {
    // For toggles, value is 0 (off) or 1 (on)
    if (value === 0) {
      return 1; // No effect when off
    }
    return tool.multiplier; // Apply multiplier when on
  }
}

/**
 * Get default tool states (all tools at neutral/off position)
 */
export function getDefaultToolStates(): Record<string, number> {
  const states: Record<string, number> = {};

  ALL_TOOLS.forEach((tool) => {
    if (tool.type === 'slider') {
      states[tool.id] = tool.defaultValue;
    } else {
      states[tool.id] = 0; // Toggle off by default
    }
  });

  return states;
}
