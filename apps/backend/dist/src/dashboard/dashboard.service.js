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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pratica_entity_1 = require("../pratiche/pratica.entity");
const cliente_entity_1 = require("../clienti/cliente.entity");
const studio_entity_1 = require("../studi/studio.entity");
const user_entity_1 = require("../users/user.entity");
const debitore_entity_1 = require("../debitori/debitore.entity");
const avvocato_entity_1 = require("../avvocati/avvocato.entity");
const documento_entity_1 = require("../documenti/documento.entity");
const movimento_finanziario_entity_1 = require("../movimenti-finanziari/movimento-finanziario.entity");
let DashboardService = class DashboardService {
    praticheRepository;
    clienteRepository;
    studioRepository;
    userRepository;
    debitoreRepository;
    avvocatoRepository;
    documentiRepository;
    movimentiRepository;
    constructor(praticheRepository, clienteRepository, studioRepository, userRepository, debitoreRepository, avvocatoRepository, documentiRepository, movimentiRepository) {
        this.praticheRepository = praticheRepository;
        this.clienteRepository = clienteRepository;
        this.studioRepository = studioRepository;
        this.userRepository = userRepository;
        this.debitoreRepository = debitoreRepository;
        this.avvocatoRepository = avvocatoRepository;
        this.documentiRepository = documentiRepository;
        this.movimentiRepository = movimentiRepository;
    }
    async getStats(clienteId, studioId, user) {
        const query = this.praticheRepository
            .createQueryBuilder('pratica')
            .where('pratica.attivo = :attivo', { attivo: true });
        if (clienteId) {
            query.andWhere('pratica.clienteId = :clienteId', { clienteId });
        }
        if (studioId !== undefined) {
            query.andWhere('pratica.studioId = :studioId', { studioId });
        }
        if (user) {
            if (user.ruolo === 'cliente') {
                if (!user.clienteId) {
                    query.andWhere('1 = 0');
                }
            }
            else if (user.ruolo === 'avvocato') {
                const canSeeAll = await this.canAvvocatoSeeAll(user);
                if (!canSeeAll) {
                    const email = user.email?.toLowerCase().trim();
                    if (!email) {
                        query.andWhere('1 = 0');
                    }
                    else {
                        query
                            .leftJoin('pratica.avvocati', 'avvocato_access')
                            .andWhere('LOWER(avvocato_access.email) = :email', { email });
                    }
                }
            }
            else if (user.ruolo === 'collaboratore') {
                query
                    .leftJoin('pratica.collaboratori', 'collaboratore_access')
                    .andWhere('collaboratore_access.id = :userId', { userId: user.id });
            }
        }
        const pratiche = await query.getMany();
        const numeroPratiche = pratiche.length;
        const praticheAperte = pratiche.filter(p => p.aperta).length;
        const praticheChiuse = pratiche.filter(p => !p.aperta).length;
        const praticheChiusePositive = pratiche.filter(p => !p.aperta && (p.importoRecuperatoCapitale > 0 ||
            p.importoRecuperatoAnticipazioni > 0 ||
            p.interessiRecuperati > 0 ||
            p.compensiLiquidati > 0)).length;
        const praticheChiuseNegative = praticheChiuse - praticheChiusePositive;
        const capitaleAffidato = pratiche.reduce((sum, p) => sum + (p.capitale || 0), 0);
        const interessiAffidati = pratiche.reduce((sum, p) => sum + (p.interessi || 0), 0);
        const anticipazioniAffidate = pratiche.reduce((sum, p) => sum + (p.anticipazioni || 0), 0);
        const compensiAffidati = pratiche.reduce((sum, p) => sum + (p.compensiLegali || 0), 0);
        const capitaleRecuperato = pratiche.reduce((sum, p) => sum + (p.importoRecuperatoCapitale || 0), 0);
        const interessiRecuperati = pratiche.reduce((sum, p) => sum + (p.interessiRecuperati || 0), 0);
        const anticipazioniRecuperate = pratiche.reduce((sum, p) => sum + (p.importoRecuperatoAnticipazioni || 0), 0);
        const compensiRecuperati = pratiche.reduce((sum, p) => sum + (p.compensiLiquidati || 0), 0);
        const percentualeRecuperoCapitale = capitaleAffidato > 0
            ? (capitaleRecuperato / capitaleAffidato) * 100
            : 0;
        const percentualeRecuperoInteressi = interessiAffidati > 0
            ? (interessiRecuperati / interessiAffidati) * 100
            : 0;
        const percentualeRecuperoAnticipazioni = anticipazioniAffidate > 0
            ? (anticipazioniRecuperate / anticipazioniAffidate) * 100
            : 0;
        const percentualeRecuperoCompensi = compensiAffidati > 0
            ? (compensiRecuperati / compensiAffidati) * 100
            : 0;
        return {
            numeroPratiche,
            praticheAperte,
            praticheChiuse,
            praticheChiusePositive,
            praticheChiuseNegative,
            capitaleAffidato,
            interessiAffidati,
            anticipazioniAffidate,
            compensiAffidati,
            capitaleRecuperato,
            interessiRecuperati,
            anticipazioniRecuperate,
            compensiRecuperati,
            percentualeRecuperoCapitale,
            percentualeRecuperoInteressi,
            percentualeRecuperoAnticipazioni,
            percentualeRecuperoCompensi,
        };
    }
    async getKPI(clienteId, studioId, user) {
        const query = this.praticheRepository
            .createQueryBuilder('pratica')
            .where('pratica.attivo = :attivo', { attivo: true });
        if (clienteId) {
            query.andWhere('pratica.clienteId = :clienteId', { clienteId });
        }
        if (studioId !== undefined) {
            query.andWhere('pratica.studioId = :studioId', { studioId });
        }
        if (user) {
            if (user.ruolo === 'cliente') {
                if (!user.clienteId) {
                    query.andWhere('1 = 0');
                }
            }
            else if (user.ruolo === 'avvocato') {
                const canSeeAll = await this.canAvvocatoSeeAll(user);
                if (!canSeeAll) {
                    const email = user.email?.toLowerCase().trim();
                    if (!email) {
                        query.andWhere('1 = 0');
                    }
                    else {
                        query
                            .leftJoin('pratica.avvocati', 'avvocato_access')
                            .andWhere('LOWER(avvocato_access.email) = :email', { email });
                    }
                }
            }
            else if (user.ruolo === 'collaboratore') {
                query
                    .leftJoin('pratica.collaboratori', 'collaboratore_access')
                    .andWhere('collaboratore_access.id = :userId', { userId: user.id });
            }
        }
        const pratiche = await query.getMany();
        const totalePraticheAffidate = pratiche.length;
        const totalePraticheChiuse = pratiche.filter(p => !p.aperta).length;
        const percentualeChiusura = totalePraticheAffidate > 0
            ? (totalePraticheChiuse / totalePraticheAffidate) * 100
            : 0;
        const praticheChiuse = pratiche.filter(p => !p.aperta);
        const esitoNegativo = praticheChiuse.filter(p => p.importoRecuperatoCapitale === 0 &&
            p.importoRecuperatoAnticipazioni === 0 &&
            p.interessiRecuperati === 0 &&
            p.compensiLiquidati === 0).length;
        const esitoPositivo = praticheChiuse.length - esitoNegativo;
        const esitoPositivoTotale = praticheChiuse.filter(p => {
            const capitaleOk = p.capitale === 0 || p.importoRecuperatoCapitale >= p.capitale;
            const interessiOk = p.interessi === 0 || p.interessiRecuperati >= p.interessi;
            const anticipazioniOk = p.anticipazioni === 0 || p.importoRecuperatoAnticipazioni >= p.anticipazioni;
            const compensiOk = p.compensiLegali === 0 || p.compensiLiquidati >= p.compensiLegali;
            return capitaleOk && interessiOk && anticipazioniOk && compensiOk &&
                (p.importoRecuperatoCapitale > 0 || p.importoRecuperatoAnticipazioni > 0 ||
                    p.interessiRecuperati > 0 || p.compensiLiquidati > 0);
        }).length;
        const esitoPositivoParziale = esitoPositivo - esitoPositivoTotale;
        const capitaleRecuperatoTotale = praticheChiuse.reduce((sum, p) => sum + (p.importoRecuperatoCapitale || 0), 0);
        const capitaleRecuperatoParziale = praticheChiuse.filter(p => p.importoRecuperatoCapitale > 0 && p.importoRecuperatoCapitale < p.capitale).length;
        const capitaleRecuperatoCompleto = praticheChiuse.filter(p => p.capitale > 0 && p.importoRecuperatoCapitale >= p.capitale).length;
        const interessiRecuperatiTotale = praticheChiuse.reduce((sum, p) => sum + (p.interessiRecuperati || 0), 0);
        const interessiRecuperatiParziale = praticheChiuse.filter(p => p.interessiRecuperati > 0 && p.interessiRecuperati < p.interessi).length;
        const interessiRecuperatiCompleto = praticheChiuse.filter(p => p.interessi > 0 && p.interessiRecuperati >= p.interessi).length;
        const compensiRecuperatiTotale = praticheChiuse.reduce((sum, p) => sum + (p.compensiLiquidati || 0), 0);
        const compensiRecuperatiParziale = praticheChiuse.filter(p => p.compensiLiquidati > 0 && p.compensiLiquidati < p.compensiLegali).length;
        const compensiRecuperatiCompleto = praticheChiuse.filter(p => p.compensiLegali > 0 && p.compensiLiquidati >= p.compensiLegali).length;
        return {
            totalePraticheAffidate,
            totalePraticheChiuse,
            percentualeChiusura,
            esitoNegativo,
            esitoPositivo,
            esitoPositivoParziale,
            esitoPositivoTotale,
            recuperoCapitale: {
                totale: capitaleRecuperatoTotale,
                parziale: capitaleRecuperatoParziale,
                completo: capitaleRecuperatoCompleto,
            },
            recuperoInteressi: {
                totale: interessiRecuperatiTotale,
                parziale: interessiRecuperatiParziale,
                completo: interessiRecuperatiCompleto,
            },
            recuperoCompensi: {
                totale: compensiRecuperatiTotale,
                parziale: compensiRecuperatiParziale,
                completo: compensiRecuperatiCompleto,
            },
        };
    }
    async getDashboardCondivisa(clienteId) {
        const cliente = await this.clienteRepository.findOne({
            where: { id: clienteId },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con ID ${clienteId} non trovato`);
        }
        const config = cliente.configurazioneCondivisione;
        if (!config || !config.abilitata) {
            throw new common_1.NotFoundException('Condivisione dashboard non abilitata per questo cliente');
        }
        const result = {
            cliente: {
                id: cliente.id,
                ragioneSociale: cliente.ragioneSociale,
            },
            configurazione: config,
        };
        const praticheEnabled = Object.values(config.pratiche || {}).some(Boolean);
        let praticheData = [];
        const praticaLabels = new Map();
        if (praticheEnabled) {
            praticheData = await this.praticheRepository.find({
                where: { clienteId, attivo: true },
                relations: ['cliente', 'debitore'],
                order: { createdAt: 'DESC' },
            });
            praticheData.forEach((pratica) => {
                praticaLabels.set(pratica.id, this.buildPraticaLabel(pratica));
            });
            result.pratiche = praticheData.map((pratica) => ({
                id: pratica.id,
                titolo: praticaLabels.get(pratica.id) ?? this.buildPraticaLabel(pratica),
                cliente: pratica.cliente?.ragioneSociale || 'Cliente',
                debitore: this.buildPraticaDebitoreLabel(pratica),
                faseId: pratica.faseId,
                aperta: pratica.aperta,
                esito: pratica.esito,
                capitale: Number(pratica.capitale ?? 0),
                importoRecuperatoCapitale: Number(pratica.importoRecuperatoCapitale ?? 0),
                anticipazioni: Number(pratica.anticipazioni ?? 0),
                importoRecuperatoAnticipazioni: Number(pratica.importoRecuperatoAnticipazioni ?? 0),
                compensiLegali: Number(pratica.compensiLegali ?? 0),
                compensiLiquidati: Number(pratica.compensiLiquidati ?? 0),
                interessi: Number(pratica.interessi ?? 0),
                interessiRecuperati: Number(pratica.interessiRecuperati ?? 0),
                dataAffidamento: pratica.dataAffidamento
                    ? pratica.dataAffidamento.toISOString?.() ?? pratica.dataAffidamento
                    : null,
                dataChiusura: pratica.dataChiusura ? pratica.dataChiusura.toISOString?.() ?? pratica.dataChiusura : null,
                riferimentoCredito: pratica.riferimentoCredito,
                storico: pratica.storico,
                opposizione: pratica.opposizione,
                pignoramento: pratica.pignoramento,
            }));
        }
        const praticaIds = praticheData.map((p) => p.id);
        if (config.pratiche.documenti && praticaIds.length > 0) {
            const documenti = await this.documentiRepository.find({
                where: { praticaId: (0, typeorm_2.In)(praticaIds), attivo: true },
                order: { dataCreazione: 'DESC' },
            });
            result.documenti = documenti.map((doc) => {
                const praticaId = doc.praticaId;
                const praticaLabel = praticaId && praticaLabels.has(praticaId) ? praticaLabels.get(praticaId) : 'Pratica';
                return {
                    id: doc.id,
                    nome: doc.nome,
                    descrizione: doc.descrizione,
                    tipo: doc.tipo,
                    praticaId: doc.praticaId,
                    praticaLabel,
                    dataCreazione: doc.dataCreazione,
                    caricatoDa: doc.caricatoDa,
                };
            });
        }
        if (config.pratiche.movimentiFinanziari && praticaIds.length > 0) {
            const movimenti = await this.movimentiRepository.find({
                where: { praticaId: (0, typeorm_2.In)(praticaIds) },
                order: { data: 'DESC', createdAt: 'DESC' },
            });
            result.movimentiFinanziari = movimenti.map((mov) => {
                const movPraticaId = mov.praticaId;
                return {
                    id: mov.id,
                    tipo: mov.tipo,
                    importo: Number(mov.importo ?? 0),
                    data: mov.data,
                    oggetto: mov.oggetto,
                    praticaId: mov.praticaId,
                    praticaLabel: movPraticaId ? praticaLabels.get(movPraticaId) ?? 'Pratica' : 'Pratica',
                };
            });
        }
        if (config.pratiche.timeline && praticheData.length > 0) {
            const timeline = [];
            praticheData.forEach((pratica) => {
                const label = praticaLabels.get(pratica.id) ?? this.buildPraticaLabel(pratica);
                (pratica.storico || []).forEach((fase) => {
                    if (!fase.dataInizio)
                        return;
                    timeline.push({
                        praticaId: pratica.id,
                        praticaLabel: label,
                        title: fase.faseNome,
                        date: fase.dataInizio,
                        detail: fase.dataFine
                            ? `Fino al ${new Date(fase.dataFine).toLocaleDateString('it-IT')}`
                            : 'In corso',
                        tipo: 'fase',
                    });
                });
                if (pratica.opposizione?.dataEsito) {
                    timeline.push({
                        praticaId: pratica.id,
                        praticaLabel: label,
                        title: 'Esito opposizione',
                        date: pratica.opposizione.dataEsito,
                        detail: pratica.opposizione.note,
                        tipo: 'opposizione',
                    });
                }
                if (pratica.pignoramento?.dataNotifica) {
                    timeline.push({
                        praticaId: pratica.id,
                        praticaLabel: label,
                        title: 'Notifica pignoramento',
                        date: pratica.pignoramento.dataNotifica,
                        detail: pratica.pignoramento.tipo,
                        tipo: 'pignoramento',
                    });
                }
            });
            result.timeline = timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        if (config.dashboard.stats) {
            result.stats = await this.getStats(clienteId);
        }
        if (config.dashboard.kpi) {
            result.kpi = await this.getKPI(clienteId);
        }
        return result;
    }
    async getAdminDashboard() {
        const [studi, studiAttivi, utenti, utentiAttivi, pratiche, praticheAperte, clienti, debitori, avvocati,] = await Promise.all([
            this.studioRepository.count(),
            this.studioRepository.count({ where: { attivo: true } }),
            this.userRepository.count(),
            this.userRepository.count({ where: { attivo: true } }),
            this.praticheRepository.count({ where: { attivo: true } }),
            this.praticheRepository.count({ where: { attivo: true, aperta: true } }),
            this.clienteRepository.count({ where: { attivo: true } }),
            this.debitoreRepository.count({ where: { attivo: true } }),
            this.avvocatoRepository.count({ where: { attivo: true } }),
        ]);
        const studiConRelazioni = await this.studioRepository
            .createQueryBuilder('studio')
            .leftJoinAndSelect('studio.users', 'user')
            .leftJoinAndSelect('studio.pratiche', 'pratica', 'pratica.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.clienti', 'cliente', 'cliente.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.debitori', 'debitore', 'debitore.attivo = :attivo', { attivo: true })
            .leftJoinAndSelect('studio.avvocati', 'avvocato', 'avvocato.attivo = :attivo', { attivo: true })
            .getMany();
        const perStudio = studiConRelazioni.map(studio => ({
            studioId: studio.id,
            studioNome: studio.nome,
            studioAttivo: studio.attivo,
            numeroUtenti: studio.users ? studio.users.length : 0,
            numeroPratiche: studio.pratiche ? studio.pratiche.length : 0,
            numeroClienti: studio.clienti ? studio.clienti.length : 0,
            numeroDebitori: studio.debitori ? studio.debitori.length : 0,
            numeroAvvocati: studio.avvocati ? studio.avvocati.length : 0,
        }));
        const ultimiUtenti = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.studio', 'studio')
            .orderBy('user.createdAt', 'DESC')
            .limit(10)
            .getMany();
        const ultimiUtentiCreati = ultimiUtenti.map(user => ({
            id: user.id,
            nome: user.nome,
            cognome: user.cognome,
            email: user.email,
            ruolo: user.ruolo,
            studioNome: user.studio ? user.studio.nome : null,
            createdAt: user.createdAt,
        }));
        const ultimePratiche = await this.praticheRepository
            .createQueryBuilder('pratica')
            .leftJoinAndSelect('pratica.cliente', 'cliente')
            .leftJoinAndSelect('pratica.debitore', 'debitore')
            .leftJoinAndSelect('pratica.studio', 'studio')
            .where('pratica.attivo = :attivo', { attivo: true })
            .orderBy('pratica.createdAt', 'DESC')
            .limit(10)
            .getMany();
        const ultimePraticheCreate = ultimePratiche.map(pratica => ({
            id: pratica.id,
            numeroProtocollo: pratica.id.substring(0, 8).toUpperCase(),
            cliente: pratica.cliente ? pratica.cliente.ragioneSociale : 'N/A',
            debitore: pratica.debitore ? `${pratica.debitore.nome} ${pratica.debitore.cognome}` : 'N/A',
            studioNome: pratica.studio ? pratica.studio.nome : null,
            createdAt: pratica.createdAt,
        }));
        return {
            totali: {
                studi,
                studiAttivi,
                utenti,
                utentiAttivi,
                pratiche,
                praticheAperte,
                clienti,
                debitori,
                avvocati,
            },
            perStudio,
            attivitaRecente: {
                ultimiUtentiCreati,
                ultimePraticheCreate,
            },
        };
    }
    buildPraticaLabel(pratica) {
        if (!pratica)
            return 'Pratica';
        const cliente = pratica.cliente?.ragioneSociale || 'Cliente';
        const debitore = pratica.debitore?.ragioneSociale ||
            [pratica.debitore?.nome, pratica.debitore?.cognome].filter(Boolean).join(' ').trim() ||
            'Debitore';
        return `${cliente} vs ${debitore}`;
    }
    buildPraticaDebitoreLabel(pratica) {
        if (!pratica.debitore)
            return 'Debitore';
        if (pratica.debitore.ragioneSociale)
            return pratica.debitore.ragioneSociale;
        const nome = [pratica.debitore.nome, pratica.debitore.cognome].filter(Boolean).join(' ').trim();
        return nome || 'Debitore';
    }
    async canAvvocatoSeeAll(user) {
        if (user.ruolo !== 'avvocato')
            return false;
        const email = user.email?.toLowerCase().trim();
        if (!email || !user.studioId)
            return false;
        const avvocato = await this.avvocatoRepository.findOne({
            where: { email, studioId: user.studioId },
        });
        return avvocato?.livelloAccessoPratiche === 'tutte';
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pratica_entity_1.Pratica)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(2, (0, typeorm_1.InjectRepository)(studio_entity_1.Studio)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(debitore_entity_1.Debitore)),
    __param(5, (0, typeorm_1.InjectRepository)(avvocato_entity_1.Avvocato)),
    __param(6, (0, typeorm_1.InjectRepository)(documento_entity_1.Documento)),
    __param(7, (0, typeorm_1.InjectRepository)(movimento_finanziario_entity_1.MovimentoFinanziario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map