'use server';

import { generateSmartPlaylist } from '@/ai/flows/generate-smart-playlist';
import { musicLibrary } from '@/data/mock-data';
import type { Song } from '@/types';

export async function createSmartPlaylistAction(
  description: string
): Promise<{ songs: Song[], playlistName: string }> {
  try {
    const { playlist: songTitles } = await generateSmartPlaylist({ description });

    if (!songTitles || songTitles.length === 0) {
      return { songs: [], playlistName: description };
    }

    const matchedSongs: Song[] = [];
    const librarySongs = [...musicLibrary];

    for (const title of songTitles) {
      const foundSong = librarySongs.find(
        (song) =>
          song.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(song.title.toLowerCase())
      );
      if (foundSong && !matchedSongs.some((s) => s.id === foundSong.id)) {
        matchedSongs.push(foundSong);
      }
    }
    
    const playlistName = description.length > 30 ? `${description.substring(0, 27)}...` : description;

    return { songs: matchedSongs, playlistName };
  } catch (error) {
    console.error('Error generating smart playlist:', error);
    return { songs: [], playlistName: 'Untitled Playlist' };
  }
}
