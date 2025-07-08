// src/ai/flows/automatic-mentions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically detecting user mentions in a question and extracting the mentioned usernames.
 *
 * The flow uses a language model to identify usernames within the question text and returns a list of these usernames.
 * The file exports the AutomaticMentionsInput and AutomaticMentionsOutput types, along with the automaticMentions function to call the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticMentionsInputSchema = z.object({
  question: z.string().describe('The question content to analyze for user mentions.'),
});

export type AutomaticMentionsInput = z.infer<typeof AutomaticMentionsInputSchema>;

const AutomaticMentionsOutputSchema = z.object({
  mentionedUsernames: z.array(z.string()).describe('An array of usernames mentioned in the question.'),
});

export type AutomaticMentionsOutput = z.infer<typeof AutomaticMentionsOutputSchema>;

export async function automaticMentions(input: AutomaticMentionsInput): Promise<AutomaticMentionsOutput> {
  return automaticMentionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automaticMentionsPrompt',
  input: {schema: AutomaticMentionsInputSchema},
  output: {schema: AutomaticMentionsOutputSchema},
  prompt: `Analyze the following question and extract all mentioned usernames.  Return a list of usernames mentioned in the question. If no users are mentioned, return an empty list:\n\nQuestion: {{{question}}}\n\nUsernames:`,
});

const automaticMentionsFlow = ai.defineFlow(
  {
    name: 'automaticMentionsFlow',
    inputSchema: AutomaticMentionsInputSchema,
    outputSchema: AutomaticMentionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
