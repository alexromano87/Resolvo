declare class NotificationSettingsDto {
    popup?: boolean;
    sound?: boolean;
    email?: boolean;
}
declare class PrivacySettingsDto {
    showOnlineStatus?: boolean;
    shareUsage?: boolean;
}
export declare class UpdateSettingsDto {
    language?: 'it' | 'en';
    density?: 'confortevole' | 'compatta';
    notifications?: NotificationSettingsDto;
    privacy?: PrivacySettingsDto;
    telefono?: string;
}
export {};
