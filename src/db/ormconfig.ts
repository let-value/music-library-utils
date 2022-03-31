import "reflect-metadata";
import { DataSource } from "typeorm";

const source = new DataSource({
    type: "sqlite",
    database: "storage.sqlite3",
    logging: true,
    entities: ["src/**/*.entity.ts"],
    migrationsTableName: "migrations",
    migrations: ["src/db/migrations/*.ts"],
});

export default source;
