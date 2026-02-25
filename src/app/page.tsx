"use client";

import { motion } from "framer-motion";
import FarmScene from "@/components/FarmScene";
import Countdown from "@/components/Countdown";
import GameCard from "@/components/GameCard";
import PixelButton from "@/components/PixelButton";

const games = [
  {
    title: "Egg Catcher",
    description:
      "Catch eggs falling from the coop before they splat! How many can you save?",
    emoji: "🥚",
    href: "/games/egg-catcher",
    difficulty: 2 as const,
    highScore: 12450,
    color: "sage",
  },
  {
    title: "Farm Defense",
    description:
      "Protect the crops from waves of pesky critters. Build scarecrows and fences!",
    emoji: "🌾",
    href: "/games/farm-defense",
    difficulty: 4 as const,
    highScore: 8800,
    color: "lavender",
  },
  {
    title: "Yoga Goat",
    description:
      "Help the goat hold impossible yoga poses. Balance is everything on the farm!",
    emoji: "🐐",
    href: "/games/yoga-goat",
    difficulty: 3 as const,
    highScore: 6200,
    color: "blush",
  },
  {
    title: "Duck Duck Goose",
    description:
      "The classic game reimagined! Tap the goose before it escapes the circle.",
    emoji: "🦆",
    href: "/games/duck-duck-goose",
    difficulty: 1 as const,
    highScore: 15000,
    color: "gold",
  },
  {
    title: "Unicorn TKD",
    description:
      "A unicorn with a black belt? Roundhouse kick your way through enchanted obstacles!",
    emoji: "🦄",
    href: "/games/unicorn-taekwondo",
    difficulty: 5 as const,
    highScore: 3100,
    color: "forest",
  },
  {
    title: "Barn Cat Ninja",
    description:
      "Stealthy paws, razor claws. Sneak through the barn collecting mice and avoiding dogs.",
    emoji: "🐱",
    href: "/games/barn-cat-ninja",
    difficulty: 3 as const,
    highScore: 9500,
    color: "plum",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* =============================================
          HERO SECTION
          ============================================= */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Enchanted forest background */}
        <FarmScene />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-20 pb-8 sm:pt-24">
          {/* Small subtitle */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 text-sm font-medium tracking-[0.3em] text-sage-dark/70 uppercase sm:text-base"
          >
            Together with their families
          </motion.p>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: "easeOut",
            }}
            className="mb-3 text-center font-[family-name:var(--font-cormorant-garant)] text-5xl font-bold text-forest sm:mb-4 sm:text-7xl md:text-8xl"
          >
            Matt & Brittany
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6 text-center text-lg font-medium text-forest/70 sm:mb-8 sm:text-xl md:text-2xl"
          >
            invite you to their wedding celebration
          </motion.p>

          {/* Date display */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-8 sm:mb-10"
          >
            <div className="relative rounded-2xl border border-soft-gold/25 bg-warm-white/60 px-8 py-5 text-center shadow-[0_4px_20px_rgba(196,154,60,0.1)] backdrop-blur-sm sm:px-12 sm:py-6">
              <p className="mb-1 text-xs font-medium tracking-[0.25em] text-soft-gold/70 uppercase sm:text-sm">
                Join the Celebration
              </p>
              <p className="font-[family-name:var(--font-cormorant-garant)] text-2xl font-bold text-soft-gold sm:text-3xl md:text-4xl">
                June 27, 2026
              </p>
              <p className="mt-1 text-xs font-medium text-sage-dark/50 sm:text-sm">
                Saturday
              </p>
            </div>
          </motion.div>

          {/* Countdown */}
          <Countdown />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-10 flex flex-col items-center gap-2 sm:mt-14"
          >
            <span className="text-xs font-medium tracking-widest text-forest/30 uppercase">
              Explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-forest/25"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 4v12M5 11l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =============================================
          RSVP CTA SECTION
          ============================================= */}
      <section className="relative px-4 py-20 sm:py-28">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage/10 to-transparent" />

        <div className="relative mx-auto max-w-4xl">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* RSVP card */}
            <div className="mb-14 sm:mb-18">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-block rounded-3xl border border-soft-gold/20 bg-warm-white/70 p-8 shadow-[0_8px_40px_rgba(196,154,60,0.1)] backdrop-blur-sm sm:p-12"
              >
                <p className="mb-3 text-xs font-medium tracking-[0.25em] text-soft-gold/70 uppercase sm:text-sm">
                  We would love to see you there
                </p>
                <h3 className="mb-5 font-[family-name:var(--font-cormorant-garant)] text-3xl font-bold text-forest sm:mb-6 sm:text-4xl">
                  Join the Celebration
                </h3>
                <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-forest/60 sm:mb-8 sm:text-base">
                  We would love for you to celebrate with us on the farm.
                  Great food, fun games, and even better company. What more
                  could you ask for?
                </p>
                <PixelButton href="/rsvp" variant="primary" size="lg">
                  RSVP Now
                </PixelButton>
              </motion.div>
            </div>

            {/* Secondary links */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <PixelButton href="/story" variant="secondary" size="md">
                  Our Story
                </PixelButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PixelButton href="/details" variant="success" size="md">
                  Celebration Details
                </PixelButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =============================================
          FAMILY SECTION
          ============================================= */}
      <section className="relative px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="overflow-hidden rounded-3xl border border-sage/15 bg-warm-white/70 px-6 py-10 shadow-[0_4px_30px_rgba(29,68,32,0.05)] backdrop-blur-sm sm:px-10 sm:py-14">
              <h3 className="mb-6 font-[family-name:var(--font-cormorant-garant)] text-2xl font-bold text-forest sm:mb-8 sm:text-3xl">
                The Brooker Family
              </h3>

              <div className="mb-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl sm:text-4xl">🤵</span>
                  <span className="font-[family-name:var(--font-cormorant-garant)] text-lg font-semibold text-forest">
                    Matt
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="text-2xl text-soft-gold sm:text-3xl"
                  >
                    &hearts;
                  </motion.span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl sm:text-4xl">👰</span>
                  <span className="font-[family-name:var(--font-cormorant-garant)] text-lg font-semibold text-forest">
                    Brittany
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-8 border-t border-sage/10 pt-6 sm:gap-12">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl">&#127775;</span>
                  <span className="font-[family-name:var(--font-cormorant-garant)] text-base font-semibold text-forest">
                    Emmett
                  </span>
                  <span className="text-xs text-forest/40">Age 11</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-2xl sm:text-3xl">&#128142;</span>
                  <span className="font-[family-name:var(--font-cormorant-garant)] text-base font-semibold text-forest">
                    Sapphire
                  </span>
                  <span className="text-xs text-forest/40">Age 8</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =============================================
          GAMES - subtle section at the bottom
          ============================================= */}
      <section className="relative px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <p className="mb-2 text-xs font-medium tracking-[0.2em] text-forest/30 uppercase">
              While you wait
            </p>
            <h2 className="font-[family-name:var(--font-cormorant-garant)] text-2xl font-bold text-forest/50 sm:text-3xl">
              A Few Games for Fun
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5">
            {games.map((game, index) => (
              <GameCard key={game.title} {...game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* =============================================
          FOOTER
          ============================================= */}
      <footer className="relative border-t border-sage/15 bg-cream-dark/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Decorative hearts */}
          <div className="mb-5 flex items-center justify-center gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className={`text-sm ${i % 2 === 0 ? "text-soft-gold/40" : "text-sage/40"}`}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                &hearts;
              </motion.span>
            ))}
          </div>

          <p className="font-[family-name:var(--font-cormorant-garant)] text-xl font-semibold text-forest/50 sm:text-2xl">
            Matt & Brittany
          </p>
          <p className="mt-1 text-sm text-forest/30">June 27, 2026</p>

          <div className="mt-5">
            <a
              href="mailto:brookerhousehold@gmail.com"
              className="text-sm text-soft-gold/60 transition-colors hover:text-soft-gold"
            >
              brookerhousehold@gmail.com
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-sage/10" />
            <span className="text-xs text-forest/15">2026</span>
            <div className="h-px w-12 bg-sage/10" />
          </div>

          <motion.p
            className="mt-5 text-xs text-forest/15"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Made with love on the farm
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
