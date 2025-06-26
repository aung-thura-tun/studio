// Summarize audio flow
'use server';

/**
 * @fileOverview Summarizes the content of an audio file at logical pausing points.
 * This file includes function to generate summaries and manage the summarization of audio content.
 *
 * - summarizeAudioContent - A function that handles the summarization of audio content.
 * - SummarizeAudioContentInput - The input type for the summarizeAudioContent function.
 * - SummarizeAudioContentOutput - The return type for the summarizeAudioContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAudioContentInputSchema = z.object({
  audioTranscript: z
    .string()
    .describe('The transcript of the audio content to be summarized.'),
  currentSummary: z
    .string()
    .optional()
    .describe('The current summary of the audio content.'),
});
export type SummarizeAudioContentInput = z.infer<typeof SummarizeAudioContentInputSchema>;

const SummarizeAudioContentOutputSchema = z.object({
  summary: z.string().describe('The summary of the audio content.'),
});
export type SummarizeAudioContentOutput = z.infer<typeof SummarizeAudioContentOutputSchema>;

export async function summarizeAudioContent(input: SummarizeAudioContentInput): Promise<SummarizeAudioContentOutput> {
  return summarizeAudioContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAudioContentPrompt',
  input: {schema: SummarizeAudioContentInputSchema},
  output: {schema: SummarizeAudioContentOutputSchema},
  prompt: `You are an expert summarizer, able to distill complex information into concise summaries.

  Summarize the following audio transcript, building upon the current summary if one exists. Focus on identifying the key topics and arguments presented.

  Transcript: {{{audioTranscript}}}

  {{#if currentSummary}}
  Current Summary: {{{currentSummary}}}
  \nContinue the summary:
  {{/if}}
  Summary: `,
});

const summarizeAudioContentFlow = ai.defineFlow(
  {
    name: 'summarizeAudioContentFlow',
    inputSchema: SummarizeAudioContentInputSchema,
    outputSchema: SummarizeAudioContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
