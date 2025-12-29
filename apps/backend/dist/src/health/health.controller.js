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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_service_1 = require("../common/cache.service");
let HealthController = class HealthController {
    dataSource;
    cacheService;
    constructor(dataSource, cacheService) {
        this.dataSource = dataSource;
        this.cacheService = cacheService;
    }
    async check() {
        const checks = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: 'unknown',
            redis: 'unknown',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        };
        try {
            await this.dataSource.query('SELECT 1');
            checks.database = 'healthy';
        }
        catch (error) {
            checks.database = 'unhealthy';
            checks.status = 'degraded';
        }
        try {
            const testKey = `health:check:${Date.now()}`;
            await this.cacheService.set(testKey, 'ok', 5);
            const value = await this.cacheService.get(testKey);
            await this.cacheService.del(testKey);
            checks.redis = value === 'ok' ? 'healthy' : 'unhealthy';
        }
        catch (error) {
            checks.redis = 'unhealthy';
        }
        return checks;
    }
    async readiness() {
        try {
            await this.dataSource.query('SELECT 1');
            return { status: 'ready' };
        }
        catch (error) {
            throw new Error('Database not ready');
        }
    }
    liveness() {
        return { status: 'alive', uptime: process.uptime() };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
__decorate([
    (0, common_1.Get)('live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "liveness", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        cache_service_1.CacheService])
], HealthController);
//# sourceMappingURL=health.controller.js.map