export declare class TwoFactorRequestDto {
    channel: 'sms' | 'email';
    telefono?: string;
}
export declare class TwoFactorVerifyDto {
    code: string;
}
export declare class TwoFactorLoginVerifyDto {
    userId: string;
    code: string;
}
