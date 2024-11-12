import { IStorageService } from './IStorageService';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';

export class StorageService<T> implements IStorageService<T> {
  constructor(readonly repository: Repository<T>) {}

  getAll = async (where?: FindOptionsWhere<T>): Promise<T[]> => {
    return this.repository.find(where);
  };

  save(obj: T): Promise<T>;
  save(obj: T[]): Promise<T[]>;
  save(obj: T | T[]): Promise<T | T[]> {
    if (Array.isArray(obj)) {
      return this.repository.save(obj);
    }
    return this.repository.save(obj);
  }

  delete(obj: T): Promise<T>;
  delete(obj: T[]): Promise<T[]>;

  delete(obj: T | T[]): Promise<T | T[]> {
    if (Array.isArray(obj)) {
      return this.repository.save(obj);
    }
    return this.repository.save(obj);
  }

  deleteWhere = (where: FindOptionsWhere<T>): Promise<DeleteResult> => {
    return this.repository.delete(where);
  };

  deleteAll = async (): Promise<void> => {
    return this.repository.clear();
  };
}
