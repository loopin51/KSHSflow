'use server';
/**
 * @fileOverview This file defines Genkit tools for interacting with user data.
 *
 * - getUsersTool: A tool that retrieves all users with their bios from Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAllUsers } from '@/actions/user';

const UserSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

export const getUsersTool = ai.defineTool(
  {
    name: 'getUsers',
    description: 'Get a list of all users and their biographies.',
    output: {
        schema: z.array(UserSchema)
    },
  },
  async () => {
    const users = await getAllUsers();
    return users.map(u => ({ name: u.name, bio: u.bio }));
  }
);
