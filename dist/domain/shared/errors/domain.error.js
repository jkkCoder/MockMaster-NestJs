"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOperationError = exports.EntityNotFoundError = exports.DomainError = void 0;
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainError = DomainError;
class EntityNotFoundError extends DomainError {
    constructor(entityName, id) {
        super(`${entityName} with id ${id} not found`);
    }
}
exports.EntityNotFoundError = EntityNotFoundError;
class InvalidOperationError extends DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidOperationError = InvalidOperationError;
//# sourceMappingURL=domain.error.js.map