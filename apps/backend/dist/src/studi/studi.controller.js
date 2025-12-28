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
exports.StudiController = void 0;
const common_1 = require("@nestjs/common");
const studi_service_1 = require("./studi.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_guard_1 = require("../auth/admin.guard");
const create_studio_dto_1 = require("./dto/create-studio.dto");
const update_studio_dto_1 = require("./dto/update-studio.dto");
let StudiController = class StudiController {
    studiService;
    constructor(studiService) {
        this.studiService = studiService;
    }
    async findAll() {
        return this.studiService.findAll();
    }
    async findAllActive() {
        return this.studiService.findAllActive();
    }
    async findOne(id) {
        return this.studiService.findOne(id);
    }
    async create(createStudioDto) {
        return this.studiService.create(createStudioDto);
    }
    async update(id, updateStudioDto) {
        return this.studiService.update(id, updateStudioDto);
    }
    async remove(id) {
        return this.studiService.remove(id);
    }
    async toggleActive(id) {
        return this.studiService.toggleActive(id);
    }
    async getStudioStats(id) {
        return this.studiService.getStudioStats(id);
    }
};
exports.StudiController = StudiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "findAllActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_studio_dto_1.CreateStudioDto]),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_studio_dto_1.UpdateStudioDto]),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/toggle-active'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudiController.prototype, "getStudioStats", null);
exports.StudiController = StudiController = __decorate([
    (0, common_1.Controller)('studi'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [studi_service_1.StudiService])
], StudiController);
//# sourceMappingURL=studi.controller.js.map