export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArt: string;
  audioSrc: string; // URL to the audio file
}

export interface Playlist {
  id: string;
  name: string;
  songs: string[]; // array of song ids
  coverArt?: string;
}
