"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Play, BookOpen, Music, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"

const navItems = [
  { href: "/", label: "Home", icon: null },
  { href: "/movies", label: "Movies", icon: Play },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/music", label: "Music", icon: Music },
  { href: "/my-list", label: "My List", icon: Heart },
]

export function Navigation() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Play className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">Entertainment Explorer</span>
          <span className="font-bold text-xl sm:hidden">EE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sign In Button or User Profile */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8"
              }
            }} />
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="sm:hidden">
                  <User className="h-4 w-4" />
                </Button>
              </SignInButton>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 text-sm font-medium transition-colors hover:text-primary p-2 rounded-lg ${
                        pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
