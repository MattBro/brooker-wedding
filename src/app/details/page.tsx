"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function useCountdown(targetMs: number) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const distance = targetMs - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return timeLeft;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function SectionCard({
  icon,
  title,
  children,
  delay = 0,
  accent = "sage",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
  accent?: "sage" | "lavender" | "blush" | "gold";
}) {
  const accentColors = {
    sage: "border-[#9CAF88]/20 bg-[#9CAF88]/5 dark:border-[#9CAF88]/15 dark:bg-[#9CAF88]/8",
    lavender: "border-[#B8A9C9]/20 bg-[#B8A9C9]/5 dark:border-[#B8A9C9]/15 dark:bg-[#B8A9C9]/8",
    blush: "border-[#F2D7D5]/40 bg-[#F2D7D5]/10 dark:border-[#D4A894]/20 dark:bg-[#D4A894]/8",
    gold: "border-[#D4A574]/20 bg-[#D4A574]/5 dark:border-[#D4A574]/15 dark:bg-[#D4A574]/8",
  };

  const iconBg = {
    sage: "bg-[#9CAF88]/15 text-[#2D5016] dark:bg-[#9CAF88]/20 dark:text-[#C8D8B8]",
    lavender: "bg-[#B8A9C9]/15 text-[#4A2040] dark:bg-[#B8A9C9]/20 dark:text-[#D4C8E0]",
    blush: "bg-[#F2D7D5]/30 text-[#4A2040] dark:bg-[#D4A894]/20 dark:text-[#F0DDD2]",
    gold: "bg-[#D4A574]/15 text-[#6B4226] dark:bg-[#D4A574]/20 dark:text-[#E8C8A0]",
  };

  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className={`rounded-2xl border ${accentColors[accent]} p-6 sm:p-8`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg[accent]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
            {title}
          </h2>
          <div className="mt-3 space-y-2 font-[family-name:var(--font-body)] text-[#2D5016]/70 dark:text-[#FDF8F0]/70">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BotanicalDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-px w-8 bg-[#9CAF88]/20 dark:bg-[#9CAF88]/15" />
      <svg width="16" height="16" viewBox="0 0 16 16" className="mx-2 text-[#9CAF88]/30 dark:text-[#9CAF88]/25">
        <path d="M8 2 C8 2, 3 6, 8 10 C13 6, 8 2, 8 2Z" fill="currentColor" />
        <line x1="8" y1="10" x2="8" y2="14" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <div className="h-px w-8 bg-[#9CAF88]/20 dark:bg-[#9CAF88]/15" />
    </div>
  );
}

export default function DetailsPage() {
  const weddingMs = new Date("2026-06-27T16:00:00").getTime();
  const countdown = useCountdown(weddingMs);

  return (
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-[#0D1F0F]">
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 font-[family-name:var(--font-body)] text-sm font-medium tracking-widest text-[#9CAF88] uppercase dark:text-[#A8C090]">
            Everything You Need to Know
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#2D5016] dark:text-[#FDF8F0] sm:text-5xl md:text-6xl">
            Celebration Details
          </h1>

          {/* Botanical divider */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[#9CAF88]/40 dark:bg-[#9CAF88]/25" />
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#9CAF88]/60 dark:text-[#9CAF88]/40">
              <path d="M10 2 C10 2, 4 8, 10 14 C16 8, 10 2, 10 2Z" fill="currentColor" />
              <line x1="10" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="h-px w-16 bg-[#9CAF88]/40 dark:bg-[#9CAF88]/25" />
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 rounded-2xl border border-[#D4A574]/20 bg-[#D4A574]/5 p-6 text-center dark:border-[#D4A574]/15 dark:bg-[#D4A574]/8 sm:p-8"
        >
          <p className="mb-4 font-[family-name:var(--font-body)] text-sm font-medium tracking-wider text-[#D4A574] uppercase">
            Counting Down the Days
          </p>
          <div className="flex justify-center gap-3 sm:gap-6">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Minutes" },
              { value: countdown.seconds, label: "Seconds" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="mb-1 rounded-xl border border-[#D4A574]/20 bg-white/80 px-3 py-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[#2D5016] dark:border-[#D4A574]/15 dark:bg-[#162618]/80 dark:text-[#FDF8F0] sm:px-5 sm:text-3xl">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="font-[family-name:var(--font-body)] text-xs text-[#D4A574]/70">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            title="When"
            delay={0.1}
            accent="sage"
          >
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
              Saturday, June 27, 2026
            </p>
            <p>
              The celebration kicks off in the afternoon. Arrive early to explore our farm and settle in!
            </p>
          </SectionCard>

          <BotanicalDivider />

          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            }
            title="Where"
            delay={0.15}
            accent="lavender"
          >
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
              49 Clarks Mill Rd, Greenwich, NY 12834
            </p>
            <p>
              Our farm in beautiful Greenwich, NY. We can&apos;t wait to welcome you!
            </p>
          </SectionCard>

          <BotanicalDivider />

          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2a5 5 0 015 5c0 2-1 3-2 4l-3 4-3-4c-1-1-2-2-2-4a5 5 0 015-5z" />
                <path d="M5 12c-1.5 1-3 3-3 5 0 2.5 4 4 10 4s10-1.5 10-4c0-2-1.5-4-3-5" />
              </svg>
            }
            title="The Celebration"
            delay={0.2}
            accent="blush"
          >
            <div className="space-y-3">
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#2D5016]">
                A Farm Feast to Remember
              </p>
              <p>
                We&apos;d love for you to bring a dish to share if you&apos;d like!
                There will also be plenty of catered food, so absolutely no pressure.
                It&apos;s a farm party, and sharing a meal together is part of the magic.
              </p>
              <div className="rounded-xl border border-[#D4A574]/20 bg-[#D4A574]/5 p-4 dark:border-[#D4A574]/15 dark:bg-[#D4A574]/8">
                <p className="font-[family-name:var(--font-body)] text-sm font-medium text-[#D4A574]">
                  Thinking of bringing something?
                </p>
                <p className="mt-1 text-sm text-[#2D5016]/60 dark:text-[#FDF8F0]/60">
                  Salads, sides, desserts, and anything made with love are all welcome.
                  You can let us know what you&apos;re bringing in your RSVP!
                </p>
              </div>
            </div>
          </SectionCard>

          <BotanicalDivider />

          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            }
            title="What to Bring"
            delay={0.25}
            accent="sage"
          >
            <div className="space-y-1">
              <ul className="mt-1 space-y-3">
                {[
                  { item: "Lawn chairs or blankets", note: "Outdoor seating is bring-your-own" },
                  { item: "Sunscreen & bug spray", note: "We are on a farm after all" },
                  { item: "A big appetite", note: "There will be plenty of food" },
                  { item: "Dancing shoes", note: "There will be dancing" },
                  { item: "Good vibes & warm hearts", note: "The most important thing" },
                ].map((entry) => (
                  <li key={entry.item} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#9CAF88]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="font-medium text-[#2D5016] dark:text-[#FDF8F0]">{entry.item}</span>
                      <span className="ml-2 text-sm text-[#2D5016]/55 dark:text-[#FDF8F0]/55">
                        {entry.note}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <BotanicalDivider />

          {/* Farm Animals Section */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="rounded-2xl border border-[#D4A574]/20 bg-[#D4A574]/5 p-6 dark:border-[#D4A574]/15 dark:bg-[#D4A574]/8 sm:p-8"
          >
            <div className="mb-6 text-center">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                Meet Our Farm Family
              </h2>
              <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[#2D5016]/60 dark:text-[#FDF8F0]/60">
                You may spot some friendly faces during your visit
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: "Guardian Dogs", desc: "Our sweet protectors", emoji: "🐕" },
                { name: "Barn Cats", desc: "The quiet hunters", emoji: "🐈" },
                { name: "House Dog", desc: "The couch cuddler", emoji: "🐶" },
                { name: "House Cats", desc: "The indoor royalty", emoji: "🐱" },
                { name: "Guinea Hens", desc: "The watchful ones", emoji: "🐔" },
                { name: "Ducks", desc: "The pond lovers", emoji: "🦆" },
                { name: "Geese", desc: "The loud greeters", emoji: "🪿" },
                { name: "Chickens", desc: "The breakfast providers", emoji: "🐓" },
              ].map((animal) => (
                <motion.div
                  key={animal.name}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-[#D4A574]/15 bg-white/60 p-3 text-center transition-shadow hover:shadow-sm dark:border-[#D4A574]/10 dark:bg-[#162618]/60"
                >
                  <div className="mb-1 text-2xl">{animal.emoji}</div>
                  <div className="font-[family-name:var(--font-body)] text-xs font-semibold text-[#2D5016] dark:text-[#FDF8F0]">
                    {animal.name}
                  </div>
                  <div className="font-[family-name:var(--font-body)] text-[11px] text-[#2D5016]/60 dark:text-[#FDF8F0]/60">
                    {animal.desc}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mt-4 text-center font-[family-name:var(--font-body)] text-xs text-[#2D5016]/55 dark:text-[#FDF8F0]/55">
              Please be gentle with all our farm friends -- they live here full time!
            </p>
          </motion.div>

          <BotanicalDivider />

          <SectionCard
            icon={
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            title="Questions?"
            delay={0.35}
            accent="lavender"
          >
            <p>
              We&apos;re here to help with anything you need. Don&apos;t hesitate to reach out!
            </p>
            <a
              href="mailto:brookerhousehold@gmail.com"
              className="mt-2 inline-block rounded-lg bg-[#B8A9C9]/15 px-4 py-2 font-[family-name:var(--font-body)] text-sm font-medium text-[#4A2040] transition-colors hover:bg-[#B8A9C9]/25 dark:bg-[#B8A9C9]/20 dark:text-[#D4C8E0] dark:hover:bg-[#B8A9C9]/30"
            >
              brookerhousehold@gmail.com
            </a>
            <p className="mt-2 text-sm text-[#2D5016]/55 dark:text-[#FDF8F0]/55">
              We usually respond within a day (farm chores permitting!)
            </p>
          </SectionCard>
        </div>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/rsvp"
            className="inline-block rounded-xl bg-[#D4A574] px-8 py-3.5 font-[family-name:var(--font-body)] text-base font-semibold text-white shadow-md shadow-[#D4A574]/20 transition-all hover:bg-[#c4955a] hover:shadow-lg"
          >
            RSVP Now
          </Link>
          <p className="mt-4 font-[family-name:var(--font-body)] text-sm text-[#9CAF88]/65">
            June 27, 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
