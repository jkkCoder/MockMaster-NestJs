"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const base_entity_1 = require("../../shared/entities/base.entity");
class User extends base_entity_1.BaseEntity {
    constructor(id, username, hashedPassword, fullName, mail, createdAt) {
        super(id);
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.fullName = fullName;
        this.mail = mail;
        this.createdAt = createdAt;
    }
    static create(username, fullName, mail, passwordHash) {
        const now = new Date();
        return new User('', username, passwordHash, fullName, mail, now);
    }
    static reconstitute(id, username, hashedPassword, fullName, mail, createdAt) {
        return new User(id, username, hashedPassword, fullName, mail, createdAt);
    }
    getPasswordHash() {
        return this.hashedPassword;
    }
    updatePassword(newPasswordHash) {
        this.hashedPassword = newPasswordHash;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map