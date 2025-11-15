'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/lib/context/game-context';
import { SLIDER_TOOLS, TOGGLE_TOOLS } from '@/lib/tools';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { type Tool } from '@/lib/tools';

// interface ToolButtonProps {
//   tool: Tool;
//   available: boolean;
//   activeTool?: ActiveTool;
//   currentTime: number;
//   onApply: (tool: Tool) => void;
// }

// const ToolButton = ({
//   tool,
//   available,
//   activeTool,
//   currentTime,
//   onApply,
// }: ToolButtonProps) => {
//   const Icon = tool.icon;

//   return (
//     <button
//       onClick={() => onApply(tool)}
//       disabled={!available}
//       className={`p-3 rounded border text-left transition-all ${
//         !available
//           ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
//           : 'bg-white border-indigo-300 hover:bg-indigo-50 cursor-pointer'
//       }`}
//     >
//       <div className="flex items-start gap-3">
//         <Icon
//           className={`w-5 h-5 mt-0.5 ${
//             available ? 'text-indigo-600' : 'text-gray-400'
//           }`}
//         />
//         <div className="flex-1">
//           <div className="flex items-start justify-between">
//             <p
//               className={`font-semibold text-sm ${
//                 available ? 'text-indigo-900' : 'text-gray-600'
//               }`}
//             >
//               {tool.name}
//             </p>
//             <span
//               className={`text-xs font-bold ${
//                 tool.multiplier > 1 ? 'text-red-600' : 'text-green-600'
//               }`}
//             >
//               {tool.multiplier > 1 ? '+' : ''}
//               {((tool.multiplier - 1) * 100).toFixed(0)}%
//             </span>
//           </div>
//           <p className="text-xs text-slate-600 mt-1">{tool.description}</p>
//           {activeTool && activeTool.endTime > currentTime && (
//             <p className="text-xs text-indigo-600 mt-1 font-medium">
//               Active - {(activeTool.endTime - currentTime).toFixed(1)}y left
//             </p>
//           )}
//           {activeTool && activeTool.isOnCooldown && (
//             <p className="text-xs text-orange-600 mt-1">
//               Cooldown - {(activeTool.cooldownEndTime - currentTime).toFixed(1)}
//               y
//             </p>
//           )}
//         </div>
//       </div>
//     </button>
//   );
// };

export default function Controls() {
  const { gameState, setToolValue } = useGameContext();
  const [infoDialogTool, setInfoDialogTool] = useState<Tool | null>(null);

  return (
    <Card className="w-[96dvw] h-[50dvh]">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
          <div className="flex items-stretch justify-start gap-4 h-full">
            <div className="grid grid-cols-2 gap-4">
              {SLIDER_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const value =
                  gameState.toolStates[tool.id] ?? tool.defaultValue;
                const percentage = (value * 100).toFixed(0);
                const isNegative = value < 0;
                const isPositive = value > 0;

                return (
                  <div
                    key={tool.id}
                    className="bg-white rounded-lg p-4 border border-indigo-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Icon className="w-5 h-5 mt-0.5 text-indigo-600" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-sm text-indigo-900">
                            {tool.name}
                          </p>
                          <span
                            className={`text-sm font-bold ${
                              isPositive
                                ? 'text-red-600'
                                : isNegative
                                ? 'text-green-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {isPositive ? '+' : ''}
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
                        onChange={(e) =>
                          setToolValue(tool.id, parseFloat(e.target.value))
                        }
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="text-xs text-slate-500 w-12">
                        +{(tool.max * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Center marker */}
                    <div className="flex items-center justify-center mt-1">
                      <span className="text-xs text-slate-400">
                        ← Reduce | Neutral | Increase →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 h-full">
              {TOGGLE_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isOn = (gameState.toolStates[tool.id] ?? 0) === 1;
                const effectPercentage = ((tool.multiplier - 1) * 100).toFixed(
                  0
                );
                const isIncrease = tool.multiplier > 1;

                return (
                  <div
                    key={tool.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isOn
                        ? 'bg-purple-100 border-purple-400'
                        : 'bg-white border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Icon
                        className={`w-5 h-5 mt-0.5 ${
                          isOn ? 'text-purple-700' : 'text-purple-500'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <p
                              className={`font-semibold text-sm ${
                                isOn ? 'text-purple-900' : 'text-purple-800'
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
                              isIncrease ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {isIncrease ? '+' : ''}
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
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-200 hover:bg-purple-300 text-purple-900'
                      }`}
                    >
                      {isOn
                        ? 'ON - Click to Turn Off'
                        : 'OFF - Click to Turn On'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
