export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Tag = 'daily life' | 'science' | 'technology' | 'study' | 'career' | 'other';

export type Answer = {
  id: string;
  body: string;
  author: User;
  votes: number;
  createdAt: string;
  isAccepted: boolean;
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

const users: User[] = [
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-3', name: 'Charlie', avatarUrl: 'https://placehold.co/100x100.png' },
];

const questions: Question[] = [
  {
    id: 'q-1',
    title: 'What are the best study spots on campus?',
    body: 'I\'m looking for a quiet place with good Wi-Fi to study for my finals. Any recommendations? I heard the library is good, but is it too crowded? Maybe some hidden gems? Thanks @Alice!',
    author: users[0],
    tags: ['study', 'daily life'],
    votes: 15,
    answersCount: 2,
    views: 120,
    createdAt: '2 days ago',
    answers: [
      {
        id: 'a-1-1',
        body: 'The third floor of the main library is usually very quiet. Also, the coffee shop near the science building is great if you don\'t mind a little background noise.',
        author: users[1],
        votes: 5,
        createdAt: '1 day ago',
        isAccepted: true,
      },
      {
        id: 'a-1-2',
        body: 'I second the coffee shop idea! Great coffee and you can book small rooms for group study.',
        author: users[2],
        votes: 2,
        createdAt: '22 hours ago',
        isAccepted: false,
      },
    ],
  },
  {
    id: 'q-2',
    title: 'How does a blockchain work? Simplified explanation needed.',
    body: 'I\'m trying to understand the basics of blockchain for my computer science class. Can someone explain it in simple terms? I\'m particularly confused about the "chain" part. Thanks for the help from @Bob or anyone else who knows about this!',
    author: users[2],
    tags: ['technology', 'science'],
    votes: 42,
    answersCount: 1,
    views: 540,
    createdAt: '5 days ago',
    answers: [
      {
        id: 'a-2-1',
        body: 'Imagine a digital notebook that is shared among many people. Each page (block) contains a list of transactions. Once a page is full, it\'s added to the notebook (chain) and linked to the previous page with a cryptographic seal. This makes it tamper-proof. That\'s the basic idea!',
        author: users[0],
        votes: 25,
        createdAt: '4 days ago',
        isAccepted: true,
      },
    ],
  },
  {
    id: 'q-3',
    title: 'Internship opportunities for a first-year student?',
    body: 'Are there any companies that offer internships to first-year students? Most seem to require at least junior standing. Any advice on how to get an internship early would be appreciated!',
    author: users[1],
    tags: ['career'],
    votes: 8,
    answersCount: 0,
    views: 95,
    createdAt: '1 hour ago',
    answers: [],
  },
];

export const getQuestions = (): Question[] => questions;

export const getQuestionById = (id: string): Question | undefined => questions.find(q => q.id === id);
