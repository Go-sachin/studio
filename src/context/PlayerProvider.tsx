'use client';

import type { Song, Playlist } from '@/types';
import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { musicLibrary } from '@/data/mock-data';

type RepeatMode = 'none' | 'one' | 'all';

interface PlayerContextType {
  isPlaying: boolean;
  currentSong: Song | null;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  isCrossfadeActive: boolean;
  queue: Song[];
  playSong: (song: Song, playlist?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleCrossfade: () => void;
  addToQueue: (song: Song) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const CROSSFADE_DURATION = 5; // seconds

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.75);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');
  const [isCrossfadeActive, setIsCrossfadeActive] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const crossfadeAudioRef = useRef<HTMLAudioElement>(null);
  const isCrossfading = useRef(false);

  const playSong = (song: Song, songList: Song[] = musicLibrary) => {
    setCurrentSong(song);
    const newQueue = songList.slice(songList.findIndex(s => s.id === song.id));
    setQueue(newQueue);
    setOriginalQueue(newQueue);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentSong) {
        if (queue.length > 0) {
            setCurrentSong(queue[0]);
            setIsPlaying(true);
        }
        return;
    }
    setIsPlaying(!isPlaying);
  };
  
  const playNext = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    let nextIndex;

    if (repeatMode === 'one' && isPlaying) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }

    if (currentIndex === queue.length - 1) { // Last song
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    } else {
      nextIndex = currentIndex + 1;
    }
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  }, [currentSong, queue, repeatMode, isPlaying]);

  const playPrev = () => {
    if (!currentSong || !audioRef.current) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1]);
      setIsPlaying(true);
    }
  };
  
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
    if (crossfadeAudioRef.current) crossfadeAudioRef.current.volume = newVolume;
  };
  
  const toggleShuffle = () => {
    const newShuffleState = !isShuffled;
    setIsShuffled(newShuffleState);
    if (newShuffleState) {
        setOriginalQueue(queue);
        const current = queue.find(s => s.id === currentSong?.id);
        const rest = queue.filter(s => s.id !== currentSong?.id);
        const shuffled = [...rest].sort(() => Math.random() - 0.5);
        setQueue(current ? [current, ...shuffled] : shuffled);
    } else {
        setQueue(originalQueue);
    }
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none');
  };

  const toggleCrossfade = () => setIsCrossfadeActive(!isCrossfadeActive);
  const addToQueue = (song: Song) => setQueue(q => [...q, song]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && currentSong) {
      audio.src = currentSong.audioSrc;
      audio.volume = volume;
      audio.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const crossfadeAudio = crossfadeAudioRef.current;
    if (!audio || !crossfadeAudio || !currentSong) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const timeLeft = audio.duration - audio.currentTime;

      if (isCrossfadeActive && timeLeft < CROSSFADE_DURATION && !isCrossfading.current) {
        const currentIndex = queue.findIndex(s => s.id === currentSong.id);
        if (currentIndex < queue.length - 1 || repeatMode === 'all') {
            isCrossfading.current = true;

            const nextIndex = (currentIndex === queue.length - 1) ? 0 : currentIndex + 1;
            const nextSong = queue[nextIndex];
            
            crossfadeAudio.src = nextSong.audioSrc;
            crossfadeAudio.volume = 0;
            crossfadeAudio.play().catch(e => console.error("Error playing crossfade audio:", e));

            // Fade out current song
            let fadeOutInterval = setInterval(() => {
                const newVolume = audio.volume - (volume / (CROSSFADE_DURATION * 10));
                if (newVolume > 0) audio.volume = newVolume;
            }, 100);

            // Fade in next song
            let fadeInInterval = setInterval(() => {
                const newVolume = crossfadeAudio.volume + (volume / (CROSSFADE_DURATION * 10));
                if (newVolume < volume) {
                    crossfadeAudio.volume = newVolume;
                } else {
                    crossfadeAudio.volume = volume;
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(fadeOutInterval);
                clearInterval(fadeInInterval);
                playNext();
                audio.volume = volume;
                isCrossfading.current = false;
            }, CROSSFADE_DURATION * 1000);
        }
      }
    };
    
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
        if (!isCrossfading.current) playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isCrossfadeActive, playNext, queue, repeatMode, volume]);

  return (
    <PlayerContext.Provider value={{
      isPlaying,
      currentSong,
      currentTime,
      duration,
      volume,
      isShuffled,
      repeatMode,
      isCrossfadeActive,
      queue,
      playSong,
      togglePlay,
      playNext,
      playPrev,
      seek,
      setVolume: handleSetVolume,
      toggleShuffle,
      toggleRepeat,
      toggleCrossfade,
      addToQueue,
    }}>
      {children}
      <audio ref={audioRef} />
      <audio ref={crossfadeAudioRef} />
    </PlayerContext.Provider>
  );
};
