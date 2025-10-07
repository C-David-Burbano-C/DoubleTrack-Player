'use server';

/**
 * @fileOverview AI-powered playlist curation flow.
 *
 * This file defines a Genkit flow that generates a playlist of songs based on a given mood or genre.
 * It includes the flow definition, input/output schemas, and an exported function to trigger the playlist generation.
 *
 * @exports generatePlaylist - A function that generates a playlist based on the specified mood or genre.
 * @exports PlaylistInput - The input type for the generatePlaylist function.
 * @exports PlaylistOutput - The output type for the generatePlaylist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the playlist generation flow
const PlaylistInputSchema = z.object({
  moodOrGenre: z
    .string()
    .describe('The desired mood or genre for the playlist (e.g., happy, sad, rock, pop).'),
  songList: z.array(z.string()).describe('List of available songs to select from'),
  playlistLength: z.number().default(5).describe('The amount of songs in the playlist')
});
export type PlaylistInput = z.infer<typeof PlaylistInputSchema>;

// Define the output schema for the playlist generation flow
const PlaylistOutputSchema = z.object({
  playlist: z
    .array(z.string())
    .describe('A list of songs that match the specified mood or genre.'),
});
export type PlaylistOutput = z.infer<typeof PlaylistOutputSchema>;

// Exported function to generate a playlist
export async function generatePlaylist(input: PlaylistInput): Promise<PlaylistOutput> {
  return playlistFlow(input);
}

// Define the prompt for the playlist generation
const playlistPrompt = ai.definePrompt({
  name: 'playlistPrompt',
  input: {schema: PlaylistInputSchema},
  output: {schema: PlaylistOutputSchema},
  prompt: `You are a playlist curator. Given a list of songs and a desired mood or genre, create a playlist that matches the mood or genre.

  Songs:
  {{#each songList}}
  - {{this}}
  {{/each}}

  Mood/Genre: {{moodOrGenre}}

  Create a playlist of {{playlistLength}} songs that matches the mood or genre. Only use songs from the song list.  Return just the array of song names, do not include any other preamble or text.`,
});

// Define the Genkit flow for playlist generation
const playlistFlow = ai.defineFlow(
  {
    name: 'playlistFlow',
    inputSchema: PlaylistInputSchema,
    outputSchema: PlaylistOutputSchema,
  },
  async input => {
    const {output} = await playlistPrompt(input);
    return output!;
  }
);
