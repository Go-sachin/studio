'use client';

import React from 'react';
import Image from 'next/image';
import { usePlayer } from '@/hooks/usePlayer';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  X,
  ListMusic,
} from 'lucide-react';
import { PlayPauseIcon } from './icons/PlayPauseIcon';
import { cn } from '@/lib/utils';

export function Player() {
  const {
    isPlaying,
    currentSong,
    currentTime,
    duration,
    volume,
    isShuffled,
    repeatMode,
    isCrossfadeActive,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleCrossfade,
  } = usePlayer();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;
  
  if (!currentSong) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-28">
          <div className="w-1/4 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden shadow-lg">
              <Image
                src={currentSong.coverArt}
                alt={currentSong.album}
                width={64}
                height={64}
                className="object-cover"
                data-ai-hint="album cover"
              />
            </div>
            <div>
              <p className="font-bold text-foreground truncate">{currentSong.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </div>

          <div className="w-1/2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn(isShuffled && 'text-accent')}>
                <Shuffle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={playPrev}>
                <SkipBack className="w-6 h-6" />
              </Button>
              <Button variant="default" size="icon" className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg" onClick={togglePlay}>
                <PlayPauseIcon isPlaying={isPlaying} className="w-6 h-6 text-primary-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext}>
                <SkipForward className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleRepeat} className={cn(repeatMode !== 'none' && 'text-accent')}>
                <RepeatIcon className="w-5 h-5" />
              </Button>
            </div>
            <div className="w-full max-w-xl flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={(value) => seek(value[0])}
                className="w-full"
              />
              <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="w-1/4 flex items-center justify-end gap-4">
             <div className="flex items-center space-x-2">
                <Label htmlFor="crossfade-switch" className="text-sm text-muted-foreground">Crossfade</Label>
                <Switch id="crossfade-switch" checked={isCrossfadeActive} onCheckedChange={toggleCrossfade} />
            </div>
            <div className="flex items-center gap-2 w-32">
              <VolumeIcon className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
