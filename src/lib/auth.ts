import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import type { Manager } from "@/lib/types";

const scryptAsync = promisify(scrypt);
const COOKIE = "mandara_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

type ManagerRow = {
  id: string;
  username: string;
  display_name: string;
  property_name: string;
  password_hash?: string;
};

export function toManager(row: ManagerRow): Manager {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    propertyName: row.property_name,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 32)) as Buffer;
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hex] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hex) return false;
  const hash = (await scryptAsync(password, salt, 32)) as Buffer;
  const expected = Buffer.from(hex, "hex");
  if (hash.length !== expected.length) return false;
  return timingSafeEqual(hash, expected);
}

export async function managerCount(): Promise<number> {
  const rows = await sql<{ n: number | string }>("select count(*)::int as n from managers");
  return Number(rows[0]?.n ?? 0);
}

export async function getCurrentManager(): Promise<Manager | null> {
  const jar = await cookies();
  const sessionId = jar.get(COOKIE)?.value;
  if (!sessionId) return null;
  const rows = await sql<ManagerRow>(
    `select m.id, m.username, m.display_name, m.property_name
     from sessions s
     join managers m on m.id = s.manager_id
     where s.id = $1 and s.expires_at > now()`,
    [sessionId],
  );
  return rows[0] ? toManager(rows[0]) : null;
}

export async function openSession(managerId: string): Promise<void> {
  const id = randomBytes(32).toString("hex");
  await sql(
    `insert into sessions (id, manager_id, expires_at) values ($1, $2, now() + interval '30 days')`,
    [id, managerId],
  );
  const jar = await cookies();
  jar.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  const sessionId = jar.get(COOKIE)?.value;
  if (sessionId) {
    await sql("delete from sessions where id = $1", [sessionId]);
  }
  jar.delete({ name: COOKIE, path: "/" });
}

export async function findManagerByUsername(username: string): Promise<
  (Manager & { passwordHash: string }) | null
> {
  const rows = await sql<ManagerRow>(
    `select id, username, display_name, property_name, password_hash
     from managers where username = $1`,
    [username],
  );
  const row = rows[0];
  if (!row?.password_hash) return null;
  return { ...toManager(row), passwordHash: row.password_hash };
}
