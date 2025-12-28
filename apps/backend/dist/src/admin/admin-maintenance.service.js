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
exports.AdminMaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const cliente_entity_1 = require("../clienti/cliente.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
const alert_entity_1 = require("../alerts/alert.entity");
const ticket_entity_1 = require("../tickets/ticket.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const cartella_entity_1 = require("../cartelle/cartella.entity");
const user_entity_1 = require("../users/user.entity");
let AdminMaintenanceService = class AdminMaintenanceService {
    praticheRepository;
    clienteRepository;
    debitoreRepository;
    avvocatoRepository;
    movimentiFinanziariRepository;
    alertRepository;
    ticketRepository;
    documentoRepository;
    cartellaRepository;
    userRepository;
    constructor(praticheRepository, clienteRepository, debitoreRepository, avvocatoRepository, movimentiFinanziariRepository, alertRepository, ticketRepository, documentoRepository, cartellaRepository, userRepository) {
        this.praticheRepository = praticheRepository;
        this.clienteRepository = clienteRepository;
        this.debitoreRepository = debitoreRepository;
        this.avvocatoRepository = avvocatoRepository;
        this.movimentiFinanziariRepository = movimentiFinanziariRepository;
        this.alertRepository = alertRepository;
        this.ticketRepository = ticketRepository;
        this.documentoRepository = documentoRepository;
        this.cartellaRepository = cartellaRepository;
        this.userRepository = userRepository;
    }
    async getOrphanData() {
        const [praticheSenzaStudio, clientiSenzaStudio, debitoriSenzaStudio, avvocatiSenzaStudio, movimentiFinanziariSenzaStudio, alertsSenzaStudio, ticketsSenzaStudio, documentiSenzaStudio, cartelleSenzaStudio, utentiSenzaStudio,] = await Promise.all([
            this.praticheRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.clienteRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.debitoreRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.avvocatoRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.movimentiFinanziariRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.alertRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.ticketRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.documentoRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.cartellaRepository.count({ where: { studioId: (0, typeorm_2.IsNull)() } }),
            this.userRepository.count({ where: { studioId: (0, typeorm_2.IsNull)(), ruolo: (0, typeorm_2.Not)('admin') } }),
        ]);
        return {
            praticheSenzaStudio,
            clientiSenzaStudio,
            debitoriSenzaStudio,
            avvocatiSenzaStudio,
            movimentiFinanziariSenzaStudio,
            alertsSenzaStudio,
            ticketsSenzaStudio,
            documentiSenzaStudio,
            cartelleSenzaStudio,
            utentiSenzaStudio,
        };
    }
    async assignOrphanDataToStudio(studioId) {
        const [pratiche, clienti, debitori, avvocati, movimenti, alerts, tickets, documenti, cartelle, utenti,] = await Promise.all([
            this.praticheRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.clienteRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.debitoreRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.avvocatoRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.movimentiFinanziariRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.alertRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.ticketRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.documentoRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.cartellaRepository.update({ studioId: (0, typeorm_2.IsNull)() }, { studioId }),
            this.userRepository
                .createQueryBuilder()
                .update(user_entity_1.User)
                .set({ studioId })
                .where('studioId IS NULL AND ruolo != :ruolo', { ruolo: 'admin' })
                .execute(),
        ]);
        return {
            message: 'Dati orfani assegnati con successo',
            updated: {
                pratiche: pratiche.affected || 0,
                clienti: clienti.affected || 0,
                debitori: debitori.affected || 0,
                avvocati: avvocati.affected || 0,
                movimentiFinanziari: movimenti.affected || 0,
                alerts: alerts.affected || 0,
                tickets: tickets.affected || 0,
                documenti: documenti.affected || 0,
                cartelle: cartelle.affected || 0,
                utenti: utenti.affected || 0,
            },
        };
    }
};
exports.AdminMaintenanceService = AdminMaintenanceService;
exports.AdminMaintenanceService = AdminMaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(2, (0, typeorm_1.InjectRepository)(debitore_entity_1.Debitore)),
    __param(3, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __param(4, (0, typeorm_1.InjectRepository)(movimento_finanziario_entity_1.MovimentoFinanziario)),
    __param(5, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __param(6, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(7, (0, typeorm_1.InjectRepository)(documento_entity_1.Documento)),
    __param(8, (0, typeorm_1.InjectRepository)(cartella_entity_1.Cartella)),
    __param(9, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminMaintenanceService);
//# sourceMappingURL=admin-maintenance.service.js.map