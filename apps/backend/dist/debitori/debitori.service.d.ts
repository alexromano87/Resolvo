import { Repository } from 'typeorm';
import { Debitore } from './debitore.entity';
import { CreateDebitoreDto } from './dto/create-debitore.dto';
import { UpdateDebitoreDto } from './dto/update-debitore.dto';
import { ClientiDebitoriService } from '../relazioni/clienti-debitori.service';
import { Pratica } from '../pratiche/pratica.entity';
import type { CurrentUserData } from '../auth/current-user.decorator';
import { Avvocato } from '../avvocati/avvocato.entity';
import { type PaginationOptions } from '../common/pagination';
export declare class DebitoriService {
    private readonly repo;
    private readonly clientiDebitoriService;
    private readonly praticheRepo;
    private readonly avvocatiRepo;
    constructor(repo: Repository<Debitore>, clientiDebitoriService: ClientiDebitoriService, praticheRepo: Repository<Pratica>, avvocatiRepo: Repository<Avvocato>);
    findAll(includeInactive?: boolean, studioId?: string, pagination?: PaginationOptions): Promise<Debitore[]>;
    findAllForUser(user: CurrentUserData, includeInactive?: boolean, pagination?: PaginationOptions): Promise<Debitore[]>;
    findAllWithClientiCountForUser(user: CurrentUserData, includeInactive?: boolean, pagination?: PaginationOptions): Promise<(Debitore & {
        clientiCount: number;
    })[]>;
    private getAvvocatoAccess;
    private findAllAssigned;
    findAllWithClientiCount(includeInactive?: boolean, studioId?: string, pagination?: PaginationOptions): Promise<(Debitore & {
        clientiCount: number;
    })[]>;
    findOne(id: string): Promise<Debitore>;
    create(dto: CreateDebitoreDto): Promise<Debitore>;
    update(id: string, dto: UpdateDebitoreDto): Promise<Debitore>;
    deactivate(id: string): Promise<Debitore>;
    reactivate(id: string): Promise<Debitore>;
    remove(id: string): Promise<void>;
    countPraticheCollegate(id: string): Promise<number>;
    canAccessDebitore(user: CurrentUserData, debitoreId: string): Promise<boolean>;
}
