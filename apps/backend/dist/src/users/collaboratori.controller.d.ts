import type { CurrentUserData } from '../auth/current-user.decorator';
import { UsersService } from './users.service';
import { CreateCollaboratoreDto } from './dto/create-collaboratore.dto';
import { UpdateCollaboratoreDto } from './dto/update-collaboratore.dto';
export declare class CollaboratoriController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(user: CurrentUserData, includeInactive?: boolean, page?: string, limit?: string): Promise<import("./user.entity").User[]>;
    create(user: CurrentUserData, createDto: CreateCollaboratoreDto): Promise<import("./user.entity").User>;
    update(user: CurrentUserData, id: string, updateDto: UpdateCollaboratoreDto): Promise<import("./user.entity").User>;
    deactivate(user: CurrentUserData, id: string): Promise<import("./user.entity").User>;
    reactivate(user: CurrentUserData, id: string): Promise<import("./user.entity").User>;
    remove(user: CurrentUserData, id: string): Promise<{
        success: boolean;
    }>;
}
