import { Repository } from 'typeorm';
import { User } from './user.entity';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { type PaginationOptions } from '../common/pagination';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(filters?: {
        studioId?: string;
        ruolo?: string;
        attivo?: boolean;
    }, pagination?: PaginationOptions): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<User>;
    resetPassword(id: string, newPassword: string): Promise<User>;
}
