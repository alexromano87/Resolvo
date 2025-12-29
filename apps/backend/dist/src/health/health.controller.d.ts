import { DataSource } from 'typeorm';
import { CacheService } from '../common/cache.service';
export declare class HealthController {
    private readonly dataSource;
    private readonly cacheService;
    constructor(dataSource: DataSource, cacheService: CacheService);
    check(): Promise<{
        status: string;
        timestamp: string;
        database: string;
        redis: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
    }>;
    readiness(): Promise<{
        status: string;
    }>;
    liveness(): {
        status: string;
        uptime: number;
    };
}
