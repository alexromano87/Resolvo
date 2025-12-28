import { Repository } from 'typeorm';
import { Avvocato } from './avvocato.entity';
import { CreateAvvocatoDto } from './create-avvocato.dto';
import { UpdateAvvocatoDto } from './update-avvocato.dto';
import { type PaginationOptions } from '../common/pagination';
export declare class AvvocatiService {
    private avvocatiRepository;
    constructor(avvocatiRepository: Repository<Avvocato>);
    create(createAvvocatoDto: CreateAvvocatoDto): Promise<Avvocato>;
    findAll(includeInactive?: boolean, studioId?: string, pagination?: PaginationOptions): Promise<Avvocato[]>;
    findOne(id: string): Promise<Avvocato>;
    update(id: string, updateAvvocatoDto: UpdateAvvocatoDto): Promise<Avvocato>;
    deactivate(id: string): Promise<Avvocato>;
    reactivate(id: string): Promise<Avvocato>;
    remove(id: string): Promise<void>;
}
