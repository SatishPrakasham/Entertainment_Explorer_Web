import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

// Reusable section skeleton component
function MusicSectionSkeleton({ title = true }) {
  return (
    <div>
      {title && <Skeleton className="h-8 w-48 mb-6" />}
      
      {/* Horizontal scrolling cards */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="flex-shrink-0 w-64">
            <CardContent className="p-4">
              <Skeleton className="w-full h-48 rounded-lg mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Reusable playlist skeleton component
function PlaylistSectionSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i}>
            <Skeleton className="w-full h-48" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="container mx-auto py-8 space-y-10">
      {/* Search and filter skeleton */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Skeleton className="h-10 w-full md:w-96" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Trending Tracks Section */}
      <MusicSectionSkeleton />

      {/* Popular Albums Section */}
      <MusicSectionSkeleton />
      
      {/* New Releases Section */}
      <MusicSectionSkeleton />
      
      {/* Genre Sections */}
      <MusicSectionSkeleton />
      <MusicSectionSkeleton />
      <MusicSectionSkeleton />
      
      {/* Playlists Section */}
      <PlaylistSectionSkeleton />
    </div>
  )
}
