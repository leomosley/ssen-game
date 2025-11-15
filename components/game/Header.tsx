"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGameContext } from "@/lib/context/game-context";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export default function Header() {
  const { gameState } = useGameContext();

  // Calculate event multipliers
  const supplyEventMultiplier = gameState.activeEvents
    .filter((e) => e.impact === "supply")
    .reduce((acc, event) => acc * event.multiplier, 1);

  const demandEventMultiplier = gameState.activeEvents
    .filter((e) => e.impact === "demand")
    .reduce((acc, event) => acc * event.multiplier, 1);

  // Calculate percentage change
  const supplyChange = ((supplyEventMultiplier - 1) * 100).toFixed(0);
  const demandChange = ((demandEventMultiplier - 1) * 100).toFixed(0);

  return (
    <Card className="w-full h-fit">
      <CardContent className="py-2 px-4">
        <div className="flex items-center justify-between gap-3">
          {/* Warnings */}
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`w-4 h-4 ${
                gameState.warningCount >= 3
                  ? "text-red-600"
                  : gameState.warningCount > 0
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            />
            <div>
              <p className="text-[10px] text-slate-600 font-medium leading-tight">Warnings</p>
              <p
                className={`text-base font-bold leading-tight ${
                  gameState.warningCount >= 3
                    ? "text-red-900"
                    : gameState.warningCount > 0
                    ? "text-orange-900"
                    : "text-green-900"
                }`}
              >
                {gameState.warningCount} / 3
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200" />

          {/* Supply Event Multiplier */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <div>
              <p className="text-[10px] text-slate-600 font-medium leading-tight">
                Supply Events
              </p>
              <p
                className={`text-base font-bold leading-tight ${
                  supplyEventMultiplier > 1
                    ? "text-green-900"
                    : supplyEventMultiplier < 1
                    ? "text-red-900"
                    : "text-slate-900"
                }`}
              >
                {supplyEventMultiplier > 1 ? "+" : ""}
                {supplyChange}%
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200" />

          {/* Demand Event Multiplier */}
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-[10px] text-slate-600 font-medium leading-tight">
                Demand Events
              </p>
              <p
                className={`text-base font-bold leading-tight ${
                  demandEventMultiplier > 1
                    ? "text-red-900"
                    : demandEventMultiplier < 1
                    ? "text-green-900"
                    : "text-slate-900"
                }`}
              >
                {demandEventMultiplier > 1 ? "+" : ""}
                {demandChange}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
