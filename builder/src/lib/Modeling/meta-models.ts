
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

export enum FieldType {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    date = 'date',
}

export type IField = {
    name: string
    type: FieldType,
    readonly: boolean,
    private: boolean,
    optional: boolean,
    // default: string,
}
