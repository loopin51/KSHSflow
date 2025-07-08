import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, Timestamp, where, collectionGroup } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
};

export type Notification = {
    id: string;
    userId: string;
    message: string;
    link: string;
    read: boolean;
    createdAt: string;
}

export type Tag = 'daily life' | 'science' | 'technology' | 'study' | 'career' | 'other';

export type Answer = {
  id: string;
  body: string;
  author: User;
  votes: number;
  createdAt: string;
  isAccepted: boolean;
  questionId: string;
  questionTitle: string;
};

export type Question = {
  id: string;
  title: string;
  body: string;
  author: User;
  tags: Tag[];
  votes: number;
  answersCount: number;
  views: number;
  createdAt: string;
  answers: Answer[];
};

const docToQuestion = (doc: any): Question => {
  const data = doc.data();
  const createdAt = data.createdAt instanceof Timestamp 
    ? formatDistanceToNow(data.createdAt.toDate(), { addSuffix: true, locale: ko }) 
    : '시간 정보 없음';
  
  return {
    id: doc.id,
    ...data,
    createdAt,
    answers: [], // Answers are loaded separately in getQuestionById
  } as Question;
};

const docToAnswer = (doc: any): Answer => {
    const data = doc.data();
    const createdAt = data.createdAt instanceof Timestamp
        ? formatDistanceToNow(data.createdAt.toDate(), { addSuffix: true, locale: ko })
        : '시간 정보 없음';
    return { id: doc.id, ...data, createdAt } as Answer;
};


export const getQuestions = async (): Promise<Question[]> => {
  try {
    const questionsCol = collection(db, 'questions');
    const q = query(questionsCol, orderBy('createdAt', 'desc'));
    const questionSnapshot = await getDocs(q);
    const questionList = questionSnapshot.docs.map(doc => docToQuestion(doc));
    return questionList;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export const getQuestionById = async (id: string): Promise<Question | undefined> => {
  try {
    const questionDocRef = doc(db, 'questions', id);
    const questionSnap = await getDoc(questionDocRef);

    if (!questionSnap.exists()) {
      return undefined;
    }

    const question = docToQuestion(questionSnap);

    const answersCol = collection(questionDocRef, 'answers');
    const answersQuery = query(answersCol, orderBy('createdAt', 'desc'));
    const answersSnapshot = await getDocs(answersQuery);

    question.answers = answersSnapshot.docs.map(doc => docToAnswer(doc));

    return question;
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    return undefined;
  }
};

export const getQuestionsByAuthor = async (authorId: string): Promise<Question[]> => {
    try {
        const q = query(
            collection(db, 'questions'),
            where('author.id', '==', authorId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => docToQuestion(doc));
    } catch (error) {
        console.error("Error fetching user's questions:", error);
        return [];
    }
};

export const getAnswersByAuthor = async (authorId: string): Promise<Answer[]> => {
    try {
        const answersQuery = query(
            collectionGroup(db, 'answers'),
            where('author.id', '==', authorId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(answersQuery);
        return snapshot.docs.map(doc => docToAnswer(doc));
    } catch (error) {
        console.error("Error fetching user's answers:", error);
        return [];
    }
};
