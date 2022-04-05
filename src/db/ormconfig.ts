import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

export const options: DataSourceOptions = {
    type: "sqlite",
    database: "storage.sqlite3",
    logging: "all",
    entities: [__dirname + "/entity/**/*"],
    migrationsTableName: "migrations",
    migrations: [__dirname + "/migrations/**/*"],
    migrationsRun: true,
};

const dataSource = new DataSource(options);

export default dataSource;
