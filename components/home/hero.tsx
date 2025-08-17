"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Hero = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch {}

    const ctx = gsap.context(() => {
      // Simple h1 entrance animation
      gsap.from("h1", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate paragraph
      gsap.from("p", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      // Image pop-in
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          scale: 1.06,
          opacity: 0,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
        });
      }

      // Parallax band on scroll
      if (bandRef.current) {
        gsap.to(bandRef.current, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative px-2 md:px-8 lg:px-12 bg-white full-band"
    >
      <div ref={bandRef} className="band" aria-hidden="true" />
      <div className="container grid md:grid-cols-2 gap-10 py-16 md:py-24 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl mb-6 leading-tight">
            <span className="text-gradient-brand bg-clip-text text-transparent font-noto-serif">
              Travel expense tracking
            </span>
            <span className=" text-black font-noto-serif">
              {" "}
              built for tour companies
            </span>
          </h1>

          <p className="font-quicksand text-lg md:text-xl text-muted-foreground mb-8">
            TRIPYFIN centralizes receipts, automates approvals, and turns trip
            costs into instant insights — so every tour stays on budget.
          </p>
        </div>

        <div
          ref={imageRef}
          className="relative w-full h-64 sm:h-80 md:h-[420px]"
        >
          <Image
            src="/hero.jpg"
            alt="Hero Image"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
