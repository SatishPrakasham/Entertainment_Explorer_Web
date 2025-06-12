import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const trendingMovies = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    description: "An epic space adventure that spans galaxies",
    image: "/placeholder.svg?height=300&width=200",
    year: "2024",
    genre: "Sci-Fi",
  },
  {
    id: 2,
    title: "Midnight Detective",
    description: "A thrilling noir mystery in the city",
    image: "/placeholder.svg?height=300&width=200",
    year: "2024",
    genre: "Mystery",
  },
  {
    id: 3,
    title: "Digital Dreams",
    description: "A cyberpunk tale of virtual reality",
    image: "/placeholder.svg?height=300&width=200",
    year: "2023",
    genre: "Sci-Fi",
  },
  {
    id: 4,
    title: "Ocean's Heart",
    description: "An underwater adventure of discovery",
    image: "/placeholder.svg?height=300&width=200",
    year: "2024",
    genre: "Adventure",
  },
]

const movieResults = [
  {
    id: 5,
    title: "Shadow Realm",
    description: "A dark fantasy epic with stunning visuals",
    image: "/placeholder.svg?height=300&width=200",
    year: "2023",
    genre: "Fantasy",
  },
  {
    id: 6,
    title: "Time Paradox",
    description: "A mind-bending thriller about time travel",
    image: "/placeholder.svg?height=300&width=200",
    year: "2024",
    genre: "Thriller",
  },
  {
    id: 7,
    title: "Robot Revolution",
    description: "AI uprising in a dystopian future",
    image: "/placeholder.svg?height=300&width=200",
    year: "2023",
    genre: "Action",
  },
  {
    id: 8,
    title: "Love in Paris",
    description: "A romantic comedy set in the city of love",
    image: "/placeholder.svg?height=300&width=200",
    year: "2024",
    genre: "Romance",
  },
  {
    id: 9,
    title: "Desert Storm",
    description: "A survival story in harsh conditions",
    image: "/placeholder.svg?height=300&width=200",
    year: "2023",
    genre: "Drama",
  },
  {
    id: 10,
    title: "Space Pirates",
    description: "Swashbuckling adventure among the stars",
    image: "/placeholder.svg?height=300&width=200",
    year: "2024",
    genre: "Adventure",
  },
]

function MovieCard({ movie, isHorizontal = false }) {
  return (
    <Card className={`${isHorizontal ? "flex-shrink-0 w-64" : ""} hover:shadow-lg transition-shadow group`}>
      <CardContent className="p-4">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <Image
            src={movie.image || "/placeholder.svg"}
            alt={movie.title}
            width={200}
            height={300}
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Add to List
            </Button>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{movie.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {movie.year} • {movie.genre}
          </span>
          <Button size="sm" variant="outline" className="rounded-full">
            <Plus className="h-4 w-4 mr-1" />
            Add to My List
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Explore Movies</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input placeholder="Search movie titles..." className="pl-12 py-3 rounded-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48 rounded-full">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="comedy">Comedy</SelectItem>
                <SelectItem value="drama">Drama</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
                <SelectItem value="horror">Horror</SelectItem>
                <SelectItem value="mystery">Mystery</SelectItem>
                <SelectItem value="romance">Romance</SelectItem>
                <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                <SelectItem value="thriller">Thriller</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48 rounded-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trending Movies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trending Movies</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isHorizontal={true} />
            ))}
          </div>
        </section>

        {/* Movie Results */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Movie Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movieResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
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
