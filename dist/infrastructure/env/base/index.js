"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = exports.httpConfig = exports.authConfig = exports.observabilityConfig = exports.databaseConfig = exports.appConfig = exports.env = exports.loadEnvironmentConfig = void 0;
const app_config_1 = require("./app.config");
const database_config_1 = require("./database.config");
const observability_config_1 = require("./observability.config");
const auth_config_1 = require("./auth.config");
const http_config_1 = require("./http.config");
const api_config_1 = require("./api.config");
const loadEnvironmentConfig = () => {
    try {
        return {
            app: (0, app_config_1.appConfig)(),
            database: (0, database_config_1.databaseConfig)(),
            observability: (0, observability_config_1.observabilityConfig)(),
            auth: (0, auth_config_1.authConfig)(),
            http: (0, http_config_1.httpConfig)(),
            api: (0, api_config_1.apiConfig)(),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Environment configuration validation failed: ${error.message}\n` +
                `Run 'npm run env:validate' to check your environment configuration.`);
        }
        throw error;
    }
};
exports.loadEnvironmentConfig = loadEnvironmentConfig;
exports.env = (0, exports.loadEnvironmentConfig)();
var app_config_2 = require("./app.config");
Object.defineProperty(exports, "appConfig", { enumerable: true, get: function () { return app_config_2.appConfig; } });
var database_config_2 = require("./database.config");
Object.defineProperty(exports, "databaseConfig", { enumerable: true, get: function () { return database_config_2.databaseConfig; } });
var observability_config_2 = require("./observability.config");
Object.defineProperty(exports, "observabilityConfig", { enumerable: true, get: function () { return observability_config_2.observabilityConfig; } });
var auth_config_2 = require("./auth.config");
Object.defineProperty(exports, "authConfig", { enumerable: true, get: function () { return auth_config_2.authConfig; } });
var http_config_2 = require("./http.config");
Object.defineProperty(exports, "httpConfig", { enumerable: true, get: function () { return http_config_2.httpConfig; } });
var api_config_2 = require("./api.config");
Object.defineProperty(exports, "apiConfig", { enumerable: true, get: function () { return api_config_2.apiConfig; } });
//# sourceMappingURL=index.js.map