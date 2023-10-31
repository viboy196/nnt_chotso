import {TypeSchemaSql} from '../schema/type.schema';
import {Region} from '../model/region';
import {AbstractSqlite} from './abstract.sqlite';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

export class RegionSqlite extends AbstractSqlite<Region> {
  constructor(schema: TypeSchemaSql<Region>, db: SQLiteDatabase) {
    super(schema, db);
  }
}
