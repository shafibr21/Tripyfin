"use client";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative px-2 md:px-8 lg:px-12 bg-white full-band">
      <div className="band" aria-hidden="true" />
      <div className="container grid md:grid-cols-2 gap-10 py-16 md:py-24 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="text-gradient-brand bg-clip-text text-transparent font-noto-serif">
              Travel expense tracking
            </span>
            <span className=" text-black font-noto-serif"> built for tour companies</span>
          </h1>

          <p className="font-quicksand text-lg md:text-xl text-muted-foreground mb-8">
            TRIPYFIN centralizes receipts, automates approvals, and turns trip costs into instant
            insights — so every tour stays on budget.
          </p>
        </div>

        <div className="relative w-full h-64 sm:h-80 md:h-[420px]">
          <Image src="/hero.jpg" alt="Hero Image" fill style={{ objectFit: "cover" }} priority className="rounded-lg" />
        </div>
      </div>
    </section>
  );
};

export default Hero;