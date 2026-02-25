"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface GameWrapperProps {
  title: string;
  backHref: string;
  storageKey: string;
  children: (props: { onGameOver: (score: number) => void }) => React.ReactNode;
}

export default function GameWrapper({ title, backHref, storageKey, children }: GameWrapperProps) {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const data = localStorage.getItem(`${storageKey}_leaderboard`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const onGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setSubmitted(false);
    setPlayerName("");
  }, []);

  const handleSubmitScore = useCallback(() => {
    if (!playerName.trim() || finalScore === null) return;

    const entry: LeaderboardEntry = {
      name: playerName.trim().substring(0, 20),
      score: finalScore,
      date: new Date().toLocaleDateString(),
    };

    const updated = [...leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    setSubmitted(true);

    try {
      localStorage.setItem(`${storageKey}_leaderboard`, JSON.stringify(updated));
    } catch {}
  }, [playerName, finalScore, leaderboard, storageKey]);

  return (
    <div
      className="min-h-dvh flex flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #1a0a00 0%, #2d1508 50%, #1a0a00 100%)",
      }}
    >
      {/* Header */}
      <div className="w-full max-w-lg px-4 pt-3 pb-2 flex items-center justify-between">
        <Link
          href={backHref}
          className="text-amber-400 font-mono text-sm hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="inline-block"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          BACK
        </Link>
        <h1
          className="font-mono text-lg font-bold tracking-wider"
          style={{ color: "#DAA520" }}
        >
          {title}
        </h1>
        <div className="w-14" />
      </div>

      {/* Game area */}
      <div className="flex-1 w-full max-w-lg flex flex-col items-center">
        {children({ onGameOver })}
      </div>

      {/* Score submission / Leaderboard */}
      {finalScore !== null && (
        <div className="w-full max-w-lg px-4 pb-6">
          {/* Score submission */}
          {!submitted && finalScore > 0 && (
            <div
              className="rounded-lg p-4 mb-4"
              style={{
                background: "#1a0a0088",
                border: "1px solid #DAA52044",
              }}
            >
              <p
                className="font-mono text-sm mb-3 text-center"
                style={{ color: "#DAA520" }}
              >
                SAVE YOUR SCORE: {finalScore}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitScore();
                  }}
                  placeholder="Your name"
                  maxLength={20}
                  className="flex-1 px-3 py-2 rounded font-mono text-sm outline-none"
                  style={{
                    background: "#0a0500",
                    border: "1px solid #DAA52044",
                    color: "#FFF8DC",
                  }}
                />
                <button
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim()}
                  className="px-4 py-2 rounded font-mono text-sm font-bold transition-colors disabled:opacity-40"
                  style={{
                    background: "#228B22",
                    color: "#FFF",
                  }}
                >
                  SAVE
                </button>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <div
              className="rounded-lg p-4"
              style={{
                background: "#1a0a0088",
                border: "1px solid #DAA52044",
              }}
            >
              <h2
                className="font-mono text-sm font-bold mb-3 text-center tracking-wider"
                style={{ color: "#DAA520" }}
              >
                LEADERBOARD
              </h2>
              <div className="space-y-1">
                {leaderboard.map((entry, i) => (
                  <div
                    key={`${entry.name}-${entry.score}-${i}`}
                    className="flex items-center font-mono text-xs gap-2"
                    style={{
                      color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#FFF8DC88",
                    }}
                  >
                    <span className="w-5 text-right">{i + 1}.</span>
                    <span className="flex-1 truncate">{entry.name}</span>
                    <span className="font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
