import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let dbInstance: Database | null = null;
let dbFilePath: string = '';

export function generateId(): string {
  return crypto.randomBytes(12).toString('hex');
}

export function isValidObjectId(id: string): boolean {
  if (typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// In-memory cache of parsed documents for sub-millisecond querying
const tableCache = new Map<string, Map<string, any>>();

export async function initSqliteDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const resolvedPath = path.resolve(process.env.SQLITE_DB_PATH || './data/flowtwin.sqlite');
  dbFilePath = resolvedPath;
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(resolvedPath)) {
    try {
      const fileBuffer = fs.readFileSync(resolvedPath);
      dbInstance = new SQL.Database(fileBuffer);
      console.log(`[FlowTwin SQLite] Loaded existing database from ${resolvedPath}`);
    } catch (err: any) {
      console.warn(`[FlowTwin SQLite] Failed to load existing database file, creating fresh: ${err.message}`);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
    console.log(`[FlowTwin SQLite] Initialized new database at ${resolvedPath}`);
  }

  // Ensure tables exist and load into cache
  const tables = [
    'users',
    'shipments',
    'facilities',
    'vehicles',
    'routes',
    'incidents',
    'simulationscenarios',
    'recoveryplans',
    'documentrecords',
    'alerts',
    'auditevents',
  ];

  for (const table of tables) {
    dbInstance.run(`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, data TEXT NOT NULL, createdAt TEXT, updatedAt TEXT);`);
    
    // Load rows into memory cache
    const cache = new Map<string, any>();
    tableCache.set(table, cache);

    const stmt = dbInstance.prepare(`SELECT id, data FROM ${table};`);
    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (row.id && row.data) {
        try {
          const parsed = JSON.parse(row.data as string);
          cache.set(row.id as string, parsed);
        } catch {}
      }
    }
    stmt.free();
  }

  saveDatabaseToDisk();
  return dbInstance;
}

export function saveDatabaseToDisk(): void {
  if (!dbInstance || !dbFilePath) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbFilePath, buffer);
  } catch (err: any) {
    console.error('[FlowTwin SQLite] Failed to persist database to disk:', err.message);
  }
}

export function upsertRow(table: string, id: string, doc: any): void {
  if (!dbInstance) return;
  const json = JSON.stringify(doc);
  const now = new Date().toISOString();
  const createdAt = doc.createdAt ? new Date(doc.createdAt).toISOString() : now;
  const updatedAt = doc.updatedAt ? new Date(doc.updatedAt).toISOString() : now;

  dbInstance.run(
    `INSERT OR REPLACE INTO ${table} (id, data, createdAt, updatedAt) VALUES (?, ?, ?, ?);`,
    [id, json, createdAt, updatedAt]
  );

  let cache = tableCache.get(table);
  if (!cache) {
    cache = new Map();
    tableCache.set(table, cache);
  }
  cache.set(id, doc);
}

export function deleteRow(table: string, id: string): void {
  if (!dbInstance) return;
  dbInstance.run(`DELETE FROM ${table} WHERE id = ?;`, [id]);
  const cache = tableCache.get(table);
  if (cache) cache.delete(id);
}

