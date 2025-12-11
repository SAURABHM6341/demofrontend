"use client";

import React from "react";
import Image from "next/image";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const logos: Logo[] = [
  { src: "/logos/godrej.png", alt: "Godrej logo" },
  { src: "/logos/coca-cola.png", alt: "Coca-Cola logo" },
  { src: "/logos/del-monte.png", alt: "Del Monte logo" },
  { src: "/logos/bailley.png", alt: "Bailley logo" },
  { src: "/logos/centuryply.png", alt: "CenturyPly logo" },
  { src: "/logos/cargo-matters.jpeg", alt: "Cargo Matters logo" },
  { src: "/logos/DHL.png", alt: "DHL logo" },
  { src: "/logos/tata.png", alt: "Tata logo" },
  { src: "/logos/tata-steel.png", alt: "Tata Steel logo" },
  { src: "/logos/delhivery.png", alt: "Delhivery logo" },
  { src: "/logos/bluedart.png", alt: "Bluedart logo" },
  { src: "/logos/cadbury.png", alt: "cadbury logo" },
  { src: "/logos/wakefit.png", alt: "wakefit logo" },
  { src: "/logos/havells_.png", alt: "havells logo" },
  { src: "/logos/orient electric.png", alt: "orient electric logo" },
  { src: "/logos/kanodia.png", alt: "kanodia logo" },
  { src: "/logos/goodluck.png", alt: "goodluck logo" },
  { src: "/logos/jsw-steel.png", alt: "jsw-steel logo" },
  { src: "/logos/parle-logo.png", alt: "parle-logo logo" },
  { src: "/logos/nestle.png", alt: "nestle logo" },
  { src: "/logos/haldiram.png", alt: "haldiram logo" },
  { src: "/logos/nilkamal.png", alt: "nilkamal logo" },
];

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export default function ClientsMarquee() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef<number>(0);
  const baseSpeed = React.useMemo(() => {
    if (typeof window === "undefined") return 0.14;
    return window.matchMedia("(max-width: 768px)").matches ? 0.28 : 0.14;
  }, []);

  const speedRef = React.useRef<number>(baseSpeed);
  const isHoveringRef = React.useRef(false);
  const isDraggingRef = React.useRef(false);
  const dragStartXRef = React.useRef(0);
  const dragStartScrollRef = React.useRef(0);
  const lastMoveTimeRef = React.useRef(0);
  const lastMoveXRef = React.useRef(0);

  const loop = React.useCallback((ts: number) => {
    const el = containerRef.current;
    if (!el) return;

    const dt = lastTsRef.current ? ts - lastTsRef.current : 16;
    lastTsRef.current = ts;

    if (!isDraggingRef.current && !isHoveringRef.current) {
      el.scrollLeft += speedRef.current * dt;
    }

    const contentWidth = el.scrollWidth / 2;
    if (el.scrollLeft >= contentWidth) {
      el.scrollLeft -= contentWidth;
    } else if (el.scrollLeft < 0) {
      el.scrollLeft += contentWidth;
    }

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  React.useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    el.setPointerCapture(e.pointerId);
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    lastMoveTimeRef.current = performance.now();
    lastMoveXRef.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el || !isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollRef.current - dx;

    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    if (dt > 0) {
      const vx = (e.clientX - lastMoveXRef.current) / dt;
      const magnitude = clamp(Math.abs(vx), 0.06, 0.6);
      speedRef.current = (vx >= 0 ? -1 : 1) * magnitude;
      lastMoveTimeRef.current = now;
      lastMoveXRef.current = e.clientX;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDraggingRef.current = false;
    el.releasePointerCapture(e.pointerId);
    const sign = Math.sign(speedRef.current) || 1;
    const target = baseSpeed * sign;
    const start = performance.now();
    const startSpeed = speedRef.current;
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      if (t >= 1) {
        speedRef.current = target;
        return;
      }
      speedRef.current = startSpeed + (target - startSpeed) * t;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    if (isDraggingRef.current) onPointerUp(e);
  };

  return (
    <section
      aria-label="Trusted clients"
      className="w-full bg-background py-12"
    >
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] touch-pan-x select-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onMouseEnter={() => (isHoveringRef.current = true)}
        onMouseLeave={() => (isHoveringRef.current = false)}
        role="region"
        aria-roledescription="carousel"
      >
        <div className="flex items-center gap-10 py-6 px-2">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo.alt}-${i}`}
              className="flex h-40 w-40 shrink-0 items-center justify-center rounded-md bg-background/40"
              aria-label={logo.alt}
            >
              <div className="relative h-16 w-16 md:h-20 md:w-20 lg:h-28 lg:w-28">
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  className="object-contain"
                  sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 112px"
                  loading="lazy"
                  fill
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-2xl font-semibold ">
        Trusted by leading brands worldwide
      </p>
    </section>
  );
}
