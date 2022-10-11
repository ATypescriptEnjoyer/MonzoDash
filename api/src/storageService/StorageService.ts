import { Model, Document, Types } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { IStorageService } from './';

export class StorageService<T> implements IStorageService<T> {
  constructor(private model: Model<T & Document>) {}

  create = async (obj: T): Promise<T & Document> => {
    const createdModel = new this.model(obj);
    return await createdModel.save();
  };

  getAll = async (): Promise<(T & Document)[]> => {
    return await this.model.find().exec();
  };

  getById = async (id: Types.ObjectId): Promise<T & Document> => {
    return await this.model.findById(id).exec();
  };

  save = async (obj: T & Document): Promise<T & Document> => {
    return await obj.save();
  };

  delete = async (obj: T & Document): Promise<T & Document> => {
    return await obj.delete();
  };

  deleteAll = async (): Promise<DeleteResult> => {
    return await this.model.deleteMany().exec();
  };
}
