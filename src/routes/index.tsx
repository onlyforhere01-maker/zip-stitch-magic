import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { MoodSection, type Mood } from "@/components/sections/mood-section";
import { ThoughtsSection } from "@/components/sections/thoughts-section";
import { MusicSection } from "@/components/sections/music-section";
import { JokesSection } from "@/components/sections/jokes-section";
import { QuoteGenerator } from "@/components/sections/quote-generator";
import { SurpriseMode } from "@/components/surprise-mode";
import { FloatingOrbs } from "@/components/floating-orbs";
import { CursorTrail } from "@/components/cursor-trail";
import { CherryBlossoms } from "@/components/cherry-blossoms";
import { ClickSparkles } from "@/components/click-sparkles";
import { ParticleField } from "@/components/particle-field";
import { VibeCycler } from "@/components/vibe-cycler";
import { KanjiRain } from "@/components/kanji-rain";
import { KonamiCode } from "@/components/konami-code";
import { AnimeCompanions } from "@/components/anime-companions";
import { AnimeSkits } from "@/components/anime-skits";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "✧ My Digital Playground ✧" },
      { name: "description", content: "Welcome to my chaotic anime-fueled corner of the internet" },
    ],
  }),
});

const MARQUEE = ["夢", "WELCOME", "混沌", "STAY WEIRD", "桜", "RUN IT BACK", "魂", "ANIME FOREVER", "光", "404 VIBES"];

