import { Document, Types } from 'mongoose';
import { DeleteResult } from 'mongodb';

export interface IStorageService<T> {
  create: (obj: T) => Promise<T & Document>;
  getAll: () => Promise<(T & Document)[]>;
  getById: (id: Types.ObjectId) => Promise<T & Document>;
  save: (obj: T & Document) => Promise<T & Document>;
  delete: (obj: T & Document) => Promise<T & Document>;
  deleteAll: () => Promise<DeleteResult>;
}
