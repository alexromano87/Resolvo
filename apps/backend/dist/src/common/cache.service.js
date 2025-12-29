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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let CacheService = CacheService_1 = class CacheService {
    configService;
    logger = new common_1.Logger(CacheService_1.name);
    redis = null;
    TTL = {
        SESSION: 3600,
        LOOKUP: 300,
        USER: 600,
        LIST: 60,
    };
    constructor(configService) {
        this.configService = configService;
        this.initializeRedis();
    }
    initializeRedis() {
        try {
            const redisHost = this.configService.get('REDIS_HOST', 'localhost');
            const redisPort = this.configService.get('REDIS_PORT', 6379);
            this.redis = new ioredis_1.default({
                host: redisHost,
                port: redisPort,
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3) {
                        this.logger.warn('Redis connection failed after 3 retries, continuing without cache');
                        return null;
                    }
                    return Math.min(times * 100, 2000);
                },
            });
            this.redis.on('error', (err) => {
                this.logger.error('Redis error:', err);
            });
            this.redis.on('connect', () => {
                this.logger.log('Redis connected successfully');
            });
        }
        catch (error) {
            this.logger.error('Failed to initialize Redis:', error);
        }
    }
    async get(key) {
        if (!this.redis)
            return null;
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            this.logger.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.redis)
            return;
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, serialized);
            }
            else {
                await this.redis.set(key, serialized);
            }
        }
        catch (error) {
            this.logger.error(`Cache set error for key ${key}:`, error);
        }
    }
    async del(key) {
        if (!this.redis)
            return;
        try {
            await this.redis.del(key);
        }
        catch (error) {
            this.logger.error(`Cache delete error for key ${key}:`, error);
        }
    }
    async delPattern(pattern) {
        if (!this.redis)
            return;
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (error) {
            this.logger.error(`Cache delete pattern error for ${pattern}:`, error);
        }
    }
    async getSession(sessionId) {
        return this.get(`session:${sessionId}`);
    }
    async setSession(sessionId, data) {
        await this.set(`session:${sessionId}`, data, this.TTL.SESSION);
    }
    async deleteSession(sessionId) {
        await this.del(`session:${sessionId}`);
    }
    async getUser(userId) {
        return this.get(`user:${userId}`);
    }
    async setUser(userId, data) {
        await this.set(`user:${userId}`, data, this.TTL.USER);
    }
    async invalidateUser(userId) {
        await this.del(`user:${userId}`);
    }
    async getList(key) {
        return this.get(`list:${key}`);
    }
    async setList(key, data) {
        await this.set(`list:${key}`, data, this.TTL.LIST);
    }
    async invalidateList(key) {
        await this.del(`list:${key}`);
    }
    async getLookup(key) {
        return this.get(`lookup:${key}`);
    }
    async setLookup(key, data) {
        await this.set(`lookup:${key}`, data, this.TTL.LOOKUP);
    }
    async invalidateLookup(key) {
        await this.del(`lookup:${key}`);
    }
    async invalidateAllLookups() {
        await this.delPattern('lookup:*');
    }
    async onModuleDestroy() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map