// Nested property getter e.g. 'origin.name'
function getNestedValue(obj: any, pathStr: string): any {
  if (!obj) return undefined;
  if (!pathStr.includes('.')) return obj[pathStr];
  const parts = pathStr.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

// Comprehensive Document Filter Matcher
export function matchFilter(doc: any, filter: any): boolean {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, expected] of Object.entries(filter)) {
    if (key === '$or' && Array.isArray(expected)) {
      const anyMatch = expected.some(subFilter => matchFilter(doc, subFilter));
      if (!anyMatch) return false;
      continue;
    }

    if (key === '$and' && Array.isArray(expected)) {
      const allMatch = expected.every(subFilter => matchFilter(doc, subFilter));
      if (!allMatch) return false;
      continue;
    }

    const actual = getNestedValue(doc, key);

    // Operator conditions
    if (expected && typeof expected === 'object' && !(expected instanceof RegExp) && !(expected instanceof Date)) {
      const exp = expected as any;
      if (exp.$regex !== undefined) {
        const flags = exp.$options || '';
        const regex = new RegExp(exp.$regex, flags);
        if (!regex.test(String(actual || ''))) return false;
        continue;
      }

      if (exp.$in !== undefined && Array.isArray(exp.$in)) {
        if (!exp.$in.includes(actual)) return false;
        continue;
      }

      if (exp.$nin !== undefined && Array.isArray(exp.$nin)) {
        if (exp.$nin.includes(actual)) return false;
        continue;
      }

      if (exp.$ne !== undefined) {
        if (actual === exp.$ne) return false;
        continue;
      }

      if (exp.$gt !== undefined && !(actual > exp.$gt)) return false;
      if (exp.$gte !== undefined && !(actual >= exp.$gte)) return false;
      if (exp.$lt !== undefined && !(actual < exp.$lt)) return false;
      if (exp.$lte !== undefined && !(actual <= exp.$lte)) return false;

      // Exact object comparison
      if (JSON.stringify(actual) !== JSON.stringify(expected)) return false;
      continue;
    }

    // Direct Regex
    if (expected instanceof RegExp) {
      if (!expected.test(String(actual || ''))) return false;
      continue;
    }

    // Direct equality (handling string IDs / object comparison)
    if (key === '_id' || key === 'id') {
      const expectedId = expected && typeof expected === 'object' && expected.toString ? expected.toString() : String(expected);
      const actualId = actual ? String(actual) : '';
      if (actualId !== expectedId) return false;
      continue;
    }

    if (actual !== expected) {
      // Loose equality for dates or numbers
      if (actual instanceof Date && expected instanceof Date) {
        if (actual.getTime() !== expected.getTime()) return false;
      } else if (String(actual) !== String(expected)) {
        return false;
      }
    }
  }

  return true;
}

// Document Class
export class SqliteDocument<T extends Record<string, any>> {
  [key: string]: any;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  private _tableName: string;

  constructor(data: T, tableName: string) {
    this._tableName = tableName;
    this._id = data._id || data.id || generateId();
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

    Object.assign(this, data);
    this._id = String(this._id);
  }

  async save(): Promise<this> {
    this.updatedAt = new Date();
    const clean = this.toObject();
    upsertRow(this._tableName, this._id, clean);
    saveDatabaseToDisk();
    return this;
  }

  toObject(): T {
    const res: Record<string, any> = {};
    for (const k of Object.keys(this)) {
      if (!k.startsWith('_') || k === '_id') {
        res[k] = this[k];
      }
    }
    res._id = this._id;
    return res as T;
  }

  toJSON(): T {
    return this.toObject();
  }

  toString(): string {
    return this._id;
  }
}

// Chainable Query Builder
export class SqliteQuery<T> implements PromiseLike<any> {
  private _tableName: string;
  private _filter: any;
  private _isSingle: boolean;
  private _isLean: boolean = false;
  private _sortObj?: Record<string, number>;
  private _skipCount: number = 0;
  private _limitCount?: number;
  private _selectFields?: string[];

  constructor(tableName: string, filter: any = {}, isSingle: boolean = false) {
    this._tableName = tableName;
    this._filter = filter;
    this._isSingle = isSingle;
  }

  sort(sortObj: Record<string, number>): this {
    this._sortObj = sortObj;
    return this;
  }

  skip(count: number): this {
    this._skipCount = count;
    return this;
  }

  limit(count: number): this {
    this._limitCount = count;
    return this;
  }

  lean(): this {
    this._isLean = true;
    return this;
  }

  select(fields: string | string[]): this {
    if (typeof fields === 'string') {
      this._selectFields = fields.split(/\s+/).filter(Boolean);
    } else {
      this._selectFields = fields;
    }
    return this;
  }

