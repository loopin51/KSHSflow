'use server';

import { db } from '@/lib/firebase';
import type { User } from '@/lib/mock-data';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export interface CreateUserInput {
  name: string;
  email: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  // Check if user already exists
  const q = query(collection(db, 'users'), where('email', '==', input.email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    throw new Error('User with this email already exists.');
  }

  const userRef = await addDoc(collection(db, 'users'), {
    name: input.name,
    email: input.email,
    avatarUrl: `https://placehold.co/100x100.png?text=${input.name.charAt(0)}`,
    bio: '',
  });

  return {
    id: userRef.id,
    ...input,
    avatarUrl: `https://placehold.co/100x100.png?text=${input.name.charAt(0)}`,
    bio: '',
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
}

export async function getUsersByNames(names: string[]): Promise<User[]> {
    if (names.length === 0) return [];
    const q = query(collection(db, 'users'), where('name', 'in', names));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getAllUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}
