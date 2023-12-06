
export interface BaseEntity {
    id?: string | null;
}

export interface Schema extends BaseEntity {
    model: string;
    modelPlural: string;
    description?: string;
    nameVariations?: NameVariations;
    props?: Prop[];
}

export interface NameVariations extends BaseEntity {
    ref: string;
    refs: string;
    model: string;
    models: string;
    selector: string;
    selectors: string;
    modelParam?: string;
    modelsParam?: string;
}

export interface Prop {
    [key: string]: unknown;
}

export interface Config extends BaseEntity {
    name: string;
    application: string;
    scope: string;
}

export interface Generator {
    generate(schema: Schema, config: unknown): {
        template: string;
        fileName: string;
        title: string;
    };
}

export enum ReturnEnums {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    date = 'date',
    void = 'void',
}

export type IReturnType = {
    type: ReturnEnums,
    optional: boolean,
}

export enum ParamsEnum {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    date = 'date',
    unknown = 'unknown',
}

export type IParamsType = {
    name: string
    type: FieldEnums,
    optional: boolean,
    default?: string,
}

export type IMethodType = {
    name: string;
    private: boolean;
    static: boolean;
    returnType: IReturnType;
    async: boolean;
    args: IParamsType[];
}

export enum FieldEnums {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    date = 'date',
}

export type IField = {
    name: string
    type: FieldEnums,
    readonly: boolean,
    private: boolean,
    optional: boolean,
    // default: string,
}
