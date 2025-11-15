"use client";

import { useState } from "react";
import { GameProvider, useGameContext } from "@/lib/context/game-context";
import { SLIDER_TOOLS, TOGGLE_TOOLS, Tool } from "@/lib/tools";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Info, X } from "lucide-react";

function TestEngineContent() {
  const { gameState, tickInterval, toggle, reset, setToolValue, getToolValue } =
    useGameContext();
  const [infoDialogTool, setInfoDialogTool] = useState<Tool | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-start justify-start py-16 px-8 bg-white gap-8">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">
            Game Engine Test
          </h1>
          <p className="text-zinc-600">
            Real-time display of exponential time and population growth
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4">
          <button
            onClick={toggle}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              gameState.isRunning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {gameState.isRunning ? "Stop" : "Start"}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg font-semibold bg-zinc-200 hover:bg-zinc-300 text-zinc-900 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Game State Display */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Section */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              Game Time
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Years Elapsed
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {gameState.currentTime.toFixed(1)} years
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Time Acceleration
                </p>
                <p className="text-2xl font-semibold text-blue-800">
                  {gameState.timeMultiplier.toFixed(2)}x
                </p>
              </div>
            </div>
          </div>

          {/* Population Section */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-900 mb-4">
              Population
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Current Population
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {Math.floor(gameState.currentPopulation).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Settlement Type
                </p>
                <p className="text-xl font-semibold text-green-800">
                  {gameState.infrastructureTier}
                </p>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">
              System Stats
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Total Ticks
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {gameState.tickCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Engine Status
                </p>
                <p
                  className={`text-xl font-semibold ${
                    gameState.isRunning ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {gameState.isRunning ? "Running" : "Stopped"}
                </p>
              </div>
            </div>
          </div>

          {/* Tick Interval */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-orange-900 mb-4">
              Tick Info
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-orange-700 font-medium">
                  Current Tick Interval
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {tickInterval.toFixed(0)}ms
                </p>
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">
                  Growth Pattern
                </p>
                <p className="text-lg font-semibold text-orange-800">
                  Exponential
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Network Metrics */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div
            className={`border-2 rounded-lg p-4 ${
              gameState.capacityFactor < 0.8
                ? "bg-red-50 border-red-200"
                : gameState.capacityFactor < 0.95
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-1 ${
                gameState.capacityFactor < 0.8
                  ? "text-red-700"
                  : gameState.capacityFactor < 0.95
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              Capacity Factor
            </p>
            <p
              className={`text-2xl font-bold ${
                gameState.capacityFactor < 0.8
                  ? "text-red-900"
                  : gameState.capacityFactor < 0.95
                  ? "text-green-900"
                  : "text-red-900"
              }`}
            >
              {(gameState.capacityFactor * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Capacity Factor Gauge */}
        <div className="w-full bg-white border-2 border-slate-300 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Grid Capacity Factor
          </h3>

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
                left: `${Math.min(gameState.capacityFactor * 100, 120)}%`,
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
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-3 rounded border-2 ${
                gameState.warningCount >= 3
                  ? "bg-red-100 border-red-400"
                  : gameState.warningCount > 0
                  ? "bg-orange-100 border-orange-300"
                  : "bg-green-100 border-green-300"
              }`}
            >
              <p className="text-sm font-medium text-slate-700 mb-1">
                Warnings
              </p>
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
          </div>
        </div>

        {/* Game Over Banner */}
        {gameState.isGameOver && (
          <div className="w-full bg-red-600 text-white rounded-lg p-6 border-4 border-red-800">
            <h2 className="text-2xl font-bold mb-2">GAME OVER</h2>
            <p className="text-lg">{gameState.gameOverReason}</p>
            <p className="mt-4 text-sm">
              You survived {gameState.currentTime.toFixed(1)} years and managed
              a population of{" "}
              {Math.floor(gameState.currentPopulation).toLocaleString()}.
            </p>
            <button
              onClick={reset}
              className="mt-4 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Active Events */}
        <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-3">
            Active Events ({gameState.activeEvents.length})
          </h3>
          {gameState.activeEvents.length === 0 ? (
            <p className="text-sm text-slate-600 italic">
              No active events - network running normally
            </p>
          ) : (
            <div className="space-y-2">
              {gameState.activeEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <div
                    key={event.id}
                    className={`p-3 rounded border ${
                      event.impact === "demand"
                        ? "bg-amber-100 border-amber-300"
                        : "bg-cyan-100 border-cyan-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`w-5 h-5 mt-0.5 ${
                            event.impact === "demand"
                              ? "text-amber-700"
                              : "text-cyan-700"
                          }`}
                        />
                        <div>
                          <p
                            className={`font-semibold ${
                              event.impact === "demand"
                                ? "text-amber-900"
                                : "text-cyan-900"
                            }`}
                          >
                            {event.name}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {event.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p
                          className={`text-lg font-bold ${
                            event.multiplier > 1
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {event.multiplier > 1 ? "+" : ""}
                          {((event.multiplier - 1) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-slate-500 uppercase">
                          {event.impact}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Ends in {event.endTick - gameState.tickCount} ticks
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Flexibility Services - Sliders */}
        <div className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
          <h3 className="font-semibold text-indigo-900 mb-4">
            Flexibility Services - Continuous Controls
          </h3>
          <div className="space-y-6">
            {SLIDER_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const value = gameState.toolStates[tool.id] ?? tool.defaultValue;
              const percentage = (value * 100).toFixed(0);
              const isNegative = value < 0;
              const isPositive = value > 0;

              return (
                <div key={tool.id} className="bg-white rounded-lg p-4 border border-indigo-300">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className="w-5 h-5 mt-0.5 text-indigo-600" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-indigo-900">
                            {tool.name}
                          </p>
                          <button
                            onClick={() => setInfoDialogTool(tool)}
                            className="text-indigo-500 hover:text-indigo-700 transition-colors"
                            title="More information"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            isPositive
                              ? "text-red-600"
                              : isNegative
                              ? "text-green-600"
                              : "text-slate-600"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-12 text-right">
                      {(tool.min * 100).toFixed(0)}%
                    </span>
                    <input
                      type="range"
                      min={tool.min}
                      max={tool.max}
                      step={tool.step}
                      value={value}
                      onChange={(e) => setToolValue(tool.id, parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs text-slate-500 w-12">
                      +{(tool.max * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Center marker */}
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-xs text-slate-400">← Reduce | Neutral | Increase →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flexibility Services - Toggles */}
        <div className="w-full bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-4">
            Flexibility Services - On/Off Controls
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TOGGLE_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isOn = (gameState.toolStates[tool.id] ?? 0) === 1;
              const effectPercentage = ((tool.multiplier - 1) * 100).toFixed(0);
              const isIncrease = tool.multiplier > 1;

              return (
                <div
                  key={tool.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isOn
                      ? "bg-purple-100 border-purple-400"
                      : "bg-white border-purple-300"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Icon
                      className={`w-5 h-5 mt-0.5 ${
                        isOn ? "text-purple-700" : "text-purple-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-semibold text-sm ${
                              isOn ? "text-purple-900" : "text-purple-800"
                            }`}
                          >
                            {tool.name}
                          </p>
                          <button
                            onClick={() => setInfoDialogTool(tool)}
                            className="text-purple-500 hover:text-purple-700 transition-colors"
                            title="More information"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isIncrease ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isIncrease ? "+" : ""}
                          {effectPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => setToolValue(tool.id, isOn ? 0 : 1)}
                    className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                      isOn
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-200 hover:bg-purple-300 text-purple-900"
                    }`}
                  >
                    {isOn ? "ON - Click to Turn Off" : "OFF - Click to Turn On"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="w-full bg-zinc-100 rounded-lg p-6 border border-zinc-200">
          <h3 className="font-semibold text-zinc-900 mb-2">About This Test</h3>
          <ul className="text-sm text-zinc-700 space-y-1">
            <li>• Simulates 500 game years over 120 real-world minutes</li>
            <li>
              • Population grows from ~2,000 (village) to ~500,000 (large city)
            </li>
            <li>
              • Random events affect supply and demand on the energy network
            </li>
            <li>
              • Capacity factor should stay between 80-95% for optimal grid
              operation
            </li>
            <li>• Use sliders to continuously adjust demand/supply controls</li>
            <li>• Use toggles to turn on/off emergency measures</li>
          </ul>
        </div>

        {/* Info Dialog */}
        <Dialog open={infoDialogTool !== null} onOpenChange={(open) => !open && setInfoDialogTool(null)}>
          <DialogContent>
            <DialogClose onClick={() => setInfoDialogTool(null)}>
              <X className="w-5 h-5" />
            </DialogClose>
            {infoDialogTool && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const Icon = infoDialogTool.icon;
                      return <Icon className="w-6 h-6 text-indigo-600" />;
                    })()}
                    <DialogTitle>{infoDialogTool.name}</DialogTitle>
                  </div>
                  <DialogDescription>{infoDialogTool.description}</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <h3 className="font-semibold text-sm text-slate-900 mb-2">Detailed Information</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {infoDialogTool.info}
                  </p>
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Impact Type:</span>
                      <span className={`font-semibold ${
                        infoDialogTool.impact === 'demand' ? 'text-amber-600' : 'text-cyan-600'
                      }`}>
                        {infoDialogTool.impact.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-slate-600">Control Type:</span>
                      <span className="font-semibold text-slate-900">
                        {infoDialogTool.type === 'slider' ? 'Continuous (Slider)' : 'Toggle (On/Off)'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default function TestEngine() {
  return (
    <GameProvider
      options={{
        initialPopulation: 2000, // small village
        targetGameYears: 500,
        targetRealMinutes: 120,
        populationVolatility: 0.01, // 1% random variance
        autoStart: true,
      }}
    >
      <TestEngineContent />
    </GameProvider>
  );
}
