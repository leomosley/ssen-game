'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/lib/context/game-context';
import { ALL_TOOLS, type Tool, type ActiveTool } from '@/lib/tools';

interface ToolButtonProps {
  tool: Tool;
  available: boolean;
  activeTool?: ActiveTool;
  currentTime: number;
  onApply: (tool: Tool) => void;
}

const ToolButton = ({
  tool,
  available,
  activeTool,
  currentTime,
  onApply,
}: ToolButtonProps) => {
  const Icon = tool.icon;

  return (
    <button
      onClick={() => onApply(tool)}
      disabled={!available}
      className={`p-3 rounded border text-left transition-all ${
        !available
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
          : 'bg-white border-indigo-300 hover:bg-indigo-50 cursor-pointer'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`w-5 h-5 mt-0.5 ${
            available ? 'text-indigo-600' : 'text-gray-400'
          }`}
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p
              className={`font-semibold text-sm ${
                available ? 'text-indigo-900' : 'text-gray-600'
              }`}
            >
              {tool.name}
            </p>
            <span
              className={`text-xs font-bold ${
                tool.multiplier > 1 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {tool.multiplier > 1 ? '+' : ''}
              {((tool.multiplier - 1) * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">{tool.description}</p>
          {activeTool && activeTool.endTime > currentTime && (
            <p className="text-xs text-indigo-600 mt-1 font-medium">
              Active - {(activeTool.endTime - currentTime).toFixed(1)}y left
            </p>
          )}
          {activeTool && activeTool.isOnCooldown && (
            <p className="text-xs text-orange-600 mt-1">
              Cooldown - {(activeTool.cooldownEndTime - currentTime).toFixed(1)}
              y
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export default function Controls() {
  const { gameState, applyTool, isToolAvailable } = useGameContext();

  return (
    <Card className="w-[96dvw] h-[50dvh]">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALL_TOOLS.map((tool) => {
            const available = isToolAvailable(tool.id);
            const activeTool = gameState.activeTools.find(
              (t) => t.id === tool.id
            );

            return (
              <ToolButton
                key={tool.id}
                tool={tool}
                available={available}
                activeTool={activeTool}
                currentTime={gameState.currentTime}
                onApply={applyTool}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
