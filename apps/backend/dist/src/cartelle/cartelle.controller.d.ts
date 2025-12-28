import { CartelleService } from './cartelle.service';
import { CreateCartellaDto } from './dto/create-cartella.dto';
import { UpdateCartellaDto } from './dto/update-cartella.dto';
import { Cartella } from './cartella.entity';
import type { CurrentUserData } from '../auth/current-user.decorator';
import { PraticheService } from '../pratiche/pratiche.service';
export declare class CartelleController {
    private readonly cartelleService;
    private readonly praticheService;
    constructor(cartelleService: CartelleService, praticheService: PraticheService);
    create(user: CurrentUserData, createDto: CreateCartellaDto): Promise<Cartella>;
    findAll(user: CurrentUserData, includeInactive?: string, page?: string, limit?: string): Promise<Cartella[]>;
    findByPratica(user: CurrentUserData, praticaId: string, includeInactive?: string, page?: string, limit?: string): Promise<Cartella[]>;
    findTree(praticaId?: string): Promise<Cartella[]>;
    findOne(user: CurrentUserData, id: string): Promise<Cartella>;
    findDescendants(user: CurrentUserData, id: string): Promise<Cartella[]>;
    findAncestors(user: CurrentUserData, id: string): Promise<Cartella[]>;
    update(user: CurrentUserData, id: string, updateDto: UpdateCartellaDto): Promise<Cartella>;
    deactivate(user: CurrentUserData, id: string): Promise<Cartella>;
    reactivate(user: CurrentUserData, id: string): Promise<Cartella>;
    remove(user: CurrentUserData, id: string): Promise<void>;
    private assertCartellaAccess;
}
