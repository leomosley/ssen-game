"use client";

import { GameProvider, useGameContext } from "@/lib/context/game-context";
import { ALL_TOOLS } from "@/lib/tools";

function TestEngineContent() {
  const { gameState, tickInterval, toggle, reset, applyTool, isToolAvailable } =
    useGameContext();

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
                      Ends in{" "}
                      {(event.endTime - gameState.currentTime).toFixed(1)} years
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Tools */}
        <div className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
          <h3 className="font-semibold text-indigo-900 mb-3">
            Flexibility Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ALL_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const available = isToolAvailable(tool.id);
              const activeTool = gameState.activeTools.find(
                (t) => t.id === tool.id
              );

              return (
                <button
                  key={tool.id}
                  onClick={() => applyTool(tool)}
                  disabled={!available}
                  className={`p-3 rounded border text-left transition-all ${
                    !available
                      ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                      : "bg-white border-indigo-300 hover:bg-indigo-50 cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`w-5 h-5 mt-0.5 ${
                        available ? "text-indigo-600" : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p
                          className={`font-semibold text-sm ${
                            available ? "text-indigo-900" : "text-gray-600"
                          }`}
                        >
                          {tool.name}
                        </p>
                        <span
                          className={`text-xs font-bold ${
                            tool.multiplier > 1
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {tool.multiplier > 1 ? "+" : ""}
                          {((tool.multiplier - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {tool.description}
                      </p>
                      {activeTool &&
                        activeTool.endTime > gameState.currentTime && (
                          <p className="text-xs text-indigo-600 mt-1 font-medium">
                            Active -{" "}
                            {(
                              activeTool.endTime - gameState.currentTime
                            ).toFixed(1)}
                            y left
                          </p>
                        )}
                      {activeTool && activeTool.isOnCooldown && (
                        <p className="text-xs text-orange-600 mt-1">
                          Cooldown -{" "}
                          {(
                            activeTool.cooldownEndTime - gameState.currentTime
                          ).toFixed(1)}
                          y
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="w-full bg-zinc-100 rounded-lg p-6 border border-zinc-200">
          <h3 className="font-semibold text-zinc-900 mb-2">About This Test</h3>
          <ul className="text-sm text-zinc-700 space-y-1">
            <li>• Simulates 100 game years over 120 real-world minutes</li>
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
            <li>• Use flexibility services to balance demand and supply</li>
          </ul>
        </div>
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
