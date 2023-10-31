import {openDatabase} from 'react-native-sqlite-storage';
export const getDBConnection = async (dbname: string) => {
  const db = await openDatabase({name: dbname, location: 'default'});
  return db;
};
