import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";
import { env } from "../config/env";
import { User, UserWithHash, JwtPayload } from "../types";
import { AppError } from "../middleware/errorHandler";

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const result = await pool.query<UserWithHash>(
    "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1",
    [email.toLowerCase().trim()]
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(401, "Email ou senha incorretos.");
  }

  const isValid = await bcrypt.compare(password, row.password_hash);

  if (!isValid) {
    throw new AppError(401, "Email ou senha incorretos.");
  }

  const payload: JwtPayload = {
    sub: row.id,
    email: row.email,
    role: row.role,
    name: row.name,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  const user: User = {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    created_at: row.created_at,
  };

  return { token, user };
}

export async function getUserById(id: string): Promise<User> {
  const result = await pool.query<User>(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
    [id]
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError(404, "Usuario nao encontrado.");
  }

  return row;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
