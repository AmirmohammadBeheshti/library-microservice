import { Pagination } from '../database/repository.type';

export abstract class BaseSerializer<TEntity, TDto> {
  public abstract serialize(value: TEntity, outputType?: string): Promise<TDto>;

  public abstract serializePaginated(
    value: Pagination<TEntity>,
    outputType?: string,
  ): Promise<Pagination<TDto>>;

  public serializeCollection(
    values: TEntity[],
    outputType?: string,
  ): Promise<TDto[]> {
    return Promise.all<TDto>(
      values.map((v) => {
        return this.serialize(v, outputType);
      }),
    );
  }
}
