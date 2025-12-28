import { Repository } from 'typeorm';
import { Documento } from './documento.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { NotificationsService } from '../notifications/notifications.service';
import type { CurrentUserData } from '../auth/current-user.decorator';
import { type PaginationOptions } from '../common/pagination';
import { Avvocato } from '../avvocati/avvocato.entity';
import * as fs from 'fs';
export declare class DocumentiService {
    private documentiRepository;
    private avvocatiRepository;
    private readonly notificationsService;
    constructor(documentiRepository: Repository<Documento>, avvocatiRepository: Repository<Avvocato>, notificationsService: NotificationsService);
    create(createDto: CreateDocumentoDto): Promise<Documento>;
    findAll(includeInactive?: boolean, studioId?: string, pagination?: PaginationOptions): Promise<Documento[]>;
    findAllForUser(user: CurrentUserData, includeInactive?: boolean, pagination?: PaginationOptions): Promise<Documento[]>;
    findByPratica(praticaId: string, includeInactive?: boolean, pagination?: PaginationOptions): Promise<Documento[]>;
    findByCartella(cartellaId: string, includeInactive?: boolean, pagination?: PaginationOptions): Promise<Documento[]>;
    findOne(id: string): Promise<Documento>;
    update(id: string, updateDto: UpdateDocumentoDto): Promise<Documento>;
    deactivate(id: string): Promise<Documento>;
    reactivate(id: string): Promise<Documento>;
    remove(id: string): Promise<void>;
    getFileStream(id: string): Promise<{
        stream: fs.ReadStream;
        documento: Documento;
    }>;
    private applyAccessFilter;
    private canAvvocatoSeeAll;
}
