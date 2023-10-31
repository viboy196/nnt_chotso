import {createContext, useContext} from 'react';
import {CustomerSqlite, RegionSqlite} from '../utils/sqllite';
export type SqliteContent = {
  regionSqlite?: RegionSqlite;
  customerSqlite?: CustomerSqlite;
};
export const SqliteContext = createContext<SqliteContent>({});
export const useSqliteContext = () => useContext(SqliteContext);
