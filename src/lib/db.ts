import { readdir, readFile, mkdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
const globalForDb = globalThis as unknown as {
  mandaraPool?: pg.Pool;
  mandaraLocal?: Promise<PGlite>;
};
let pool = globalForDb.mandaraPool;
let local = globalForDb.mandaraLocal;

export async function sql<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (databaseUrl !== "") {
    pool ??= new pg.Pool({ connectionString: databaseUrl, max: 5 });
    globalForDb.mandaraPool = pool;
    return (await pool.query(text, params)).rows as T[];
  }
  local ??= startLocal().catch((error: unknown) => {
    local = undefined;
    globalForDb.mandaraLocal = undefined;
    throw error;
  });
  globalForDb.mandaraLocal = local;
  return (await (await local).query<T>(text, params)).rows;
}

async function startLocal(): Promise<PGlite> {
  await mkdir("data", { recursive: true });
  const db = new PGlite("data/local.db");
  await db.exec(
    "create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())",
  );
  const files = (await readdir("migrations").catch(() => []))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const done = new Set(
    (await db.query<{ name: string }>("select name from schema_migrations")).rows.map(
      (row) => row.name,
    ),
  );
  for (const file of files) {
    if (done.has(file)) continue;
    const body = await readFile(`migrations/${file}`, "utf8");
    await db.exec("begin");
    try {
      await db.exec(body);
      await db.query("insert into schema_migrations (name) values ($1)", [file]);
      await db.exec("commit");
    } catch (error) {
      await db.exec("rollback");
      throw error;
    }
  }
  return db;
}
