"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const zod_1 = require("zod");
const databaseConfigSchema = zod_1.z.object({
    host: zod_1.z.string().min(1).default('localhost'),
    port: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().min(1).max(65535))
        .default('3306'),
    username: zod_1.z.string().min(1).default('mockmaster'),
    password: zod_1.z.string().min(1).default('mockmaster'),
    database: zod_1.z.string().min(1).default('mockmaster'),
    testDatabase: zod_1.z.string().min(1).default('mockmaster_test'),
});
const databaseConfig = () => {
    return databaseConfigSchema.parse({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        testDatabase: process.env.DB_TEST_NAME,
    });
};
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map