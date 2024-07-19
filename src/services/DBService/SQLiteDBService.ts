import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
  DEBUG,
} from 'react-native-sqlite-storage';
import {ReportItemModel} from './Models';
import {consoleLog} from 'src/utils/Helpers/HelperFunction';

enablePromise(true);
DEBUG(__DEV__);

var DB_INSTANCE: any = null;
export const getDBConnection = async () => {
  DB_INSTANCE = openDatabase({
    name: 'Sloan-Connect.db',
    location: 'default',
  });

  return DB_INSTANCE;
};

export const getDBInstance = () => {
  return DB_INSTANCE;
};

export const checkTableExistance = async (
  db: SQLiteDatabase,
  __tableName: string,
): Promise<boolean> => {
  try {
    await db.executeSql(`SELECT rowid as id FROM ${__tableName}`);
    return true;
  } catch (error) {
    return false;
  }
};

export const createReportTable = async (
  db: SQLiteDatabase,
  tableName: string,
) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        name varchar(255) DEFAULT NULL,
        value text,
        dateTime double DEFAULT NULL,
        status tinyint(1) DEFAULT '0'
    );`;

  const createTableState = await db.executeSql(query);
  consoleLog('createTable createTableState==>', createTableState);
};

export const clearTable = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  const query = `DROP TABLE ${tableName};`;
  await db.executeSql(query);
};

export const getReportItems = async (
  db: SQLiteDatabase,
): Promise<ReportItemModel[]> => {
  try {
    const __tableName = 'table_reports';
    const reportItems: ReportItemModel[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id, name, value, dateTime, status FROM ${__tableName}`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        reportItems.push(result.rows.item(index));
      }
    });
    return reportItems;
  } catch (error) {
    console.log('getReportItems error==>', error);
    throw Error('Failed to get reportItems !!!');
  }
};

export const saveReportItems = async (
  db: SQLiteDatabase,
  reportItems: ReportItemModel[],
) => {
  const __tableName = 'table_reports';
  const insertQuery =
    `INSERT OR REPLACE INTO ${__tableName}(rowid, name, value, dateTime, status) values` +
    reportItems
      .map(
        i =>
          `(${i.id}, '${i.name}', '${i.value}', '${i.dateTime}', '${i.status}')`,
      )
      .join(',');

  return db.executeSql(insertQuery);
};

export const updateReportItem = async (
  db: SQLiteDatabase,
  item: ReportItemModel,
  status: number,
) => {
  const __tableName = 'table_reports';

  const deleteQuery = `UPDATE ${__tableName} set status = ${status} where rowid = ${item.id}`;
  await db.executeSql(deleteQuery);
};

export const deleteReportItem = async (
  db: SQLiteDatabase,
  id: number,
): Promise<any> => {
  const __tableName = 'table_reports';

  const deleteQuery = `DELETE from ${__tableName} where rowid = ${id}`;
  return await db.executeSql(deleteQuery);
};
