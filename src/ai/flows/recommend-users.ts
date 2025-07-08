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
  prompt: `당신은 사람들을 연결하는 전문가입니다. 당신의 임무는 사용자의 전문 지식이 담긴 자기소개를 기반으로 질문에 언급할 관련 사용자를 추천하는 것입니다.

사용자의 질문을 분석하고 getUsers 도구를 사용하여 사용 가능한 모든 사용자와 그들의 자기소개 목록을 가져오세요.

질문의 내용과 사용자의 자기소개를 바탕으로 질문에 가장 적합한 사용자를 최대 3명까지 식별하여 사용자 이름을 반환하세요.

관련 사용자가 없는 경우 빈 목록을 반환하세요.

질문: {{{question}}}
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
