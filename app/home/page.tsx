"use client"
import Features from '@/components/home/feature'
import Hero from '@/components/home/hero'
import HomeHeader from '@/components/home/home-header'
import { Button } from '@/components/ui/button'
import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Homepage = () => {
  

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b px-4 z-50">
        <HomeHeader />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative">
        {/* Hero Content */}
        <Hero />
      </section>

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold text-black mb-6">Ready to Track Your Adventure Finances?</h2>
        <p className="text-lg text-gray-600 mb-8">Sign up today and start planning your next trip with ease.</p>
        <Button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300">
          <Link href="/auth/signup" className="flex items-center">
            Sign Up Now
          </Link>
        </Button>
      </section>
    </div>
  );
}

export default Homepage;
