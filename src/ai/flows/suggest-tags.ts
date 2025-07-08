'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for a question based on its content.
 *
 * The flow uses a language model to analyze the question and suggest tags that can help categorize it effectively.
 * The file exports the SuggestTagsInput and SuggestTagsOutput types, along with the suggestTags function to call the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  question: z.string().describe('The question content to suggest tags for.'),
});

export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the question.'),
});

export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `Suggest relevant tags for the following question.  Return a list of tags that can help categorize it effectively:

Question: {{{question}}}

Tags:`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
