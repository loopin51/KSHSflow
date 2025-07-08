import { config } from 'dotenv';
config();

import '@/ai/flows/automatic-mentions.ts';
import '@/ai/flows/suggest-tags.ts';
import '@/ai/flows/recommend-users.ts';
import '@/ai/tools/user-tools.ts';
