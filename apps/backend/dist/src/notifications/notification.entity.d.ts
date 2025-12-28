import { User } from '../users/user.entity';
import { Pratica } from '../pratiche/pratica.entity';
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    praticaId: string | null;
    pratica: Pratica | null;
    type: string;
    title: string;
    message: string;
    metadata: Record<string, unknown> | null;
    readAt: Date | null;
    createdAt: Date;
}
