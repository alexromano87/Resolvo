import { AuthService } from './auth.service';
import type { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Cliente } from '../clienti/cliente.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../notifications/email.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>> & {
  createQueryBuilder?: jest.Mock;
};

const makeQueryBuilder = (result: any) => {
  const builder = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(result),
  };
  return builder;
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: MockRepo<User>;
  let clienteRepository: MockRepo<Cliente>;
  let jwtService: JwtService;
  let emailService: EmailService;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn((u) => u),
      save: jest.fn(async (u) => u),
      update: jest.fn(),
      increment: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    clienteRepository = {
      createQueryBuilder: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(() => 'test-token'),
    } as unknown as JwtService;
    emailService = {
      sendEmail: jest.fn(),
    } as unknown as EmailService;

    service = new AuthService(
      userRepository as Repository<User>,
      clienteRepository as Repository<Cliente>,
      jwtService,
      emailService,
    );
  });

  it('register: throws if email exists', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({ id: 'u1' });
    await expect(
      service.register({
        email: 'test@example.com',
        password: 'password123',
        nome: 'Test',
        cognome: 'User',
        ruolo: 'collaboratore',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('login: rejects invalid password', async () => {
    const hashed = await bcrypt.hash('correct-password', 10);
    const user = {
      id: 'u1',
      email: 'test@example.com',
      password: hashed,
      attivo: true,
      ruolo: 'collaboratore',
      tokenVersion: 0,
      twoFactorEnabled: false,
    } as User;

    (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      makeQueryBuilder(user),
    );

    await expect(
      service.login({ email: 'test@example.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('login: blocks when account is locked', async () => {
    const hashed = await bcrypt.hash('correct-password', 10);
    const user = {
      id: 'u1',
      email: 'locked@example.com',
      password: hashed,
      attivo: true,
      ruolo: 'collaboratore',
      tokenVersion: 0,
      twoFactorEnabled: false,
      lockoutUntil: new Date(Date.now() + 10_000),
    } as User;

    (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      makeQueryBuilder(user),
    );

    await expect(
      service.login({ email: 'locked@example.com', password: 'correct-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('login: increments failed attempts and sets lockout', async () => {
    const hashed = await bcrypt.hash('correct-password', 10);
    const user = {
      id: 'u1',
      email: 'tries@example.com',
      password: hashed,
      attivo: true,
      ruolo: 'collaboratore',
      tokenVersion: 0,
      twoFactorEnabled: false,
      failedLoginAttempts: 4,
    } as User;

    (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      makeQueryBuilder(user),
    );

    await expect(
      service.login({ email: 'tries@example.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(userRepository.update).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({
        failedLoginAttempts: 0,
        lockoutUntil: expect.any(Date),
      }),
    );
  });

  it('login: returns 2FA challenge when enabled', async () => {
    const hashed = await bcrypt.hash('secret123', 10);
    const user = {
      id: 'u2',
      email: 'twofa@example.com',
      password: hashed,
      attivo: true,
      ruolo: 'collaboratore',
      tokenVersion: 0,
      twoFactorEnabled: true,
      twoFactorChannel: 'email',
      telefono: null,
    } as User;

    (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      makeQueryBuilder(user),
    );

    const response = await service.login({
      email: 'twofa@example.com',
      password: 'secret123',
    });

    expect(response).toMatchObject({
      requiresTwoFactor: true,
      userId: 'u2',
      channel: 'email',
    });
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('requestPasswordReset: sends email for valid user', async () => {
    const hashed = await bcrypt.hash('secret123', 10);
    const user = {
      id: 'u3',
      email: 'reset@example.com',
      password: hashed,
    } as User;

    (userRepository.createQueryBuilder as jest.Mock).mockReturnValue(
      makeQueryBuilder(user),
    );

    const result = await service.requestPasswordReset('reset@example.com');

    expect(result).toEqual({ success: true });
    expect(emailService.sendEmail).toHaveBeenCalled();
  });

  it('refreshToken: rotates refresh token', async () => {
    const refreshToken = 'refresh-token-value';
    const user = {
      id: 'u4',
      email: 'refresh@example.com',
      ruolo: 'collaboratore',
      attivo: true,
      tokenVersion: 0,
      refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      refreshTokenExpiresAt: new Date(Date.now() + 60_000),
    } as User;

    (userRepository.findOne as jest.Mock).mockResolvedValue(user);

    const response = await service.refreshToken(user.id, refreshToken);

    expect(response).toHaveProperty('access_token');
    expect(response).toHaveProperty('refresh_token');
    expect(response.user).toMatchObject({
      id: user.id,
      email: user.email,
    });
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('refreshToken: revokes on invalid token', async () => {
    const refreshToken = 'wrong-token';
    const user = {
      id: 'u5',
      email: 'refresh@example.com',
      ruolo: 'collaboratore',
      attivo: true,
      tokenVersion: 2,
      refreshTokenHash: await bcrypt.hash('valid-token', 10),
      refreshTokenExpiresAt: new Date(Date.now() + 60_000),
    } as User;

    (userRepository.findOne as jest.Mock).mockResolvedValue(user);

    await expect(service.refreshToken(user.id, refreshToken)).rejects.toBeInstanceOf(UnauthorizedException);

    expect(userRepository.update).toHaveBeenCalledWith(
      user.id,
      expect.objectContaining({
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
        tokenVersion: user.tokenVersion + 1,
      }),
    );
  });
});
