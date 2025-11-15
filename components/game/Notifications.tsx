"use client";

import { useGameContext } from "@/lib/context/game-context";
import { useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "../ui/dialog";

export default function Notifications() {
  const { gameState, reset } = useGameContext();

  useEffect(() => {
    if (gameState.warningCount === 0) return;

    if (gameState.isGameOver) {
      toast.error("Critical Warning! Game over!");
      return;
    }

    toast.warning(
      `Warning you aren't utilising the grid efficiently! You have ${
        3 - gameState.warningCount
      } more warning${3 - gameState.warningCount === 1 ? "" : "s"} left.`
    );
  }, [gameState.warningCount, gameState.isGameOver]);

  if (gameState.isGameOver) {
    return (
      <Dialog open={gameState.isGameOver}>
        <DialogContent className="bg-red-600 text-white rounded-lg p-6 border-4 border-red-800">
          <div className="w-full ">
            <h2 className="text-2xl font-bold mb-2">GAME OVER</h2>
            <p className="text-lg">{gameState.gameOverReason}</p>
            <p className="mt-4 text-sm">
              You survived {gameState.currentTime.toFixed(1)} years and managed
              a population of{" "}
              {Math.floor(gameState.currentPopulation).toLocaleString()}.
            </p>
            <button
              onClick={reset}
              className="mt-4 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
