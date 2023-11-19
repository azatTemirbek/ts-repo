
export interface IDeleteRepository<Model> {
    deleteById(id: string): Promise<boolean>;
    delete(model: Model): Promise<boolean>;
}
