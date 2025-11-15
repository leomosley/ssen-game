'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/lib/context/game-context';
import { SLIDER_TOOLS, type Tool, type ActiveTool } from '@/lib/tools';

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

  return (
    <Card className="w-[96dvw] h-[50dvh]">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent>
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
        </div>
      </CardContent>
    </Card>
  );
}
