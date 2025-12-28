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
exports.MovimentiFinanziariService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movimento_finanziario_entity_1 = require("./movimento-finanziario.entity");
let MovimentiFinanziariService = class MovimentiFinanziariService {
    movimentiRepository;
    constructor(movimentiRepository) {
        this.movimentiRepository = movimentiRepository;
    }
    async create(createMovimentoDto) {
        const movimento = this.movimentiRepository.create(createMovimentoDto);
        return await this.movimentiRepository.save(movimento);
    }
    async findAllByPratica(praticaId, studioId) {
        const where = { praticaId };
        if (studioId !== undefined) {
            where.studioId = studioId;
        }
        return await this.movimentiRepository.find({
            where,
            order: { data: 'DESC', createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const movimento = await this.movimentiRepository.findOne({
            where: { id },
        });
        if (!movimento) {
            throw new common_1.NotFoundException(`Movimento con id ${id} non trovato`);
        }
        return movimento;
    }
    async update(id, updateMovimentoDto) {
        const movimento = await this.findOne(id);
        Object.assign(movimento, updateMovimentoDto);
        return await this.movimentiRepository.save(movimento);
    }
    async remove(id) {
        const movimento = await this.findOne(id);
        await this.movimentiRepository.remove(movimento);
    }
    async getTotaliByPratica(praticaId, studioId) {
        const movimenti = await this.findAllByPratica(praticaId, studioId);
        const totali = {
            capitale: 0,
            anticipazioni: 0,
            compensi: 0,
            interessi: 0,
            recuperoCapitale: 0,
            recuperoAnticipazioni: 0,
            recuperoCompensi: 0,
            recuperoInteressi: 0,
        };
        movimenti.forEach((m) => {
            const importo = Number(m.importo);
            switch (m.tipo) {
                case 'capitale':
                    totali.capitale += importo;
                    break;
                case 'anticipazione':
                    totali.anticipazioni += importo;
                    break;
                case 'compenso':
                    totali.compensi += importo;
                    break;
                case 'interessi':
                    totali.interessi += importo;
                    break;
                case 'recupero_capitale':
                    totali.recuperoCapitale += importo;
                    break;
                case 'recupero_anticipazione':
                    totali.recuperoAnticipazioni += importo;
                    break;
                case 'recupero_compenso':
                    totali.recuperoCompensi += importo;
                    break;
                case 'recupero_interessi':
                    totali.recuperoInteressi += importo;
                    break;
            }
        });
        return totali;
    }
};
exports.MovimentiFinanziariService = MovimentiFinanziariService;
exports.MovimentiFinanziariService = MovimentiFinanziariService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movimento_finanziario_entity_1.MovimentoFinanziario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MovimentiFinanziariService);
//# sourceMappingURL=movimenti-finanziari.service.js.map