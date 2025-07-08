
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageCircleQuestion, LogOut, Bell, Check } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from 'react';
import type { Notification } from '@/lib/mock-data';
import { getNotificationsForUser, markNotificationAsRead } from '@/actions/notification';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
        getNotificationsForUser(user.id).then(setNotifications);
    }
  }, [user]);

  const handleNotificationClick = async (notification: Notification) => {
      router.push(notification.link);
      if (!notification.read) {
          await markNotificationAsRead(notification.id);
          setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, read: true} : n));
      }
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('') : '';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MessageCircleQuestion className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">CampusOverflow</span>
        </Link>
        <div className="flex-1 px-4 sm:px-8 lg:px-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="w-full rounded-full pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
            {user ? (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                                <Bell className="h-5 w-5" />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-card" />
                                )}
                                <span className="sr-only">Notifications</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.length > 0 ? notifications.map(n => (
                                <DropdownMenuItem key={n.id} onClick={() => handleNotificationClick(n)} className="flex items-start gap-2 cursor-pointer">
                                    <div className="flex-shrink-0 mt-1">
                                      {n.read ? <Check className="h-4 w-4 text-muted-foreground" /> : <div className="h-4 w-4 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-primary" /></div>}
                                    </div>
                                    <p className="text-sm text-muted-foreground whitespace-normal">{n.message}</p>
                                </DropdownMenuItem>
                            )) : (
                                <p className="p-2 text-sm text-center text-muted-foreground">No new notifications</p>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9" data-ai-hint="person avatar">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/ask')}>
                            Ask Question
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <>
                    <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
            )}
        </div>
      </div>
    </header>
  );
}
