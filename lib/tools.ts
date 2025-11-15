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
  info: string; // Detailed information about the tool
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
    info: 'Delaying EV charging helps the energy network by reducing peak demand and relieving stress on local and regional feeders. When charging is paused or shifted to off-peak periods, it prevents overloading of transformers and lines, maintains voltage stability, and reduces the risk of outages. This allows the grid to better integrate variable renewable generation, such as solar and wind, by aligning electricity demand with periods of higher supply. Aggregated EVs can act as flexible loads, responding to grid signals to charge at optimal times, which decreases the need for expensive peaker plants and improves overall efficiency. While essential services remain unaffected, strategically delaying non-essential EV charging enhances grid resilience, lowers operational costs, and supports a more stable, low-carbon electricity system.',
    impact: 'demand',
    type: 'slider',
    min: -0.30, // -15% demand (delay charging)
    max: 0.30, // +15% demand (accelerate charging)
    step: 0.1,
    defaultValue: 0,
    icon: Car,
  },
  {
    id: 'residential-load',
    name: 'Residential Load Control',
    description: 'Decrease (left) or increase (right) residential consumption',
    info: 'Residential load reduction helps the energy network by temporarily lowering electricity demand from households, easing stress on local feeders, transformers, and substations during peak periods. By reducing or pausing non-essential appliances such as heating, cooling, or EV charging, the grid can maintain voltage stability, prevent overloads, and reduce the risk of outages. Coordinated residential load reduction also supports the integration of variable renewable generation by shifting consumption to align with periods of high renewable output. This flexibility decreases reliance on expensive peaker plants, improves overall grid efficiency, and enhances system resilience. When effectively managed, residential load reduction provides a controllable, distributed resource that helps balance supply and demand while minimizing disruption to essential household services.',
    impact: 'demand',
    type: 'slider',
    min: -0.5, // -15% demand
    max: 0.5, // +15% demand
    step: 0.1,
    defaultValue: 0,
    icon: Home,
  },
  {
    id: 'industrial-load',
    name: 'Industrial Load Shifting',
    description: 'Shift industrial loads to reduce (left) or increase (right) demand',
    info: 'Shifting industrial loads allows the energy network to better balance supply and demand by moving large electricity consumption from peak periods to times of lower demand. By temporarily reducing or delaying energy-intensive processes, factories and industrial sites can relieve stress on local and regional feeders, prevent overloading of transformers, and maintain voltage stability. This flexibility helps the grid integrate variable renewable generation by aligning industrial consumption with periods of high renewable output, such as daytime solar peaks. Coordinated load shifting can reduce the need for expensive peaker plants, lower operational costs, and improve overall grid efficiency. When managed effectively, industrial load shifting enhances grid resilience, supports a low-carbon energy system, and provides a controllable resource that operators can use to maintain stability without affecting essential production processes.',
    impact: 'demand',
    type: 'slider',
    min: -0.8, // -20% demand
    max: 1, // +20% demand
    step: 0.1,
    defaultValue: 0,
    icon: Building2,
  },
  {
    id: 'battery-storage',
    name: 'Battery Storage Control',
    description: 'Send to storage (left) or draw from storage (right)',
    info: 'Batteries help manage the electricity grid by acting as flexible energy storage that can absorb excess electricity when supply exceeds demand and release it when demand exceeds supply. They are used for peak shaving, discharging during periods of high demand to reduce stress on the grid; load shifting, storing energy during low-demand periods and releasing it during high-demand periods; and frequency regulation, quickly injecting or absorbing power to maintain grid stability around 50 Hz. Batteries also provide local backup during outages and reduce renewable energy curtailment by capturing otherwise wasted solar or wind power. They can be connected at utility, distribution, or residential levels, with utility-scale batteries helping balance regional grids, distribution-level batteries managing local voltage and feeder capacity, and aggregated residential or commercial batteries acting like virtual power plants. Key metrics include capacity (kWh) for total stored energy, power (kW) for charging/discharging speed, response time for how quickly the battery reacts to signals, and state of charge (SoC) indicating current energy stored. Grid operators, such as DNOs or National Grid, send signals to batteries to optimize charge and discharge, which reduces the need for traditional peaker plants, lowers carbon emissions, and improves overall grid flexibility and resilience.',
    impact: 'supply',
    type: 'slider',
    min: -0.8, // -15% supply (sending to storage)
    max: 1.5, // +15% supply (drawing from storage)
    step: 0.1,
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
    info: 'Pausing non-essential loads, it temporarily reduces electricity demand to help balance supply and prevent stress on the grid. Non-essential loads might include appliances, electric vehicle charging, or industrial processes that are not immediately critical. By pausing these loads, the network can relieve congestion on feeders, maintain voltage stability, and prevent overloading of transformers or lines. This action supports the integration of variable renewable generation, allowing the grid to absorb excess supply or respond to shortfalls more effectively. Flexibility tools like batteries or demand-side response can complement this strategy by storing energy when demand is low and releasing it when needed. While essential services like hospitals, lighting, and heating continue uninterrupted, temporarily pausing non-essential loads can help avoid outages, improve grid resilience, and reduce reliance on expensive peaker generation, all while maintaining overall stability and reliability.',
    impact: 'demand',
    type: 'toggle',
    multiplier: 0.85, // -15% demand when ON
    icon: PowerOff,
  },
  {
    id: 'emergency-repairs',
    name: 'Emergency Repairs',
    description: 'Rapidly repair infrastructure to restore generation',
    info: 'Emergency repairs can significantly disrupt the electricity grid by causing unexpected outages and forcing temporary adjustments to the network. When a fault occurs, such as a damaged transformer, downed cable, or fallen pole, affected sections may lose power instantly, impacting homes, businesses, or critical infrastructure. Grid operators must reroute electricity around the damaged section, which can overload nearby feeders, cause voltage drops, and potentially trigger automatic load-shedding or rolling outages. Flexibility tools like batteries and demand-side response may be used to compensate for lost supply, discharging stored energy or reducing demand in the affected area. Emergency repairs also increase operational complexity and risk, as temporary circuits or bypasses can stress the network, and safety protocols often slow restoration. Prolonged or repeated repairs reduce grid reliability, increase operational costs, and highlight the need for additional redundancy or flexibility. Overall, emergency repairs disrupt the balance of supply and demand, require careful management of network assets, and can affect both customers and the wider grid’s stability.',
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
