"use client"
import Footer from '@/components/footer'
import CTA from '@/components/home/CTA'
import Features from '@/components/home/feature'
import Hero from '@/components/home/hero'
import HowItWorks from '@/components/home/HowItWorks'
import React, { useEffect } from 'react'

const Homepage = () => {
  

  return (
    <div>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
    </div>
  );
}

export default Homepage;
