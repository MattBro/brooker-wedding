"use client";

export default function FarmScene() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dreamy gradient sky - enchanted twilight forest */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #E8E2D0 0%, #F0EADE 20%, #FDF8F0 45%, #DDE8D0 70%, #B5CCAA 100%)",
        }}
      />

      {/* Warm golden sun glow */}
      <div className="absolute top-6 right-[15%] sm:top-10">
        <div
          className="h-20 w-20 rounded-full opacity-75 sm:h-32 sm:w-32"
          style={{
            background:
              "radial-gradient(circle, rgba(196,154,60,0.55) 0%, rgba(196,154,60,0.18) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating fireflies */}
      <Fireflies />

      {/* Fairy dust sparkle trail */}
      <FairyDustTrail />

      {/* Distant treeline silhouettes */}
      <div className="absolute bottom-[28%] w-full sm:bottom-[32%]">
        <svg
          viewBox="0 0 1440 180"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 180 Q60 100 120 140 Q160 60 200 120 Q240 40 280 100 Q320 60 360 130 Q400 80 440 110 Q480 30 520 90 Q560 60 600 120 Q640 50 680 100 Q720 70 760 130 Q800 90 840 110 Q880 40 920 80 Q960 60 1000 120 Q1040 80 1080 100 Q1120 50 1160 90 Q1200 70 1240 130 Q1280 90 1320 110 Q1360 60 1400 100 L1440 130 L1440 180 Z"
            fill="#1D4420"
            opacity="0.2"
          />
        </svg>

        {/* Fairy string lights draped between trees */}
        <FairyStringLights />
      </div>

      {/* Mid-ground rolling hills with gnome silhouettes */}
      <div className="absolute bottom-[15%] w-full sm:bottom-[18%]">
        <svg
          viewBox="0 0 1440 200"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 200 Q180 100 360 140 Q540 80 720 120 Q900 60 1080 110 Q1260 80 1440 140 L1440 200 Z"
            fill="#5C7A4A"
            opacity="0.3"
          />
          <path
            d="M0 200 Q240 120 480 155 Q720 90 960 130 Q1200 100 1440 155 L1440 200 Z"
            fill="#5C7A4A"
            opacity="0.4"
          />

          {/* Gnome peeking from behind left hill */}
          <g transform="translate(290, 110)" opacity="0.25">
            {/* Pointy hat */}
            <polygon points="0,-18 6,0 -6,0" fill="#1D4420" />
            {/* Head */}
            <circle cx="0" cy="4" r="5" fill="#1D4420" />
            {/* Body */}
            <ellipse cx="0" cy="12" rx="6" ry="7" fill="#1D4420" />
            {/* Beard */}
            <ellipse cx="0" cy="8" rx="4" ry="5" fill="#1D4420" opacity="0.7" />
          </g>

          {/* Gnome peeking from behind right hill */}
          <g transform="translate(1050, 80)" opacity="0.2">
            <polygon points="0,-16 5,0 -5,0" fill="#1D4420" />
            <circle cx="0" cy="3" r="4.5" fill="#1D4420" />
            <ellipse cx="0" cy="10" rx="5.5" ry="6" fill="#1D4420" />
            <ellipse cx="0" cy="7" rx="3.5" ry="4.5" fill="#1D4420" opacity="0.7" />
          </g>

          {/* Tiny gnome peeking from center hill */}
          <g transform="translate(680, 95)" opacity="0.18">
            <polygon points="0,-12 4,0 -4,0" fill="#1D4420" />
            <circle cx="0" cy="2.5" r="3.5" fill="#1D4420" />
            <ellipse cx="0" cy="8" rx="4" ry="5" fill="#1D4420" />
          </g>
        </svg>
      </div>

      {/* Foreground meadow */}
      <div className="absolute bottom-0 h-[20%] w-full sm:h-[22%]">
        <svg
          viewBox="0 0 1440 200"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 200 Q360 130 720 160 Q1080 110 1440 150 L1440 200 Z"
            fill="#7A9966"
            opacity="0.5"
          />
          <path
            d="M0 200 Q200 150 500 170 Q800 130 1100 160 Q1300 140 1440 170 L1440 200 Z"
            fill="#8FAA78"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Toadstool mushrooms among the flowers */}
      <Toadstools />

      {/* Tiny fairy door at base of tree area */}
      <FairyDoor />

      {/* Scattered wildflowers */}
      <Wildflowers />

      {/* Gentle floating petals */}
      <FloatingPetals />
    </div>
  );
}

