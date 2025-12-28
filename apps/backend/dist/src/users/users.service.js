"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = __importStar(require("bcrypt"));
const pagination_1 = require("../common/pagination");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll(filters, pagination) {
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.studio', 'studio')
            .orderBy('user.createdAt', 'DESC');
        if (filters) {
            if (filters.studioId !== undefined) {
                query.andWhere('user.studioId = :studioId', { studioId: filters.studioId });
            }
            if (filters.ruolo) {
                query.andWhere('user.ruolo = :ruolo', { ruolo: filters.ruolo });
            }
            if (filters.attivo !== undefined) {
                query.andWhere('user.attivo = :attivo', { attivo: filters.attivo });
            }
        }
        const page = (0, pagination_1.normalizePagination)(pagination?.page, pagination?.limit);
        if (page) {
            query.skip(page.skip).take(page.take);
        }
        const users = await query.getMany();
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utente non trovato');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async create(createUserDto) {
        if (!createUserDto.email) {
            throw new common_1.ConflictException('Email è obbligatoria');
        }
        if (createUserDto.ruolo === 'titolare_studio' && !createUserDto.studioId) {
            throw new common_1.ConflictException('Studio obbligatorio per il titolare');
        }
        const normalizedEmail = createUserDto.email.toLowerCase().trim();
        const existingUser = await this.userRepository.findOne({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email già registrata');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            email: normalizedEmail,
            password: hashedPassword,
        });
        const savedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utente non trovato');
        }
        if (updateUserDto.ruolo === 'titolare_studio' && !updateUserDto.studioId) {
            throw new common_1.ConflictException('Studio obbligatorio per il titolare');
        }
        if (updateUserDto.email) {
            const normalizedEmail = updateUserDto.email.toLowerCase().trim();
            if (normalizedEmail !== user.email) {
                const existingUser = await this.userRepository.findOne({
                    where: { email: normalizedEmail },
                });
                if (existingUser) {
                    throw new common_1.ConflictException('Email già in uso');
                }
            }
            updateUserDto.email = normalizedEmail;
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        const updatedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async remove(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utente non trovato');
        }
        await this.userRepository.remove(user);
    }
    async toggleActive(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utente non trovato');
        }
        user.attivo = !user.attivo;
        const updatedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async resetPassword(id, newPassword) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Utente non trovato');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        const updatedUser = await this.userRepository.save(user);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map