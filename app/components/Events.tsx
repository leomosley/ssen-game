'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/lib/context/game-context';
import { type GameEvent, getRandomEvent } from '@/lib/events';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const EventCard = (props: GameEvent) => {
  return (
    <Card className={cn(props.multiplier >= 1 ? 'border-green-300' : 'border-red-300', "border-2 p-1")}>
      <CardHeader className='gap-1'>
        <CardTitle>
          <span className="flex items-center gap-2 justify-between">
            <div className='flex items-center gap-2'>
              <props.icon />
              {props.name}
            </div>
            {props.impact.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>{props.description}</CardContent>
    </Card>
  );
};

export default function Events() {
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>([]);
  const { gameState } = useGameContext()

  const renderRandomEvent = () => {
    if (activeEvents.length < 3) {
      const newEvent = getRandomEvent();
      if (newEvent) setActiveEvents([...activeEvents, newEvent]);
      return;
    }
  };

  return (
    <Card className="w-[50dvw] h-[40dvh] flex-col gap-2">
      <CardHeader className='flex'>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className='flex-col gap-1 flex'>
        {gameState.activeEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </CardContent>
    </Card>
  );
}
