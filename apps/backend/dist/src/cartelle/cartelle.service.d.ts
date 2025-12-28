import { Repository, TreeRepository } from 'typeorm';
import { Cartella } from './cartella.entity';
import { CreateCartellaDto } from './dto/create-cartella.dto';
import { UpdateCartellaDto } from './dto/update-cartella.dto';
import type { CurrentUserData } from '../auth/current-user.decorator';
import { Avvocato } from '../avvocati/avvocato.entity';
import { type PaginationOptions } from '../common/pagination';
export declare class CartelleService {
    private cartelleRepository;
    private avvocatiRepository;
    constructor(cartelleRepository: TreeRepository<Cartella>, avvocatiRepository: Repository<Avvocato>);
    create(createDto: CreateCartellaDto): Promise<Cartella>;
    findAll(includeInactive?: boolean, studioId?: string, pagination?: PaginationOptions): Promise<Cartella[]>;
    findAllForUser(user: CurrentUserData, includeInactive?: boolean, pagination?: PaginationOptions): Promise<Cartella[]>;
    findByPratica(praticaId: string, includeInactive?: boolean, pagination?: PaginationOptions): Promise<Cartella[]>;
    findTree(praticaId?: string): Promise<Cartella[]>;
    findOne(id: string): Promise<Cartella>;
    findDescendants(id: string): Promise<Cartella[]>;
    findAncestors(id: string): Promise<Cartella[]>;
    update(id: string, updateDto: UpdateCartellaDto): Promise<Cartella>;
    deactivate(id: string): Promise<Cartella>;
    reactivate(id: string): Promise<Cartella>;
    remove(id: string): Promise<void>;
    private applyAccessFilter;
    private canAvvocatoSeeAll;
}
