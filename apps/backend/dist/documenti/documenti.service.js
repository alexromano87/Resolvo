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
exports.DocumentiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const documento_entity_1 = require("./documento.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const pagination_1 = require("../common/pagination");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const fs = __importStar(require("fs"));
const util_1 = require("util");
const unlinkAsync = (0, util_1.promisify)(fs.unlink);
let DocumentiService = class DocumentiService {
    documentiRepository;
    avvocatiRepository;
    notificationsService;
    constructor(documentiRepository, avvocatiRepository, notificationsService) {
        this.documentiRepository = documentiRepository;
        this.avvocatiRepository = avvocatiRepository;
        this.notificationsService = notificationsService;
    }
    async create(createDto) {
        const documento = this.documentiRepository.create(createDto);
        const saved = await this.documentiRepository.save(documento);
        await this.notificationsService.notifyDocumentAdded(saved);
        return saved;
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        if (studioId !== undefined) {
            where.studioId = studioId;
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.documentiRepository.find({
            where,
            relations: ['pratica', 'cartella'],
            order: { dataCreazione: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findAllForUser(user, includeInactive = false, pagination) {
        const query = this.documentiRepository
            .createQueryBuilder('documento')
            .leftJoinAndSelect('documento.pratica', 'pratica')
            .leftJoinAndSelect('documento.cartella', 'cartella')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .orderBy('documento.dataCreazione', 'DESC');
        if (!includeInactive) {
            query.andWhere('documento.attivo = :attivo', { attivo: true });
        }
        await this.applyAccessFilter(query, user);
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        return query.getMany();
    }
    async findByPratica(praticaId, includeInactive = false, pagination) {
        const where = includeInactive
            ? { praticaId }
            : { praticaId, attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.documentiRepository.find({
            where,
            relations: ['cartella'],
            order: { dataCreazione: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findByCartella(cartellaId, includeInactive = false, pagination) {
        const where = includeInactive
            ? { cartellaId }
            : { cartellaId, attivo: true };
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return this.documentiRepository.find({
            where,
            order: { dataCreazione: 'DESC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findOne(id) {
        const documento = await this.documentiRepository.findOne({
            where: { id },
            relations: ['pratica', 'cartella'],
        });
        if (!documento) {
            throw new common_1.NotFoundException(`Documento con ID ${id} non trovato`);
        }
        return documento;
    }
    async update(id, updateDto) {
        const documento = await this.findOne(id);
        if (updateDto.nome !== undefined) {
            documento.nome = updateDto.nome;
        }
        if (updateDto.descrizione !== undefined) {
            documento.descrizione = updateDto.descrizione;
        }
        if (updateDto.cartellaId !== undefined) {
            if (updateDto.cartellaId === null) {
                documento.cartella = null;
                documento.cartellaId = null;
            }
            else {
                documento.cartellaId = updateDto.cartellaId;
                documento.cartella = { id: updateDto.cartellaId };
            }
        }
        return this.documentiRepository.save(documento);
    }
    async deactivate(id) {
        const documento = await this.findOne(id);
        documento.attivo = false;
        return this.documentiRepository.save(documento);
    }
    async reactivate(id) {
        const documento = await this.documentiRepository.findOne({
            where: { id },
            relations: ['pratica', 'cartella'],
        });
        if (!documento) {
            throw new common_1.NotFoundException(`Documento con ID ${id} non trovato`);
        }
        documento.attivo = true;
        return this.documentiRepository.save(documento);
    }
    async remove(id) {
        const documento = await this.findOne(id);
        try {
            if (fs.existsSync(documento.percorsoFile)) {
                await unlinkAsync(documento.percorsoFile);
            }
        }
        catch (error) {
            console.error(`Error deleting file: ${documento.percorsoFile}`, error);
        }
        await this.documentiRepository.remove(documento);
    }
    async getFileStream(id) {
        const documento = await this.findOne(id);
        if (!fs.existsSync(documento.percorsoFile)) {
            throw new common_1.NotFoundException(`File fisico non trovato: ${documento.percorsoFile}`);
        }
        const stream = fs.createReadStream(documento.percorsoFile);
        return { stream, documento };
    }
    async applyAccessFilter(query, user) {
        if (user.ruolo === 'admin') {
            return;
        }
        if (user.ruolo === 'cliente') {
            if (!user.clienteId) {
                query.andWhere('1 = 0');
                return;
            }
            query.andWhere('pratica.clienteId = :clienteId', { clienteId: user.clienteId });
            return;
        }
        if (user.ruolo === 'avvocato') {
            const canSeeAll = await this.canAvvocatoSeeAll(user);
            if (canSeeAll) {
                if (user.studioId) {
                    query.andWhere('documento.studioId = :studioId', { studioId: user.studioId });
                    return;
                }
                query.andWhere('1 = 0');
                return;
            }
            const email = user.email?.toLowerCase().trim();
            if (!email) {
                query.andWhere('1 = 0');
                return;
            }
            query.andWhere('documento.praticaId IS NOT NULL');
            query
                .leftJoin('pratica.avvocati', 'avvocato_access')
                .andWhere('LOWER(avvocato_access.email) = :email', { email });
            return;
        }
        if (user.ruolo === 'collaboratore') {
            query.andWhere('documento.praticaId IS NOT NULL');
            query
                .leftJoin('pratica.collaboratori', 'collaboratore_access')
                .andWhere('collaboratore_access.id = :userId', { userId: user.id });
            return;
        }
        if (!user.studioId) {
            query.andWhere('1 = 0');
            return;
        }
        query.andWhere('documento.studioId = :studioId', { studioId: user.studioId });
    }
    async canAvvocatoSeeAll(user) {
        if (user.ruolo !== 'avvocato')
            return false;
        const email = user.email?.toLowerCase().trim();
        if (!email || !user.studioId)
            return false;
        const avvocato = await this.avvocatiRepository.findOne({
            where: { email, studioId: user.studioId },
        });
        return avvocato?.livelloAccessoPratiche === 'tutte';
    }
};
exports.DocumentiService = DocumentiService;
exports.DocumentiService = DocumentiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(documento_entity_1.Documento)),
    __param(1, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], DocumentiService);
//# sourceMappingURL=documenti.service.js.map