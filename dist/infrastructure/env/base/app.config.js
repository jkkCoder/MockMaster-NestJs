"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const zod_1 = require("zod");
const appConfigSchema = zod_1.z.object({
    port: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().min(1).max(65535))
        .default('3000'),
    nodeEnv: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
});
const appConfig = () => {
    return appConfigSchema.parse({
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV,
    });
};
exports.appConfig = appConfig;
//# sourceMappingURL=app.config.js.map