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
exports.AvvocatiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const avvocato_entity_1 = require("./avvocato.entity");
const pagination_1 = require("../common/pagination");
let AvvocatiService = class AvvocatiService {
    avvocatiRepository;
    constructor(avvocatiRepository) {
        this.avvocatiRepository = avvocatiRepository;
    }
    async create(createAvvocatoDto) {
        const existing = await this.avvocatiRepository.findOne({
            where: { email: createAvvocatoDto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email già registrata');
        }
        const avvocato = this.avvocatiRepository.create(createAvvocatoDto);
        return await this.avvocatiRepository.save(avvocato);
    }
    async findAll(includeInactive = false, studioId, pagination) {
        const where = includeInactive ? {} : { attivo: true };
        if (studioId !== undefined) {
            where.studioId = studioId;
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        return await this.avvocatiRepository.find({
            where,
            order: { cognome: 'ASC', nome: 'ASC' },
            ...(page ? { skip: page.skip, take: page.take } : {}),
        });
    }
    async findOne(id) {
        const avvocato = await this.avvocatiRepository.findOne({
            where: { id },
            relations: ['pratiche'],
        });
        if (!avvocato) {
            throw new common_1.NotFoundException(`Avvocato con id ${id} non trovato`);
        }
        return avvocato;
    }
    async update(id, updateAvvocatoDto) {
        const avvocato = await this.findOne(id);
        if (updateAvvocatoDto.email && updateAvvocatoDto.email !== avvocato.email) {
            const existing = await this.avvocatiRepository.findOne({
                where: { email: updateAvvocatoDto.email },
            });
            if (existing) {
                throw new common_1.ConflictException('Email già registrata');
            }
        }
        Object.assign(avvocato, updateAvvocatoDto);
        return await this.avvocatiRepository.save(avvocato);
    }
    async deactivate(id) {
        const avvocato = await this.findOne(id);
        avvocato.attivo = false;
        return await this.avvocatiRepository.save(avvocato);
    }
    async reactivate(id) {
        const avvocato = await this.findOne(id);
        avvocato.attivo = true;
        return await this.avvocatiRepository.save(avvocato);
    }
    async remove(id) {
        const avvocato = await this.avvocatiRepository.findOne({
            where: { id },
            relations: ['pratiche'],
        });
        if (!avvocato) {
            throw new common_1.NotFoundException(`Avvocato con id ${id} non trovato`);
        }
        if (avvocato.pratiche && avvocato.pratiche.length > 0) {
            throw new common_1.ConflictException('Impossibile eliminare: avvocato associato a una o più pratiche');
        }
        await this.avvocatiRepository.remove(avvocato);
    }
};
exports.AvvocatiService = AvvocatiService;
exports.AvvocatiService = AvvocatiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AvvocatiService);
//# sourceMappingURL=avvocati.service.js.map