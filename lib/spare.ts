
type event = {
  event: string;
  impact: 'supply' | 'demand';
  impactMultiplier: number;
};

const RANDOM_EVENTS: event[] = [
  {
    event: 'Wind Surge',
    impact: 'supply',
    impactMultiplier: 1.2,
  },
  {
    event: 'Solar Panel Efficiency Drop',
    impact: 'supply',
    impactMultiplier: 0.7,
  },
  {
    event: 'Heatwave',
    impact: 'demand',
    impactMultiplier: 1.5,
  },
  {
    event: 'Industrial Strike',
    impact: 'demand',
    impactMultiplier: 0.6,
  },
  {
    event: 'Storm Damage to Grid',
    impact: 'supply',
    impactMultiplier: 0.4,
  },
  {
    event: 'Energy Conservation Campaign',
    impact: 'demand',
    impactMultiplier: 0.8,
  },
  {
    event: 'Hydroelectric Dam Peak Flow',
    impact: 'supply',
    impactMultiplier: 1.4,
  },
  {
    event: 'Cold Snap',
    impact: 'demand',
    impactMultiplier: 1.3,
  },
  {
    event: 'Power Plant Maintenance Completion',
    impact: 'supply',
    impactMultiplier: 1.1,
  },
  {
    event: 'Major Data Center Outage',
    impact: 'demand',
    impactMultiplier: 0.9,
  },
  {
    event: 'Grid Modernization Success',
    impact: 'supply',
    impactMultiplier: 1.25,
  },
];

function getRandomEvent() {
  const randomNum = Math.floor(Math.random() * RANDOM_EVENTS.length);
  return RANDOM_EVENTS[randomNum];
}