import { DataSourceOptions } from 'typeorm';

export function getConfig() {
    return {
        type: 'better-sqlite3',
        database: '/data/monzodash.db',
        synchronize: false,
        migrations: [__dirname + '/../../migrations/*.{ts,js}'],
        entities: [__dirname + '/../**/schemas/*.schema.{ts,js}'],
    } as DataSourceOptions
}