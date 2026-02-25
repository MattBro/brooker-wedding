"use client";

import dynamic from "next/dynamic";
import GameWrapper from "@/components/games/GameWrapper";

const ZoesAdventure = dynamic(() => import("@/components/games/ZoesAdventure"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <p className="font-mono text-amber-400 animate-pulse">Loading...</p>
    </div>
  ),
});

export default function ZoesAdventurePage() {
  return (
    <GameWrapper title="ZOE'S ADVENTURE" backHref="/games" storageKey="zoesAdventure">
      {({ onGameOver }) => <ZoesAdventure onGameOver={onGameOver} />}
    </GameWrapper>
  );
}
