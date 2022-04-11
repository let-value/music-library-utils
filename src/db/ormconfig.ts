import "reflect-metadata";
import { DataSource } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

export const options: SqliteConnectionOptions = {
    type: "sqlite",
    database: "storage.sqlite3",
    logging: "all",
    logger: "file",
    entities: [__dirname + "/entity/**/*"],
    migrationsTableName: "migrations",
    migrations: [__dirname + "/migrations/**/*"],
    migrationsRun: true,
    cache: true,
};

const baseDataSource = new DataSource(options);

export default baseDataSource;
