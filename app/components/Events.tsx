'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type GameEvent, getRandomEvent } from '@/lib/events';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const EventCard = (props: GameEvent) => {    
  return (
    <Card className={cn(props.multiplier >= 1 ? "bg-green-100" : "bg-red-100")}>
      <CardHeader>
        <CardTitle>
          <span className='flex'>{props.impact.toUpperCase()} - {props.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.description}
      </CardContent>
    </Card>
  );
};

export default function Events() {
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>([]);

  const renderRandomEvent = () => {    
    if (activeEvents.length < 3) {
      const newEvent = getRandomEvent();      
      if (newEvent) setActiveEvents([...activeEvents, newEvent]);
      return
    }
  };

  return (
    <Card className="w-[50dvw] h-[40dvh]">
      {/* <CardHeader className='flex'>
        <CardTitle>Events</CardTitle>
      </CardHeader> */}
      <CardContent>
        <Button onClick={renderRandomEvent}>Add Event</Button>
        {activeEvents.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </CardContent>
    </Card>
  );
}
