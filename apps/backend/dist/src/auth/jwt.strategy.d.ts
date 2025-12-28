import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Cliente } from '../clienti/cliente.entity';
export interface JwtPayload {
    sub: string;
    email: string;
    ruolo: string;
    tokenVersion: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    private clienteRepository;
    private configService;
    constructor(userRepository: Repository<User>, clienteRepository: Repository<Cliente>, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        nome: string;
        cognome: string;
        ruolo: import("../users/user.entity").UserRole;
        clienteId: string | null;
        studioId: string | null;
    }>;
}
export {};
