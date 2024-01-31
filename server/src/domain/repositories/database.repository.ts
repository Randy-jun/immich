import { Version } from '../domain.constant';

export enum DatabaseExtension {
  CUBE = 'cube',
  EARTH_DISTANCE = 'earthdistance',
  VECTOR = 'vector',
  VECTORS = 'vectors',
}

export enum DatabaseLock {
  GeodataImport = 100,
  StorageTemplateMigration = 420,
  CLIPDimSize = 512,
}

export const extName: Record<DatabaseExtension, string> = {
  cube: 'cube',
  earthdistance: 'earthdistance',
  vector: 'pgvector',
  vectors: 'pgvecto.rs',
} as const;

export const IDatabaseRepository = 'IDatabaseRepository';

export interface IDatabaseRepository {
  getExtensionVersion(extName: string): Promise<Version | null>;
  getAvailableExtensionVersion(extension: DatabaseExtension): Promise<Version | null>;
  getPreferredVectorExtension(): DatabaseExtension;
  getPostgresVersion(): Promise<Version>;
  createExtension(extension: DatabaseExtension): Promise<void>;
  updateExtension(extension: DatabaseExtension, version?: Version): Promise<void>;
  runMigrations(options?: { transaction?: 'all' | 'none' | 'each' }): Promise<void>;
  withLock<R>(lock: DatabaseLock, callback: () => Promise<R>): Promise<R>;
  isBusy(lock: DatabaseLock): boolean;
  wait(lock: DatabaseLock): Promise<void>;
}
