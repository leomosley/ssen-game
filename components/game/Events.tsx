"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/lib/context/game-context";
import { type GameEvent } from "@/lib/events";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const EventCard = (props: GameEvent) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        className={cn(
          props.multiplier >= 1 ? "border-green-300" : "border-red-300",
          "border-2 p-1"
        )}
      >
        <CardHeader className="gap-1">
          <CardTitle>
            <span className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <props.icon />
                {props.name}
              </div>
              {props.impact.toUpperCase()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>{props.description}</CardContent>
      </Card>
    </motion.div>
  );
};

export default function Events() {
  const { gameState } = useGameContext();

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {gameState.activeEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
