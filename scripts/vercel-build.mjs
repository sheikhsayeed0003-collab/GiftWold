import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const isVercel = process.env.VERCEL === "1";

if (isVercel) {
  const schemaPath = "prisma/schema.prisma";
  let schema = readFileSync(schemaPath, "utf8");
  schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
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
}

execSync("npx prisma generate", { stdio: "inherit" });
if (isVercel) {
  const migrateEnv = {
    ...process.env,
    PRISMA_MIGRATE_ADVISORY_LOCK_TIMEOUT: "120000",
  };
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit", env: migrateEnv });
  } catch (err) {
    console.warn("[vercel-build] migrate deploy failed — continuing build (migrations may already be applied):", err);
  }
  try {
    execSync("npx prisma db seed", { stdio: "inherit", env: migrateEnv });
  } catch (err) {
    console.warn("[vercel-build] db seed skipped or failed:", err);
  }
}
execSync("npx next build", { stdio: "inherit" });
