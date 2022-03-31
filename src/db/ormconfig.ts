import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import * as entities from "./entity";

export const options: DataSourceOptions = {
    type: "sqlite",
    database: "storage.sqlite3",
    logging: "all",
    entities: Array.from(Object.values(entities)),
    migrationsTableName: "migrations",
    migrations: [__dirname + "/migrations/*"],
};

const dataSource = new DataSource(options);

export default dataSource;
