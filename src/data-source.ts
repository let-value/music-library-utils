import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Track } from './entity/Track';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: true,
    entities: [Track],
});
