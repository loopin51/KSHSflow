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
  question: z.string().describe('The question title and body to suggest tags for.'),
});

export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of 1-5 suggested tags for the question. Tags should be lowercase and single words.'),
});

export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `다음 질문에 대해 1~5개의 관련 태그를 제안해주세요. 태그는 소문자 단일 단어여야 합니다.

질문: {{{question}}}

태그:`,
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
