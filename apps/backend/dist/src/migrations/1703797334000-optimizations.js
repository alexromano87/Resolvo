"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimizations1703797334000 = void 0;
class Optimizations1703797334000 {
    async up(queryRunner) {
        const hasPartitions = await queryRunner.query(`
      SELECT COUNT(*) as count
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'recupero_crediti'
      AND TABLE_NAME = 'movimenti_finanziari'
      AND PARTITION_NAME IS NOT NULL
    `);
        if (hasPartitions[0].count === 0) {
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
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE movimenti_finanziari REMOVE PARTITIONING;`);
    }
}
exports.Optimizations1703797334000 = Optimizations1703797334000;
//# sourceMappingURL=1703797334000-optimizations.js.map