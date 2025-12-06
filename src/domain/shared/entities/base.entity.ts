import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
  protected constructor(public readonly id: string = uuidv4()) {}

  equals(other: BaseEntity): boolean {
    return this.id === other.id;
  }
}

