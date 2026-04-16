import { pool } from "../config/database";
import { Variable } from "../types";
import { AppError } from "../middleware/errorHandler";

export async function getAllVariables(): Promise<Variable[]> {
  const result = await pool.query<Variable>(
    `SELECT id, name, unit, min::float, max::float,
            warning_min::float, warning_max::float, icon, category
     FROM variables
     ORDER BY category, id`
  );
  return result.rows;
}

export async function getVariableById(id: string): Promise<Variable> {
  const result = await pool.query<Variable>(
    `SELECT id, name, unit, min::float, max::float,
            warning_min::float, warning_max::float, icon, category
     FROM variables WHERE id = $1`,
    [id]
  );

  const row = result.rows[0];
  if (!row) throw new AppError(404, `Variavel '${id}' nao encontrada.`);
  return row;
}

export interface UpdateVariableDto {
  name?: string;
  unit?: string;
  min?: number;
  max?: number;
  warning_min?: number;
  warning_max?: number;
  icon?: string;
}

export async function updateVariable(id: string, dto: UpdateVariableDto): Promise<Variable> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (dto.name !== undefined)        { fields.push(`name = $${index++}`);        values.push(dto.name); }
  if (dto.unit !== undefined)        { fields.push(`unit = $${index++}`);        values.push(dto.unit); }
  if (dto.min !== undefined)         { fields.push(`min = $${index++}`);         values.push(dto.min); }
  if (dto.max !== undefined)         { fields.push(`max = $${index++}`);         values.push(dto.max); }
  if (dto.warning_min !== undefined) { fields.push(`warning_min = $${index++}`); values.push(dto.warning_min); }
  if (dto.warning_max !== undefined) { fields.push(`warning_max = $${index++}`); values.push(dto.warning_max); }
  if (dto.icon !== undefined)        { fields.push(`icon = $${index++}`);        values.push(dto.icon); }

  if (fields.length === 0) throw new AppError(400, "Nenhum campo para atualizar.");

  values.push(id);
  const result = await pool.query<Variable>(
    `UPDATE variables SET ${fields.join(", ")}
     WHERE id = $${index}
     RETURNING id, name, unit, min::float, max::float,
               warning_min::float, warning_max::float, icon, category`,
    values
  );

  const row = result.rows[0];
  if (!row) throw new AppError(404, `Variavel '${id}' nao encontrada.`);
  return row;
}
