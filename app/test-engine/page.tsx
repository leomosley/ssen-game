"use client";

import { useGame } from "@/lib/hooks/use-game";

export default function TestEngine() {
  const { gameState, tickInterval, toggle, reset } = useGame({
    initialPopulation: 2000, // small village
    targetGameYears: 100,
    targetRealMinutes: 120,
    populationVolatility: 0.01, // 1% random variance
    autoStart: true,
  });

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
                  Population Multiplier
                </p>
                <p className="text-2xl font-semibold text-green-800">
                  {gameState.populationMultiplier.toFixed(4)}x
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
              gameState.networkPressure < 0.8
                ? "bg-green-50 border-green-200"
                : gameState.networkPressure < 1.0
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-1 ${
                gameState.networkPressure < 0.8
                  ? "text-green-700"
                  : gameState.networkPressure < 1.0
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              Network Pressure
            </p>
            <p
              className={`text-2xl font-bold ${
                gameState.networkPressure < 0.8
                  ? "text-green-900"
                  : gameState.networkPressure < 1.0
                  ? "text-yellow-900"
                  : "text-red-900"
              }`}
            >
              {(gameState.networkPressure * 100).toFixed(1)}%
            </p>
          </div>
        </div>

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
                      {(event.endTime - gameState.currentTime).toFixed(1)}{" "}
                      years
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              • Network pressure should stay between 80-90% for optimal
              performance
            </li>
            <li>• Events have varying impacts and durations</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
