'use server';

import { db } from '@/lib/firebase';
import type { Notification } from '@/lib/mock-data';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, updateDoc, addDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { revalidatePath } from 'next/cache';

export async function createNotification(userId: string, message: string, link: string) {
    await addDoc(collection(db, 'notifications'), {
        userId,
        message,
        link,
        read: false,
        createdAt: Timestamp.now(),
    });
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
    const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', userId), 
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        const createdAt = data.createdAt instanceof Timestamp
            ? formatDistanceToNow(data.createdAt.toDate(), { addSuffix: true, locale: ko })
            : '시간 정보 없음';
        return {
            id: docSnap.id,
            ...data,
            createdAt,
        } as Notification;
    });
}

export async function markNotificationAsRead(notificationId: string) {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
    revalidatePath('/profile');
}
