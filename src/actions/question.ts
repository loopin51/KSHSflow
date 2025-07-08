'use server';

import { db } from '@/lib/firebase';
import type { User } from '@/lib/mock-data';
import { collection, addDoc, Timestamp, doc, runTransaction } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { getUsersByNames } from './user';
import { createNotification } from './notification';

interface CreateQuestionInput {
  title: string;
  body: string;
  tags: string;
  author: User;
  mentionedUsernames: string[];
}

export async function createQuestion(input: CreateQuestionInput) {
  try {
    const tagsArray = input.tags.split(' ').filter(Boolean);

    const questionRef = await addDoc(collection(db, 'questions'), {
      title: input.title,
      body: input.body,
      tags: tagsArray,
      author: {
        id: input.author.id,
        name: input.author.name,
        avatarUrl: input.author.avatarUrl,
      },
      createdAt: Timestamp.now(),
      votes: 0,
      answersCount: 0,
      views: 0,
    });
    
    if (input.mentionedUsernames.length > 0) {
        const mentionedUsers = await getUsersByNames(input.mentionedUsernames);
        for (const mentionedUser of mentionedUsers) {
            if (mentionedUser.id !== input.author.id) {
                const message = `${input.author.name}님이 질문에서 당신을 언급했습니다.`;
                const link = `/questions/${questionRef.id}`;
                await createNotification(mentionedUser.id, message, link);
            }
        }
    }


    revalidatePath('/');
    revalidatePath('/profile');
    return { questionId: questionRef.id };
  } catch (error) {
    console.error('Error creating question:', error);
    throw new Error('질문을 생성하지 못했습니다.');
  }
}


interface CreateAnswerInput {
    content: string;
    questionId: string;
    author: User;
}

export async function createAnswer(input: CreateAnswerInput) {
    try {
        const questionRef = doc(db, 'questions', input.questionId);
        const answersColRef = collection(questionRef, 'answers');

        await runTransaction(db, async (transaction) => {
            const questionDoc = await transaction.get(questionRef);
            if (!questionDoc.exists()) {
                throw new Error("질문이 존재하지 않습니다!");
            }
            
            const questionData = questionDoc.data();

            const answerData = {
                body: input.content,
                author: {
                    id: input.author.id,
                    name: input.author.name,
                    avatarUrl: input.author.avatarUrl
                },
                questionId: input.questionId,
                questionTitle: questionData.title,
                createdAt: Timestamp.now(),
                votes: 0,
                isAccepted: false
            };
            transaction.set(doc(answersColRef), answerData);

            const newAnswersCount = (questionData.answersCount || 0) + 1;
            transaction.update(questionRef, { answersCount: newAnswersCount });
        });

        revalidatePath(`/questions/${input.questionId}`);
        revalidatePath('/profile');
    } catch (error) {
        console.error('Error creating answer:', error);
        throw new Error('답변을 생성하지 못했습니다.');
    }
}
