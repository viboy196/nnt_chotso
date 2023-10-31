import {Region} from '../model/region';
import {TypeSchemaSql} from './type.schema';

export const SchemaRegion: TypeSchemaSql<Region> = {
  name: 'Region',
  primaryKey: 'Makhuvuc',
  indexs: ['Tenkhuvuc'],
  properties: {
    Makhuvuc: 'VARCHAR',
    Tenkhuvuc: 'VARCHAR',
    Dachot: 'INTEGER',
    Daghi: 'INTEGER',
    Maso: 'VARCHAR',
    Soluong: 'INTEGER',
    Tenso: 'VARCHAR',
  },
};
