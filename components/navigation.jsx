"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Play, BookOpen, Music, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignInButton, useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"

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
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <Logo size="sm" animate={false} />
            </div>
            <div className="sm:hidden">
              <motion.div
                className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 10 }}
              >
                <Play className="h-5 w-5 text-primary-foreground" />
              </motion.div>
            </div>
          </Link>
        </motion.div>

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
