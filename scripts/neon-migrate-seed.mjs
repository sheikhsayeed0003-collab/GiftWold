/**
 * One-off: apply Postgres migrations + seed using Neon env from .env.local.
 * Restores SQLite schema afterward for local dev.
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";

function loadEnvLocal() {
  if (!existsSync(".env.local")) {
    throw new Error(".env.local missing — run: npx vercel integration add neon");
  }
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 1) continue;
    const key = trimmed.slice(0, i);
    let val = trimmed.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

const schemaPath = "prisma/schema.prisma";
const schemaBackup = readFileSync(schemaPath, "utf8");

loadEnvLocal();
if (!process.env.DATABASE_URL?.startsWith("postgres")) {
  throw new Error("DATABASE_URL must be a Postgres URL in .env.local");
}

let schema = schemaBackup.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
writeFileSync(schemaPath, schema);

writeFileSync("prisma/migrations/migration_lock.toml", 'provider = "postgresql"\n');

const src = "prisma/vercel-migrations";
const dest = "prisma/migrations";
for (const name of readdirSync(dest)) {
  if (name === "migration_lock.toml") continue;
  rmSync(`${dest}/${name}`, { recursive: true, force: true });
}
for (const name of readdirSync(src)) {
  if (name === "migration_lock.toml") continue;
  cpSync(`${src}/${name}`, `${dest}/${name}`, { recursive: true });
}

const lockBackup = existsSync("prisma/migrations/migration_lock.toml")
  ? readFileSync("prisma/migrations/migration_lock.toml", "utf8")
  : null;
const localMigrationsBackup = `${process.cwd()}/.tmp-prisma-migrations-backup`;
if (existsSync(localMigrationsBackup)) rmSync(localMigrationsBackup, { recursive: true, force: true });
mkdirSync(localMigrationsBackup, { recursive: true });
for (const name of readdirSync(dest)) {
  cpSync(`${dest}/${name}`, `${localMigrationsBackup}/${name}`, { recursive: true });
}

try {
  execSync("npx prisma generate", { stdio: "inherit" });
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  execSync("npx prisma db seed", { stdio: "inherit" });
} finally {
  writeFileSync(schemaPath, schemaBackup);
  for (const name of readdirSync(dest)) {
    if (name === "migration_lock.toml") continue;
    rmSync(`${dest}/${name}`, { recursive: true, force: true });
  }
  for (const name of readdirSync(localMigrationsBackup)) {
    cpSync(`${localMigrationsBackup}/${name}`, `${dest}/${name}`, { recursive: true });
  }
  if (lockBackup !== null) writeFileSync("prisma/migrations/migration_lock.toml", lockBackup);
  rmSync(localMigrationsBackup, { recursive: true, force: true });
  execSync("npx prisma generate", { stdio: "inherit" });
}

console.log("Neon migrate + seed complete.");
