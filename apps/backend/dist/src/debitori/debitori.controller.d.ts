import { DebitoriService } from './debitori.service';
import { CreateDebitoreDto } from './dto/create-debitore.dto';
import { UpdateDebitoreDto } from './dto/update-debitore.dto';
import { ClientiDebitoriService } from '../relazioni/clienti-debitori.service';
import type { CurrentUserData } from '../auth/current-user.decorator';
export declare class DebitoriController {
    private readonly debitoriService;
    private readonly clientiDebitoriService;
    constructor(debitoriService: DebitoriService, clientiDebitoriService: ClientiDebitoriService);
    findAll(user: CurrentUserData, includeInactive?: string, withClientiCount?: string, page?: string, limit?: string): Promise<import("./debitore.entity").Debitore[]>;
    findOne(user: CurrentUserData, id: string): Promise<import("./debitore.entity").Debitore>;
    getClientiForDebitore(user: CurrentUserData, id: string): Promise<{
        clientiIds: string[];
    }>;
    getPraticheCount(user: CurrentUserData, id: string): Promise<{
        count: number;
    }>;
    create(user: CurrentUserData, dto: CreateDebitoreDto): Promise<import("./debitore.entity").Debitore>;
    update(user: CurrentUserData, id: string, dto: UpdateDebitoreDto): Promise<import("./debitore.entity").Debitore>;
    deactivate(user: CurrentUserData, id: string): Promise<import("./debitore.entity").Debitore>;
    reactivate(user: CurrentUserData, id: string): Promise<import("./debitore.entity").Debitore>;
    remove(user: CurrentUserData, id: string): Promise<void>;
}
