
export interface IReadRepository<Model> {
    findById(id: string): Promise<Model | null>;
    findAll(where: never): Promise<Model[]>;
}
