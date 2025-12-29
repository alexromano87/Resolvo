"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const isProd = process.env.NODE_ENV === 'production';
const AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_USE_SQLITE === 'true' ? 'sqlite' : 'mysql',
    database: process.env.DB_USE_SQLITE === 'true' ? ':memory:' : process.env.DB_DATABASE || 'recupero_crediti',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3307),
    username: process.env.DB_USERNAME || 'rc_user',
    password: process.env.DB_PASSWORD || 'rc_pass',
    entities: isProd ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
    migrationsTableName: 'typeorm_migrations',
    migrations: isProd ? ['dist/src/migrations/*.js'] : ['src/migrations/*.ts'],
    extra: process.env.DB_USE_SQLITE === 'true'
        ? {}
        : {
            multipleStatements: true,
        },
    synchronize: false,
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map