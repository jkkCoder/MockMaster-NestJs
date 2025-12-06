export declare abstract class DomainError extends Error {
    constructor(message: string);
}
export declare class EntityNotFoundError extends DomainError {
    constructor(entityName: string, id: string);
}
export declare class InvalidOperationError extends DomainError {
    constructor(message: string);
}
