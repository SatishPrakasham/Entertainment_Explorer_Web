"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Music, Disc, Radio, ChevronLeft, ChevronRight } from "lucide-react"
import { 
  TrendingTracks, 
  PopularAlbums, 
  MusicSearchResults,
  NewReleases,
  GenreTracks,
  PopularPlaylists 
} from "@/components/music-list-enhanced"
import { GenreSelector } from "@/components/genre-selector"
import { FeaturedArtists } from "@/components/featured-artists"

export default function MusicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get search parameters from URL
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'track';
  const pageParam = parseInt(searchParams.get('page') || '1');
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchType, setSearchType] = useState(typeParam);
  const [selectedGenre, setSelectedGenre] = useState({ id: 132, name: 'Pop' });
  const [secondGenre, setSecondGenre] = useState({ id: 152, name: 'Rock' });
  const [thirdGenre, setThirdGenre] = useState({ id: 116, name: 'Hip-Hop' });
  const [isSearching, setIsSearching] = useState(!!queryParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    params.set('type', searchType);
    params.set('page', '1');
    router.push(`/music?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/music?${params.toString()}`);
  };
  
  const handleGenreSelect = (genreId, genreName) => {
    setSelectedGenre({ id: genreId, name: genreName });
  };
  
  // Update state when URL parameters change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'track';
    const page = parseInt(searchParams.get('page') || '1');
    
    setSearchQuery(q);
    setSearchType(type);
    setCurrentPage(page);
    setIsSearching(!!q);
  }, [searchParams]);
  
  // Handle key press for search input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Explore Music</h1>

        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search for music..." 
              className="pl-12 py-3 rounded-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full md:w-48 rounded-full">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="track">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span>Tracks</span>
                </div>
              </SelectItem>
              <SelectItem value="album">
                <div className="flex items-center gap-2">
                  <Disc className="h-4 w-4" />
                  <span>Albums</span>
                </div>
              </SelectItem>
              <SelectItem value="artist">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  <span>Artists</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button 
            type="submit"
            className="rounded-full px-8" 
          >
            Search
          </Button>
        </form>
      </div>

      {/* Search Results */}
      {isSearching && queryParam ? (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Search Results for "{queryParam}"</h2>
          <MusicSearchResults 
            query={queryParam} 
            type={searchType} 
            page={currentPage} 
          />
          
          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              Page {currentPage}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      ) : (
        <>
          {/* Trending Tracks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Trending Tracks</h2>
            <TrendingTracks limit={15} />
          </section>

          {/* Popular Albums */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Albums</h2>
            <PopularAlbums limit={15} />
          </section>

          {/* New Releases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">New Releases</h2>
            <NewReleases limit={15} />
          </section>

          {/* Genre Selector */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Explore by Genre</h2>
            <GenreSelector 
              onSelectGenre={handleGenreSelect} 
              selectedGenreId={selectedGenre.id} 
            />
          </section>

          {/* Dynamic Genre Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{selectedGenre.name} Tracks</h2>
            <GenreTracks 
              genreId={selectedGenre.id} 
              genreName={selectedGenre.name} 
              limit={15} 
            />
          </section>

          {/* Additional Genre Sections */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Rock Classics</h2>
            <GenreTracks genreId={152} genreName="Rock" limit={15} />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Hip-Hop & Rap</h2>
            <GenreTracks genreId={116} genreName="Hip-Hop" limit={15} />
          </section>

          {/* Featured Artists */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Artists</h2>
            <FeaturedArtists limit={6} />
          </section>
          
          {/* Popular Playlists */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Playlists</h2>
            <PopularPlaylists limit={6} />
          </section>
        </>
      )}
    </div>
  );
}

