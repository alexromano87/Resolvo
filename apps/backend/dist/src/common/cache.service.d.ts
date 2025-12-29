import { ConfigService } from '@nestjs/config';
export declare class CacheService {
    private readonly configService;
    private readonly logger;
    private redis;
    private readonly TTL;
    constructor(configService: ConfigService);
    private initializeRedis;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    getSession(sessionId: string): Promise<any | null>;
    setSession(sessionId: string, data: any): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
    getUser(userId: string): Promise<any | null>;
    setUser(userId: string, data: any): Promise<void>;
    invalidateUser(userId: string): Promise<void>;
    getList(key: string): Promise<any[] | null>;
    setList(key: string, data: any[]): Promise<void>;
    invalidateList(key: string): Promise<void>;
    getLookup(key: string): Promise<any | null>;
    setLookup(key: string, data: any): Promise<void>;
    invalidateLookup(key: string): Promise<void>;
    invalidateAllLookups(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
