import { MigrationInterface, QueryRunner } from 'typeorm';

export class Optimizations20250108 implements MigrationInterface {
  name = 'Optimizations20250108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_praticaId ON tickets (praticaId);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_documenti_praticaId ON documenti (praticaId);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_alerts_praticaId ON alerts (praticaId);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_movimenti_praticaId ON movimenti_finanziari (praticaId);
    `);

    await queryRunner.query(`
      ALTER TABLE movimenti_finanziari
      PARTITION BY RANGE (YEAR(data)) (
        PARTITION p_before_2023 VALUES LESS THAN (2023),
        PARTITION p_2023 VALUES LESS THAN (2024),
        PARTITION p_2024 VALUES LESS THAN (2025),
        PARTITION p_future VALUES LESS THAN MAXVALUE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tickets_praticaId ON tickets;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_documenti_praticaId ON documenti;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_alerts_praticaId ON alerts;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_movimenti_praticaId ON movimenti_finanziari;`);
    await queryRunner.query(`ALTER TABLE movimenti_finanziari REMOVE PARTITIONING;`);
  }
}
