export declare const RATE_LIMIT_KEY = "rate_limit";
export type RateLimitOptions = {
    limit: number;
    windowMs: number;
};
export declare const RateLimit: (options: RateLimitOptions) => import("@nestjs/common").CustomDecorator<string>;
