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
      </div>

      {/* Mid-ground rolling hills */}
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
