import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly tracking = new Map<string, RateLimitEntry>();
  private readonly limit = 60;
  private readonly windowMs = 60_000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request || !request.ip || !request.method || !request.url) {
      return true;
    }

    const key = `${request.ip}:${request.method}:${request.url}`;
    const now = Date.now();
    const entry = this.tracking.get(key);
    if (!entry || entry.resetAt <= now) {
      this.tracking.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.limit) {
      throw new HttpException(
        'Numero richieste superato. Riprova tra pochi istanti.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    entry.count += 1;
    return true;
  }
}
