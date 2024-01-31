import { DatabaseExtension, extName } from '@app/domain/repositories/database.repository';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

const url = process.env.DB_URL;
const urlOrParts = url
  ? { url }
  : {
      host: process.env.DB_HOSTNAME || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE_NAME || 'immich',
    };

export const databaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  entities: [__dirname + '/entities/*.entity.{js,ts}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  subscribers: [__dirname + '/subscribers/*.{js,ts}'],
  migrationsRun: false,
  connectTimeoutMS: 10000, // 10 seconds
  parseInt8: true,
  ...urlOrParts,
};

// this export is used by TypeORM commands in package.json#scripts
export const dataSource = new DataSource(databaseConfig);

const vectorEnv = process.env.IMMICH_VECTOR_EXTENSION?.trim().toLowerCase();
if (vectorEnv && !['pgvector', 'pgvecto.rs'].includes(vectorEnv)) {
  throw new Error(`IMMICH_VECTOR_EXTENSION must be one of ${Object.values(extName).join(', ')}`);
}

export const vectorExt = vectorEnv === 'pgvector' ? DatabaseExtension.VECTOR : DatabaseExtension.VECTORS;
