export interface PasswordHasherPort {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

// Token for dependency injection
export const PASSWORD_HASHER_PORT = Symbol('PasswordHasherPort');
