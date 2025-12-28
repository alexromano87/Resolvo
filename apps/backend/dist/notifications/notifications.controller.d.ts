import type { CurrentUserData } from '../auth/current-user.decorator';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    list(user: CurrentUserData, unread?: string, limit?: string): Promise<import("./notification.entity").Notification[]>;
    markRead(user: CurrentUserData, id: string): Promise<{
        success: boolean;
    }>;
    markAllRead(user: CurrentUserData): Promise<{
        success: boolean;
    }>;
}
