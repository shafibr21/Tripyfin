"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, User, Menu, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

const HomeHeader = () => {
  const { data: session } = useSession()
  const user = session?.user
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm px-4 z-50">
      <div className="container mx-auto px-4 ">
        {/* Desktop and Mobile Header */}
        <div className="flex justify-between items-center ">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <img src="/logo.svg" alt="TripyFin Logo" className="w-10 h-10 md:w-16 md:h-16" />
            <h1 className="text-lg md:text-xl font-semibold text-black">TripyFin</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="bg-black text-white hover:bg-transparent hover:text-black"
            >
              <Link href="/" className="flex items-center">
                Home
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="bg-black text-white hover:bg-transparent hover:text-black"
            >
              <Link href="/dashboard" className="flex items-center">
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-black">{user?.name ?? 'Guest'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden bg-black my-3"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 border-t border-gray-200">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start bg-black text-white hover:bg-transparent hover:text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/" className="flex items-center">
                  Home
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start bg-black text-white hover:bg-transparent hover:text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/dashboard" className="flex items-center">
                  Dashboard
                </Link>
              </Button>
            </div>

            {/* Mobile User Section */}
            <div className="flex items-center justify-between py-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-black">{user?.name ?? 'Guest'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signOut()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2 "
              >
                <LogOut className="h-4 w-4 " />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default HomeHeader