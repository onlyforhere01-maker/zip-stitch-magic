import { useEffect, useState, useCallback } from "react";

// Cinematic anime skits. Characters are rendered as sharp silhouettes
// with rim lighting, lens flares, light beams, motion blur, and energy
// FX — the goal is "anime opening freeze frame", not cartoon doodles.

type SceneProps = { onDone: () => void };

// ──────────────────────────────────────────────────────────────
// Speech bubble (typewriter)
// ──────────────────────────────────────────────────────────────
function SpeechBubble({
  x,
  y,
  text,
  side = "left",
  delay = 0,
  duration = 2400,
}: {
  x: number | string;
  y: number | string;
  text: string;
  side?: "left" | "right";
  delay?: number;
  duration?: number;
}) {
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), delay);
    const t2 = setTimeout(() => setShow(false), delay + duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [delay, duration]);

  useEffect(() => {
    if (!show) return;
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [show, text]);

  if (!show) return null;
  return (
    <div
      className="absolute z-[9100] pointer-events-none animate-scale-in"
      style={{
        left: typeof x === "number" ? `${x}px` : x,
        top: typeof y === "number" ? `${y}px` : y,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="relative max-w-[280px] rounded-2xl border-2 border-white/90 bg-black/85 backdrop-blur-md text-white px-4 py-2.5 font-mono text-sm shadow-[0_0_30px_rgba(255,255,255,0.15)]">
        {typed}
        <span className="animate-pulse">▌</span>
        <span
          className="absolute -bottom-2 w-4 h-4 rotate-45 bg-black/85 border-r-2 border-b-2 border-white/90"
          style={{ [side]: "20px" } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Silhouette characters — sharp anime poses, rim-lit
// ──────────────────────────────────────────────────────────────
type Pose = "swing" | "slash" | "fight-l" | "fight-r" | "stand" | "shy" | "charge";

function Silhouette({
  pose,
  rim = "#00e5ff",
  size = 280,
}: {
  pose: Pose;
  rim?: string;
  size?: number;
}) {
  // Different anime-style poses as sharp filled paths.
  const paths: Record<Pose, string> = {
    // Wind-up swing with staff held overhead, hair streaming
    swing:
      "M120 30 C90 28 78 50 82 70 L70 60 L74 88 C58 96 56 122 70 138 L92 150 L82 200 L100 248 L70 296 L96 304 L118 252 L128 252 L128 304 L150 304 L150 250 L168 250 L172 296 L196 286 L182 240 L196 188 L184 142 C204 132 210 110 198 92 L222 38 L208 30 L184 78 L172 64 C176 46 158 26 132 28 Z",
    // Mid-slash with katana arc trailing
    slash:
      "M100 36 C70 38 58 64 70 86 L52 78 L60 108 L48 140 L70 168 L60 218 L42 268 L70 280 L92 230 L106 210 L120 232 L116 284 L142 284 L150 232 L172 222 L210 200 L262 152 L296 96 L284 86 L240 132 L200 168 L172 176 L168 122 L186 90 C202 76 198 52 178 42 C162 34 130 32 100 36 Z",
    // Anchored fighter facing right, fist forward
    "fight-l":
      "M90 40 C66 42 56 66 66 86 L52 80 L60 108 L48 138 L66 162 L94 174 L160 188 L228 178 L260 170 L260 156 L208 148 L168 138 L138 124 L132 96 L150 76 C162 60 152 38 124 36 Z M70 188 L94 248 L78 308 L102 312 L118 252 L130 252 L130 312 L156 312 L156 252 L138 188 Z",
    // Anchored fighter facing left (mirror via scaleX)
    "fight-r":
      "M90 40 C66 42 56 66 66 86 L52 80 L60 108 L48 138 L66 162 L94 174 L160 188 L228 178 L260 170 L260 156 L208 148 L168 138 L138 124 L132 96 L150 76 C162 60 152 38 124 36 Z M70 188 L94 248 L78 308 L102 312 L118 252 L130 252 L130 312 L156 312 L156 252 L138 188 Z",
    stand:
      "M120 30 C92 32 80 56 90 78 L70 70 L78 102 L66 134 L84 162 L78 218 L62 280 L88 290 L108 230 L124 230 L128 290 L156 290 L156 230 L174 230 L188 286 L212 274 L194 218 L188 162 L206 134 L194 102 L202 70 L182 78 C192 56 178 32 152 30 Z",
    shy:
      "M120 30 C92 32 78 58 92 80 L78 76 L88 108 L74 140 L92 168 L86 224 L70 288 L96 296 L116 232 L128 232 L130 296 L156 296 L156 232 L170 232 L188 290 L210 280 L196 222 L198 168 L218 140 L204 108 L214 76 L196 80 C210 58 196 32 168 30 Z M204 130 L240 110 L246 118 L210 142 Z",
    charge:
      "M120 20 C82 22 64 58 78 86 L52 70 L66 108 L54 142 L72 172 L60 226 L40 296 L72 306 L96 232 L122 232 L128 306 L160 306 L160 232 L186 232 L210 302 L240 292 L222 226 L210 172 L228 142 L216 108 L230 70 L204 86 C218 58 200 22 162 20 Z",
  };

  const flip = pose === "fight-r";
  const id = `rim-${pose}-${rim.replace("#", "")}`;

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 320 340"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        filter: `drop-shadow(0 0 12px ${rim}) drop-shadow(0 0 28px ${rim}AA) drop-shadow(0 12px 24px rgba(0,0,0,0.7))`,
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={rim} stopOpacity="0.9" />
          <stop offset="35%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
      </defs>
      {/* Rim glow underlay */}
      <path d={paths[pose]} fill={rim} opacity="0.35" transform="translate(0,0)" style={{ filter: "blur(6px)" }} />
      {/* Sharp silhouette */}
      <path d={paths[pose]} fill={`url(#${id})`} stroke={rim} strokeWidth="1.2" strokeOpacity="0.8" />
      {/* Highlight rim line */}
      <path d={paths[pose]} fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.9" style={{ mixBlendMode: "screen" as const }} />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// FX primitives
// ──────────────────────────────────────────────────────────────
function SpeedLines({ direction = "left" }: { direction?: "left" | "right" }) {
  const lines = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
      {lines.map((_, i) => {
        const top = (i / lines.length) * 100;
        return (
          <div
            key={i}
            className="absolute h-[2px] bg-white"
            style={{
              top: `${top}%`,
              left: 0,
              right: 0,
              opacity: 0.85,
              animation: `speedline 0.45s linear ${i * 0.03}s infinite`,
              transform: direction === "right" ? "scaleX(-1)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function LightBeam({ angle = 20, color = "#fff", x = "50%" }: { angle?: number; color?: string; x?: string }) {
  return (
    <div
      className="absolute top-0 h-[140vh] w-[40vw] pointer-events-none mix-blend-screen"
      style={{
        left: x,
        background: `linear-gradient(90deg, transparent, ${color}55 40%, ${color}AA 50%, ${color}55 60%, transparent)`,
        transform: `translateX(-50%) rotate(${angle}deg)`,
        transformOrigin: "top center",
        filter: "blur(2px)",
        animation: "beamSweep 3.5s ease-in-out infinite",
      }}
    />
  );
}

function LensFlare({ x, y, color = "#fff" }: { x: string; y: string; color?: string }) {
  return (
    <div className="absolute pointer-events-none mix-blend-screen" style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
      <div className="w-40 h-40 rounded-full" style={{ background: `radial-gradient(circle, ${color}, transparent 60%)`, filter: "blur(8px)" }} />
      <div className="absolute inset-0 w-40 h-1 top-1/2 -translate-y-1/2" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, filter: "blur(1px)" }} />
      <div className="absolute inset-0 w-1 h-40 left-1/2 -translate-x-1/2" style={{ background: `linear-gradient(180deg, transparent, ${color}, transparent)`, filter: "blur(1px)" }} />
    </div>
  );
}

function Vignette() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
      }}
    />
  );
}

function Letterbox() {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[8vh] bg-black z-[8999] animate-letterbox-top" />
      <div className="absolute bottom-0 left-0 right-0 h-[8vh] bg-black z-[8999] animate-letterbox-bottom" />
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 1: Hero swings across with staff — cinematic sweep
// ──────────────────────────────────────────────────────────────
function SwingHero({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 5200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <Letterbox />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-cyan-500/10" />
      <LightBeam angle={-15} color="#ffb84a" x="60%" />
      <SpeedLines direction="left" />
      <div
        className="absolute top-[14%]"
        style={{ animation: "skitSwingAcross 5s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
      >
        <div style={{ animation: "skitSpin 0.6s linear infinite", filter: "blur(0.5px)" }}>
          <Silhouette pose="swing" rim="#ffb84a" size={260} />
        </div>
      </div>
      <SpeechBubble x="50%" y="50%" text="OUTTA MY WAY — DESTINY CALLS" delay={1400} duration={2200} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 2: Two fighters clash, notice viewer, retreat
// ──────────────────────────────────────────────────────────────
function FightInterrupted({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 11000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <Letterbox />
      <div className="absolute inset-0 bg-black/55 animate-fade-in" />
      <Vignette />
      <LightBeam angle={20} color="#00e5ff" x="30%" />
      <LightBeam angle={-20} color="#ff3b6e" x="70%" />

      {/* Floor reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-cyan-500/20 to-transparent" />

      <div className="absolute bottom-[12%] left-0" style={{ animation: "fighterLeft 11s ease-in-out forwards" }}>
        <Silhouette pose="fight-l" rim="#00e5ff" size={320} />
      </div>
      <div className="absolute bottom-[12%] right-0" style={{ animation: "fighterRight 11s ease-in-out forwards" }}>
        <Silhouette pose="fight-r" rim="#ff3b6e" size={320} />
      </div>

      {/* Clash burst */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "clashFlash 0.8s ease-out 1.8s forwards", opacity: 0 }}>
        <div className="w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, #fff, #ffd84a 30%, transparent 70%)", filter: "blur(4px)" }} />
      </div>
      <LensFlare x="50%" y="50%" color="#ffd84a" />

      <SpeechBubble x="28%" y="38%" text="oi... someone's watching us." delay={3200} duration={2400} side="left" />
      <SpeechBubble x="72%" y="38%" text="tch. we settle this another night, rival." delay={5800} duration={2600} side="right" />
      <SpeechBubble x="50%" y="62%" text="(both vanish into the dark)" delay={8800} duration={1800} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 3: Shy/flirty character peeks
// ──────────────────────────────────────────────────────────────
function ShyGirlPeek({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 7500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-pink-500/15 via-transparent to-transparent" />
      <LightBeam angle={-10} color="#ff8aa8" x="80%" />
      <div
        className="absolute bottom-[8%] right-0"
        style={{ animation: "shyPeek 7.5s ease-in-out forwards" }}
      >
        <Silhouette pose="shy" rim="#ff8aa8" size={280} />
      </div>
      {/* heart sparks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute text-pink-300 text-2xl mix-blend-screen"
          style={{ right: `${10 + i * 3}%`, top: `${30 + i * 4}%`, animation: `petalFall 4s ease-out ${1.5 + i * 0.2}s forwards`, opacity: 0 }}>♡</div>
      ))}
      <SpeechBubble x="78%" y="42%" text="h-hi senpai... noticed me yet? ♡" delay={2000} duration={2600} side="right" />
      <SpeechBubble x="78%" y="42%" text="okay bye!! pretend you didn't see >///<" delay={5000} duration={2200} side="right" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 4: Sigma walks by silently
// ──────────────────────────────────────────────────────────────
function SigmaWalk({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 9500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />
      <Vignette />
      <LightBeam angle={5} color="#7a00ff" x="50%" />
      <div className="absolute bottom-[10%]" style={{ animation: "sigmaWalk 9.5s linear forwards" }}>
        <div style={{ animation: "subtleBob 0.9s ease-in-out infinite" }}>
          <Silhouette pose="stand" rim="#7a00ff" size={280} />
        </div>
      </div>
      <SpeechBubble x="50%" y="52%" text="..." delay={2800} duration={1600} />
      <SpeechBubble x="50%" y="52%" text="they always watch. doesn't matter." delay={5200} duration={2600} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 5: Aura charge — full power-up
// ──────────────────────────────────────────────────────────────
function AuraCharge({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 7000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/40 via-orange-500/10 to-transparent" style={{ animation: "auraPulse 6.5s ease-in-out" }} />
      <SpeedLines direction="right" />
      <LightBeam angle={0} color="#ffd84a" x="50%" />

      {/* Ground crack glow */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60vw] h-12 rounded-full"
        style={{ background: "radial-gradient(ellipse, #ffd84a, transparent 70%)", filter: "blur(20px)", animation: "auraPulse 6.5s ease-in-out" }} />

      <div className="absolute left-1/2 bottom-[14%] -translate-x-1/2" style={{ animation: "shakeChar 0.06s linear infinite" }}>
        <div className="relative">
          <div className="absolute inset-0 -m-20 rounded-full bg-yellow-300/60 blur-3xl animate-pulse" />
          <div className="absolute inset-0 -m-10 rounded-full bg-orange-400/70 blur-2xl animate-pulse" />
          <div className="relative">
            <Silhouette pose="charge" rim="#ffd84a" size={340} />
          </div>
        </div>
      </div>

      {/* Rising spark particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute bottom-0 w-1 h-1 rounded-full bg-yellow-200 mix-blend-screen"
          style={{ left: `${30 + Math.random() * 40}%`, animation: `sparkRise ${1.5 + Math.random()}s linear ${Math.random() * 4}s infinite`, boxShadow: "0 0 10px #ffd84a" }} />
      ))}

      <LensFlare x="50%" y="50%" color="#ffd84a" />
      <SpeechBubble x="50%" y="30%" text="this isn't even my final form..." delay={2400} duration={2200} />
      <SpeechBubble x="50%" y="30%" text="HAAAAA — back to scrolling, mortal" delay={4800} duration={1900} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scene 6: Samurai dash slash + petals
// ──────────────────────────────────────────────────────────────
function SamuraiSlash({ onDone }: SceneProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 5800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden">
      <Letterbox />
      <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 via-black/40 to-rose-900/30" />
      <Vignette />

      <div className="absolute top-1/2 -translate-y-1/2"
        style={{ animation: "samuraiDash 1.4s cubic-bezier(0.7, 0, 0.3, 1) forwards", filter: "blur(1px)" }}>
        <Silhouette pose="slash" rim="#ff4d6d" size={300} />
      </div>

      {/* Slash arc */}
      <div className="absolute top-1/2 left-1/2 w-[90vw] h-[3px] bg-white origin-left"
        style={{
          transform: "translate(-50%, -50%) rotate(-12deg)",
          animation: "slashLine 0.5s ease-out 1.2s forwards",
          opacity: 0,
          boxShadow: "0 0 30px #fff, 0 0 60px #ff4d6d, 0 0 100px #ff4d6d",
        }} />

      {/* Sparks at slash impact */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white mix-blend-screen"
          style={{
            boxShadow: "0 0 12px #fff, 0 0 24px #ff4d6d",
            animation: `sparkBurst 0.8s ease-out 1.3s forwards`,
            opacity: 0,
            ['--ang' as string]: `${(i / 14) * 360}deg`,
          } as React.CSSProperties} />
      ))}

      {/* Petals */}
      {Array.from({ length: 22 }).map((_, i) => (
        <div key={i} className="absolute text-pink-300 text-2xl mix-blend-screen"
          style={{ left: `${5 + i * 4.2}%`, top: "50%", animation: `petalFall 3.2s ease-out ${1.4 + i * 0.06}s forwards`, opacity: 0, filter: "drop-shadow(0 0 6px #ff4d6d)" }}>🌸</div>
      ))}
      <SpeechBubble x="50%" y="34%" text="one cut. one truth." delay={2400} duration={2400} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Scheduler
// ──────────────────────────────────────────────────────────────
const SCENES = [SwingHero, ShyGirlPeek, SigmaWalk, AuraCharge, SamuraiSlash];

export function AnimeSkits() {
  const [active, setActive] = useState<number | null>(null);
  const [SceneComp, setSceneComp] = useState<React.FC<SceneProps> | null>(null);

  const pick = useCallback(() => {
    const idx = Math.floor(Math.random() * SCENES.length);
    setActive(idx);
    setSceneComp(() => SCENES[idx]);
  }, []);

  useEffect(() => {
    const first = setTimeout(pick, 12000 + Math.random() * 10000);
    return () => clearTimeout(first);
  }, [pick]);

  const handleDone = useCallback(() => {
    setActive(null);
    setSceneComp(null);
    setTimeout(pick, 60000 + Math.random() * 60000);
  }, [pick]);

  if (!SceneComp || active === null) return null;
  return <SceneComp key={active + "-" + Date.now()} onDone={handleDone} />;
}
