"use client"
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import gsap from 'gsap';

const Hero = () => {
  useEffect(() => {
    // GSAP animation to slide the black strips down
    gsap.fromTo(
      ".black-strip", 
      { y: "-200%" }, // Initial position above the viewport
      { 
        y: "0%", // Final position at the top
        duration: 3, 
        ease: "power3.out" 
      }
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center">
      {/* Black Strips - Positioned just behind the Hero Section */}
      <div className="black-strip absolute top-0 left-1/2 w-[8px] h-[100vh] bg-black transform -translate-x-1/2 z-0"></div>
      {/* Second black strip with a 5px gap */}
      <div className="black-strip absolute top-0 left-[calc(50%+15px)] w-[8px] h-[100vh] bg-black transform -translate-x-1/2 z-0"></div>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row justify-between items-center w-full max-w-7xl p-4 gap-8 relative z-10">
        <div className="max-w-lg w-full text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-black">
            Manage Your Adventure Finances
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 leading-relaxed opacity-90">
            Track your travel expenses, stay within your budget, and enjoy your trip without worries.
          </p>
          <Button className="mt-6 md:mt-8 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <Link href="/dashboard" className="flex items-center">
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
            className="rounded-lg shadow-xl w-full h-auto object-cover"
            priority
          />
        </div>
      </section>
    </div>
  );
};

export default Hero;
