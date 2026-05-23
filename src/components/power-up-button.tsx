import { useState } from "react";

export function PowerUpButton() {
  const [active, setActive] = useState(false);
  const [charge, setCharge] = useState(0);

  const fire = () => {
    setActive(true);
    setCharge(0);
    const start = Date.now();
    const charging = setInterval(() => {
      const p = Math.min(100, (Date.now() - start) / 12);
      setCharge(p);
      if (p >= 100) clearInterval(charging);
    }, 30);
    // Aura sound
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.5);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.8);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      osc.connect(g).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch {/* */}
    setTimeout(() => { setActive(false); setCharge(0); clearInterval(charging); }, 2000);
  };

  return (
    <>
      <button
        onClick={fire}
        disabled={active}
        className="fixed bottom-4 right-4 z-[60] rounded-full border-2 border-accent bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 px-5 py-3 font-mono text-sm font-black text-black shadow-[0_0_30px_rgba(255,100,0,0.7)] hover:scale-110 active:scale-95 transition-all disabled:opacity-100"
        style={{ textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
      >
        ⚡ KAMEHAMEHA
      </button>
      {active && (
        <div className="fixed inset-0 z-[9997] pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-radial from-yellow-300/40 via-orange-500/30 to-transparent animate-pulse" />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-200 via-white to-cyan-200"
            style={{
              width: `${charge * 8}px`,
              height: `${charge * 8}px`,
              boxShadow: `0 0 ${charge * 2}px ${charge}px rgba(255,255,150,0.8), 0 0 ${charge * 4}px ${charge * 2}px rgba(0,200,255,0.6)`,
              filter: "blur(2px)",
            }}
          />
          {/* Speed lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-0.5 bg-white animate-speed-lines"
              style={{
                width: "100vw",
                transform: `rotate(${i * 18}deg) translateX(50px)`,
                opacity: charge / 100,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
