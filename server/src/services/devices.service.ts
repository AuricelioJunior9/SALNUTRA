import { pool } from "../config/database";
import { Device, DeviceStatus } from "../types";
import { AppError } from "../middleware/errorHandler";

export async function getAllDevices(): Promise<Device[]> {
  const result = await pool.query<Device>(
    "SELECT id, name, type, status, ip, last_seen FROM devices ORDER BY name"
  );
  return result.rows;
}

export async function getDeviceById(id: string): Promise<Device> {
  const result = await pool.query<Device>(
    "SELECT id, name, type, status, ip, last_seen FROM devices WHERE id = $1",
    [id]
  );
  const row = result.rows[0];
  if (!row) throw new AppError(404, `Dispositivo '${id}' nao encontrado.`);
  return row;
}

export interface CreateDeviceDto {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  ip: string;
}

export async function createDevice(dto: CreateDeviceDto): Promise<Device> {
  const result = await pool.query<Device>(
    `INSERT INTO devices (id, name, type, status, ip, last_seen)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING id, name, type, status, ip, last_seen`,
    [dto.id, dto.name, dto.type, dto.status, dto.ip]
  );
  return result.rows[0];
}

export interface UpdateDeviceDto {
  name?: string;
  type?: string;
  status?: DeviceStatus;
  ip?: string;
}

export async function updateDevice(id: string, dto: UpdateDeviceDto): Promise<Device> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (dto.name !== undefined)   { fields.push(`name = $${index++}`);   values.push(dto.name); }
  if (dto.type !== undefined)   { fields.push(`type = $${index++}`);   values.push(dto.type); }
  if (dto.status !== undefined) { fields.push(`status = $${index++}`); values.push(dto.status); }
  if (dto.ip !== undefined)     { fields.push(`ip = $${index++}`);     values.push(dto.ip); }

  if (fields.length === 0) throw new AppError(400, "Nenhum campo para atualizar.");

  fields.push(`last_seen = NOW()`);
  values.push(id);

  const result = await pool.query<Device>(
    `UPDATE devices SET ${fields.join(", ")}
     WHERE id = $${index}
     RETURNING id, name, type, status, ip, last_seen`,
    values
  );

  const row = result.rows[0];
  if (!row) throw new AppError(404, `Dispositivo '${id}' nao encontrado.`);
  return row;
}

export async function deleteDevice(id: string): Promise<void> {
  const result = await pool.query(
    "DELETE FROM devices WHERE id = $1",
    [id]
  );
  if (result.rowCount === 0) throw new AppError(404, `Dispositivo '${id}' nao encontrado.`);
}
