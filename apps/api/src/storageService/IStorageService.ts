import { DeleteResult, FindOptionsWhere } from 'typeorm';

export interface IStorageService<T> {
  getAll: (where?: FindOptionsWhere<T>) => Promise<T[]>;
  save(obj: T): Promise<T>;
  save(obj: T[]): Promise<T[]>;
  delete(obj: T): Promise<T>;
  delete(obj: T[]): Promise<T[]>;
  deleteWhere: (where: FindOptionsWhere<T>) => Promise<DeleteResult>;
  deleteAll: () => Promise<void>;
}
