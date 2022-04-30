import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export default (): MikroOrmModuleOptions => ({
  type: 'postgresql',
  driver: PostgreSqlDriver,
  dbName: process.env.POSTGRES_DB_NAME || 'nestjs_boilerplate',
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  autoLoadEntities: true,
  forceUtcTimezone: true,
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    transactional: true,
    allOrNothing: true,
    dropTables: false,
    disableForeignKeys: false,
    safe: false,
    emit: 'ts',
  },
});
