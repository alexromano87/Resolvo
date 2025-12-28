import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { DocumentiService } from './documenti.service';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Documento } from './documento.entity';
import type { CurrentUserData } from '../auth/current-user.decorator';
import { PraticheService } from '../pratiche/pratiche.service';
import { CartelleService } from '../cartelle/cartelle.service';
export declare class DocumentiController {
    private readonly documentiService;
    private readonly praticheService;
    private readonly cartelleService;
    constructor(documentiService: DocumentiService, praticheService: PraticheService, cartelleService: CartelleService);
    uploadFile(user: CurrentUserData, file: Express.Multer.File, nome?: string, descrizione?: string, caricatoDa?: string, praticaId?: string, cartellaId?: string): Promise<Documento>;
    findAll(user: CurrentUserData, includeInactive?: string, page?: string, limit?: string): Promise<Documento[]>;
    findByPratica(user: CurrentUserData, praticaId: string, includeInactive?: string, page?: string, limit?: string): Promise<Documento[]>;
    findByCartella(user: CurrentUserData, cartellaId: string, includeInactive?: string, page?: string, limit?: string): Promise<Documento[]>;
    findOne(user: CurrentUserData, id: string): Promise<Documento>;
    downloadFile(user: CurrentUserData, id: string, res: Response): Promise<StreamableFile>;
    update(user: CurrentUserData, id: string, updateDto: UpdateDocumentoDto): Promise<Documento>;
    deactivate(user: CurrentUserData, id: string): Promise<Documento>;
    reactivate(user: CurrentUserData, id: string): Promise<Documento>;
    remove(user: CurrentUserData, id: string): Promise<void>;
    private assertDocumentoAccess;
}
