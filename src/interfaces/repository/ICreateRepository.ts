
export interface ICreateRepository<Model> {
    save(logbook: Model): Promise<boolean>;
}
