"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/lib/context/game-context";

export default function Monitors() {
  const { gameState } = useGameContext();
  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="font-semibold text-slate-900">
          Grid Capacity Factor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Gauge Bar */}
        <div className="relative h-12 mb-4">
          <div className="absolute inset-0 flex">
            {/* Red zone (0-80%) */}
            <div className="flex-[80] bg-red-100 border-2 border-red-300 rounded-l-lg flex items-center justify-center">
              <span className="text-xs font-medium text-red-700">
                Inefficient
              </span>
            </div>
            {/* Green zone (80-95%) */}
            <div className="flex-[15] bg-green-100 border-y-2 border-green-300 flex items-center justify-center">
              <span className="text-xs font-medium text-green-700">
                Optimal
              </span>
            </div>
            {/* Red zone (95-100%) */}
            <div className="flex-[5] bg-red-100 border-y-2 border-r-2 border-red-300 flex items-center justify-center">
              <span className="text-xs font-medium text-red-700">Risk</span>
            </div>
          </div>

          {/* Current capacity factor indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-slate-900 transition-all duration-300"
            style={{
              left: `${Math.min(gameState.capacityFactor * 100, 100)}%`,
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-900 whitespace-nowrap">
              {(gameState.capacityFactor * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
          <span>0%</span>
          <span className="font-semibold text-green-700">80%</span>
          <span className="font-semibold text-green-700">95%</span>
          <span className="font-semibold text-red-700">100%</span>
        </div>

        {/* Warnings */}
        {/* <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-3 rounded border-2 ${
              gameState.warningCount >= 3
                ? "bg-red-100 border-red-400"
                : gameState.warningCount > 0
                ? "bg-orange-100 border-orange-300"
                : "bg-green-100 border-green-300"
            }`}
          >
            <p className="text-sm font-medium text-slate-700 mb-1">Warnings</p>
            <p
              className={`text-2xl font-bold ${
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
          <div className="p-3 rounded border-2 bg-slate-50 border-slate-300">
            <p className="text-sm font-medium text-slate-700 mb-1">
              Ticks in Red Zone
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {gameState.ticksInRedZone} / 10
            </p>
          </div>
        </div> */}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700 font-medium mb-1">
                Total Demand
              </p>
              <p className="text-2xl font-bold text-amber-900">
                {Math.floor(gameState.totalDemand).toLocaleString()} kW
              </p>
            </div>
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-4">
              <p className="text-sm text-cyan-700 font-medium mb-1">
                Total Supply
              </p>
              <p className="text-2xl font-bold text-cyan-900">
                {Math.floor(gameState.totalSupply).toLocaleString()} kW
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium mb-1">
                Years Elapsed
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {gameState.currentTime.toFixed(1)} years
              </p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium mb-1">
                Population
              </p>
              <p className="text-2xl font-bold text-green-900">
                {Math.floor(gameState.currentPopulation).toLocaleString()}
              </p>
              <p className="text-xs text-green-700 font-medium mt-1">
                {gameState.infrastructureTier}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
