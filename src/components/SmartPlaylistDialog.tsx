'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createSmartPlaylistAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Song } from '@/types';

interface SmartPlaylistDialogProps {
  children: React.ReactNode;
  addPlaylist: (name: string, songIds: string[]) => void;
}

export function SmartPlaylistDialog({ children, addPlaylist }: SmartPlaylistDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast({
        title: 'Description needed',
        description: 'Please describe the playlist you want to create.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const { songs, playlistName } = await createSmartPlaylistAction(description);
      if (songs.length > 0) {
        addPlaylist(playlistName, songs.map(s => s.id));
        toast({
          title: 'Playlist created!',
          description: `"${playlistName}" has been added to your playlists.`,
        });
        setIsOpen(false);
        setDescription('');
      } else {
        toast({
          title: 'No songs found',
          description: 'We couldn\'t find any songs matching your description. Try being more specific!',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Smart Playlist</DialogTitle>
            <DialogDescription>
              Describe the vibe, genre, or mood. Our AI will craft the perfect playlist for you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">For example: "upbeat indie pop for a road trip"</Label>
              <Textarea
                placeholder="Describe your playlist here..."
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Playlist
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
