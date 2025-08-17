"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePrimary = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between py-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="TRIPYFIN home"
        >
          <span className="text-2xl font-extrabold tracking-tight text-gradient-brand">
            TRIPYFIN
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link href="#how" className="hover:text-primary transition-colors">
            How it works
          </Link>
          <Link href="#cta" className="hover:text-primary transition-colors">
            Get started
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth Section */}
          {!user ? (
            <>
              <Button
                variant="outline"
                className="hidden md:inline-flex"
                onClick={() => router.push("/auth/signin")}
              >
                Sign in
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handlePrimary}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
              >
                Get started
              </Button>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user.name ?? "Guest"}
                </span>
              </div>
              <Button
                variant="outline"
                className="hidden md:inline-flex"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handlePrimary}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
              >
                Dashboard
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex flex-col gap-3">
            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-primary transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#cta"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-primary transition-colors"
            >
              Get started
            </Link>

            <div className="pt-3 border-t border-gray-200">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/auth/signin");
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handlePrimary();
                    }}
                  >
                    Get started
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {user.name ?? "Guest"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handlePrimary();
                      }}
                    >
                      Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
