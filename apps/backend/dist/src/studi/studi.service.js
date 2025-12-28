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
exports.StudiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const studio_entity_1 = require("./studio.entity");
let StudiService = class StudiService {
    studioRepository;
    constructor(studioRepository) {
        this.studioRepository = studioRepository;
    }
    async findAll() {
        return this.studioRepository.find({
            order: { nome: 'ASC' },
            relations: ['users', 'pratiche'],
        });
    }
    async findAllActive() {
        return this.studioRepository.find({
            where: { attivo: true },
            order: { nome: 'ASC' },
        });
    }
    async findOne(id) {
        const studio = await this.studioRepository.findOne({
            where: { id },
            relations: ['users', 'pratiche'],
        });
        if (!studio) {
            throw new common_1.NotFoundException('Studio non trovato');
        }
        return studio;
    }
    async create(createStudioDto) {
        const existingStudio = await this.studioRepository.findOne({
            where: { nome: createStudioDto.nome },
        });
        if (existingStudio) {
            throw new common_1.ConflictException('Esiste già uno studio con questo nome');
        }
        const studio = this.studioRepository.create(createStudioDto);
        return this.studioRepository.save(studio);
    }
    async update(id, updateStudioDto) {
        const studio = await this.findOne(id);
        if (updateStudioDto.nome && updateStudioDto.nome !== studio.nome) {
            const existingStudio = await this.studioRepository.findOne({
                where: { nome: updateStudioDto.nome },
            });
            if (existingStudio) {
                throw new common_1.ConflictException('Esiste già uno studio con questo nome');
            }
        }
        Object.assign(studio, updateStudioDto);
        return this.studioRepository.save(studio);
    }
    async remove(id) {
        const studio = await this.findOne(id);
        if (studio.users && studio.users.length > 0) {
            throw new common_1.ConflictException('Non è possibile eliminare uno studio con utenti associati');
        }
        await this.studioRepository.remove(studio);
    }
    async toggleActive(id) {
        const studio = await this.findOne(id);
        studio.attivo = !studio.attivo;
        return this.studioRepository.save(studio);
    }
    async getStudioStats(id) {
        const studio = await this.studioRepository
            .createQueryBuilder('studio')
            .leftJoinAndSelect('studio.users', 'user')
            .leftJoinAndSelect('studio.pratiche', 'pratica', 'pratica.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.clienti', 'cliente', 'cliente.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.debitori', 'debitore', 'debitore.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.avvocati', 'avvocato', 'avvocato.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.documenti', 'documento', 'documento.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.tickets', 'ticket', 'ticket.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.alerts', 'alert', 'alert.attivo = :attivo', { attivo: true })
            .where('studio.id = :id', { id })
            .getOne();
        if (!studio) {
            throw new common_1.NotFoundException('Studio non trovato');
        }
        const praticheAperte = studio.pratiche?.filter(p => p.aperta).length || 0;
        const praticheChiuse = studio.pratiche?.filter(p => !p.aperta).length || 0;
        const capitaleAffidato = studio.pratiche?.reduce((sum, p) => sum + (p.capitale || 0), 0) || 0;
        const capitaleRecuperato = studio.pratiche?.reduce((sum, p) => sum + (p.importoRecuperatoCapitale || 0), 0) || 0;
        const storageUtilizzato = studio.documenti?.reduce((sum, d) => sum + (d.dimensione || 0), 0) || 0;
        const storageUtilizzatoMB = (storageUtilizzato / 1024 / 1024).toFixed(2);
        const utentiPerRuolo = studio.users?.reduce((acc, user) => {
            acc[user.ruolo] = (acc[user.ruolo] || 0) + 1;
            return acc;
        }, {}) || {};
        const alertsAperti = studio.alerts?.filter(a => a.stato === 'in_gestione').length || 0;
        const ticketsAperti = studio.tickets?.filter(t => t.stato === 'aperto' || t.stato === 'in_gestione').length || 0;
        return {
            studio: {
                id: studio.id,
                nome: studio.nome,
                ragioneSociale: studio.ragioneSociale,
                email: studio.email,
                telefono: studio.telefono,
                attivo: studio.attivo,
                createdAt: studio.createdAt,
                updatedAt: studio.updatedAt,
            },
            statistiche: {
                numeroUtenti: studio.users?.length || 0,
                utentiAttivi: studio.users?.filter(u => u.attivo).length || 0,
                utentiPerRuolo,
                numeroPratiche: studio.pratiche?.length || 0,
                praticheAperte,
                praticheChiuse,
                numeroClienti: studio.clienti?.length || 0,
                numeroDebitori: studio.debitori?.length || 0,
                numeroAvvocati: studio.avvocati?.length || 0,
                numeroDocumenti: studio.documenti?.length || 0,
                storageUtilizzatoMB: parseFloat(storageUtilizzatoMB),
                alertsAperti,
                ticketsAperti,
            },
            finanziari: {
                capitaleAffidato,
                capitaleRecuperato,
                percentualeRecupero: capitaleAffidato > 0 ? ((capitaleRecuperato / capitaleAffidato) * 100).toFixed(2) : '0.00',
            },
        };
    }
};
exports.StudiService = StudiService;
exports.StudiService = StudiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(studio_entity_1.Studio)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudiService);
//# sourceMappingURL=studi.service.js.map