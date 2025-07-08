'use server';
/**
 * @fileOverview A Genkit flow for recommending users to mention based on a question's content.
 *
 * - recommendUsers - A function that handles the user recommendation process.
 * - RecommendUsersInput - The input type for the recommendUsers function.
 * - RecommendUsersOutput - The return type for the recommendUsers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getUsersTool } from '@/ai/tools/user-tools';

const RecommendUsersInputSchema = z.object({
  question: z.string().describe('The question content to analyze for user recommendations.'),
});
export type RecommendUsersInput = z.infer<typeof RecommendUsersInputSchema>;

const RecommendUsersOutputSchema = z.object({
  recommendedUsernames: z.array(z.string()).describe('An array of usernames recommended to be mentioned.'),
});
export type RecommendUsersOutput = z.infer<typeof RecommendUsersOutputSchema>;

export async function recommendUsers(input: RecommendUsersInput): Promise<RecommendUsersOutput> {
  return recommendUsersFlow(input);
}

const recommendUsersPrompt = ai.definePrompt({
  name: 'recommendUsersPrompt',
  input: { schema: RecommendUsersInputSchema },
  output: { schema: RecommendUsersOutputSchema },
  tools: [getUsersTool],
  prompt: `You are an expert at connecting people. Your task is to recommend relevant users to mention in a question based on their expertise, which is described in their bio.

Analyze the user's question and use the getUsers tool to fetch a list of all available users and their bios.

Based on the question's content and the users' bios, identify up to 3 users who would be most suitable to answer the question. Return their usernames.

If no users seem relevant, return an empty list.

Question: {{{question}}}
`,
});


const recommendUsersFlow = ai.defineFlow(
  {
    name: 'recommendUsersFlow',
    inputSchema: RecommendUsersInputSchema,
    outputSchema: RecommendUsersOutputSchema,
  },
  async input => {
    const { output } = await recommendUsersPrompt(input);
    return output!;
  }
);
