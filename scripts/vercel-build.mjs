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
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}
execSync("npx next build", { stdio: "inherit" });
