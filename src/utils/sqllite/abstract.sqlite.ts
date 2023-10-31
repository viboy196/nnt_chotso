import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {TypeSchemaSql} from '../schema/type.schema';
import {ExcuteResult} from '../model';

export abstract class AbstractSqlite<T> {
  constructor(
    protected readonly schema: TypeSchemaSql<T>,
    protected readonly db: SQLiteDatabase,
  ) {
    this.createTable(schema);
  }

  private async createTable(schema: TypeSchemaSql<T>) {
    const tag = 'createTable';
    if (this.db === undefined) {
      throw new Error(tag + ' database not connect');
    }
    if (this.schema === undefined) {
      throw new Error('no schema');
    }
    const arrKey = Object.keys(schema.properties);

    //@ts-ignore
    const strProperties = arrKey
      //@ts-ignore
      .map(key => `${key} ${schema.properties[key]}`)
      .join(',');
    //@ts-ignore
    const strPrimaryKey = `PRIMARY KEY (${schema.primaryKey})`;
    let strIndexs = '';

    if (schema.indexs !== undefined) {
      strIndexs = `CREATE INDEX ${schema.name}Index
            ON ${schema.name} (${schema.indexs.join(',')});`;
    }

    const query = `CREATE TABLE IF NOT EXISTS ${this.schema.name}
        (
            ${strProperties},
            ${strPrimaryKey}
        );
        ${strIndexs}`;

    await this.db.executeSql(query);
  }

  public async addAsync(item: T) {
    const tag = 'insertItem';
    if (this.db === undefined) {
      throw new Error(tag + ' database not connect');
    }
    //@ts-ignore
    const arrKey = Object.keys(item);
    //@ts-ignore
    const query = `INSERT INTO ${this.schema.name} (${arrKey.join(
      ',',
    )}) VALUES (${
      //@ts-ignore
      arrKey.map(i => `'${item[i]}'`).join(',')
    });`;

    const rest = await this.db.executeSql(query);
    return rest;
  }

  public async getAll(): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'getAll';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }
      //@ts-ignore
      const query = `SELECT * FROM ${this.schema.name}`;
      console.log(query);

      const rest = await this.db.executeSql(query);
      const data = rest[0].rows.raw();

      if (data !== undefined) {
        return {
          code: '00',
          result: data,
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async getByPrimaryKey(id: string | number): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'getByPrimaryKey';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }
      //@ts-ignore
      const query = `SELECT * FROM ${this.schema.name} where ${this.schema.primaryKey} = '${id}'`;

      const rest = await this.db.executeSql(query);

      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
          result: data.at(0),
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async getBy(key: keyof T, value: T[keyof T]): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'getBy';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }
      //@ts-ignore
      const query = `SELECT * FROM ${this.schema.name} where ${key} = '${value}'`;

      const rest = await await this.db.executeSql(query);

      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
          result: data,
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async getFiltered(filtered: string): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'getFiltered';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }

      const query = filtered.includes('SELECT')
        ? filtered
        : `SELECT * FROM ${this.schema.name} where ${filtered}`;

      const rest = await this.db.executeSql(query);
      console.log(rest);

      const data = rest[0].rows.raw();
      console.log(query, data.length);

      if (data !== undefined) {
        return {
          code: '00',
          result: data,
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
        };
      }
    } catch (error) {
      console.error(error);
      return {
        code: '01',
        errorMessage: 'not found data',
      };
    }
  }

  public async getFilteredNone(filtered: string): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'getBy';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }

      const query = `${filtered}`;

      const rest = await this.db.executeSql(query);

      const data = rest[0].rows.raw();
      console.log(query, data);

      if (data !== undefined) {
        return {
          code: '00',
          result: data,
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async getFirst(): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'getByFirst';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }
      //@ts-ignore
      const query = `SELECT * FROM ${this.schema.name} LIMIT 1`;

      const rest = await this.db.executeSql(query);

      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
          result: data.at(0),
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async SaveAsync(items: T[]): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'SaveItems';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }
      if (items.length === 0) {
        throw new Error(tag + 'input has not data');
      }
      //@ts-ignore
      const arrKey = Object.keys(items[0]);
      const query = `INSERT OR REPLACE INTO ${this.schema.name} (${arrKey.join(
        ',',
      )}) values ${items
        .map(item => {
          //@ts-ignore
          const arrValue = Object.values(item);
          return `(${arrValue.map(i => `'${i}'`).join(',')})`;
        })
        .join(',')}`;

      const rest = await await this.db.executeSql(query);
      console.log(rest[0].rows.raw());

      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
          result: data,
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async updateAsync(items: T): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'UpdateItem';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }
      console.log('updateAsync', items);

      //@ts-ignore
      const arrKey = Object.keys(items);
      // @ts-ignore
      const strCondition = `${this.schema.primaryKey} = '${
        items[this.schema.primaryKey]
      }'`;
      const query = `UPDATE ${this.schema.name}
            SET ${arrKey
              .map(key => {
                //@ts-ignore
                return `${key} = '${items[key]}'`;
              })
              .join(',')}
            WHERE ${strCondition};`;

      const rest = await this.db.executeSql(query);
      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
          result: data,
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not found data',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async updateByFilterAsync(
    id: string | number,
    strFilter: string,
  ): Promise<ExcuteResult> {
    try {
      //cons
      const tag = 'UpdateItem';
      if (this.db === undefined) {
        throw new Error(tag + ' database not connect');
      }
      // @ts-ignore
      const query = `UPDATE ${this.schema.name} SET ${strFilter} WHERE ${this.schema.primaryKey} = '${id}';`;

      const rest = await this.db.executeSql(query);
      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
          result: data,
        };
      } else {
        return {
          code: '01',
          errorMessage: 'not updateByFilterAsync ',
          result: data,
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async deleteAsync(id: string): Promise<ExcuteResult> {
    try {
      // @ts-ignore
      const query = `DELETE from ${this.schema.name} where ${this.schema.primaryKey} =  '${id}'`;
      const rest = await this.db.executeSql(query);

      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
        };
      } else {
        return {
          code: '01',
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }

  public async deleteAll(): Promise<ExcuteResult> {
    try {
      // @ts-ignore
      const query = `DELETE from ${this.schema.name}`;
      const rest = await this.db.executeSql(query);

      const data = rest[0].rows.raw();
      if (data !== undefined) {
        return {
          code: '00',
        };
      } else {
        return {
          code: '01',
        };
      }
    } catch (error) {
      console.error(error);
      throw Error(`Failed to get ${this.schema.name} !!!`);
    }
  }
}
