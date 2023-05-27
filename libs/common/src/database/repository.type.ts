import { IPaginationMeta } from './repository.interface';

export class Pagination<T> {
  constructor(
    public readonly items: T[],
    public readonly meta: IPaginationMeta,
  ) {}
}

export interface IErrMsgRepository {
  duplicateErr: string;
  notFoundError: string;
}
