import { useEffect, useRef, useState } from "react";

// Cute anime SDs that wander, follow cursor, and react to clicks.
// Pure SVG so they scale crisply and stay performant.

type Mood = "idle" | "chase" | "cheer" | "sleep";

interface Companion {
  id: number;
  x: number; // px
  y: number;
  vx: number;
  vy: number;
  hue: number;
  scale: number;
  mood: Mood;
  bob: number;
  blink: number;
  name: string;
  emoji: string;
}

const NAMES = ["Yuki", "Kuro", "Mochi", "Hoshi", "Rin", "Tama", "Aki", "Nami"];
const EMOJIS = ["🌸", "⚡", "🍡", "✨", "🍥", "🌙", "🔮", "🍣"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function AnimeCompanions({ count = 5 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [pets, setPets] = useState<Companion[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, down: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPets(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: rand(80, w - 80),
        y: rand(120, h - 120),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        hue: Math.floor(rand(0, 360)),
        scale: rand(0.8, 1.2),
        mood: "idle" as Mood,
        bob: Math.random() * Math.PI * 2,
        blink: 0,
        name: NAMES[i % NAMES.length],
        emoji: EMOJIS[i % EMOJIS.length],
      }))
    );

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onDown = () => (mouse.current.down = true);
    const onUp = () => (mouse.current.down = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [count]);

  useEffect(() => {
    if (!mounted) return;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      setPets((prev) =>
        prev.map((p) => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          let { vx, vy, mood } = p;

          if (mouse.current.down && dist < 600) {
            // cheer toward cursor
            vx += (dx / dist) * 0.4;
            vy += (dy / dist) * 0.4;
            mood = "cheer";
          } else if (dist < 220) {
            // gentle chase
            vx += (dx / dist) * 0.08;
            vy += (dy / dist) * 0.08;
            mood = "chase";
          } else {
            // wander
            vx += rand(-0.05, 0.05);
            vy += rand(-0.05, 0.05);
            mood = "idle";
          }
          // damping & speed cap
          vx *= 0.96;
          vy *= 0.96;
          const sp = Math.hypot(vx, vy);
          const cap = 3.2;
          if (sp > cap) {
            vx = (vx / sp) * cap;
            vy = (vy / sp) * cap;
          }
          let nx = p.x + vx * (dt / 16);
          let ny = p.y + vy * (dt / 16);
          // bounce
          if (nx < 30) { nx = 30; vx = Math.abs(vx); }
          if (nx > w - 30) { nx = w - 30; vx = -Math.abs(vx); }
          if (ny < 60) { ny = 60; vy = Math.abs(vy); }
          if (ny > h - 30) { ny = h - 30; vy = -Math.abs(vy); }

          return {
            ...p,
            x: nx,
            y: ny,
            vx,
            vy,
            mood,
            bob: p.bob + 0.05,
            blink: (p.blink + 1) % 220,
          };
        })
      );
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[45] pointer-events-none overflow-hidden">
      {pets.map((p) => {
        const bob = Math.sin(p.bob) * 4;
        const blinking = p.blink > 210;
        const facingLeft = p.vx < 0;
        return (
          <div
            key={p.id}
            className="absolute will-change-transform"
            style={{
              transform: `translate3d(${p.x - 32}px, ${p.y - 32 + bob}px, 0) scale(${p.scale}) scaleX(${facingLeft ? -1 : 1})`,
              transition: "filter 200ms",
              filter:
                p.mood === "cheer"
                  ? `drop-shadow(0 0 14px hsl(${p.hue} 90% 65%))`
                  : `drop-shadow(0 4px 8px rgba(0,0,0,0.5))`,
            }}
          >
            <svg width="64" height="64" viewBox="0 0 64 64">
              {/* aura */}
              {p.mood === "cheer" && (
                <circle cx="32" cy="34" r="28" fill={`hsl(${p.hue} 90% 65% / 0.25)`} className="animate-pulse" />
              )}
              {/* body */}
              <ellipse cx="32" cy="42" rx="18" ry="16" fill={`hsl(${p.hue} 85% 70%)`} stroke="#0a0a0a" strokeWidth="2" />
              {/* head */}
              <circle cx="32" cy="26" r="16" fill={`hsl(${p.hue} 90% 80%)`} stroke="#0a0a0a" strokeWidth="2" />
              {/* hair tuft */}
              <path d={`M20 18 Q28 6 36 16 Q42 8 46 20 Q40 14 32 18 Q24 14 20 18 Z`} fill={`hsl(${(p.hue + 200) % 360} 70% 25%)`} stroke="#0a0a0a" strokeWidth="1.5" />
              {/* eyes */}
              {blinking ? (
                <>
                  <path d="M25 27 Q27 29 29 27" stroke="#0a0a0a" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M35 27 Q37 29 39 27" stroke="#0a0a0a" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="27" cy="27" rx="2.5" ry="3.5" fill="#0a0a0a" />
                  <ellipse cx="37" cy="27" rx="2.5" ry="3.5" fill="#0a0a0a" />
                  <circle cx="27.8" cy="25.8" r="0.9" fill="#fff" />
                  <circle cx="37.8" cy="25.8" r="0.9" fill="#fff" />
                </>
              )}
              {/* blush */}
              <circle cx="23" cy="31" r="1.8" fill="#ff6ba8" opacity="0.7" />
              <circle cx="41" cy="31" r="1.8" fill="#ff6ba8" opacity="0.7" />
              {/* mouth */}
              {p.mood === "cheer" ? (
                <path d="M28 33 Q32 38 36 33" stroke="#0a0a0a" strokeWidth="1.6" fill="#ff6ba8" />
              ) : (
                <path d="M30 33 Q32 35 34 33" stroke="#0a0a0a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              )}
              {/* accessory */}
              <text x="46" y="14" fontSize="14">{p.emoji}</text>
            </svg>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-foreground/80 bg-background/70 backdrop-blur px-1.5 py-0.5 rounded-full border border-border whitespace-nowrap">
              {p.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
