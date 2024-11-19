import { DataSourceOptions, DataSource } from 'typeorm';

export function getConfig() {
  return {
    type: 'better-sqlite3',
    database: 'monzodash.db',
    synchronize: false,
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
  } as DataSourceOptions;
}

const datasource = new DataSource(getConfig());
datasource.initialize();
export default datasource;
