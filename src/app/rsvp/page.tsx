"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ConfettiCelebration from "@/components/ConfettiCelebration";

type FormState = "idle" | "submitting" | "success" | "error";

export default function RSVPPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [potluckDish, setPotluckDish] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Please enter your name so we know who to expect!");
      setFormState("error");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("We need a valid email to keep you updated!");
      setFormState("error");
      return;
    }

    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          attending,
          guest_count: attending ? guestCount : 0,
          dietary_restrictions: dietaryRestrictions.trim(),
          potluck_dish: potluckDish.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setFormState("success");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to submit. Please try again!"
      );
      setFormState("error");
    }
  };

  return (
    <div className="enchanted-bg min-h-screen">
      <ConfettiCelebration active={showConfetti} />

      <div className="mx-auto max-w-2xl px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <AnimatePresence mode="wait">
          {formState === "success" ? (
            <SuccessScreen attending={attending} name={name} />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="mb-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-3 text-sm font-medium tracking-widest text-sage uppercase"
                >
                  You&apos;re Invited
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-[family-name:var(--font-cormorant-garant)] text-4xl font-semibold text-forest sm:text-5xl"
                >
                  Join Our Celebration
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-base text-deep-plum/60"
                >
                  We would be so happy to have you there. Please let us know if you can make it!
                </motion.p>

                {/* Botanical divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mx-auto mt-6 flex items-center justify-center gap-3"
                >
                  <div className="h-px w-16 bg-sage/40" />
                  <svg width="20" height="20" viewBox="0 0 20 20" className="text-sage/60">
                    <path d="M10 2 C10 2, 4 8, 10 14 C16 8, 10 2, 10 2Z" fill="currentColor" />
                    <line x1="10" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  <div className="h-px w-16 bg-sage/40" />
                </motion.div>
              </div>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="soft-card space-y-6 p-6 sm:p-8"
              >
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-deep-plum">
                    Your Name <span className="text-soft-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="enchanted-input"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-deep-plum">
                    Email Address <span className="text-soft-gold">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="enchanted-input"
                    required
                  />
                </div>

                {/* Attending Toggle */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-deep-plum">
                    Will you be joining us?
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAttending(true)}
                      className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        attending
                          ? "border-soft-gold bg-soft-gold text-white shadow-md"
                          : "border-lavender/30 bg-warm-white text-deep-plum/65 hover:border-lavender/50"
                      }`}
                    >
                      Joyfully Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending(false)}
                      className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        !attending
                          ? "border-lavender bg-lavender text-white shadow-md"
                          : "border-lavender/30 bg-warm-white text-deep-plum/65 hover:border-lavender/50"
                      }`}
                    >
                      Regretfully Decline
                    </button>
                  </div>
                </div>

                {/* Conditional fields for attending */}
                <AnimatePresence>
                  {attending && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-6 overflow-hidden"
                    >
                      {/* Guest Count */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-deep-plum">
                          Number of Guests
                        </label>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              setGuestCount(Math.max(1, guestCount - 1))
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-sage/30 bg-warm-white text-lg text-deep-plum transition-all hover:border-sage hover:bg-sage/10"
                          >
                            -
                          </button>
                          <span className="min-w-[2rem] text-center font-[family-name:var(--font-cormorant-garant)] text-3xl font-semibold text-deep-plum">
                            {guestCount}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setGuestCount(Math.min(10, guestCount + 1))
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-sage/30 bg-warm-white text-lg text-deep-plum transition-all hover:border-sage hover:bg-sage/10"
                          >
                            +
                          </button>
                          <span className="text-sm text-deep-plum/60">
                            {guestCount === 1 ? "guest" : "guests"}
                          </span>
                        </div>
                      </div>

                      {/* Dietary Restrictions */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-deep-plum">
                          Dietary Needs
                        </label>
                        <input
                          type="text"
                          value={dietaryRestrictions}
                          onChange={(e) =>
                            setDietaryRestrictions(e.target.value)
                          }
                          placeholder="Allergies, vegan, gluten-free..."
                          className="enchanted-input"
                        />
                        <p className="mt-1.5 text-xs text-deep-plum/55">
                          Optional -- let us know about any food needs
                        </p>
                      </div>

                      {/* Potluck */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-deep-plum">
                          Bringing a Dish to Share?
                        </label>
                        <input
                          type="text"
                          value={potluckDish}
                          onChange={(e) => setPotluckDish(e.target.value)}
                          placeholder="Grandma's famous pie, garden salad..."
                          className="enchanted-input"
                        />
                        <p className="mt-1.5 text-xs text-deep-plum/55">
                          Totally optional -- there will also be catered food, so no pressure at all!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-deep-plum">
                    Leave Us a Note
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="A kind word, a bit of advice, or just say hello..."
                    className="enchanted-input min-h-[100px] resize-y"
                    rows={3}
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {formState === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-blush-dark/30 bg-blush/40 p-4"
                    >
                      <p className="text-sm font-medium text-deep-plum">
                        Oops!
                      </p>
                      <p className="mt-1 text-sm text-deep-plum/80">
                        {errorMessage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className={`w-full rounded-xl bg-soft-gold px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-soft-gold-dark hover:shadow-lg ${
                      formState === "submitting"
                        ? "cursor-wait opacity-70"
                        : ""
                    }`}
                  >
                    {formState === "submitting" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send RSVP"
                    )}
                  </button>
                </div>
              </motion.form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-sage/70">
                  June 27, 2026
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SuccessScreen({
  attending,
  name,
}: {
  attending: boolean;
  name: string;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="py-12 text-center"
    >
      <div className="soft-card mx-auto max-w-md p-8 sm:p-10">
        {attending ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <svg className="mx-auto h-16 w-16 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <h2 className="font-[family-name:var(--font-cormorant-garant)] text-3xl font-semibold text-forest">
              We Can&apos;t Wait to Celebrate With You!
            </h2>
            <p className="mt-4 text-base text-deep-plum/70">
              {name}, your RSVP has been received.
            </p>
            <p className="mt-2 text-sm text-deep-plum/60">
              See you at the farm on June 27, 2026.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-sage/30" />
              <span className="text-sage">&#10045;</span>
              <div className="h-px w-12 bg-sage/30" />
            </div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <svg className="mx-auto h-16 w-16 text-lavender" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </motion.div>
            <h2 className="font-[family-name:var(--font-cormorant-garant)] text-3xl font-semibold text-forest">
              We&apos;ll Miss You!
            </h2>
            <p className="mt-4 text-base text-deep-plum/70">
              {name}, we&apos;re sorry you can&apos;t make it.
            </p>
            <p className="mt-2 text-sm text-deep-plum/60">
              We&apos;ll be thinking of you and wishing you were there to celebrate with us.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-sage/30 px-6 py-3 text-center text-sm font-medium text-deep-plum transition-all hover:bg-sage/10"
          >
            Back Home
          </Link>
          <Link
            href="/details"
            className="flex min-h-[44px] items-center justify-center rounded-xl bg-sage px-6 py-3 text-center text-sm font-medium text-white transition-all hover:bg-sage-dark"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
