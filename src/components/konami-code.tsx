import { useEffect, useState } from "react";

const SEQ = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function KonamiCode() {
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let idx = 0;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQ[idx]) {
        idx++;
        setProgress(idx);
        if (idx === SEQ.length) {
          setUnlocked(true);
          idx = 0;
          setProgress(0);
          document.body.classList.add("rainbow-mode");
          setTimeout(() => {
            setUnlocked(false);
            document.body.classList.remove("rainbow-mode");
          }, 10000);
        }
      } else {
        idx = 0;
        setProgress(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {progress > 0 && progress < SEQ.length && (
        <div className="fixed top-16 right-4 z-[60] rounded-md border border-primary/40 bg-card/80 px-3 py-1.5 font-mono text-xs backdrop-blur-md">
          konami: {progress}/{SEQ.length}
        </div>
      )}
      {unlocked && (
        <div className="fixed inset-0 z-[9996] pointer-events-none flex items-center justify-center">
          <div className="text-8xl font-black animate-bounce" style={{
            background: "linear-gradient(90deg, #ff0080, #ff8c00, #ffd700, #00ff80, #00bfff, #8a2be2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(255,255,255,0.6))",
          }}>
            🌈 GOD MODE 🌈
          </div>
        </div>
      )}
    </>
  );
}
