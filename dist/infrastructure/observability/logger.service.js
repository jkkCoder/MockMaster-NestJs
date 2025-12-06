"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerService = void 0;
const common_1 = require("@nestjs/common");
const observability_config_1 = require("../env/base/observability.config");
let AppLoggerService = class AppLoggerService {
    constructor() {
        this.config = (0, observability_config_1.observabilityConfig)();
        this.isProduction = process.env.NODE_ENV === 'production';
    }
    log(message, context, metadata) {
        this.writeLog('info', message, context, metadata);
    }
    error(message, trace, context, metadata) {
        this.writeLog('error', message, context, { ...metadata, trace });
    }
    warn(message, context, metadata) {
        this.writeLog('warn', message, context, metadata);
    }
    debug(message, context, metadata) {
        this.writeLog('debug', message, context, metadata);
    }
    verbose(message, context, metadata) {
        this.writeLog('verbose', message, context, metadata);
    }
    logWithContext(level, message, context, serviceContext) {
        this.writeLog(level, message, serviceContext, context);
    }
    writeLog(level, message, context, metadata) {
        if (!this.shouldLog(level)) {
            return;
        }
        const timestamp = new Date().toISOString();
        const logContext = typeof context === 'string' ? context : undefined;
        const logMetadata = typeof context === 'object' ? context : metadata || {};
        if (this.isProduction) {
            const logEntry = {
                timestamp,
                level: level.toUpperCase(),
                message,
                ...(logContext && { context: logContext }),
                ...logMetadata,
                service: this.config.serviceName,
                version: this.config.serviceVersion,
            };
            console.log(JSON.stringify(logEntry));
        }
        else {
            const contextStr = logContext ? `[${logContext}]` : '';
            const metadataStr = Object.keys(logMetadata).length > 0
                ? ` ${JSON.stringify(logMetadata)}`
                : '';
            const levelEmoji = this.getLevelEmoji(level);
            console.log(`${levelEmoji} [${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}${metadataStr}`);
        }
    }
    shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug', 'verbose'];
        const currentLevelIndex = levels.indexOf(this.config.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }
    getLevelEmoji(level) {
        const emojis = {
            error: '❌',
            warn: '⚠️',
            info: 'ℹ️',
            debug: '🔍',
            verbose: '📝',
        };
        return emojis[level] || 'ℹ️';
    }
};
exports.AppLoggerService = AppLoggerService;
exports.AppLoggerService = AppLoggerService = __decorate([
    (0, common_1.Injectable)()
], AppLoggerService);
//# sourceMappingURL=logger.service.js.map