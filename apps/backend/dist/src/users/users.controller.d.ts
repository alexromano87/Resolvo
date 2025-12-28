import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(studioId?: string, ruolo?: string, attivo?: string, page?: string, limit?: string): Promise<import("./user.entity").User[]>;
    findOne(id: string): Promise<import("./user.entity").User>;
    create(createUserDto: CreateUserDto): Promise<import("./user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./user.entity").User>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<import("./user.entity").User>;
    resetPassword(id: string, body: {
        newPassword: string;
    }): Promise<import("./user.entity").User>;
}