function Fireflies() {
  const fireflies = [
    { left: "15%", top: "25%", delay: "0s", duration: "4s" },
    { left: "35%", top: "35%", delay: "1.5s", duration: "5s" },
    { left: "55%", top: "20%", delay: "0.8s", duration: "3.5s" },
    { left: "75%", top: "30%", delay: "2.2s", duration: "4.5s" },
    { left: "25%", top: "45%", delay: "3s", duration: "3.8s" },
    { left: "65%", top: "40%", delay: "1s", duration: "5.2s" },
    { left: "85%", top: "22%", delay: "0.3s", duration: "4.2s" },
    { left: "45%", top: "50%", delay: "2.5s", duration: "3.3s" },
    { left: "10%", top: "38%", delay: "1.8s", duration: "4.8s" },
    { left: "90%", top: "42%", delay: "0.6s", duration: "3.6s" },
  ];

  return (
    <>
      {fireflies.map((f, i) => (
        <div
          key={i}
          className="animate-firefly absolute h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
          style={{
            left: f.left,
            top: f.top,
            animationDelay: f.delay,
            animationDuration: f.duration,
            background:
              "radial-gradient(circle, rgba(196,154,60,0.9) 0%, rgba(196,154,60,0.35) 60%, transparent 100%)",
            boxShadow: "0 0 8px rgba(196,154,60,0.6)",
          }}
        />
      ))}
    </>
  );
}

function Wildflowers() {
  const flowers = [
    { left: "8%", bottom: "12%", color: "#E8C8B8", size: "text-base" },
    { left: "18%", bottom: "10%", color: "#C49A3C", size: "text-sm" },
    { left: "30%", bottom: "14%", color: "#D4A894", size: "text-xs" },
    { left: "42%", bottom: "11%", color: "#C49A3C", size: "text-base" },
    { left: "58%", bottom: "13%", color: "#E8C8B8", size: "text-sm" },
    { left: "70%", bottom: "10%", color: "#C49A3C", size: "text-xs" },
    { left: "82%", bottom: "15%", color: "#D4A894", size: "text-base" },
    { left: "92%", bottom: "11%", color: "#C49A3C", size: "text-sm" },
  ];

  return (
    <>
      {flowers.map((f, i) => (
        <div
          key={i}
          className={`animate-gentle-sway absolute ${f.size} opacity-40`}
          style={{
            left: f.left,
            bottom: f.bottom,
            animationDelay: `${i * 0.5}s`,
            color: f.color,
          }}
        >
          *
        </div>
      ))}
    </>
  );
}

function FloatingPetals() {
  const petals = [
    { left: "10%", delay: "0s", duration: "14s", size: 6 },
    { left: "25%", delay: "3s", duration: "16s", size: 5 },
    { left: "40%", delay: "6s", duration: "12s", size: 7 },
    { left: "60%", delay: "2s", duration: "15s", size: 5 },
    { left: "75%", delay: "8s", duration: "13s", size: 6 },
    { left: "90%", delay: "4s", duration: "17s", size: 4 },
  ];

  return (
    <>
      {petals.map((p, i) => (
        <div
          key={i}
          className="animate-petal-fall absolute"
          style={{
            left: p.left,
            top: "-5%",
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50% 0 50% 50%",
            background:
              i % 2 === 0
                ? "rgba(196,154,60,0.5)"
                : "rgba(232,200,184,0.5)",
          }}
        />
      ))}
    </>
  );
}

function Toadstools() {
  const mushrooms = [
    { left: "12%", bottom: "13%", scale: 0.7 },
    { left: "35%", bottom: "11%", scale: 0.5 },
    { left: "62%", bottom: "14%", scale: 0.6 },
    { left: "78%", bottom: "10%", scale: 0.45 },
    { left: "48%", bottom: "12%", scale: 0.55 },
  ];

  return (
    <>
      {mushrooms.map((m, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: m.left,
            bottom: m.bottom,
            transform: `scale(${m.scale})`,
          }}
        >
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
            {/* Stem */}
            <rect x="9" y="16" width="6" height="12" rx="2" fill="#F0EADE" opacity="0.5" />
            {/* Cap - red with white dots */}
            <ellipse cx="12" cy="14" rx="12" ry="10" fill="#9B4040" opacity="0.4" />
            {/* White dots on cap */}
            <circle cx="7" cy="10" r="1.5" fill="#FDF8F0" opacity="0.5" />
            <circle cx="14" cy="8" r="1.2" fill="#FDF8F0" opacity="0.5" />
            <circle cx="10" cy="14" r="1" fill="#FDF8F0" opacity="0.4" />
            <circle cx="17" cy="12" r="1.3" fill="#FDF8F0" opacity="0.45" />
            <circle cx="5" cy="14" r="0.8" fill="#FDF8F0" opacity="0.35" />
          </svg>
        </div>
      ))}
    </>
  );
}

