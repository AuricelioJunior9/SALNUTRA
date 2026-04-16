export type UserRole = "admin" | "operador" | "usuario";
export type VariableCategory = "salmoura" | "motor";
export type DeviceStatus = "online" | "offline";
export type ReadingStatus = "normal" | "warning" | "critical";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
}

export interface UserWithHash extends User {
  password_hash: string;
}

export interface Variable {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  warning_min: number;
  warning_max: number;
  icon: string;
  category: VariableCategory;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  ip: string;
  last_seen: Date;
}

export interface Reading {
  id: number;
  variable_id: string;
  value: number;
  status: ReadingStatus;
  timestamp: Date;
}

export interface LatestReading extends Reading {
  variable: Variable;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
