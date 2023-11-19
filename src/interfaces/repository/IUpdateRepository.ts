
export interface IUpdateRepository<Model> {
    update(logbook: Model): Promise<boolean>;
}
