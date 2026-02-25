"use client";

import dynamic from "next/dynamic";
import GameWrapper from "@/components/games/GameWrapper";

const EggCatcher = dynamic(() => import("@/components/games/EggCatcher"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <p className="font-mono text-amber-400 animate-pulse">Loading...</p>
    </div>
  ),
});

export default function EggCatcherPage() {
  return (
    <GameWrapper title="EGG CATCHER" backHref="/games" storageKey="eggCatcher">
      {({ onGameOver }) => <EggCatcher onGameOver={onGameOver} />}
    </GameWrapper>
  );
}
