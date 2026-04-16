import { pool } from "../config/database";
import { Reading, Variable, ReadingStatus } from "../types";

export interface LatestReadingRow {
  id: number;
  variable_id: string;
  value: number;
  status: ReadingStatus;
  timestamp: Date;
  variable_name: string;
  variable_unit: string;
  variable_min: number;
  variable_max: number;
  variable_warning_min: number;
  variable_warning_max: number;
  variable_icon: string;
  variable_category: Variable["category"];
}

export interface LatestReadingResult {
  reading: Reading;
  variable: Variable;
}

export async function getLatestReadings(): Promise<LatestReadingResult[]> {
  const result = await pool.query<LatestReadingRow>(`
    SELECT DISTINCT ON (r.variable_id)
      r.id,
      r.variable_id,
      r.value::float,
      r.status,
      r.timestamp,
      v.name   AS variable_name,
      v.unit   AS variable_unit,
      v.min::float    AS variable_min,
      v.max::float    AS variable_max,
      v.warning_min::float AS variable_warning_min,
      v.warning_max::float AS variable_warning_max,
      v.icon   AS variable_icon,
      v.category AS variable_category
    FROM readings r
    JOIN variables v ON v.id = r.variable_id
    ORDER BY r.variable_id, r.timestamp DESC
  `);

  return result.rows.map((row) => ({
    reading: {
      id: row.id,
      variable_id: row.variable_id,
      value: row.value,
      status: row.status,
      timestamp: row.timestamp,
    },
    variable: {
      id: row.variable_id,
      name: row.variable_name,
      unit: row.variable_unit,
      min: row.variable_min,
      max: row.variable_max,
      warning_min: row.variable_warning_min,
      warning_max: row.variable_warning_max,
      icon: row.variable_icon,
      category: row.variable_category,
    },
  }));
}

export async function getReadingHistory(
  variableId: string,
  limit = 20
): Promise<Reading[]> {
  const result = await pool.query<Reading>(
    `SELECT id, variable_id, value::float, status, timestamp
     FROM readings
     WHERE variable_id = $1
     ORDER BY timestamp DESC
     LIMIT $2`,
    [variableId, limit]
  );
  return result.rows.reverse();
}

export async function insertReading(
  variableId: string,
  value: number,
  status: ReadingStatus
): Promise<Reading> {
  const result = await pool.query<Reading>(
    `INSERT INTO readings (variable_id, value, status)
     VALUES ($1, $2, $3)
     RETURNING id, variable_id, value::float, status, timestamp`,
    [variableId, value, status]
  );
  return result.rows[0];
}

export async function cleanOldReadings(keepPerVariable = 500): Promise<void> {
  await pool.query(`
    DELETE FROM readings
    WHERE id NOT IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY variable_id ORDER BY timestamp DESC) AS rn
        FROM readings
      ) ranked
      WHERE rn <= $1
    )
  `, [keepPerVariable]);
}
