import {
  BadRequestException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import {
  AggregateOptions,
  Document,
  FilterQuery,
  InsertManyOptions,
  Model,
  PipelineStage,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { UpdatedModel } from './repository.entity';
import { IPaginationOptions } from './repository.interface';
import { IErrMsgRepository, Pagination } from './repository.type';

export abstract class BaseMongooseRepository<TEntity extends Document> {
  constructor(
    private readonly model: Model<TEntity>,
    private readonly errMsg: IErrMsgRepository = {
      duplicateErr: 'یکی از مقادیر تکراری است',
      notFoundError: 'کاربر مورد نظر یافت نشد',
    },
  ) {}

  protected handleCreateAndUpdateError(error) {
    console.log('DB Error:', error);

    if (error.name === 'ValidationError') {
      const errorObj = [];
      Object.keys(error.errors).forEach((item) => {
        errorObj.push(error.errors[item].message);
      });
      throw new NotAcceptableException(errorObj);
    }
    switch (error.code) {
      case 11000:
        throw new BadRequestException(
          error.message || this.errMsg.duplicateErr,
        );

      default:
        throw new BadRequestException('عملیات با خطا مواجه شد');
    }
  }

  async create(data: unknown, saveOptions?: SaveOptions): Promise<TEntity> {
    if (!data) {
      throw new Error(`${this.model.name} is empty!`);
    }
    try {
      return await new this.model(data).save(saveOptions);
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  async insertMany(data: unknown[], saveOptions?: InsertManyOptions) {
    if (!data) {
      throw new Error(`${this.model.name} is empty!`);
    }
    try {
      return await this.model.insertMany(data, saveOptions);
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  async find(
    filter: FilterQuery<TEntity>,
    projection?: Record<string, number>,
    options?: QueryOptions,
  ): Promise<TEntity[]> {
    let newProjection: Record<string, number> = { ...projection, __v: 0 };
    for (const key in projection) {
      if (projection[key] === 1) {
        newProjection = projection;
        break;
      }
    }

    return this.model
      .find(filter, newProjection, {
        sort: { createdAt: -1 },
        ...options,
        strictQuery: false,
      })
      .exec();
  }

  async findOne(
    filter: FilterQuery<TEntity>,
    projection?: Record<string, number>,
    options?: QueryOptions,
  ): Promise<TEntity> {
    let newProjection: Record<string, number> = { ...projection, __v: 0 };
    for (const key in projection) {
      if (projection[key] === 1) {
        newProjection = projection;
        break;
      }
    }

    return this.model
      .findOne(filter, newProjection, {
        sort: { createdAt: -1 },
        ...options,
        strictQuery: false,
      })
      .exec();
  }
  async findOneOrFailed(
    filter: FilterQuery<TEntity>,
    projection?: Record<string, number>,
    options?: QueryOptions,
  ): Promise<TEntity> {
    const entity = await this.findOne(filter, projection, options);
    if (!entity)
      throw new NotFoundException(this.errMsg.notFoundError ?? 'یافت نشد');

    return entity;
  }

  async findById(id: string): Promise<TEntity | null> {
    return this.model.findById(id).exec();
  }

  async findAll(): Promise<TEntity[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async remove(filter: FilterQuery<TEntity>): Promise<boolean> {
    const { deletedCount } = await this.model.deleteMany(filter, {
      strictQuery: false,
    });
    return !!deletedCount;
  }

  async findOneAndUpdate(
    filter: FilterQuery<TEntity>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<TEntity>,
    options?: QueryOptions,
  ): Promise<any> {
    try {
      return await this.model
        .findOneAndUpdate(filter, updated, {
          ...options,
          new: true,
          runValidators: true,
          context: 'query',
        })
        .exec();
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  async count(filter: FilterQuery<TEntity>) {
    try {
      return this.model.count(filter).exec();
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  async aggregate(
    pipeline: PipelineStage[],
    options?: AggregateOptions,
    sortByCreateDate = true,
  ): Promise<any[]> {
    return await this.model.aggregate(
      sortByCreateDate ? [{ $sort: { createdAt: -1 } }, ...pipeline] : pipeline,
      options,
    );
  }

  async findAndPaginate(
    paginationOptions: IPaginationOptions = {},
    filter?: FilterQuery<TEntity>,
    projection?: Record<string, number>,
    options?: QueryOptions,
  ): Promise<Pagination<TEntity>> {
    const { page = 1, take } = paginationOptions;
    if (page < 1) {
      return this.createPaginationObject([], 0, page, take);
    }
    const offset = take * (page - 1);
    const skip = Number.isFinite(offset) ? offset : undefined;
    const totalCount: number = await this.count(filter);

    const items = await this.find(filter, projection, {
      ...options,
      strictQuery: false,
      skip: skip,
      limit: take,
    });

    return this.createPaginationObject(items, totalCount, page, take);
  }

  async aggregateAndPaginate<TAggregation>(
    paginationOptions: IPaginationOptions = {},
    pipeline: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<Pagination<TAggregation>> {
    const { page = 1, take = 50 } = paginationOptions;
    if (page < 1) {
      return this.createPaginationObjectAggregation([], 0, page, take);
    }
    const offset = take * (page - 1);
    const skip = Number.isFinite(offset) ? offset : undefined;
    const totalCount: number = await this.countAggregate(pipeline);

    const newPipeline: PipelineStage[] = [
      { $sort: { createdAt: -1 } },
      ...pipeline,
      { $skip: skip },
      { $limit: take },
    ];
    const items = await this.model.aggregate(newPipeline, options);

    return this.createPaginationObjectAggregation(
      items,
      totalCount,
      page,
      take,
    );
  }

  async countAggregate(
    pipeline?: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<number> {
    try {
      const newPipeline = [
        ...pipeline,
        { $group: { _id: 'count', count: { $sum: 1 } } },
      ];

      return (await this.model.aggregate(newPipeline, options))[0]?.count;
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  async updateOne(
    filter: FilterQuery<TEntity>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<unknown>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    try {
      const a = await this.model
        .updateOne(filter, updated, {
          ...options,
          new: true,
          // runValidators: true,
        })
        .exec();
      return a;
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  async updateMany(
    filter: FilterQuery<TEntity>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<unknown>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    try {
      return await this.model
        .updateMany(filter, updated, {
          ...options,
          new: true,
          // runValidators: true,
        })
        .exec();
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  private createPaginationObjectAggregation(
    items: any[],
    totalItems: number,
    currentPage: number,
    take: number,
  ) {
    try {
      const totalPages = Math.ceil(totalItems / take);
      return new Pagination(items, {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: totalPages,
        currentPage: currentPage,
      });
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  private createPaginationObject(
    items: TEntity[],
    totalItems: number,
    currentPage: number,
    take: number,
  ) {
    try {
      const totalPages = Math.ceil(totalItems / take);
      return new Pagination(items, {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: totalPages,
        currentPage: currentPage,
      });
    } catch (error) {
      this.handleCreateAndUpdateError(error);
    }
  }

  async updateOneOrFailed(
    filter: FilterQuery<TEntity>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<TEntity>,
    options?: QueryOptions,
  ): Promise<UpdatedModel> {
    const entity = await this.model
      .updateOne(filter, updated, {
        ...options,
        new: true,
        // runValidators: true,
      })
      .exec();
    if (!entity.modifiedCount)
      throw new NotFoundException(this.errMsg.notFoundError ?? 'یافت نشد');
    return entity;
  }

  async findOneAndUpdateOrFailed(
    filter: FilterQuery<TEntity>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<TEntity>,
    options?: QueryOptions,
  ): Promise<TEntity> {
    const entity = await this.findOneAndUpdate(filter, updated, options);
    if (!entity)
      throw new NotFoundException(this.errMsg.notFoundError ?? 'یافت نشد');
    return entity;
  }

  async removeOrFailed(filter: FilterQuery<TEntity>): Promise<boolean> {
    const deletedItem = await this.remove(filter);
    if (!deletedItem)
      throw new NotFoundException(this.errMsg.notFoundError ?? 'یافت نشد');
    return deletedItem;
  }

  async findOneAndRemoveOrFailed(
    filter: FilterQuery<TEntity>,
    options?: QueryOptions,
  ): Promise<TEntity> {
    const deletedItem = await this.model.findOneAndRemove(filter, {
      ...options,
      new: true,
    });
    if (!deletedItem)
      throw new NotFoundException(this.errMsg.notFoundError ?? 'یافت نشد');
    return deletedItem;
  }
}
