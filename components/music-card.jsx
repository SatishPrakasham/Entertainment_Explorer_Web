'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Plus, Clock, Music, Disc } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddToListButton } from "@/components/AddToListButton";

// Format seconds to MM:SS
function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TrackCard({ track, isHorizontal = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/music/track/${track.id}`}>
        <Card className={`${isHorizontal ? "flex-shrink-0 w-64" : ""} hover:shadow-lg transition-shadow group`}>
          <CardContent className="p-4">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <Image
                src={track.coverUrl || "/placeholder.svg"}
                alt={track.title}
                width={200}
                height={200}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary" className="rounded-full mr-2">
                  <Play className="h-4 w-4" />
                </Button>
                <AddToListButton 
                  item={track} 
                  category="songs" 
                  size="sm" 
                  className="rounded-full"
                />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{track.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{track.artist}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDuration(track.duration)}</span>
              </div>
              <AddToListButton 
                item={track} 
                category="songs" 
                variant="outline" 
                className="rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function AlbumCard({ album, isHorizontal = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/music/album/${album.id}`}>
        <Card className={`${isHorizontal ? "flex-shrink-0 w-64" : ""} hover:shadow-lg transition-shadow group`}>
          <CardContent className="p-4">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <Image
                src={album.coverUrl || "/placeholder.svg"}
                alt={album.title}
                width={200}
                height={200}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary" className="rounded-full mr-2">
                  <Play className="h-4 w-4" />
                </Button>
                <AddToListButton 
                  item={album} 
                  category="songs" 
                  size="sm" 
                  className="rounded-full"
                />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{album.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{album.artist}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-xs text-muted-foreground">
                <Disc className="h-3 w-3 mr-1" />
                <span>{album.trackCount} tracks</span>
              </div>
              <AddToListButton 
                item={album} 
                category="songs" 
                variant="outline" 
                className="rounded-full"
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
