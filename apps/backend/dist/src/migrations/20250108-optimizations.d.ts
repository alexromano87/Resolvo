import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class Optimizations20250108 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
