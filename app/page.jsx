import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Play, BookOpen, Music } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const trendingMovies = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    description: "An epic space adventure that spans galaxies",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 2,
    title: "Midnight Detective",
    description: "A thrilling noir mystery in the city",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 3,
    title: "Digital Dreams",
    description: "A cyberpunk tale of virtual reality",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 4,
    title: "Ocean's Heart",
    description: "An underwater adventure of discovery",
    image: "/placeholder.svg?height=300&width=200",
  },
]

const trendingBooks = [
  {
    id: 1,
    title: "The Last Library",
    description: "A post-apocalyptic tale of knowledge preservation",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 2,
    title: "Quantum Hearts",
    description: "A sci-fi romance across parallel universes",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 3,
    title: "Mountain Whispers",
    description: "A mystical journey through ancient peaks",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 4,
    title: "City of Shadows",
    description: "Urban fantasy in a world of hidden magic",
    image: "/placeholder.svg?height=300&width=200",
  },
]

const trendingMusic = [
  {
    id: 1,
    title: "Neon Nights",
    description: "Synthwave album with retro-futuristic vibes",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 2,
    title: "Acoustic Soul",
    description: "Intimate acoustic performances",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 3,
    title: "Electric Dreams",
    description: "Electronic music for the digital age",
    image: "/placeholder.svg?height=300&width=200",
  },
  {
    id: 4,
    title: "Jazz Fusion",
    description: "Modern jazz with contemporary elements",
    image: "/placeholder.svg?height=300&width=200",
  },
]

function TrendingSection({ title, items, icon: Icon, href }) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <Link href={href}>
          <Button variant="outline" className="rounded-full">
            View All
          </Button>
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <Card key={item.id} className="flex-shrink-0 w-64 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={200}
                height={300}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Entertainment Explorer
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the best in movies, books, and music
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search by title, genre, or artist..."
              className="pl-12 py-6 text-lg rounded-full border-2 focus:border-primary"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8">Search</Button>
          </div>
        </div>
      </section>

      {/* Trending Sections */}
      <div className="max-w-7xl mx-auto px-4">
        <TrendingSection title="Trending Movies" items={trendingMovies} icon={Play} href="/movies" />
        <TrendingSection title="Trending Books" items={trendingBooks} icon={BookOpen} href="/books" />
        <TrendingSection title="Trending Music" items={trendingMusic} icon={Music} href="/music" />
      </div>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
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
