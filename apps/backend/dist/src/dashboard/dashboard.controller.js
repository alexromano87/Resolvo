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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getAdminDashboard() {
        return this.dashboardService.getAdminDashboard();
    }
    async getStats(user, clienteId) {
        const studioId = user.ruolo === 'admin' ? undefined : (user.studioId || undefined);
        const effectiveClienteId = user.ruolo === 'cliente' ? (user.clienteId || undefined) : clienteId;
        return this.dashboardService.getStats(effectiveClienteId, studioId, user);
    }
    async getKPI(user, clienteId) {
        const studioId = user.ruolo === 'admin' ? undefined : (user.studioId || undefined);
        const effectiveClienteId = user.ruolo === 'cliente' ? (user.clienteId || undefined) : clienteId;
        return this.dashboardService.getKPI(effectiveClienteId, studioId, user);
    }
    async getDashboardCondivisa(clienteId) {
        return this.dashboardService.getDashboardCondivisa(clienteId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminDashboard", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('kpi'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getKPI", null);
__decorate([
    (0, common_1.Get)('condivisa/:clienteId'),
    __param(0, (0, common_1.Param)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardCondivisa", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map