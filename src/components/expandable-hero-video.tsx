"use client";

import { useEffect, useRef } from "react";

const INITIAL_WIDTH = 80;
const INITIAL_HEIGHT = 70;
const INITIAL_RADIUS = 24;

export function ExpandableHeroVideo({ videoSrc }: { videoSrc: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const video = videoRef.current;
    const indicator = indicatorRef.current;
    if (!section || !container || !video || !indicator) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      video.setAttribute("autoplay", "");
      video.play().catch(() => {});
      return;
    }

    let hasPlayedVideo = false;
    let ticking = false;

    function handleScroll() {
      if (!section || !container || !video || !indicator) return;
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - sectionTop) / (windowHeight * 1.5))
      );
      const easeProgress =
        scrollProgress < 0.5
          ? 2 * scrollProgress * scrollProgress
          : 1 - Math.pow(-2 * scrollProgress + 2, 2) / 2;

      const width = INITIAL_WIDTH + (100 - INITIAL_WIDTH) * easeProgress;
      const height = INITIAL_HEIGHT + (100 - INITIAL_HEIGHT) * easeProgress;
      const radius = INITIAL_RADIUS * (1 - easeProgress);

      container.style.width = `${width}%`;
      container.style.height = `${height}vh`;
      container.style.borderRadius = `${radius}px`;

      const shadowOpacity = Math.max(0, 1 - easeProgress * 2);
      container.style.boxShadow = `0 20px 60px rgba(0, 0, 0, ${0.3 * shadowOpacity})`;

      const indicatorOpacity = Math.max(0, 1 - scrollProgress * 2);
      indicator.style.opacity = String(indicatorOpacity);

      if (scrollProgress > 0.6 && !hasPlayedVideo) {
        video.play().catch(() => {});
        hasPlayedVideo = true;
      }
      if (scrollProgress < 0.3 && hasPlayedVideo) {
        video.pause();
        video.currentTime = 0;
        hasPlayedVideo = false;
      }
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black h-[200vh] max-md:h-auto max-md:py-10"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden max-md:static max-md:h-auto">
        <div
          ref={containerRef}
          className="relative w-[80%] h-[70vh] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-md:w-[90%] max-md:h-0 max-md:pb-[67.5%] max-md:rounded-2xl"
        >
          <video
            ref={videoRef}
            muted
            playsInline
            loop
            className="h-full w-full object-cover block max-md:absolute max-md:inset-0"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          <div
            ref={indicatorRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce max-md:hidden"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.5))" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
