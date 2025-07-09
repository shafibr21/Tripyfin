"use client"
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import gsap from 'gsap';
import { SplitText } from 'gsap/all';

const Hero = () => {
  useEffect(() => {
    // GSAP animation to slide the black strips down
    gsap.fromTo(
      ".black-strip", 
      { y: "-200%" }, // Initial position above the viewport
      { 
        y: "0%", // Final position at the top
        duration: 3, 
        ease: "power3.out",
        onComplete: () => {
          // Create a thin line border effect after they hit the bottom
          gsap.to(".black-strip", {
            borderBottom: "2px solid black", // Create a border once they reach the bottom
            duration: 1,
            delay: 0.5, // Delay to allow the strips to hit the bottom first
          });
        }
      }
    );
    gsap.registerPlugin(SplitText)

    let split = new SplitText(".text", {
      type: "lines, words, chars",
    
    });
    gsap.from(split.lines,{
      y:100,
      autoAlpha:0,
      stagger: 0.4,
    })

    // Animate the "Start Tracking" button to fade in
    gsap.fromTo(
      ".start-tracking-btn",
      { opacity: 0,
        y: 50, // Start slightly below
        scale: 0.5, // Start slightly smaller
       }, // Initially invisible
      {
        opacity: 1, // Fade in to full visibility
        duration: 3, // Duration of the fade-in
        rotate: 360, // Optional rotation effect
        delay: 0.5, // Delay after the strips animation
        y: 0, // Move to original position
        scale: 1, // Scale to original size
        ease: "power3.out",
      }
    );

    // Use GSAP matchMedia for responsive image scaling
    let mm = gsap.matchMedia();

    // Mobile animation (screens smaller than 768px)
    mm.add("(max-width: 767px)", () => {
      gsap.fromTo(
        ".hero-img",
        { opacity: 0, y: 50, scale: 0.3 },
        {
          opacity: 1,
          duration: 2,
          delay: 1,
          ease: "power3.out",
          y: 0,
          scale: 1, // Original size on mobile
        }
      );
    });

    // Desktop animation (screens 768px and larger)
    mm.add("(min-width: 768px)", () => {
      gsap.fromTo(
        ".hero-img",
        { opacity: 0, y: 50, scale: 0.5 },
        {
          opacity: 1,
          duration: 2,
          delay: 1,
          ease: "power3.out",
          y: 0,
          scale: 1.6, // Larger scale on desktop
        }
      );
    });

    // Cleanup function
    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Black Strips - Positioned relative to hero container, not viewport */}
      <div className="black-strip absolute top-0 left-1/2 w-[6px] h-full bg-black transform -translate-x-1/2 z-0 hidden md:block"></div>
      {/* Second black strip with a 5px gap */}
      <div className="black-strip absolute top-0 left-[calc(50%+15px)] w-[6px] h-full bg-black transform -translate-x-1/2 z-0 hidden md:block"></div>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row justify-between items-center w-full max-w-7xl p-4 gap-8 relative">
        <div className="max-w-lg w-full text-center md:text-left">
          <h1 className=" text text-3xl md:text-5xl font-bold text-black z-50">
            Manage Your Adventure Finances
          </h1>
          <p className=" text mt-4 md:mt-6 text-base md:text-lg text-gray-600 leading-relaxed opacity-90 z-50">
            Track your travel expenses, stay within your budget, and enjoy your trip without worries.
          </p>
          <Button className="start-tracking-btn mt-6 md:mt-8 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <Link href="/dashboard" className="  flex items-center">
              Start Tracking
            </Link>
          </Button>
        </div>
        <div className="max-w-xs md:max-w-md w-full flex justify-center">
          <Image 
            src="/hero.jpg"
            alt="Placeholder Traveler"
            width={400}
            height={400}
            className=" hero-img rounded-lg shadow-xl w-full h-auto object-cover"
            priority
          />
        </div>
      </section>
    </div>
  );
};

export default Hero;