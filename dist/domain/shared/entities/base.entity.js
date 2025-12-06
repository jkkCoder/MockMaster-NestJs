"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const uuid_1 = require("uuid");
class BaseEntity {
    constructor(id = (0, uuid_1.v4)()) {
        this.id = id;
    }
    equals(other) {
        return this.id === other.id;
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base.entity.js.map