function Home() {
  const [surpriseActive, setSurpriseActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerSurprise = useCallback(() => {
    setSurpriseActive(true);
    setTimeout(() => setSurpriseActive(false), 2400);
  }, []);

  const handleHeaderClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 3000);
        return 0;
      }
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: currentMood
          ? `linear-gradient(to bottom right, ${currentMood.bgGradient.split(" ").join(", ")})`
          : undefined,
      }}
    >
      <AnimeSkits />
      <KanjiRain />
      <FloatingOrbs />
      <ParticleField />
      <CherryBlossoms />
      <CursorTrail />
      <ClickSparkles />
      <VibeCycler />
      <KonamiCode />
      <AnimeCompanions count={5} />
      <SurpriseMode active={surpriseActive} />

      {/* Cinematic grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-[5] opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")" }} />
      {/* Scanline */}
      <div className="pointer-events-none fixed inset-0 z-[6] opacity-[0.07]"
        style={{ background: "repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255,255,255,0.4) 2px 3px)" }} />

      {showEasterEgg && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 animate-dramatic-reveal">
          <div className="text-center">
            <p className="text-6xl mb-4 animate-bounce">🎉</p>
            <p className="text-2xl font-bold neon-glow-cyan">YOU FOUND THE SECRET!</p>
            <p className="text-muted-foreground mt-2 font-mono">{"// congrats, you're officially curious"}</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* ===================== HERO ===================== */}
        <header className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-20 pb-12">
          {/* Giant kanji backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              opacity: Math.max(0, 0.18 - scrollY * 0.0005),
            }}
          >
            <span className="text-[40vw] md:text-[28vw] font-black leading-none text-foreground/10 mix-blend-overlay">混</span>
          </div>

          {/* Corner brackets — anime title-card */}
          <div className="absolute top-20 left-6 md:left-10 w-16 h-16 border-l-2 border-t-2 border-primary/70" />
          <div className="absolute top-20 right-6 md:right-10 w-16 h-16 border-r-2 border-t-2 border-primary/70" />
          <div className="absolute bottom-16 left-6 md:left-10 w-16 h-16 border-l-2 border-b-2 border-primary/70" />
          <div className="absolute bottom-16 right-6 md:right-10 w-16 h-16 border-r-2 border-b-2 border-primary/70" />

          <div
            className="relative mx-auto max-w-5xl text-center"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: Math.max(0, 1 - scrollY * 0.0025),
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/40 px-4 py-1.5 text-xs font-mono backdrop-blur-md mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              EP.01 — ENTER THE CHAOS
            </div>

            <h1
              onClick={handleHeaderClick}
              onMouseEnter={() => setHeaderHovered(true)}
              onMouseLeave={() => setHeaderHovered(false)}
              className={`glitch-text text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] cursor-pointer select-none transition-all duration-500 ${
                headerHovered ? "animate-glitch-skew neon-glow-cyan" : "neon-glow-pink"
              }`}
              data-text="welcome to my chaos"
            >
              welcome<br/>to my <span className="italic text-primary">chaos</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-muted-foreground font-mono">
              <span className="text-primary">{"/*"}</span> six worlds. infinite vibes. tiny anime friends included. <span className="text-primary">{"*/"}</span>
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={triggerSurprise}
                className="group relative inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary/10 px-7 py-3.5 text-sm font-bold uppercase tracking-wider transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">► click for vibes</span>
              </button>
              <a
                href="#worlds"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3.5 text-sm font-mono backdrop-blur-md hover:border-primary/60 hover:bg-card/60 transition-all"
              >
                scroll ↓
              </a>
            </div>
          </div>

          {/* Bottom stat strip */}
          <div className="absolute bottom-4 left-0 right-0 px-6 md:px-10 flex justify-between items-end text-xs font-mono text-muted-foreground/70">
            <div>
              <div className="text-primary">[ STATUS ]</div>
              <div>online · vibing · unhinged</div>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-primary">[ COORDS ]</div>
              <div>34.6937°N, 135.5023°E</div>
            </div>
          </div>
        </header>

        {/* ===================== MARQUEE ===================== */}
        <div className="relative overflow-hidden border-y-2 border-border bg-card/30 py-4 backdrop-blur-sm">
          <div className="flex animate-marquee whitespace-nowrap gap-12 text-2xl md:text-3xl font-black tracking-tight">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
              <span key={i} className="inline-flex items-center gap-12">
                <span className={i % 2 ? "text-primary" : "text-foreground"}>{w}</span>
                <span className="text-muted-foreground">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ===================== WORLDS / BENTO ===================== */}
        <section id="worlds" className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono text-primary mb-2">§ 01 — INTERACTIVE</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                pick a <span className="italic text-primary">world</span>
              </h2>
            </div>
            <div className="text-sm font-mono text-muted-foreground max-w-xs text-right">
              {"// each card is a tiny universe.\n   tap, drag, scream — make it yours."}
            </div>
          </div>

          {/* Bento grid: featured + normal */}
          <div className="grid gap-5 md:grid-cols-6 auto-rows-[minmax(220px,auto)]">
            <div className="md:col-span-3 md:row-span-2"><MoodSection onMoodChange={setCurrentMood} /></div>
            <div className="md:col-span-3"><ThoughtsSection /></div>
            <div className="md:col-span-2"><JokesSection /></div>
            <div className="md:col-span-4"><MusicSection /></div>
            <div className="md:col-span-3"><QuoteGenerator /></div>
            <div className="md:col-span-3 group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/60 bg-card/30 p-8 backdrop-blur-sm hover:border-primary/50 transition-all">
              <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground">/ 06</div>
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
                <span className="text-7xl animate-float-delayed mb-4">🌙</span>
                <p className="text-lg font-bold tracking-tight">more brewing</p>
                <p className="mt-1 text-xs text-muted-foreground font-mono">{"// stay tuned, mortal"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== DIVIDER ===================== */}
        <div className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-6 text-4xl md:text-6xl font-black text-primary">桜 ✦ 魂 ✦ 夢</span>
          </div>
        </div>

        {/* ===================== MANIFESTO ===================== */}
        <section className="mx-auto max-w-5xl px-4 pb-24">
          <div className="text-xs font-mono text-primary mb-2 text-center">§ 02 — MANIFESTO</div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-10">
            rules of the <span className="italic text-primary">playground</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "stay weird", d: "the algorithm is boring. you are not." },
              { n: "02", t: "click everything", d: "secrets hide where you least expect." },
              { n: "03", t: "vibe loud", d: "this place exists to be felt, not skimmed." },
            ].map((r) => (
              <div key={r.n} className="group relative rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm hover:border-primary/60 transition-all hover:-translate-y-1">
                <div className="text-xs font-mono text-primary mb-3">{r.n}</div>
                <h3 className="text-2xl font-black tracking-tight mb-2">{r.t}</h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">{r.d}</p>
                <div className="absolute top-0 right-0 h-8 w-8 border-r-2 border-t-2 border-primary/0 group-hover:border-primary rounded-tr-2xl transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="relative border-t-2 border-border bg-card/40 backdrop-blur-sm overflow-hidden">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[20vw] font-black text-foreground/[0.04] leading-none select-none pointer-events-none">CHAOS</div>
          <div className="relative mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-wrap justify-between items-end gap-6">
              <div>
                <div className="text-xs font-mono text-primary mb-1">[ END TRANSMISSION ]</div>
                <p className="text-2xl font-black tracking-tight">made with chaos<br/>and too much caffeine</p>
              </div>
              <div className="text-right text-xs font-mono text-muted-foreground/70">
                <div>2026 / build 0.0.∞</div>
                <div>existence is temporary,</div>
                <div>code is forever.</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
