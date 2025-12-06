export declare abstract class BaseEntity {
    readonly id: string;
    protected constructor(id?: string);
    equals(other: BaseEntity): boolean;
}
