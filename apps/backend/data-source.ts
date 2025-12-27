import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DB_USE_SQLITE === 'true' ? 'sqlite' : 'mysql',
  database: process.env.DB_USE_SQLITE === 'true' ? ':memory:' : process.env.DB_DATABASE || 'recupero_crediti',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3307),
  username: process.env.DB_USERNAME || 'rc_user',
  password: process.env.DB_PASSWORD || 'rc_pass',
  autoLoadEntities: true,
  migrationsTableName: 'typeorm_migrations',
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
