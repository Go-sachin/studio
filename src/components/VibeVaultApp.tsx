'use client';

import React, { useState, useMemo } from 'react';
import { AppSidebar } from './AppSidebar';
import { MusicLibraryView } from './MusicLibraryView';
import { PlaylistView } from './PlaylistView';
import { Player } from './Player';
import type { Playlist } from '@/types';
import { initialPlaylists, musicLibrary } from '@/data/mock-data';

type ActiveView = { type: 'library' } | { type: 'playlist'; id: string };

export default function VibeVaultApp() {
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'library' });
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);

  const addPlaylist = (name: string, songs: string[]) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      songs,
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    setActiveView({ type: 'playlist', id: newPlaylist.id });
  };
  
  const currentPlaylist = useMemo(() => {
    if (activeView.type === 'playlist') {
      return playlists.find(p => p.id === activeView.id);
    }
    return undefined;
  }, [activeView, playlists]);

  return (
    <div className="flex h-screen w-full bg-background font-body">
      <AppSidebar
        playlists={playlists}
        activeView={activeView}
        setActiveView={setActiveView}
        addPlaylist={addPlaylist}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">
          {activeView.type === 'library' && <MusicLibraryView />}
          {activeView.type === 'playlist' && currentPlaylist && (
            <PlaylistView playlist={currentPlaylist} allSongs={musicLibrary} />
          )}
        </div>
        <Player />
      </main>
    </div>
  );
}
