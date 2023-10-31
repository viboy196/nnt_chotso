import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Customer, ExcuteResult} from '../model';
import {TypeSchemaSql} from '../schema';
import {AbstractSqlite} from './abstract.sqlite';

export class CustomerSqlite extends AbstractSqlite<Customer> {
  constructor(schema: TypeSchemaSql<Customer>, db: SQLiteDatabase) {
    super(schema, db);
  }
  // lấy các chỉ số chưa ghi , đã ghi ,
  public async FillChiSoScreenRegion(): Promise<ExcuteResult> {
    const query = `SELECT COUNT(*) FILTER (WHERE Chisomoi <> -1) AS daghi,
        COUNT(*) FILTER (WHERE Chisomoi = -1) AS chuaghi,
        COUNT(*) FILTER (WHERE Dongbo = true) AS mount
        FROM ${this.schema.name};`;

    const rest = await this.db.executeSql(query);
    console.log(rest);

    const res1 = rest[0].rows.item(0);
    console.log('FillChiSoScreenRegion res1', res1);

    const res2 = await this.getFirst();
    //@ts-ignore
    const data2 = res2.result as Customer;
    const mtk = data2.Mathoiky;
    const mathoiky = 'Tháng ' + (mtk % 100) + '/' + parseInt(`${mtk / 100}`);
    return {
      code: '00',
      result: {...res1, mathoiky: mathoiky},
    };
  }
}