  async exec(): Promise<T> {
    const cache = tableCache.get(this._tableName) || new Map<string, any>();
    let items: any[] = [];

    for (const doc of cache.values()) {
      if (matchFilter(doc, this._filter)) {
        items.push(doc);
        if (this._isSingle && !this._sortObj) break;
      }
    }

    // Sort if needed
    if (this._sortObj) {
      const entries = Object.entries(this._sortObj);
      items.sort((a, b) => {
        for (const [key, dir] of entries) {
          const valA = getNestedValue(a, key);
          const valB = getNestedValue(b, key);
          if (valA === valB) continue;
          if (valA === undefined) return 1;
          if (valB === undefined) return -1;
          return valA > valB ? dir : -dir;
        }
        return 0;
      });
    }

    if (this._isSingle) {
      const item = items[0] || null;
      if (!item) return null as unknown as T;
      if (this._selectFields) {
        const filtered = { ...item };
        for (const field of this._selectFields) {
          if (field.startsWith('-')) {
            delete filtered[field.substring(1)];
          }
        }
        return (this._isLean ? filtered : new SqliteDocument(filtered, this._tableName)) as unknown as T;
      }
      return (this._isLean ? item : new SqliteDocument(item, this._tableName)) as unknown as T;
    }

    // Pagination
    if (this._skipCount > 0) {
      items = items.slice(this._skipCount);
    }
    if (this._limitCount !== undefined) {
      items = items.slice(0, this._limitCount);
    }

    // Select filtering
    if (this._selectFields) {
      items = items.map(doc => {
        const filtered = { ...doc };
        for (const field of this._selectFields!) {
          if (field.startsWith('-')) {
            delete filtered[field.substring(1)];
          }
        }
        return filtered;
      });
    }

    if (this._isLean) {
      return items as unknown as T;
    }

    return items.map(doc => new SqliteDocument(doc, this._tableName)) as unknown as T;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return (this.exec() as Promise<T>).then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return this.exec().catch(onrejected);
  }
}

// Model Interface
export interface ISqliteModel<T extends Record<string, any>> {
  find(filter?: any): SqliteQuery<T[]>;
  findOne(filter?: any): SqliteQuery<T | null>;
  findById(id: string): SqliteQuery<T | null>;
  create(data: any | any[]): Promise<any>;
  countDocuments(filter?: any): Promise<number>;
  deleteMany(filter?: any): Promise<{ deletedCount: number }>;
  updateOne(filter: any, update: any): Promise<{ modifiedCount: number }>;
  findByIdAndUpdate(id: string, update: any, options?: any): Promise<any>;
}

export function createSqliteModel<T extends Record<string, any>>(
  modelName: string,
  tableName: string
): ISqliteModel<T> {
  return {
    find(filter: any = {}) {
      return new SqliteQuery<T[]>(tableName, filter, false);
    },

    findOne(filter: any = {}) {
      return new SqliteQuery<T | null>(tableName, filter, true);
    },

    findById(id: string) {
      return new SqliteQuery<T | null>(tableName, { _id: id }, true);
    },

    async create(data: any | any[]) {
      if (Array.isArray(data)) {
        const docs = data.map(item => {
          const id = item._id || item.id || generateId();
          const doc = {
            ...item,
            _id: id,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
          };
          upsertRow(tableName, id, doc);
          return new SqliteDocument<T>(doc, tableName);
        });
        saveDatabaseToDisk();
        return docs;
      } else {
        const id = data._id || data.id || generateId();
        const doc = {
          ...data,
          _id: id,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
        upsertRow(tableName, id, doc);
        saveDatabaseToDisk();
        return new SqliteDocument<T>(doc, tableName);
      }
    },

    async countDocuments(filter: any = {}) {
      const cache = tableCache.get(tableName) || new Map<string, any>();
      let count = 0;
      for (const doc of cache.values()) {
        if (matchFilter(doc, filter)) count++;
      }
      return count;
    },

    async deleteMany(filter: any = {}) {
      const cache = tableCache.get(tableName) || new Map<string, any>();
      const toDelete: string[] = [];
      for (const [id, doc] of cache.entries()) {
        if (matchFilter(doc, filter)) {
          toDelete.push(id);
        }
      }
      for (const id of toDelete) {
        deleteRow(tableName, id);
      }
      saveDatabaseToDisk();
      return { deletedCount: toDelete.length };
    },

    async updateOne(filter: any, update: any) {
      const doc = await this.findOne(filter);
      if (!doc) return { modifiedCount: 0 };
      const patch = update.$set || update;
      Object.assign(doc, patch);
      await doc.save();
      return { modifiedCount: 1 };
    },

    async findByIdAndUpdate(id: string, update: any, options: any = {}) {
      const doc = await this.findOne({ _id: id });
      if (!doc) return null;
      const patch = update.$set || update;
      Object.assign(doc, patch);
      await doc.save();
      return options.new ? doc : doc;
    },
  };
}
