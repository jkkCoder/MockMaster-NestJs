export interface PasswordHasherPort {
  hash(password: string, userName?: string): Promise<string>;
  verify(password: string, hash: string, userName?: string): Promise<boolean>;
}

// Token for dependency injection
export const PASSWORD_HASHER_PORT = Symbol('PasswordHasherPort');
