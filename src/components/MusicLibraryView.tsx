'use client';

import React from 'react';
import Image from 'next/image';
import { usePlayer } from '@/hooks/usePlayer';
import { musicLibrary } from '@/data/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export function MusicLibraryView() {
  const { playSong, currentSong, isPlaying } = usePlayer();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tighter">Music Library</h1>
        <p className="text-muted-foreground">All the music in your collection.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {musicLibrary.map((song) => (
            <TableRow 
              key={song.id} 
              className="group cursor-pointer"
              onClick={() => playSong(song, musicLibrary)}
            >
              <TableCell>
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={song.coverArt}
                    alt={song.album}
                    width={48}
                    height={48}
                    className="object-cover"
                    data-ai-hint="album cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell className="text-right">{formatDuration(song.duration)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
