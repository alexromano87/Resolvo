"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rate_limit_decorator_1 = require("./rate-limit.decorator");
let RateLimitGuard = class RateLimitGuard {
    reflector;
    store = new Map();
    defaultLimit = 60;
    defaultWindowMs = 60_000;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const handler = context.getHandler();
        const klass = context.getClass();
        const meta = this.reflector.get(rate_limit_decorator_1.RATE_LIMIT_KEY, handler) ||
            this.reflector.get(rate_limit_decorator_1.RATE_LIMIT_KEY, klass);
        const options = {
            limit: meta?.limit ?? this.defaultLimit,
            windowMs: meta?.windowMs ?? this.defaultWindowMs,
        };
        const request = context.switchToHttp().getRequest();
        if (!request)
            return true;
        const ipHeader = request.headers?.['x-forwarded-for'];
        const ip = (Array.isArray(ipHeader) ? ipHeader[0] : ipHeader) ||
            request.ip ||
            'unknown';
        const routeKey = request.route?.path || request.url || 'unknown';
        const key = `${ip}:${request.method}:${routeKey}`;
        const now = Date.now();
        const entry = this.store.get(key);
        if (!entry || entry.resetAt < now) {
            this.store.set(key, { count: 1, resetAt: now + options.windowMs });
            return true;
        }
        if (entry.count >= options.limit) {
            throw new common_1.HttpException('Troppi tentativi, riprova più tardi', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        entry.count += 1;
        this.store.set(key, entry);
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map