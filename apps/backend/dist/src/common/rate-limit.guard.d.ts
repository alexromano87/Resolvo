import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class RateLimitGuard implements CanActivate {
    private readonly reflector;
    readonly store: Map<string, {
        count: number;
        resetAt: number;
    }>;
    private readonly defaultLimit;
    private readonly defaultWindowMs;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
