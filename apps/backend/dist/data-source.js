"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_USE_SQLITE === 'true' ? 'sqlite' : 'mysql',
    database: process.env.DB_USE_SQLITE === 'true' ? ':memory:' : process.env.DB_DATABASE || 'recupero_crediti',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3307),
    username: process.env.DB_USERNAME || 'rc_user',
    password: process.env.DB_PASSWORD || 'rc_pass',
    entities: [`${__dirname}/src/**/*.entity{.ts,.js}`],
    migrationsTableName: 'typeorm_migrations',
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
});
exports.default = exports.AppDataSource;
//# sourceMappingURL=data-source.js.map