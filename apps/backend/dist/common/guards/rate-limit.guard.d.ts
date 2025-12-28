import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RateLimitGuard implements CanActivate {
    private readonly tracking;
    private readonly limit;
    private readonly windowMs;
    canActivate(context: ExecutionContext): boolean;
}
