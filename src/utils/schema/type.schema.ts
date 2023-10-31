export type TypeSchemaSql<T> = {
  name: string;
  primaryKey: keyof T;
  properties: {
    [key in keyof T]: 'INTEGER' | 'VARCHAR' | 'BOOLEAN';
  };
  indexs?: (keyof T)[];
};
