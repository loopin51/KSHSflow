'use server';

import { db } from '@/lib/firebase';
import type { User } from '@/lib/mock-data';
import { collection, addDoc, Timestamp, doc, runTransaction } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

interface CreateQuestionInput {
  title: string;
  body: string;
  tags: string;
  author: User;
}

export async function createQuestion(input: CreateQuestionInput) {
  try {
    const tagsArray = input.tags.split(' ').filter(Boolean);

    await addDoc(collection(db, 'questions'), {
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

    revalidatePath('/');
  } catch (error) {
    console.error('Error creating question:', error);
    throw new Error('Failed to create question.');
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
                throw new Error("Question does not exist!");
            }

            // Add the new answer
            const answerData = {
                body: input.content,
                author: {
                    id: input.author.id,
                    name: input.author.name,
                    avatarUrl: input.author.avatarUrl
                },
                createdAt: Timestamp.now(),
                votes: 0,
                isAccepted: false
            };
            transaction.set(doc(answersColRef), answerData);

            // Update the answersCount on the question
            const newAnswersCount = (questionDoc.data().answersCount || 0) + 1;
            transaction.update(questionRef, { answersCount: newAnswersCount });
        });

        revalidatePath(`/questions/${input.questionId}`);
    } catch (error) {
        console.error('Error creating answer:', error);
        throw new Error('Failed to create answer.');
    }
}
