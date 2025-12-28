import { AvvocatiService } from './avvocati.service';
import { CreateAvvocatoDto } from './create-avvocato.dto';
import { UpdateAvvocatoDto } from './update-avvocato.dto';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class AvvocatiController {
    private readonly avvocatiService;
    constructor(avvocatiService: AvvocatiService);
    create(user: CurrentUserData, createAvvocatoDto: CreateAvvocatoDto): Promise<import("./avvocato.entity").Avvocato>;
    findAll(user: CurrentUserData, includeInactive?: boolean, page?: string, limit?: string): Promise<import("./avvocato.entity").Avvocato[]>;
    findOne(id: string): Promise<import("./avvocato.entity").Avvocato>;
    update(user: CurrentUserData, id: string, updateAvvocatoDto: UpdateAvvocatoDto): Promise<import("./avvocato.entity").Avvocato>;
    deactivate(user: CurrentUserData, id: string): Promise<import("./avvocato.entity").Avvocato>;
    reactivate(user: CurrentUserData, id: string): Promise<import("./avvocato.entity").Avvocato>;
    remove(user: CurrentUserData, id: string): Promise<void>;
}
