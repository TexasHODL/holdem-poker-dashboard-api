import { Injectable } from '@nestjs/common';
import {
  Document,
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

// @Injectable()
export class CrudService<T = Document> {
  constructor(protected model: Model<T>) {}

  create(dto: any) {
    return this.model.create(dto);
  }

  findAll(
    query?: FilterQuery<any>,
    options?: QueryOptions<any>,
    projection?: ProjectionType<any> | null,
  ) {
    return this.model.find(query, projection, options);
  }

  findById(id: any) {
    return this.model.findById(id).exec();
  }

  findOne(
    query?: FilterQuery<any>,
    projection?: ProjectionType<any> | null,
    options?: QueryOptions<any> | null,
  ) {
    return this.model.findOne(query, projection, options);
  }

  update(id: any, updateQuery: UpdateQuery<any>) {
    return this.model.findByIdAndUpdate(id, updateQuery).exec();
  }

  updateOne(query: FilterQuery<any>, updateQuery: UpdateQuery<any>) {
    return this.model.findOneAndUpdate(query, updateQuery).exec();
  }

  remove(id: any) {
    return this.model.findByIdAndRemove(id).exec();
  }

  count(query?: FilterQuery<any>) {
    return this.model.count(query).exec();
  }

  aggregate(agg: PipelineStage[]) {
    return this.model.aggregate(agg);
  }

  updatePassbok (query: FilterQuery<any>, updateQuery: UpdateQuery<any>) {
    return this.model.updateOne(query, updateQuery).exec();
  }
  
}
