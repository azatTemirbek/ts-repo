
export interface ICreateRepository<Model> {
    save(model: Model): Promise<boolean>;
}
