"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GameCardProps {
  title: string;
  description: string;
  emoji: string;
  href: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  highScore?: number;
  color: string;
  index?: number;
}

const softColors: Record<string, { bg: string; accent: string }> = {
  sage: { bg: "rgba(92,122,74,0.12)", accent: "#5C7A4A" },
  lavender: { bg: "rgba(92,122,74,0.08)", accent: "#3E5A30" },
  blush: { bg: "rgba(232,200,184,0.15)", accent: "#D4A894" },
  gold: { bg: "rgba(196,154,60,0.12)", accent: "#C49A3C" },
  forest: { bg: "rgba(29,68,32,0.1)", accent: "#1D4420" },
  plum: { bg: "rgba(196,154,60,0.08)", accent: "#A67E28" },
};

const colorOrder = ["sage", "lavender", "blush", "gold", "forest", "plum"];

export default function GameCard({
  title,
  description,
  emoji,
  href,
  difficulty,
  highScore = 0,
  index = 0,
}: GameCardProps) {
  const colorKey = colorOrder[index % colorOrder.length];
  const colors = softColors[colorKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link href={href} className="group block">
        <div className="game-card-hover overflow-hidden rounded-2xl border border-sage/15 bg-warm-white/80 backdrop-blur-sm">
          {/* Emoji display area */}
          <div
            className="relative flex h-36 items-center justify-center overflow-hidden sm:h-44"
            style={{ background: colors.bg }}
          >
            {/* Soft gradient overlay */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 80%, ${colors.accent}22 0%, transparent 70%)`,
              }}
            />

            {/* Game emoji */}
            <motion.span
              className="relative z-10 text-5xl drop-shadow-sm sm:text-6xl"
              whileHover={{ scale: 1.15, rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.4 }}
            >
              {emoji}
            </motion.span>

            {/* Decorative sparkles */}
            <div
              className="absolute top-4 right-4 h-1.5 w-1.5 animate-soft-sparkle rounded-full"
              style={{
                background: colors.accent,
                opacity: 0.4,
                animationDelay: "0.5s",
              }}
            />
            <div
              className="absolute bottom-4 left-4 h-1 w-1 animate-soft-sparkle rounded-full"
              style={{
                background: colors.accent,
                opacity: 0.3,
                animationDelay: "1.5s",
              }}
            />
          </div>

          {/* Card content */}
          <div className="p-4 sm:p-5">
            {/* Title */}
            <h3
              className="mb-1.5 truncate font-[family-name:var(--font-cormorant-garant)] text-lg font-bold sm:mb-2 sm:text-xl"
              style={{ color: colors.accent }}
            >
              {title}
            </h3>

            {/* Description */}
            <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-forest/60 sm:text-sm">
              {description}
            </p>

            {/* Stats row */}
            <div className="mb-4 flex items-center justify-between">
              {/* Difficulty */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-forest/40">
                  Level
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          i < difficulty ? colors.accent : "rgba(29,68,32,0.08)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* High score */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-forest/40">
                  Best
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: colors.accent }}
                >
                  {highScore.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Play button */}
            <div
              className="flex items-center justify-center rounded-xl py-2.5 font-medium text-warm-white transition-all duration-300 group-hover:shadow-md"
              style={{
                backgroundColor: colors.accent,
                boxShadow: `0 2px 10px ${colors.accent}22`,
              }}
            >
              <span className="text-sm tracking-wide">Play</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
