// src/ai/flows/toggle-ai-summary.ts
'use server';

/**
 * @fileOverview Defines a Genkit flow for toggling the AI summary feature on or off.
 *
 * - toggleAISummary - A function to enable or disable AI summarization of audio content.
 * - ToggleAISummaryInput - The input type, a boolean representing the desired state.
 * - ToggleAISummaryOutput - The output type, a boolean confirming the new state.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ToggleAISummaryInputSchema = z
  .boolean()
  .describe('A boolean to turn AI summarization on (true) or off (false).');
export type ToggleAISummaryInput = z.infer<typeof ToggleAISummaryInputSchema>;

const ToggleAISummaryOutputSchema = z
  .boolean()
  .describe('A boolean confirming the new state of AI summarization.');
export type ToggleAISummaryOutput = z.infer<typeof ToggleAISummaryOutputSchema>;

export async function toggleAISummary(input: ToggleAISummaryInput): Promise<ToggleAISummaryOutput> {
  return toggleAISummaryFlow(input);
}

const toggleAISummaryFlow = ai.defineFlow(
  {
    name: 'toggleAISummaryFlow',
    inputSchema: ToggleAISummaryInputSchema,
    outputSchema: ToggleAISummaryOutputSchema,
  },
  async input => {
    // Simply return the input value to confirm the toggle.
    return input;
  }
);
