import { useEffect, useRef } from "react";

const CHARS = "刀龍鬼妖魔神猫狐桜月夜風雷火水霧影心愛夢";

export function KanjiRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 10, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const grad = ctx.createLinearGradient(x, y - 40, x, y);
        grad.addColorStop(0, "rgba(0,229,255,0)");
        grad.addColorStop(1, "rgba(0,229,255,0.8)");
        ctx.fillStyle = grad;
        ctx.fillText(ch, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
}
