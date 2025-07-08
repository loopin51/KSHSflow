import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/mock-data';

interface UserCardProps {
    user: User;
    timestamp: string;
    action: 'asked' | 'answered';
}

export function UserCard({ user, timestamp, action }: UserCardProps) {
    const initials = user.name.split(' ').map(n => n[0]).join('');
    const actionText = action === 'asked' ? '질문함' : '답변함';

    return (
        <div className="flex items-center gap-2 text-sm">
            <Avatar className="h-8 w-8" data-ai-hint="person avatar">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
                <span className="font-semibold text-primary">{user.name}</span>
                <span className="text-muted-foreground"> {actionText} {timestamp}</span>
            </div>
        </div>
    );
}
