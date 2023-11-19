import { ICreateRepository } from './ICreateRepository';
import { IDeleteRepository } from './IDeleteRepository';
import { IReadRepository } from './IReadRepository';
import { IUpdateRepository } from './IUpdateRepository';

export interface ICrudRepository<Model> extends IReadRepository<Model>, ICreateRepository<Model>, IUpdateRepository<Model>, IDeleteRepository<Model> {}
