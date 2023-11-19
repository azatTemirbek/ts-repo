
export interface IUpdateRepository<Model> {
    update(model: Model): Promise<boolean>;
}
