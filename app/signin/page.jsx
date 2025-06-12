import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Play } from "lucide-react"
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                card: "bg-transparent shadow-none",
                headerTitle: "text-2xl font-bold",
                headerSubtitle: "text-muted-foreground",
              },
            }}
            redirectUrl="/"
          />
        </CardContent>
      </Card>
      {/* Footer */}
      <footer className="bg-card border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Entertainment Explorer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover the best in movies, books, and music all in one place.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link
                  href="/movies"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Movies
                </Link>
                <Link
                  href="/books"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Books
                </Link>
                <Link
                  href="/music"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Music
                </Link>
              </div>
            </div>

            {/* Account */}
            <div className="space-y-4">
              <h3 className="font-semibold">Account</h3>
              <div className="space-y-2">
                <Link
                  href="/signin"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/my-list"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  My List
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
                <Link
                  href="/contact"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 Entertainment Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
