import { useEffect, useState } from "react";

export type Vibe = "cyberpunk" | "shonen" | "ghibli";

const VIBES: Record<Vibe, { primary: string; accent: string; pink: string; bg: string; label: string }> = {
  cyberpunk: {
    primary: "oklch(0.75 0.18 180)",
    accent: "oklch(0.8 0.16 60)",
    pink: "oklch(0.75 0.22 340)",
    bg: "oklch(0.06 0.01 240)",
    label: "// CYBERPUNK //",
  },
  shonen: {
    primary: "oklch(0.78 0.22 35)",
    accent: "oklch(0.9 0.15 90)",
    pink: "oklch(0.7 0.25 20)",
    bg: "oklch(0.08 0.04 30)",
    label: "⚡ SHONEN ⚡",
  },
  ghibli: {
    primary: "oklch(0.78 0.14 150)",
    accent: "oklch(0.85 0.12 80)",
    pink: "oklch(0.85 0.1 340)",
    bg: "oklch(0.1 0.02 200)",
    label: "🌸 GHIBLI 🌸",
  },
};

export function VibeCycler({ onVibeChange }: { onVibeChange?: (v: Vibe) => void }) {
  const [vibe, setVibe] = useState<Vibe>("cyberpunk");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const v = VIBES[vibe];
    root.style.setProperty("--primary", v.primary);
    root.style.setProperty("--accent", v.accent);
    root.style.setProperty("--neon-cyan", v.primary);
    root.style.setProperty("--neon-orange", v.accent);
    root.style.setProperty("--neon-pink", v.pink);
    root.style.setProperty("--background", v.bg);
    root.style.setProperty("--ring", v.primary);
    setFlash(false);
    const t = setTimeout(() => setFlash(false), 400);
    onVibeChange?.(vibe);
    return () => clearTimeout(t);
  }, [vibe, onVibeChange]);

  useEffect(() => {
    const order: Vibe[] = ["cyberpunk", "shonen", "ghibli"];
    const id = setInterval(() => {
      setVibe((prev) => order[(order.indexOf(prev) + 1) % order.length]);
    }, 18000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {flash && (
        <div className="fixed inset-0 z-[9998] pointer-events-none animate-vibe-flash bg-white" />
      )}
      <button
        onClick={() => {
          const order: Vibe[] = ["cyberpunk", "shonen", "ghibli"];
          setVibe((prev) => order[(order.indexOf(prev) + 1) % order.length]);
        }}
        className="fixed top-4 right-4 z-[60] rounded-full border border-primary/60 bg-card/80 px-3 py-1.5 text-xs font-mono backdrop-blur-md hover:scale-110 transition-all neon-glow-cyan"
      >
        {VIBES[vibe].label}
      </button>
    </>
  );
}
