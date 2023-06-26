import { ResultSetHeader } from 'mysql2';

export interface InsertResultRaw extends Omit<ResultSetHeader, 'insertId'> {
  insertId: number | string;
}