function FairyDoor() {
  return (
    <div
      className="absolute hidden sm:block"
      style={{
        left: "22%",
        bottom: "17%",
        opacity: 0.3,
      }}
    >
      <svg width="18" height="24" viewBox="0 0 18 24" fill="none">
        {/* Door arch */}
        <path
          d="M2 24 L2 8 Q2 0 9 0 Q16 0 16 8 L16 24 Z"
          fill="#5C3A1A"
          opacity="0.6"
        />
        {/* Door frame */}
        <path
          d="M3 24 L3 9 Q3 2 9 2 Q15 2 15 9 L15 24 Z"
          fill="#8B6914"
          opacity="0.5"
        />
        {/* Tiny doorknob */}
        <circle cx="12" cy="15" r="1" fill="#C49A3C" opacity="0.7" />
        {/* Tiny window on door */}
        <circle cx="9" cy="8" r="2" fill="#C49A3C" opacity="0.3" />
        {/* Door glow */}
        <path
          d="M3 24 L3 9 Q3 2 9 2 Q15 2 15 9 L15 24 Z"
          fill="#C49A3C"
          opacity="0.1"
        />
      </svg>
    </div>
  );
}

function FairyStringLights() {
  const lights = [
    { cx: 280, cy: 115, delay: "0s" },
    { cx: 320, cy: 108, delay: "0.3s" },
    { cx: 360, cy: 104, delay: "0.6s" },
    { cx: 400, cy: 103, delay: "0.9s" },
    { cx: 440, cy: 106, delay: "1.2s" },
    { cx: 480, cy: 112, delay: "0.2s" },
    { cx: 900, cy: 78, delay: "0.5s" },
    { cx: 940, cy: 72, delay: "0.8s" },
    { cx: 980, cy: 69, delay: "1.1s" },
    { cx: 1020, cy: 70, delay: "0.4s" },
    { cx: 1060, cy: 74, delay: "0.7s" },
    { cx: 1100, cy: 82, delay: "1.0s" },
  ];

  return (
    <svg
      viewBox="0 0 1440 180"
      className="absolute bottom-0 w-full"
      preserveAspectRatio="none"
    >
      {/* String wire - left catenary */}
      <path
        d="M260 120 Q370 95 500 118"
        fill="none"
        stroke="#1D4420"
        strokeWidth="0.5"
        opacity="0.12"
      />
      {/* String wire - right catenary */}
      <path
        d="M880 82 Q990 60 1120 86"
        fill="none"
        stroke="#1D4420"
        strokeWidth="0.5"
        opacity="0.12"
      />
      {/* Fairy light bulbs */}
      {lights.map((l, i) => (
        <g key={i}>
          <circle
            cx={l.cx}
            cy={l.cy}
            r="2"
            fill="#C49A3C"
            opacity="0.35"
            className="animate-fairy-light-twinkle"
            style={{ animationDelay: l.delay }}
          />
          <circle
            cx={l.cx}
            cy={l.cy}
            r="4"
            fill="#C49A3C"
            opacity="0.1"
            className="animate-fairy-light-twinkle"
            style={{ animationDelay: l.delay }}
          />
        </g>
      ))}
    </svg>
  );
}

function FairyDustTrail() {
  const sparkles = [
    { left: "20%", top: "30%", delay: "0s", duration: "3s", size: 3 },
    { left: "30%", top: "25%", delay: "0.5s", duration: "2.5s", size: 2 },
    { left: "40%", top: "35%", delay: "1s", duration: "3.5s", size: 2.5 },
    { left: "50%", top: "28%", delay: "1.5s", duration: "2.8s", size: 2 },
    { left: "60%", top: "32%", delay: "0.8s", duration: "3.2s", size: 3 },
    { left: "70%", top: "26%", delay: "2s", duration: "2.6s", size: 2 },
    { left: "80%", top: "34%", delay: "0.3s", duration: "3s", size: 2.5 },
    { left: "25%", top: "40%", delay: "1.2s", duration: "2.7s", size: 1.5 },
    { left: "45%", top: "22%", delay: "2.2s", duration: "3.3s", size: 2 },
    { left: "65%", top: "38%", delay: "0.7s", duration: "2.4s", size: 1.5 },
    { left: "85%", top: "29%", delay: "1.8s", duration: "3.1s", size: 2 },
    { left: "15%", top: "36%", delay: "2.5s", duration: "2.9s", size: 1.5 },
  ];

  return (
    <>
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="animate-fairy-sparkle absolute"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        >
          <svg
            width={s.size * 3}
            height={s.size * 3}
            viewBox="0 0 12 12"
            fill="none"
            style={{ marginLeft: `-${s.size}px`, marginTop: `-${s.size}px` }}
          >
            {/* Four-pointed star sparkle */}
            <path
              d="M6 0 L7 4.5 L12 6 L7 7.5 L6 12 L5 7.5 L0 6 L5 4.5 Z"
              fill="#C49A3C"
              opacity="0.5"
            />
          </svg>
        </div>
      ))}
    </>
  );
}
