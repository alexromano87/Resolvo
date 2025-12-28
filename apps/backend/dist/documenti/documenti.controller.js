"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentiController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const documenti_service_1 = require("./documenti.service");
const update_documento_dto_1 = require("./dto/update-documento.dto");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const pratiche_service_1 = require("../pratiche/pratiche.service");
const cartelle_service_1 = require("../cartelle/cartelle.service");
function getTipoDocumento(extension) {
    const ext = extension.toLowerCase();
    if (ext === '.pdf')
        return 'pdf';
    if (['.doc', '.docx'].includes(ext))
        return 'word';
    if (['.xls', '.xlsx'].includes(ext))
        return 'excel';
    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext))
        return 'immagine';
    if (ext === '.csv')
        return 'csv';
    if (ext === '.xml')
        return 'xml';
    return 'altro';
}
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'documenti');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `documento-${uniqueSuffix}${ext}`);
    },
});
let DocumentiController = class DocumentiController {
    documentiService;
    praticheService;
    cartelleService;
    constructor(documentiService, praticheService, cartelleService) {
        this.documentiService = documentiService;
        this.praticheService = praticheService;
        this.cartelleService = cartelleService;
    }
    async uploadFile(user, file, nome, descrizione, caricatoDa, praticaId, cartellaId) {
        const ext = path.extname(file.originalname);
        const tipo = getTipoDocumento(ext);
        const createDto = {
            nome: nome || file.originalname,
            descrizione,
            percorsoFile: file.path,
            nomeOriginale: file.originalname,
            estensione: ext,
            tipo,
            dimensione: file.size,
            caricatoDa,
            praticaId,
            cartellaId,
        };
        if (user.ruolo !== 'admin' && user.studioId) {
            createDto.studioId = user.studioId;
        }
        return this.documentiService.create(createDto);
    }
    async findAll(user, includeInactive, page, limit) {
        return this.documentiService.findAllForUser(user, includeInactive === 'true', {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async findByPratica(user, praticaId, includeInactive, page, limit) {
        await this.praticheService.findOneForUser(praticaId, user);
        return this.documentiService.findByPratica(praticaId, includeInactive === 'true', {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async findByCartella(user, cartellaId, includeInactive, page, limit) {
        const cartella = await this.cartelleService.findOne(cartellaId);
        if (cartella.praticaId) {
            await this.praticheService.findOneForUser(cartella.praticaId, user);
        }
        else if (user.ruolo !== 'admin' && cartella.studioId !== user.studioId) {
            throw new common_1.NotFoundException('Cartella non trovata');
        }
        return this.documentiService.findByCartella(cartellaId, includeInactive === 'true', {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
    }
    async findOne(user, id) {
        await this.assertDocumentoAccess(id, user);
        return this.documentiService.findOne(id);
    }
    async downloadFile(user, id, res) {
        await this.assertDocumentoAccess(id, user);
        const { stream, documento } = await this.documentiService.getFileStream(id);
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${documento.nomeOriginale}"`,
        });
        return new common_1.StreamableFile(stream);
    }
    async update(user, id, updateDto) {
        await this.assertDocumentoAccess(id, user);
        return this.documentiService.update(id, updateDto);
    }
    async deactivate(user, id) {
        await this.assertDocumentoAccess(id, user);
        return this.documentiService.deactivate(id);
    }
    async reactivate(user, id) {
        await this.assertDocumentoAccess(id, user);
        return this.documentiService.reactivate(id);
    }
    async remove(user, id) {
        await this.assertDocumentoAccess(id, user);
        return this.documentiService.remove(id);
    }
    async assertDocumentoAccess(id, user) {
        if (!user || user.ruolo === 'admin')
            return;
        const documento = await this.documentiService.findOne(id);
        if (documento.praticaId) {
            await this.praticheService.findOneForUser(documento.praticaId, user);
            return;
        }
        if (documento.studioId && documento.studioId === user.studioId) {
            return;
        }
        throw new common_1.NotFoundException('Documento non trovato');
    }
};
exports.DocumentiController = DocumentiController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('nome')),
    __param(3, (0, common_1.Body)('descrizione')),
    __param(4, (0, common_1.Body)('caricatoDa')),
    __param(5, (0, common_1.Body)('praticaId')),
    __param(6, (0, common_1.Body)('cartellaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pratica/:praticaId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('praticaId')),
    __param(2, (0, common_1.Query)('includeInactive')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "findByPratica", null);
__decorate([
    (0, common_1.Get)('cartella/:cartellaId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cartellaId')),
    __param(2, (0, common_1.Query)('includeInactive')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "findByCartella", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_documento_dto_1.UpdateDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentiController.prototype, "remove", null);
exports.DocumentiController = DocumentiController = __decorate([
    (0, common_1.Controller)('documenti'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [documenti_service_1.DocumentiService,
        pratiche_service_1.PraticheService,
        cartelle_service_1.CartelleService])
], DocumentiController);
//# sourceMappingURL=documenti.controller.js.map