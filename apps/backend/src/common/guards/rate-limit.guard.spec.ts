import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';

const createContext = (request: any): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext);

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  const request = { ip: '127.0.0.1', method: 'GET', url: '/tickets' };

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RateLimitGuard();
  });

  it('consente la chiamata iniziale', () => {
    expect(guard.canActivate(createContext(request))).toBe(true);
  });

  it('blocca quando si supera la soglia in finestra', () => {
    const context = createContext(request);
    for (let i = 0; i < 60; i++) {
      guard.canActivate(context);
    }

    let thrown: any;
    try {
      guard.canActivate(context);
    } catch (err) {
      thrown = err;
    }

    expect(thrown?.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
  });

  it('reimposta il contatore dopo il timeout', () => {
    const key = `${request.ip}:${request.method}:${request.url}`;
    const context = createContext(request);
    for (let i = 0; i < 60; i++) {
      guard.canActivate(context);
    }
    const tracking = (guard as any).tracking;
    const entry = tracking.get(key);
    entry.resetAt = Date.now() - 1;

    expect(guard.canActivate(context)).toBe(true);
  });
});
