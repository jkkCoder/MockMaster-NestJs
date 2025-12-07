import { User } from '@domain/user/entities/user.entity';
export interface UserRepositoryPort {
    save(user: User): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
export declare const USER_REPOSITORY_PORT: unique symbol;
