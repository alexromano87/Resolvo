// apps/backend/src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Studio } from '../studi/studio.entity';

export type UserRole =
  | 'admin'
  | 'titolare_studio'
  | 'avvocato'
  | 'collaboratore'
  | 'segreteria'
  | 'cliente';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string; // Hash bcrypt

  @Column()
  nome: string;

  @Column()
  cognome: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono: string | null;

  @Column({
    type: 'enum',
    enum: ['admin', 'titolare_studio', 'avvocato', 'collaboratore', 'segreteria', 'cliente'],
    default: 'collaboratore',
  })
  ruolo: UserRole;

  @Column({ type: 'uuid', nullable: true })
  clienteId: string | null; // Per utenti di tipo 'cliente'

  @Column({ type: 'uuid', nullable: true })
  studioId: string | null; // Studio di appartenenza (null per admin e clienti)

  @Column({ default: true })
  attivo: boolean;

  @Column({ type: 'int', default: 0 })
  tokenVersion: number;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  twoFactorChannel: string | null;

  @Column({ type: 'varchar', length: 12, nullable: true })
  twoFactorCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  twoFactorCodeExpires: Date | null;

  @Column({ type: 'varchar', length: 12, nullable: true })
  twoFactorCodePurpose: string | null;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockoutUntil: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHash: string | null;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt: Date | null;

  @Column({ type: 'json', nullable: true })
  settings: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  // Relazioni
  @ManyToOne(() => Studio, (studio) => studio.users, { nullable: true })
  @JoinColumn({ name: 'studioId' })
  studio: Studio | null;
}
