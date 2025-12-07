import { BaseEntity } from '../../shared/entities/base.entity';
export declare class User extends BaseEntity {
    readonly username: string;
    private hashedPassword;
    readonly fullName: string;
    readonly mail: string;
    readonly createdAt: Date;
    private constructor();
    static create(username: string, fullName: string, mail: string, passwordHash: string): User;
    static reconstitute(id: string, username: string, hashedPassword: string, fullName: string, mail: string, createdAt: Date): User;
    getPasswordHash(): string;
    updatePassword(newPasswordHash: string): void;
}
