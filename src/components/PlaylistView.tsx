'use client';

import React from 'react';
import Image from 'next/image';
import { usePlayer } from '@/hooks/usePlayer';
import type { Playlist, Song } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from './ui/button';
import { Play } from 'lucide-react';

interface PlaylistViewProps {
  playlist: Playlist;
  allSongs: Song[];
}

export function PlaylistView({ playlist, allSongs }: PlaylistViewProps) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const playlistSongs = allSongs.filter(song => playlist.songs.includes(song.id));

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const coverArt = playlistSongs.length > 0 ? playlistSongs[0].coverArt : 'https://placehold.co/150x150/F0EDFF/333333.png';

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-6">
        <div className="relative w-40 h-40 rounded-lg overflow-hidden shadow-xl">
            <Image 
                src={coverArt} 
                alt={playlist.name}
                width={160}
                height={160}
                className="object-cover"
                data-ai-hint="album cover"
            />
        </div>
        <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Playlist</h2>
            <h1 className="text-6xl font-bold tracking-tighter">{playlist.name}</h1>
            <p className="text-muted-foreground mt-2">{playlistSongs.length} songs</p>
        </div>
      </div>
       <Button onClick={() => playSong(playlistSongs[0], playlistSongs)} size="lg" className="rounded-full">
        <Play className="mr-2 h-5 w-5 fill-current" /> Play
      </Button>

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
          {playlistSongs.map((song) => (
            <TableRow 
              key={song.id} 
              className="group cursor-pointer"
              onClick={() => playSong(song, playlistSongs)}
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
