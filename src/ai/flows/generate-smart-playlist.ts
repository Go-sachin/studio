'use server';

/**
 * @fileOverview AI agent that generates a smart playlist based on a text description.
 *
 * - generateSmartPlaylist - A function that generates a smart playlist.
 * - GenerateSmartPlaylistInput - The input type for the generateSmartPlaylist function.
 * - GenerateSmartPlaylistOutput - The return type for the generateSmartPlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartPlaylistInputSchema = z.object({
  description: z.string().describe('A text description of the desired playlist (e.g., "songs for studying").'),
});
export type GenerateSmartPlaylistInput = z.infer<typeof GenerateSmartPlaylistInputSchema>;

const GenerateSmartPlaylistOutputSchema = z.object({
  playlist: z.array(z.string()).describe('A list of song titles that fit the description.'),
});
export type GenerateSmartPlaylistOutput = z.infer<typeof GenerateSmartPlaylistOutputSchema>;

export async function generateSmartPlaylist(input: GenerateSmartPlaylistInput): Promise<GenerateSmartPlaylistOutput> {
  return generateSmartPlaylistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartPlaylistPrompt',
  input: {schema: GenerateSmartPlaylistInputSchema},
  output: {schema: GenerateSmartPlaylistOutputSchema},
  prompt: `You are a playlist generation expert. Given a description of a playlist, you will generate a list of songs that fit the description.

Description: {{{description}}}

Respond with a JSON array of song titles.  Do not include any other text in your response.`,
});

const generateSmartPlaylistFlow = ai.defineFlow(
  {
    name: 'generateSmartPlaylistFlow',
    inputSchema: GenerateSmartPlaylistInputSchema,
    outputSchema: GenerateSmartPlaylistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
