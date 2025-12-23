import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY, type RateLimitOptions } from './rate-limit.decorator';

const store = new Map<string, { count: number; resetAt: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const klass = context.getClass();

    const options =
      this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, handler) ||
      this.reflector.get<RateLimitOptions>(RATE_LIMIT_KEY, klass);

    if (!options) return true;

    const request = context.switchToHttp().getRequest();
    const ipHeader = request.headers?.['x-forwarded-for'];
    const ip =
      (Array.isArray(ipHeader) ? ipHeader[0] : ipHeader) ||
      request.ip ||
      'unknown';
    const routeKey = request.route?.path || request.url || 'unknown';
    const key = `${ip}:${request.method}:${routeKey}`;

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + options.windowMs });
      return true;
    }

    if (entry.count >= options.limit) {
      throw new HttpException('Troppi tentativi, riprova più tardi', HttpStatus.TOO_MANY_REQUESTS);
    }

    entry.count += 1;
    store.set(key, entry);
    return true;
  }
}
