'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Library, ListMusic, Sparkles, Music4 } from 'lucide-react';
import type { Playlist } from '@/types';
import { SmartPlaylistDialog } from './SmartPlaylistDialog';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  playlists: Playlist[];
  activeView: { type: 'library' } | { type: 'playlist'; id: string };
  setActiveView: (view: { type: 'library' } | { type: 'playlist'; id: string }) => void;
  addPlaylist: (name: string, songIds: string[]) => void;
}

export function AppSidebar({ playlists, activeView, setActiveView, addPlaylist }: AppSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-primary/10 border-r border-primary/20">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Music4 className="w-8 h-8 text-primary-foreground" />
          <h1 className="text-2xl font-bold text-primary-foreground tracking-tighter">
            VibeVault
          </h1>
        </div>
      </div>
      <Separator className="bg-primary/20" />
      <div className="p-2">
        <SmartPlaylistDialog addPlaylist={addPlaylist}>
            <Button variant="ghost" className="w-full justify-start gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/20">
              <Sparkles className="w-5 h-5 text-accent" />
              Smart Playlist
            </Button>
        </SmartPlaylistDialog>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/20",
              activeView.type === 'library' && 'bg-primary/20 text-primary-foreground font-semibold'
            )}
            onClick={() => setActiveView({ type: 'library' })}
          >
            <Library className="w-5 h-5" />
            Library
          </Button>
          <div className="px-2 pt-4 pb-2 text-xs font-semibold uppercase text-primary-foreground/50 tracking-wider">
            Playlists
          </div>
          {playlists.map((playlist) => (
            <Button
              key={playlist.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/20 truncate",
                activeView.type === 'playlist' && activeView.id === playlist.id && 'bg-primary/20 text-primary-foreground font-semibold'
              )}
              onClick={() => setActiveView({ type: 'playlist', id: playlist.id })}
              title={playlist.name}
            >
              <ListMusic className="w-5 h-5" />
              <span className="truncate">{playlist.name}</span>
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
