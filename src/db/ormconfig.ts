import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entities from "./entity";

const source = new DataSource({
    type: "sqlite",
    database: "storage.sqlite3",
    logging: true,
    entities: Array.from(Object.values(entities)),
    migrationsTableName: "migrations",
    migrations: ["src/db/migrations/*.ts"],
});

export default source;
