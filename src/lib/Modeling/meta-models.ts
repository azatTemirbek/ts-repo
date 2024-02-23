
export interface BaseEntity {
    id?: null | string;
}

export interface Schema extends BaseEntity {
    description?: string;
    model: string;
    modelPlural: string;
    nameVariations?: NameVariations;
    props?: Prop[];
}

export interface NameVariations extends BaseEntity {
    model: string;
    modelParam?: string;
    models: string;
    modelsParam?: string;
    ref: string;
    refs: string;
    selector: string;
    selectors: string;
}

export interface Prop {
    [key: string]: unknown;
}

export interface Config extends BaseEntity {
    application: string;
    name: string;
    scope: string;
}

export interface Generator {
    generate(schema: Schema, config: unknown): {
        fileName: string;
        template: string;
        title: string;
    };
}

export enum ReturnEnums {
    boolean = 'boolean',
    date = 'date',
    number = 'number',
    string = 'string',
    void = 'void',
}

export type IReturnType = {
    optional: boolean,
    type: ReturnEnums,
}

export enum ParamsEnum {
    boolean = 'boolean',
    date = 'date',
    number = 'number',
    string = 'string',
    unknown = 'unknown',
}

export type IParamsType = {
    default?: string,
    name: string
    optional: boolean,
    type: FieldEnums,
}

export type IMethodType = {
    args: IParamsType[];
    async: boolean;
    name: string;
    private: boolean;
    returnType: IReturnType;
    static: boolean;
}

export enum FieldEnums {
    boolean = 'boolean',
    date = 'date',
    number = 'number',
    string = 'string',
}

export type IField = {
    name: string
    optional: boolean,
    private: boolean,
    readonly: boolean,
    type: FieldEnums,
    // default: string,
}
